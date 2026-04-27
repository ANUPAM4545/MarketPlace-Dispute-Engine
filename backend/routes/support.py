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
@bp.route('/test-email', methods=['GET'])
def test_email_route():
    import threading
    try:
        # Allow testing with a specific recipient via ?to=email@example.com
        recipient = request.args.get('to') or current_app.config.get('MAIL_USERNAME')
        
        if not recipient:
            return jsonify({"error": "No recipient specified and MAIL_USERNAME not configured"}), 500
            
        result = send_email(
            subject="Elite Engine Diagnostic Test",
            recipient=recipient,
            template="welcome",
            name="System Tester",
            role="User",
            login_url="https://disputeengine.tech/login"
        )
        
        if result is True or isinstance(result, threading.Thread):
            return jsonify({
                "status": "Success", 
                "message": f"Email sent successfully to {recipient}",
                "note": "If you used the ?to= parameter, check that specific inbox."
            }), 200
        else:
            return jsonify({"status": "Failed", "error": str(result)}), 500
    except Exception as e:
        return jsonify({"status": "Error", "error": str(e)}), 500
