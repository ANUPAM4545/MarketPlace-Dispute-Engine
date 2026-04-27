import threading
from flask import current_app, render_template
from flask_mail import Message

def send_async_email(app, msg):
    """
    Actual email sending logic to be run in a background thread.
    Uses app.extensions['mail'] to avoid circular imports.
    """
    with app.app_context():
        try:
            if 'mail' in app.extensions:
                app.extensions['mail'].send(msg)
                print(f"SUCCESS: Email sent to {msg.recipients}")
            else:
                print("ERROR: Mail extension not initialized in app.")
        except Exception as e:
            print(f"CRITICAL Error sending email: {str(e)}")

def send_email(subject, recipient, template, **kwargs):
    """
    Sends an email using a background thread and an HTML template.
    Now includes robust error catching and avoids circular imports.
    """
    app = current_app._get_current_object()
    
    try:
        # Pass the subject into the template context as well
        kwargs['subject'] = subject
        html_body = render_template(f"emails/{template}.html", **kwargs)
    except Exception as e:
        print(f"Template rendering failed for {template}: {e}")
        return None

    msg = Message(
        subject=subject,
        recipients=[recipient],
        html=html_body,
        # Ensure sender is set to default if not specified
        sender=app.config.get('MAIL_DEFAULT_SENDER')
    )
    
    # In some environments (like Vercel/Serverless), threads are killed immediately.
    # For those cases, we could allow a synchronous send via config.
    if app.config.get('MAIL_SEND_SYNC', False):
        send_async_email(app, msg)
        return None

    thread = threading.Thread(target=send_async_email, args=(app, msg))
    thread.start()
    return thread
