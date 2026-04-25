import os
from dotenv import load_dotenv
load_dotenv()
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from config import Config
from models import db

mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/*": {
        "origins": "*",
        "allow_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    }})
    JWTManager(app)
    mail.init_app(app)
    db.init_app(app)

    with app.app_context():
        # Import routes here to avoid circular imports
        from routes import auth, disputes, orders, analytics, products, notifications, search
        app.register_blueprint(auth.bp)
        app.register_blueprint(disputes.bp)
        app.register_blueprint(orders.bp)
        app.register_blueprint(analytics.bp)
        app.register_blueprint(products.bp)
        app.register_blueprint(notifications.bp)
        app.register_blueprint(search.bp)
        
        try:
            db.create_all()
            print("Database tables created/verified successfully!")
        except Exception as e:
            print(f"CRITICAL: Database connection failed: {e}")

    return app

app = create_app()

@app.route("/")
def home():
    return "Backend is running"

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(debug=os.environ.get('FLASK_DEBUG', 'False').lower() == 'true', 
            host='0.0.0.0',
            port=port)
            
