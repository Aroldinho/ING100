from flask import Blueprint, request, jsonify
from models import Utilisateur
from database import db
import jwt
import os
from datetime import datetime, timedelta
from functools import wraps

auth_bp = Blueprint('auth', __name__)
SECRET_KEY = os.environ.get('SECRET_KEY', 'ing10-secret-key-change-me')

def generate_token(user):
    payload = {
        'user_id': user.id, 'email': user.email, 'role': user.role,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'message': 'Token manquant'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = Utilisateur.query.get(data['user_id'])
        except Exception:
            return jsonify({'message': 'Token invalide'}), 401
        return f(current_user, *args, **kwargs)
    return decorated


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email et mot de passe requis'}), 400
    if Utilisateur.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Cet email est déjà utilisé'}), 409

    user = Utilisateur(
        nom=data.get('nom', ''),
        email=data['email'],
        telephone=data.get('telephone', ''),
        role=data.get('role', 'ingenieur'),
        localite=data.get('localite', '')
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Compte créé', 'user': user.to_dict()}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not email or not password:
        return jsonify({'message': 'Email et mot de passe requis'}), 400

    user = Utilisateur.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Identifiants incorrects'}), 401
    if role and user.role != role:
        return jsonify({'message': f'Ce compte n\'est pas un compte {role}'}), 403

    return jsonify({
        'message': 'Connexion réussie',
        'token': generate_token(user),
        'user': user.to_dict()
    }), 200


@auth_bp.route('/me', methods=['GET'])
@token_required
def me(current_user):
    return jsonify(current_user.to_dict()), 200