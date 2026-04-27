from app import create_app, db
from models import User, Order, Dispute, Product
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

app = create_app()
with app.app_context():
    # Clear existing data
    db.drop_all()
    db.create_all()

    # 1. Create Users
    admin = User(email="admin@test.com", name="Admin", role="Admin", phone="555-0101", address="100 Admin Way, Server City", password_hash=generate_password_hash("Admin@123", method="pbkdf2:sha256"))
    seller = User(email="seller@test.com", name="Seller", role="Seller", phone="555-0202", address="200 Market Street, Shopville", password_hash=generate_password_hash("Seller@123", method="pbkdf2:sha256"))
    buyer = User(email="buyer@test.com", name=" Buyer", role="Buyer", phone="555-0303", address="300 Home Ave, Resident Town", password_hash=generate_password_hash("Buyer@123", method="pbkdf2:sha256"))
    
    db.session.add_all([admin, seller, buyer])
    db.session.commit()

    # 2. Products will be created by sellers manually now.

    # 3. No demo orders or disputes
    print("✅ Industry-level database seeded!")
    print(f"Admin: admin@test.com / Admin@123")
    print(f"Seller: seller@test.com / Seller@123")
    print(f"Buyer: buyer@test.com / Buyer@123")
