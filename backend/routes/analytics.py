from flask import Blueprint, jsonify
from models import Dispute, User, Order
from flask_jwt_extended import jwt_required, get_jwt

bp = Blueprint('analytics', __name__, url_prefix='/analytics')

@bp.route('/', methods=['GET'])
@jwt_required()
def get_analytics():
    claims = get_jwt()
    role = claims.get('role')

    if role != 'Admin':
        return jsonify({"msg": "Admin access required"}), 403

    total_disputes = Dispute.query.count()
    open_disputes = Dispute.query.filter(Dispute.status.in_(['OPEN', 'UNDER_REVIEW', 'SELLER_RESPONDED'])).count()
    resolved_disputes = Dispute.query.filter_by(status='RESOLVED').count()
    rejected_disputes = Dispute.query.filter_by(status='REJECTED').count()
    
    total_users = User.query.count()
    total_orders = Order.query.count()

    return jsonify({
        "total_disputes": total_disputes,
        "open_disputes": open_disputes,
        "resolved_disputes": resolved_disputes,
        "rejected_disputes": rejected_disputes,
        "total_users": total_users,
        "total_orders": total_orders
    }), 200
