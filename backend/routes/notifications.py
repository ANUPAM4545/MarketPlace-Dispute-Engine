from flask import Blueprint, jsonify, request
from models import db, Notification
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('notifications', __name__, url_prefix='/notifications')

@bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    current_user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=current_user_id).order_by(Notification.created_at.desc()).limit(10).all()
    
    return jsonify([{
        "id": n.id,
        "title": n.title,
        "message": n.message,
        "type": n.type,
        "is_read": n.is_read,
        "created_at": n.created_at.isoformat() + 'Z'
    } for n in notifications]), 200

@bp.route('/read-all', methods=['POST'])
@jwt_required()
def read_all():
    current_user_id = get_jwt_identity()
    Notification.query.filter_by(user_id=current_user_id, is_read=False).update({"is_read": True})
    db.session.commit()
    return jsonify({"msg": "All notifications marked as read"}), 200

def create_notification(user_id, title, message, type='INFO'):
    """Utility function to create notifications from other routes"""
    new_notif = Notification(user_id=user_id, title=title, message=message, type=type)
    db.session.add(new_notif)
    db.session.commit()
