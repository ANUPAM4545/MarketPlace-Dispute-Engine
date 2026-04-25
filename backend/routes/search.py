from flask import Blueprint, jsonify, request
from models import db, Product, Order, Dispute, User
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('search', __name__, url_prefix='/search')

@bp.route('/', methods=['GET'])
@jwt_required()
def global_search():
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify([]), 200
        
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    results = []
    
    # 1. Search Products (Visible to all)
    products = Product.query.filter(Product.name.ilike(f'%{query}%')).limit(5).all()
    for p in products:
        results.append({
            "id": p.id,
            "type": "Product",
            "title": p.name,
            "subtitle": f"${p.price}",
            "link": "/dashboard" # Catalog view
        })
        
    # 2. Search Orders (Role-specific)
    order_query = Order.query.filter(
        (Order.product_name.ilike(f'%{query}%')) | 
        (Order.tracking_id.ilike(f'%{query}%'))
    )
    if user.role == 'Buyer':
        order_query = order_query.filter_by(buyer_id=user.id)
    elif user.role == 'Seller':
        order_query = order_query.filter_by(seller_id=user.id)
    
    orders = order_query.limit(5).all()
    for o in orders:
        results.append({
            "id": o.id,
            "type": "Order",
            "title": f"Order #{o.id}",
            "subtitle": o.product_name,
            "link": "/dashboard" # Orders view
        })
        
    # 3. Search Disputes (Role-specific)
    dispute_query = Dispute.query.filter(Dispute.category.ilike(f'%{query}%'))
    if user.role == 'Buyer':
        dispute_query = dispute_query.filter_by(buyer_id=user.id)
    elif user.role == 'Seller':
        dispute_query = dispute_query.join(Order).filter(Order.seller_id == user.id)
        
    disputes = dispute_query.limit(5).all()
    for d in disputes:
        results.append({
            "id": d.id,
            "type": "Dispute",
            "title": f"Dispute: {d.category}",
            "subtitle": d.status,
            "link": f"/disputes/{d.id}"
        })

    return jsonify(results), 200
