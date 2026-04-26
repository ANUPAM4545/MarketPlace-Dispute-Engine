from flask import Blueprint, request, jsonify, current_app
from utils.email import send_email

bp = Blueprint('support', __name__, url_prefix='/support')

@bp.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')

    if not all([name, email, subject, message]):
        return jsonify({"msg": "Missing required fields"}), 400

    # Send notification email to the owner
    try:
        # We send it to the MAIL_USERNAME (the owner's email)
        owner_email = current_app.config.get('MAIL_USERNAME')
        send_email(
            subject=f"Support Inquiry: {subject}",
            recipient=owner_email,
            template="contact_form",
            name=name,
            email=email,
            message=message
        )
        return jsonify({"msg": "Message sent successfully"}), 200
    except Exception as e:
        print(f"Error in support route: {e}")
        return jsonify({"msg": "Failed to send message"}), 500
