from flask import Blueprint, request, jsonify
from models import PrixLocalise, Materiau
from database import db

prix_bp = Blueprint('prix', __name__)

@prix_bp.route('/prix', methods=['GET'])
def get_prix():
    q = request.args.get('q', '').lower()
    ville = request.args.get('ville', '')
    query = PrixLocalise.query.join(Materiau)

    if q:
        query = query.filter(db.or_(
            Materiau.nom.ilike(f'%{q}%'),
            Materiau.categorie.ilike(f'%{q}%')
        ))
    if ville:
        query = query.filter(PrixLocalise.localite == ville)

    return jsonify([p.to_dict() for p in query.all()]), 200


@prix_bp.route('/prix/<int:id>', methods=['GET'])
def get_prix_detail(id):
    p = PrixLocalise.query.get(id)
    if not p:
        return jsonify({'message': 'Prix non trouvé'}), 404
    return jsonify(p.to_dict()), 200


@prix_bp.route('/prix', methods=['POST'])
def add_prix():
    data = request.get_json()
    materiau = Materiau.query.filter_by(nom=data['nom']).first()
    if not materiau:
        materiau = Materiau(
            nom=data['nom'],
            unite=data.get('unite', 'unité'),
            categorie=data.get('categorie', 'Autre')
        )
        db.session.add(materiau)
        db.session.flush()

    prix = PrixLocalise(
        id_materiau=materiau.id,
        localite=data['localite'],
        prix_min=data.get('prix_min'),
        prix_max=data.get('prix_max'),
        prix_moyen=data.get('prix_moyen'),
        date_releve=data.get('date_releve', ''),
        source=data.get('source', 'Saisie manuelle')
    )
    db.session.add(prix)
    db.session.commit()
    return jsonify(prix.to_dict()), 201