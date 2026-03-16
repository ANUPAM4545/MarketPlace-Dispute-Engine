from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    JWTManager(app)
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

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001)
