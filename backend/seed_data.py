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

    # 2. Add Product
    product = Product(
        name="Luxury Minimalist Watch",
        price=299.99,
        description="A premium timepiece featuring a sleek black dial and gold-tone hands. Perfect for any occasion.",
        stock=50,
        seller_id=seller.id
    )
    db.session.add(product)
    db.session.commit()

    # 3. Add an Order that is DELIVERED to test Reviews
    order = Order(
        buyer_id=buyer.id,
        seller_id=seller.id,
        product_id=product.id,
        product_name=product.name,
        quantity=1,
        amount=product.price,
        status="DELIVERED",
        tracking_id="TRK123456789",
        carrier_name="FedEx"
    )
    db.session.add(order)
    db.session.commit()

    # 4. Add a Dispute to test Chat Room
    dispute = Dispute(
        order_id=order.id,
        buyer_id=buyer.id,
        category="Item Not As Described",
        description="The watch I received has a silver tone, but the description says gold-tone.",
        status="OPEN"
    )
    db.session.add(dispute)
    db.session.commit()
    print("✅ Industry-level database seeded!")
    print(f"Admin: admin@test.com / Admin@123")
    print(f"Seller: seller@test.com / Seller@123")
    print(f"Buyer: buyer@test.com / Buyer@123")
