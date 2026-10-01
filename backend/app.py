from flask import Flask, jsonify
from flask_cors import CORS
from database import db
from auth import auth_bp
from prix import prix_bp
from devis import devis_bp
from seed_data import seed

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ing10.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'ing10-secret-key-change-me'

CORS(app, resources={r"/api/*": {"origins": "*"}})
db.init_app(app)

app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(prix_bp, url_prefix='/api')
app.register_blueprint(devis_bp, url_prefix='/api')


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'ING10 API', 'version': '1.0'}), 200


@app.errorhandler(404)
def not_found(e):
    return jsonify({'message': 'Route non trouvée'}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({'message': 'Erreur serveur'}), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed()

    print('\n🚀 ING10 API sur http://localhost:5000\n')
    app.run(debug=True, port=5000)