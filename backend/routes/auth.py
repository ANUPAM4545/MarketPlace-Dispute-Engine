from flask import Blueprint, request, jsonify
from models import db, User, Order, Dispute, Product
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from utils.email import send_email
import re

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    phone = data.get('phone')
    role = data.get('role', 'Buyer')

    if not email or not password or not name:
        return jsonify({"msg": "Missing required fields"}), 400
        
    # Password security check
    if len(password) < 8:
        return jsonify({"msg": "Password must be at least 8 characters long"}), 400
    if not re.search(r"[0-9]", password):
        return jsonify({"msg": "Password must contain at least one number"}), 400
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return jsonify({"msg": "Password must contain at least one special character"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 400

    # Using secure pbkdf2:sha256
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(email=email, password_hash=hashed_password, name=name, phone=phone, role=role)
    db.session.add(new_user)
    db.session.commit()

    # Send Welcome Email
    try:
        send_email(
            subject="Welcome to DisputeEngine.tech!",
            recipient=email,
            template="welcome",
            name=name,
            role=role,
            login_url="https://disputeengine.tech/login"
        )
    except Exception as e:
        print(f"Failed to send welcome email: {e}")

    return jsonify({"msg": "User created successfully"}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role, "name": user.name})
    return jsonify(access_token=access_token, role=user.role, name=user.name), 200

@bp.route('/sellers', methods=['GET'])
def get_sellers():
    sellers = User.query.filter_by(role='Seller').all()
    return jsonify([{"id": s.id, "name": s.name} for s in sellers]), 200

@bp.route('/google', methods=['POST'])
def google_login():
    data = request.get_json()
    token = data.get('token')
    requested_role = data.get('role', 'Buyer')
    
    if not token:
        return jsonify({"msg": "Missing token"}), 400
        
    try:
        import os
        client_id = os.environ.get('VITE_GOOGLE_CLIENT_ID')
        
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), audience=client_id if client_id else None)
        
        email = idinfo['email']
        name = idinfo.get('name', 'Google User')
        
    except Exception as e:
        return jsonify({"msg": "Invalid token or Google error", "error": str(e)}), 401
        
    user = User.query.filter_by(email=email).first()
    if not user:
        # Auto-register with the requested role
        user = User(email=email, name=name, role=requested_role, password_hash='GOOGLE_SSO_USER', phone='N/A')
        db.session.add(user)
        db.session.commit()
        
        # Send Welcome Email (Only for the first registration via Google)
        try:
            send_email(
                subject="Welcome to DisputeEngine.tech!",
                recipient=email,
                template="welcome",
                name=name,
                role=requested_role,
                login_url="https://disputeengine.tech/login"
            )
        except Exception as e:
            print(f"Failed to send google welcome email: {e}")
        
    access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role, "name": user.name})
    return jsonify(access_token=access_token, role=user.role, name=str(user.name)), 200

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    from flask_jwt_extended import get_jwt_identity
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify({
        "name": user.name,
        "email": user.email,
        "phone": user.phone or "",
        "address": user.address or "",
        "role": user.role
    }), 200

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    from flask_jwt_extended import get_jwt_identity
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    data = request.get_json()
    
    if 'name' in data and data['name'].strip():
        user.name = data['name'].strip()
    if 'phone' in data:
        user.phone = data['phone'].strip()
    if 'address' in data:
        user.address = data['address'].strip()
        
    if 'password' in data and data['password'].strip():
        old_password = data.get('old_password')
        if not old_password:
            return jsonify({"msg": "Current password is required to change to a new one"}), 400
        
        if not check_password_hash(user.password_hash, old_password):
            return jsonify({"msg": "Current password incorrect"}), 401

        new_password = data['password']
        if len(new_password) < 8:
            return jsonify({"msg": "New password must be at least 8 characters long"}), 400
        if not re.search(r"[0-9]", new_password):
            return jsonify({"msg": "New password must contain at least one number"}), 400
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", new_password):
            return jsonify({"msg": "New password must contain at least one special character"}), 400
            
        user.password_hash = generate_password_hash(new_password, method='pbkdf2:sha256')

    db.session.commit()
    return jsonify({"msg": "Profile updated successfully"}), 200

@bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    stats = []
    role = user.role.capitalize()
    
    if role == 'Buyer':
        orders = Order.query.filter_by(buyer_id=user.id).all()
        disputes = Dispute.query.filter_by(buyer_id=user.id).all()
        total_spent = sum(o.amount for o in orders if o.status != 'CANCELLED')
        active_disputes = len([d for d in disputes if d.status not in ['RESOLVED', 'REJECTED']])
        stats = [
            {"label": "Total Spent", "value": f"${total_spent:,.2f}", "color": "gold"},
            {"label": "Orders Placed", "value": len(orders), "color": "blue"},
            {"label": "Active Disputes", "value": active_disputes, "color": "red"}
        ]
    elif role == 'Seller':
        orders = Order.query.filter_by(seller_id=user.id).all()
        disputes = Dispute.query.join(Order).filter(Order.seller_id == user.id).all()
        total_earnings = sum(o.amount for o in orders if o.status == 'DELIVERED')
        pending_shipments = len([o for o in orders if o.status == 'PAID'])
        dispute_rate = (len(disputes) / len(orders) * 100) if orders else 0
        stats = [
            {"label": "Total Earnings", "value": f"${total_earnings:,.2f}", "color": "green"},
            {"label": "Pending Shipments", "value": pending_shipments, "color": "blue"},
            {"label": "Dispute Rate", "value": f"{dispute_rate:.1f}%", "color": "orange"}
        ]
    elif role == 'Admin':
        total_users = User.query.count()
        total_disputes = Dispute.query.count()
        insurance_claims = Dispute.query.filter_by(insurance_claim_filed=True).count()
        stats = [
            {"label": "Total Users", "value": total_users, "color": "indigo"},
            {"label": "System Disputes", "value": total_disputes, "color": "red"},
            {"label": "Insurance Claims", "value": insurance_claims, "color": "green"}
        ]

    return jsonify(stats), 200
