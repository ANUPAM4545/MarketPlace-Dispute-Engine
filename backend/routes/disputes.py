from flask import Blueprint, request, jsonify
from models import db, Dispute, Evidence
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

bp = Blueprint('disputes', __name__, url_prefix='/disputes')

import os
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
        
        # Save Evidence record
        evidence = Evidence(
            dispute_id=new_dispute.id,
            file_url=f"/static/uploads/{filename}",
            uploaded_by=current_user_id
        )
        db.session.add(evidence)

    db.session.commit()
    
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
        "created_at": d.created_at
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
    
    # Fetch evidence
    evidence_list = Evidence.query.filter_by(dispute_id=id).all()
    evidence_data = [{
        "file_url": e.file_url,
        "uploaded_by": e.uploaded_by,
        "uploaded_at": e.uploaded_at
    } for e in evidence_list]

    return jsonify({
        "id": dispute.id,
        "status": dispute.status,
        "category": dispute.category,
        "description": dispute.description,
        "seller_response": dispute.seller_response,
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
        evidence = Evidence(
            dispute_id=dispute.id,
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
    
    return jsonify({"msg": "Dispute status updated", "status": dispute.status}), 200
