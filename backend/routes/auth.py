from flask import Blueprint, request, jsonify
from models import db, User
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    phone = data.get('phone')
    role = data.get('role', 'Buyer')

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(email=email, password_hash=hashed_password, name=name, phone=phone, role=role)
    db.session.add(new_user)
    db.session.commit()

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
        # Auto-register with the requested role (e.g. from the Register page dropdown)
        user = User(email=email, name=name, role=requested_role, password_hash='GOOGLE_SSO_USER', phone='N/A')
        db.session.add(user)
        db.session.commit()
        
    access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role, "name": user.name})
    return jsonify(access_token=access_token, role=user.role, name=str(user.name)), 200
