from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # Buyer, Seller, Admin

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_name = db.Column(db.String(255), nullable=False, default="Generic Product")
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='DELIVERED')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Dispute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(50), default='OPEN') # OPEN, UNDER_REVIEW, SELLER_RESPONDED, RESOLVED, REJECTED
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    seller_response = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Evidence(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dispute_id = db.Column(db.Integer, db.ForeignKey('dispute.id'), nullable=False)
    file_url = db.Column(db.String(255), nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # User ID
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

class Resolution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dispute_id = db.Column(db.Integer, db.ForeignKey('dispute.id'), nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    decision = db.Column(db.String(50), nullable=False) # REFUND, REJECT, PARTIAL_REFUND
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
