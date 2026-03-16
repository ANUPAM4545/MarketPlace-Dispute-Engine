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
