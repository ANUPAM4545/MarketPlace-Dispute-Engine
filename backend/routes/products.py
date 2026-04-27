from flask import Blueprint, request, jsonify
from models import db, Product, User
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

bp = Blueprint('products', __name__, url_prefix='/products')

@bp.route('/', methods=['GET'])
def get_products():
    seller_id = request.args.get('seller_id')
    if seller_id:
        products = Product.query.filter_by(seller_id=seller_id).all()
    else:
        products = Product.query.all()
    
    from models import Review
    products_data = []
    
    for p in products:
        reviews = Review.query.filter_by(product_id=p.id).all()
        avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0
        
        products_data.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "stock": p.stock,
            "seller_id": p.seller_id,
            "seller_name": p.seller.name if p.seller else "Unknown",
            "image_url": p.image_url,
            "average_rating": round(avg_rating, 1),
            "review_count": len(reviews)
        })
        
    return jsonify(products_data), 200

@bp.route('/', methods=['POST'])
@jwt_required()
def create_product():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')

    if role != 'Seller':
        return jsonify({"msg": "Only sellers can create products"}), 403

    # Check for file
    image_url = None
    if 'image' in request.files:
        file = request.files['image']
        if file.filename != '':
            from utils.s3 import upload_to_s3
            # 1. Try S3
            image_url = upload_to_s3(file)
            
            if not image_url:
                # 2. Fallback to Local
                import os
                from werkzeug.utils import secure_filename
                from flask import current_app
                filename = secure_filename(file.filename)
                upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
                if not os.path.exists(upload_folder):
                    os.makedirs(upload_folder)
                file_path = os.path.join(upload_folder, filename)
                file.save(file_path)
                image_url = f"/static/uploads/{filename}"

    # Handle both JSON and form data
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form

    name = data.get('name')
    price = data.get('price')
    description = data.get('description', '')
    stock = data.get('stock', 10)

    if not name or not price:
        return jsonify({"msg": "Missing required fields (name, price)"}), 400

    product = Product(
        name=name,
        price=float(price),
        description=description,
        stock=int(stock),
        seller_id=current_user_id,
        image_url=image_url
    )
    db.session.add(product)
    db.session.commit()

    return jsonify({"msg": "Product created", "id": product.id, "image_url": image_url}), 201

@bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_product(id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')

    if role != 'Seller':
        return jsonify({"msg": "Only sellers can update products"}), 403

    product = Product.query.get_or_404(id)
    if product.seller_id != int(current_user_id):
        return jsonify({"msg": "You can only update your own products"}), 403

    if request.is_json:
        data = request.get_json()
    else:
        data = request.form

    # Update basic fields
    if 'name' in data:
        product.name = data.get('name')
    if 'price' in data:
        product.price = float(data.get('price'))
    if 'description' in data:
        product.description = data.get('description')
    if 'stock' in data:
        product.stock = int(data.get('stock'))

    # Update image if provided
    if 'image' in request.files:
        file = request.files['image']
        if file.filename != '':
            from utils.s3 import upload_to_s3
            # 1. Try S3
            new_url = upload_to_s3(file)
            
            if not new_url:
                # 2. Fallback to Local
                import os
                from werkzeug.utils import secure_filename
                from flask import current_app
                filename = secure_filename(file.filename)
                upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
                if not os.path.exists(upload_folder):
                    os.makedirs(upload_folder)
                file_path = os.path.join(upload_folder, filename)
                file.save(file_path)
                new_url = f"/static/uploads/{filename}"
            
            product.image_url = new_url

    db.session.commit()
    return jsonify({"msg": "Product updated", "id": product.id}), 200

@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_product(id):
    current_user_id = get_jwt_identity()
    product = Product.query.get_or_404(id)

    if product.seller_id != int(current_user_id):
        return jsonify({"msg": "You can only delete your own products"}), 403

    db.session.delete(product)
    db.session.commit()
    return jsonify({"msg": "Product deleted"}), 200

@bp.route('/<int:id>/reviews', methods=['GET'])
def get_product_reviews(id):
    from models import Review
    reviews = Review.query.filter_by(product_id=id).order_by(Review.created_at.desc()).all()
    
    return jsonify([{
        "id": r.id,
        "user_name": r.user.name,
        "rating": r.rating,
        "comment": r.comment,
        "created_at": r.created_at.isoformat()
    } for r in reviews]), 200
