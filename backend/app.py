import os
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

    CORS(app)
    JWTManager(app)
    mail.init_app(app)
    db.init_app(app)

    with app.app_context():
        # Import routes here to avoid circular imports
        from routes import auth, disputes, orders, analytics
        app.register_blueprint(auth.bp)
        app.register_blueprint(disputes.bp)
        app.register_blueprint(orders.bp)
        app.register_blueprint(analytics.bp)
        
        db.create_all()

    return app

app = create_app()

@app.route("/")
def home():
    return "Backend is running"

if __name__ == '__main__':
    app.run(debug=os.environ.get('FLASK_DEBUG', 'False').lower() == 'true', 
            host='0.0.0.0',
            port=int(os.environ.get('PORT', 5000)))
