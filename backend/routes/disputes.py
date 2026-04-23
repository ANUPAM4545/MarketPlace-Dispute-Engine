from flask import Blueprint, request, jsonify
from models import db, Dispute, Evidence
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from utils.email import send_email
from models import User

bp = Blueprint('disputes', __name__, url_prefix='/disputes')

import os
import json
from werkzeug.utils import secure_filename
from flask import current_app

@bp.route('/', methods=['POST'])
@jwt_required()
def create_dispute():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    if claims.get('role') != 'Buyer':
        return jsonify({"msg": "Only buyers can create disputes"}), 403
    
    # Check if this is a multipart request (with file) or JSON
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form

    order_id = data.get('order_id')
    category = data.get('category')
    description = data.get('description')
    
    if not all([order_id, category, description]):
         return jsonify({"msg": "Missing required fields"}), 400

    # Verify order ownership
    from models import Order
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"msg": "Order not found"}), 404
    if order.buyer_id != int(current_user_id):
        return jsonify({"msg": "You can only dispute your own orders"}), 403

    new_dispute = Dispute(
        order_id=order_id,
        buyer_id=current_user_id,
        category=category,
        description=description
    )
    db.session.add(new_dispute)
    db.session.flush() # Get ID
    
    # Handle File Upload
    file = request.files.get('evidence')
    if file and file.filename != '':
        filename = secure_filename(file.filename)
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
            
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        
        # Extract metadata
        file_size = os.path.getsize(file_path)
        metadata = {
            "file_size": file_size,
            "filename": filename
        }

        # Save Evidence record
        evidence = Evidence(
            dispute_id=new_dispute.id,
            order_id=order_id,
            image_type='BUYER',
            metadata_info=json.dumps(metadata),
            file_url=f"/static/uploads/{filename}",
            uploaded_by=current_user_id
        )
        db.session.add(evidence)

        # FRAUD DETECTION: Check if Seller uploaded pre-delivery evidence
        seller_evidence = Evidence.query.filter_by(order_id=order_id, image_type='SELLER').first()
        if seller_evidence:
            # Basic Image Comparison Logic: Compare file size metadata
            try:
                seller_meta = json.loads(seller_evidence.metadata_info) if seller_evidence.metadata_info else {}
                if "file_size" in seller_meta and "file_size" in metadata:
                    s_size = seller_meta["file_size"]
                    b_size = metadata["file_size"]
                    # If sizes differ by more than 5%, flag as suspicious (likely manipulated or different photo)
                    diff_ratio = abs(s_size - b_size) / max(s_size, 1)
                    if diff_ratio > 0.05:
                        new_dispute.is_suspicious = True
                else:
                    new_dispute.is_suspicious = True # Default to suspicious if we can't compare
            except Exception:
                new_dispute.is_suspicious = True

            db.session.add(new_dispute)

    db.session.commit()
    
    seller = User.query.get(order.seller_id)
    if seller and seller.email:
        send_email(
            subject=f"New Dispute Opened for Order #{order_id}",
            recipient=seller.email,
            template="dispute_opened",
            order_id=order_id,
            category=category,
            description=description,
            login_url="http://localhost:5173/login"
        )
    
    return jsonify({"msg": "Dispute created", "id": new_dispute.id}), 201

@bp.route('/', methods=['GET'])
@jwt_required()
def get_disputes():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')
    
    if role == 'Admin':
        disputes = Dispute.query.all()
    elif role == 'Seller':
        # Filter by seller's orders
        from models import Order
        disputes = Dispute.query.join(Order).filter(Order.seller_id == current_user_id).all()
    else: # Buyer
        disputes = Dispute.query.filter_by(buyer_id=current_user_id).all()
        
    return jsonify([{
        "id": d.id,
        "status": d.status,
        "category": d.category,
        "description": d.description,
        "created_at": d.created_at,
        "is_suspicious": d.is_suspicious,
        "order_amount": d.order.amount if d.order else 0,
        "product_name": d.order.product_name if d.order else "N/A"
    } for d in disputes]), 200

@bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_dispute(id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')
    
    dispute = Dispute.query.get_or_404(id)
    from models import Order
    order = Order.query.get(dispute.order_id)

    # Access Control
    if role == 'Admin':
        pass # Admin sees all
    elif role == 'Seller':
        if order.seller_id != int(current_user_id):
             return jsonify({"msg": "Access denied"}), 403
    elif role == 'Buyer':
        if dispute.buyer_id != int(current_user_id):
             return jsonify({"msg": "Access denied"}), 403
    else:
        return jsonify({"msg": "Unknown role"}), 403
    
    # Fetch evidence (both order-level seller evidence and dispute-level evidence)
    evidence_list = Evidence.query.filter(
        db.or_(
            Evidence.dispute_id == id,
            Evidence.order_id == dispute.order_id
        )
    ).all()
    
    evidence_data = [{
        "id": e.id,
        "file_url": e.file_url,
        "uploaded_by": e.uploaded_by,
        "uploaded_at": e.uploaded_at,
        "image_type": e.image_type,
        "metadata_info": json.loads(e.metadata_info) if e.metadata_info else {}
    } for e in evidence_list]

    return jsonify({
        "id": dispute.id,
        "status": dispute.status,
        "category": dispute.category,
        "description": dispute.description,
        "seller_response": dispute.seller_response,
        "is_suspicious": dispute.is_suspicious,
        "created_at": dispute.created_at,
        "buyer_id": dispute.buyer_id,
        "order_id": dispute.order_id,
        "evidence": evidence_data
    }), 200

@bp.route('/<int:id>/respond', methods=['POST'])
@jwt_required()
def respond_dispute(id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')
    
    dispute = Dispute.query.get_or_404(id)
    
    # Check if this is a multipart request (with file) or JSON
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form

    # Verify it is the seller AND the correct seller
    if role != 'Seller': 
         return jsonify({"msg": "Only sellers can respond"}), 403
    
    from models import Order
    order = Order.query.get(dispute.order_id)
    if order.seller_id != int(current_user_id):
        return jsonify({"msg": "You can only respond to disputes for your orders"}), 403
         
    # Update status and response text
    dispute.status = 'SELLER_RESPONDED'
    if 'response' in data:
        dispute.seller_response = data['response']

    # Handle Counter-Evidence File Upload
    file = request.files.get('evidence')
    if file and file.filename != '':
        filename = secure_filename(file.filename)
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
            
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        
        # Save Evidence record
        # Seller responding to a dispute
        file_size = os.path.getsize(file_path)
        metadata = {"file_size": file_size, "filename": filename}

        evidence = Evidence(
            dispute_id=dispute.id,
            order_id=dispute.order_id,
            image_type='SELLER',
            metadata_info=json.dumps(metadata),
            file_url=f"/static/uploads/{filename}",
            uploaded_by=current_user_id
        )
        db.session.add(evidence)

    db.session.commit()
    
    return jsonify({"msg": "Response submitted", "status": dispute.status}), 200

@bp.route('/<int:id>/resolve', methods=['POST'])
@jwt_required()
def resolve_dispute(id):
    claims = get_jwt()
    role = claims.get('role')
    
    if role != 'Admin':
        return jsonify({"msg": "Only admins can resolve disputes"}), 403
        
    dispute = Dispute.query.get_or_404(id)
    data = request.get_json()
    
    resolution = data.get('resolution') # RESOLVED, REJECTED
    if resolution not in ['RESOLVED', 'REJECTED']:
        return jsonify({"msg": "Invalid resolution status"}), 400
        
    dispute.status = resolution
    # Log resolution decision?
    
    db.session.commit()
    
    from models import Order, User
    order = Order.query.get(dispute.order_id)
    buyer = User.query.get(dispute.buyer_id)
    seller = User.query.get(order.seller_id)
    
    for notify_user in [buyer, seller]:
        if notify_user and notify_user.email:
            send_email(
                subject=f"Dispute #{dispute.id} Final Resolution",
                recipient=notify_user.email,
                template="status_update",
                dispute_id=dispute.id,
                new_status=resolution,
                login_url="http://localhost:5173/login"
            )

    return jsonify({"msg": "Dispute resolved", "status": dispute.status}), 200

@bp.route('/<int:id>/status', methods=['PUT'])
@jwt_required()
def update_dispute_status(id):
    claims = get_jwt()
    role = claims.get('role')
    
    if role != 'Admin':
        return jsonify({"msg": "Only admins can update dispute status directly"}), 403
        
    dispute = Dispute.query.get_or_404(id)
    data = request.get_json()
    
    new_status = data.get('status')
    valid_statuses = ['OPEN', 'UNDER_REVIEW', 'SELLER_RESPONDED', 'RESOLVED', 'REJECTED']
    
    if new_status not in valid_statuses:
        return jsonify({"msg": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400
        
    dispute.status = new_status
    db.session.commit()
    
    from models import Order, User
    order = Order.query.get(dispute.order_id)
    buyer = User.query.get(dispute.buyer_id)
    seller = User.query.get(order.seller_id)
    
    for notify_user in [buyer, seller]:
        if notify_user and notify_user.email:
            send_email(
                subject=f"Dispute #{dispute.id} Status Updated",
                recipient=notify_user.email,
                template="status_update",
                dispute_id=dispute.id,
                new_status=new_status,
                login_url="http://localhost:5173/login"
            )
    
    return jsonify({"msg": "Dispute status updated", "status": dispute.status}), 200

@bp.route('/<int:id>/messages', methods=['GET'])
@jwt_required()
def get_dispute_messages(id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')
    
    dispute = Dispute.query.get_or_404(id)
    from models import Order, Message, User
    order = Order.query.get(dispute.order_id)

    # Access Control
    if role == 'Seller' and order.seller_id != int(current_user_id):
        return jsonify({"msg": "Access denied"}), 403
    elif role == 'Buyer' and dispute.buyer_id != int(current_user_id):
        return jsonify({"msg": "Access denied"}), 403
    
    messages = Message.query.filter_by(dispute_id=id).order_by(Message.created_at.asc()).all()
    
    return jsonify([{
        "id": m.id,
        "sender_id": m.sender_id,
        "sender_name": m.sender.name,
        "sender_role": m.sender.role,
        "content": m.content,
        "created_at": m.created_at.isoformat()
    } for m in messages]), 200

@bp.route('/<int:id>/messages', methods=['POST'])
@jwt_required()
def post_dispute_message(id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')
    
    dispute = Dispute.query.get_or_404(id)
    from models import Order, Message
    order = Order.query.get(dispute.order_id)

    # Access Control
    if role == 'Seller' and order.seller_id != int(current_user_id):
        return jsonify({"msg": "Access denied"}), 403
    elif role == 'Buyer' and dispute.buyer_id != int(current_user_id):
        return jsonify({"msg": "Access denied"}), 403
    
    data = request.get_json()
    content = data.get('content')
    if not content or not content.strip():
        return jsonify({"msg": "Message content cannot be empty"}), 400
        
    new_message = Message(
        dispute_id=id,
        sender_id=current_user_id,
        content=content.strip()
    )
    db.session.add(new_message)
    db.session.commit()
    
    return jsonify({
        "msg": "Message sent",
        "message": {
            "id": new_message.id,
            "sender_id": new_message.sender_id,
            "sender_name": new_message.sender.name,
            "sender_role": new_message.sender.role,
            "content": new_message.content,
            "created_at": new_message.created_at.isoformat()
        }
    }), 201
