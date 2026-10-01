from flask import Blueprint, jsonify, request
from models import Projet, Devis
from auth import token_required
from database import db
import json

devis_bp = Blueprint('devis', __name__)

@devis_bp.route('/stats', methods=['GET'])
def stats():
    total_projets = Projet.query.count()
    total_devis = Devis.query.count()
    total_montant = db.session.query(db.func.sum(Projet.montant)).scalar() or 0
    return jsonify({
        'devis': total_devis,
        'projets': total_projets,
        'clients': max(total_projets, 1),
        'montant_total': int(total_montant)
    }), 200


@devis_bp.route('/projets', methods=['GET'])
def projets():
    liste = Projet.query.order_by(Projet.date_creation.desc()).limit(10).all()
    return jsonify([p.to_dict() for p in liste]), 200


@devis_bp.route('/devis', methods=['POST'])
def create_devis():
    data = request.get_json()
    devis = Devis(
        nom_projet=data.get('nom_projet'),
        localite=data.get('localite'),
        type_batiment=data.get('type_batiment'),
        surface=data.get('surface', 0),
        nb_niveaux=data.get('nb_niveaux', 1),
        montant_total=data.get('montant_total', 0),
        marge_contingence=data.get('marge_contingence', 0.15),
        details_json=json.dumps(data.get('details', {}))
    )
    db.session.add(devis)
    db.session.commit()
    return jsonify(devis.to_dict()), 201


@devis_bp.route('/devis', methods=['GET'])
def list_devis():
    liste = Devis.query.order_by(Devis.date_creation.desc()).all()
    return jsonify([d.to_dict() for d in liste]), 200