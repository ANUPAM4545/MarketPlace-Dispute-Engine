from flask import Blueprint, request, jsonify
from models import db, Order, User
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime

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

    return jsonify([{
        "id": o.id,
        "product_name": o.product_name,
        "amount": o.amount,
        "status": o.status,
        "created_at": o.created_at,
        "seller_id": o.seller_id
    } for o in orders]), 200

@bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')

    if role != 'Buyer':
        return jsonify({"msg": "Only buyers can create orders"}), 403

    data = request.get_json()
    product_name = data.get('product_name')
    amount = data.get('amount')
    seller_id = data.get('seller_id')

    if not all([product_name, amount, seller_id]):
        return jsonify({"msg": "Missing required fields"}), 400

    order = Order(
        buyer_id=current_user_id,
        seller_id=seller_id,
        product_name=product_name,
        amount=float(amount)
    )
    db.session.add(order)
    db.session.commit()

    return jsonify({"msg": "Order created", "id": order.id}), 201

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

    orders_data = [
        {"product_name": "Wireless Headphones", "amount": 99.99},
        {"product_name": "Smartphone Case", "amount": 19.99},
        {"product_name": "Laptop Stand", "amount": 45.00}
    ]

    created_orders = []
    for data in orders_data:
        order = Order(
            buyer_id=current_user_id,
            seller_id=seller.id,
            product_name=data['product_name'],
            amount=data['amount']
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

    filename = secure_filename(file.filename)
    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
        
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)

    # Extract metadata like size
    file_size = os.path.getsize(file_path)
    metadata = {
        "file_size": file_size,
        "filename": filename
    }

    from models import Evidence
    evidence = Evidence(
        order_id=order.id,
        image_type='SELLER',
        metadata_info=json.dumps(metadata),
        file_url=f"/static/uploads/{filename}",
        uploaded_by=current_user_id
    )
    db.session.add(evidence)
    db.session.commit()

    return jsonify({"msg": "Pre-delivery evidence uploaded successfully", "id": evidence.id}), 201
