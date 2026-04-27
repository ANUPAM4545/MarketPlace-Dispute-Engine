import os
import secrets

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or secrets.token_hex(16)
    
    # Render's DATABASE_URL starts with 'postgres://', but SQLAlchemy 1.4+ requires 'postgresql://'
    db_url = os.environ.get('DATABASE_URL') or 'sqlite:///market_dispute.db'
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
        
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or secrets.token_hex(16)

    # Flask-Mail config
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com').strip()
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'True').lower() == 'true'
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', '').strip()
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', '').strip()
    MAIL_DEFAULT_SENDER = (os.environ.get('MAIL_DEFAULT_SENDER') or os.environ.get('MAIL_USERNAME') or 'noreply@disputeengine.com').strip()
    MAIL_SEND_SYNC = os.environ.get('MAIL_SEND_SYNC', 'False').lower() == 'true'
