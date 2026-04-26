from flask import Blueprint, request, jsonify
from models import db, Order, User, Product
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime
from routes.notifications import create_notification
from utils.s3 import upload_to_s3

bp = Blueprint('orders', __name__, url_prefix='/orders')

@bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')

    if role == 'Buyer':
        orders = Order.query.filter_by(buyer_id=current_user_id).all()
    elif role == 'Seller':
        orders = Order.query.filter_by(seller_id=current_user_id).all()
    else: # Admin
        orders = Order.query.all()

    from models import Review
    
    orders_data = []
    for o in orders:
        has_reviewed = False
        if role == 'Buyer':
            has_reviewed = Review.query.filter_by(order_id=o.id).first() is not None
            
        orders_data.append({
            "id": o.id,
            "product_name": o.product_name,
            "quantity": o.quantity,
            "amount": o.amount,
            "status": o.status,
            "tracking_id": o.tracking_id,
            "carrier_name": o.carrier_name,
            "created_at": o.created_at,
            "seller_id": o.seller_id,
            "product_id": o.product_id,
            "has_reviewed": has_reviewed
        })

    return jsonify(orders_data), 200

@bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')

    if role != 'Buyer':
        return jsonify({"msg": "Only buyers can place orders"}), 403

    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    if not product_id:
        return jsonify({"msg": "Missing product_id"}), 400
        
    try:
        quantity = int(quantity)
        if quantity <= 0:
            return jsonify({"msg": "Quantity must be greater than 0"}), 400
    except ValueError:
        return jsonify({"msg": "Invalid quantity"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404

    if product.stock < quantity:
        return jsonify({"msg": f"Only {product.stock} units available in stock"}), 400

    # SECURE: Price and Seller are pulled from the DB, NOT from user input!
    order = Order(
        buyer_id=current_user_id,
        seller_id=product.seller_id,
        product_id=product.id,
        product_name=product.name,
        quantity=quantity,
        amount=product.price * quantity,
        status='PENDING'
    )
    
    # Decrement stock
    product.stock -= quantity
    
    db.session.add(order)
    db.session.commit()
    
    # Send notification to seller
    create_notification(
        user_id=order.seller_id,
        title="New Order Received!",
        message=f"You received an order for {quantity}x {product.name} (Order #{order.id}).",
        type='SUCCESS'
    )

    return jsonify({"msg": "Order placed", "id": order.id}), 201

@bp.route('/<int:id>/pay', methods=['POST'])
@jwt_required()
def pay_order(id):
    current_user_id = get_jwt_identity()
    order = Order.query.get_or_404(id)
    
    if order.buyer_id != int(current_user_id):
        return jsonify({"msg": "Unauthorized"}), 403
    
    if order.status != 'PENDING':
        return jsonify({"msg": f"Cannot pay for order in {order.status} status"}), 400
    
    # Simulate payment processing...
    order.status = 'PAID'
    db.session.commit()
    
    return jsonify({"msg": "Payment successful", "status": order.status}), 200

@bp.route('/<int:id>/status', methods=['PATCH'])
@jwt_required()
def update_order_status(id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')
    
    order = Order.query.get_or_404(id)
    data = request.get_json()
    new_status = data.get('status')
    
    if not new_status:
        return jsonify({"msg": "Status required"}), 400

    # Business Logic for Status Transitions
    if role == 'Seller':
        if order.seller_id != int(current_user_id):
            return jsonify({"msg": "Unauthorized"}), 403
        
        if new_status == 'SHIPPED':
            # ENFORCE: Seller cannot mark as SHIPPED without evidence (pre-delivery proof)
            from models import Evidence
            evidence = Evidence.query.filter_by(order_id=id, uploaded_by=current_user_id).first()
            if not evidence:
                return jsonify({"msg": "You must upload shipping proof (image) before marking as SHIPPED"}), 400
            
            if order.status == 'PAID':
                order.status = 'SHIPPED'
                # Extract tracking info if provided
                order.tracking_id = data.get('tracking_id')
                order.carrier_name = data.get('carrier_name')
            else:
                return jsonify({"msg": "Order must be PAID before it can be SHIPPED"}), 400
        else:
            return jsonify({"msg": "Invalid status transition for Seller"}), 400
            
    elif role == 'Buyer':
        if order.buyer_id != int(current_user_id):
            return jsonify({"msg": "Unauthorized"}), 403
        if new_status == 'DELIVERED' and order.status == 'SHIPPED':
            order.status = 'DELIVERED'
        else:
            return jsonify({"msg": "Invalid status transition for Buyer"}), 400
    else:
        # Admin can override if needed
        if role == 'Admin':
            order.status = new_status
        else:
            return jsonify({"msg": "Unauthorized role for status update"}), 403

    db.session.commit()
    
    # Send notification logic
    if new_status == 'SHIPPED':
        create_notification(
            user_id=order.buyer_id,
            title="Order Shipped!",
            message=f"Your order #{order.id} for {order.product_name} has been shipped.",
            type='SUCCESS'
        )
    elif new_status == 'DELIVERED':
        create_notification(
            user_id=order.seller_id,
            title="Order Delivered",
            message=f"Order #{order.id} has been delivered to the buyer successfully.",
            type='INFO'
        )

    return jsonify({"msg": f"Order status updated to {order.status}"}), 200

@bp.route('/seed', methods=['POST'])
@jwt_required()
def seed_orders():
    # Helper to create dummy orders for the current user (if Buyer)
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')

    if role != 'Buyer':
         return jsonify({"msg": "Only buyers can seed orders"}), 403

    # Find a seller (anyone with Seller role)
    seller = User.query.filter_by(role='Seller').first()
    if not seller:
        return jsonify({"msg": "No sellers found to link orders to"}), 404

    # Find some products
    products = Product.query.limit(3).all()
    if not products:
        return jsonify({"msg": "No products found to order"}), 404

    created_orders = []
    for p in products:
        order = Order(
            buyer_id=current_user_id,
            seller_id=p.seller_id,
            product_id=p.id,
            product_name=p.name,
            amount=p.price,
            status='DELIVERED'
        )
        db.session.add(order)
        created_orders.append(order)
    
    db.session.commit()
    return jsonify({"msg": "Orders seeded", "count": len(created_orders)}), 201

import os
import json
from werkzeug.utils import secure_filename
from flask import current_app

@bp.route('/<int:id>/evidence', methods=['POST'])
@jwt_required()
def upload_order_evidence(id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')

    if role != 'Seller':
        return jsonify({"msg": "Only sellers can upload pre-delivery evidence"}), 403

    order = Order.query.get_or_404(id)
    if order.seller_id != int(current_user_id):
        return jsonify({"msg": "You can only upload evidence for your own orders"}), 403

    file = request.files.get('evidence')
    if not file or file.filename == '':
        return jsonify({"msg": "No evidence file provided"}), 400

    # 1. Try S3 Upload First
    file_url = upload_to_s3(file)
    
    if file_url:
        # S3 Success
        metadata = {
            "storage": "S3",
            "filename": file.filename
        }
    else:
        # 2. Fallback to Local Storage
        filename = secure_filename(file.filename)
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
            
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        file_size = os.path.getsize(file_path)
        file_url = f"/static/uploads/{filename}"
        metadata = {
            "storage": "LOCAL",
            "file_size": file_size,
            "filename": filename
        }

    from models import Evidence
    evidence = Evidence(
        order_id=order.id,
        image_type='SELLER',
        metadata_info=json.dumps(metadata),
        file_url=file_url,
        uploaded_by=current_user_id
    )
    db.session.add(evidence)
    db.session.commit()

    return jsonify({"msg": "Pre-delivery evidence uploaded successfully", "id": evidence.id}), 201

@bp.route('/<int:id>/review', methods=['POST'])
@jwt_required()
def create_order_review(id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')

    if role != 'Buyer':
        return jsonify({"msg": "Only buyers can leave reviews"}), 403

    order = Order.query.get_or_404(id)
    if order.buyer_id != int(current_user_id):
        return jsonify({"msg": "You can only review your own orders"}), 403

    if order.status != 'DELIVERED':
        return jsonify({"msg": "You can only review orders that have been DELIVERED"}), 400

    from models import Review
    existing_review = Review.query.filter_by(order_id=order.id).first()
    if existing_review:
        return jsonify({"msg": "You have already reviewed this order"}), 400

    data = request.get_json()
    rating = data.get('rating')
    comment = data.get('comment', '')

    if not rating or not (1 <= int(rating) <= 5):
        return jsonify({"msg": "Please provide a valid rating between 1 and 5"}), 400

    if not order.product_id:
        return jsonify({"msg": "Cannot review an order without a valid product reference"}), 400

    review = Review(
        product_id=order.product_id,
        user_id=current_user_id,
        order_id=order.id,
        rating=int(rating),
        comment=comment
    )
    db.session.add(review)
    db.session.commit()

    return jsonify({"msg": "Review submitted successfully", "id": review.id}), 201
