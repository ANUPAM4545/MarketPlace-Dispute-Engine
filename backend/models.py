from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(20), nullable=False)  # Buyer, Seller, Admin

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(500))
    stock = db.Column(db.Integer, default=10)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    seller = db.relationship('User', backref='products')

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=True)
    product_name = db.Column(db.String(255), nullable=False, default="Generic Product")
    quantity = db.Column(db.Integer, nullable=False, default=1)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='PENDING') # PENDING, PAID, SHIPPED, DELIVERED, CANCELLED
    tracking_id = db.Column(db.String(100), nullable=True)
    carrier_name = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    product = db.relationship('Product', backref='orders')

class Dispute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(50), default='OPEN') # OPEN, UNDER_REVIEW, SELLER_RESPONDED, RESOLVED, REJECTED
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    seller_response = db.Column(db.Text)
    is_suspicious = db.Column(db.Boolean, default=False)
    is_logistics_fault = db.Column(db.Boolean, default=False)
    insurance_claim_filed = db.Column(db.Boolean, default=False)
    ai_analysis = db.Column(db.Text, nullable=True)
    ai_recommendation = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # Relationships
    order = db.relationship('Order', backref='disputes')

class Evidence(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dispute_id = db.Column(db.Integer, db.ForeignKey('dispute.id'), nullable=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=True)
    image_type = db.Column(db.String(20), nullable=False) # 'SELLER' or 'BUYER'
    metadata_info = db.Column(db.Text, nullable=True)
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

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dispute_id = db.Column(db.Integer, db.ForeignKey('dispute.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships for easier access
    sender = db.relationship('User', backref='messages')

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), default='INFO') # INFO, SUCCESS, WARNING, DANGER
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='notifications')

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False, unique=True)
    rating = db.Column(db.Integer, nullable=False) # 1-5
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    product = db.relationship('Product', backref='reviews')
    user = db.relationship('User', backref='reviews')
    order = db.relationship('Order', backref='review', uselist=False)
