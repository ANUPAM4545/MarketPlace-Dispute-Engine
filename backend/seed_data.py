from app import create_app, db
from models import User, Order, Dispute
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

app = create_app()
with app.app_context():
    # Clear existing data
    db.drop_all()
    db.create_all()

    # 1. Create Users
    admin = User(email="admin@test.com", name="Dhoni Admin", role="Admin", password_hash=generate_password_hash("Admin@123", method="pbkdf2:sha256"))
    seller = User(email="seller@test.com", name="Premium Seller", role="Seller", password_hash=generate_password_hash("Seller@123", method="pbkdf2:sha256"))
    buyer = User(email="buyer@test.com", name="Regular Buyer", role="Buyer", password_hash=generate_password_hash("Buyer@123", method="pbkdf2:sha256"))
    
    db.session.add_all([admin, seller, buyer])
    db.session.commit()

    # 2. Create Orders
    orders = [
        Order(buyer_id=buyer.id, seller_id=seller.id, product_name="High-End Headphones", amount=299.99),
        Order(buyer_id=buyer.id, seller_id=seller.id, product_name="Mechanical Keyboard", amount=150.00),
        Order(buyer_id=buyer.id, seller_id=seller.id, product_name="4K Monitor", amount=450.00),
        Order(buyer_id=buyer.id, seller_id=seller.id, product_name="USB-C Hub", amount=50.00),
        Order(buyer_id=buyer.id, seller_id=seller.id, product_name="Desk Lamp", amount=85.00)
    ]
    db.session.add_all(orders)
    db.session.commit()

    # 3. Create Disputes for every column
    disputes = [
        Dispute(order_id=orders[0].id, buyer_id=buyer.id, category="Item Not as Described", 
                 description="The headphones have a scratch on the left ear cup.", status="OPEN", 
                 created_at=datetime.utcnow() - timedelta(days=5)),
        
        Dispute(order_id=orders[1].id, buyer_id=buyer.id, category="Late Delivery", 
                 description="Package arrived 5 days late, box was damaged.", status="UNDER_REVIEW", 
                 created_at=datetime.utcnow() - timedelta(days=4)),
        
        Dispute(order_id=orders[2].id, buyer_id=buyer.id, category="Defective Product", 
                 description="The monitor has 3 dead pixels in the center.", status="SELLER_RESPONDED", 
                 is_suspicious=True, created_at=datetime.utcnow() - timedelta(days=3)),

        Dispute(order_id=orders[3].id, buyer_id=buyer.id, category="Incorrect Item", 
                 description="Received a USB 2.0 hub instead of the USB-C one ordered.", status="RESOLVED", 
                 created_at=datetime.utcnow() - timedelta(days=2)),

        Dispute(order_id=orders[4].id, buyer_id=buyer.id, category="Change of Mind", 
                 description="Buyer just wanted a refund because they found it cheaper elsewhere.", status="REJECTED", 
                 created_at=datetime.utcnow() - timedelta(days=1))
    ]

    db.session.add_all(disputes)
    db.session.commit()

    print("✅ Local database seeded with ALL columns populated!")
    print(f"Admin Login -> Email: admin@test.com, Password: Admin@123")
