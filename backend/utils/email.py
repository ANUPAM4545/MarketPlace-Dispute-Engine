import threading
from flask import current_app, render_template
from flask_mail import Message

def send_async_email(app, msg):
    from app import mail
    with app.app_context():
        try:
            mail.send(msg)
        except Exception as e:
            print(f"Error sending email: {e}")

def send_email(subject, recipient, template, **kwargs):
    """
    Sends an email asynchronously using a background thread and an HTML template.
    """
    # Grab the actual application object from the context local
    app = current_app._get_current_object()
    
    try:
        html_body = render_template(f"emails/{template}.html", **kwargs)
    except Exception as e:
        print(f"Template rendering failed: {e}")
        return None

    msg = Message(
        subject=subject,
        recipients=[recipient],
        html=html_body
    )
    
    thread = threading.Thread(target=send_async_email, args=(app, msg))
    thread.start()
    return thread
