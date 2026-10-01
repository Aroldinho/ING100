from database import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class Utilisateur(db.Model):
    __tablename__ = 'utilisateur'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    telephone = db.Column(db.String(30))
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='ingenieur')
    localite = db.Column(db.String(80))
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, pwd):
        self.password_hash = generate_password_hash(pwd)

    def check_password(self, pwd):
        return check_password_hash(self.password_hash, pwd)

    def to_dict(self):
        return {
            'id': self.id, 'nom': self.nom, 'email': self.email,
            'telephone': self.telephone, 'role': self.role,
            'localite': self.localite
        }


class Materiau(db.Model):
    __tablename__ = 'materiau'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(150), nullable=False)
    unite = db.Column(db.String(20))
    categorie = db.Column(db.String(60))

    def to_dict(self):
        return {'id': self.id, 'nom': self.nom, 'unite': self.unite, 'categorie': self.categorie}


class PrixLocalise(db.Model):
    __tablename__ = 'prix_localise'
    id = db.Column(db.Integer, primary_key=True)
    id_materiau = db.Column(db.Integer, db.ForeignKey('materiau.id'))
    localite = db.Column(db.String(80), nullable=False)
    prix_min = db.Column(db.Float)
    prix_max = db.Column(db.Float)
    prix_moyen = db.Column(db.Float)
    date_releve = db.Column(db.String(20))
    source = db.Column(db.String(100))

    materiau = db.relationship('Materiau', backref='prix')

    def to_dict(self):
        return {
            'id': self.id,
            'nom': self.materiau.nom if self.materiau else '',
            'unite': self.materiau.unite if self.materiau else '',
            'categorie': self.materiau.categorie if self.materiau else '',
            'localite': self.localite,
            'prix_min': self.prix_min,
            'prix_max': self.prix_max,
            'prix_moyen': self.prix_moyen,
            'date_releve': self.date_releve,
            'source': self.source
        }


class Projet(db.Model):
    __tablename__ = 'projet'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(150), nullable=False)
    localite = db.Column(db.String(80))
    type_batiment = db.Column(db.String(60))
    surface = db.Column(db.Float)
    statut = db.Column(db.String(20), default='en-cours')
    montant = db.Column(db.Float, default=0)
    id_user = db.Column(db.Integer, db.ForeignKey('utilisateur.id'))
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id, 'nom': self.nom, 'localite': self.localite,
            'type': self.type_batiment, 'surface': self.surface,
            'statut': self.statut, 'montant': self.montant
        }


class Devis(db.Model):
    __tablename__ = 'devis'
    id = db.Column(db.Integer, primary_key=True)
    nom_projet = db.Column(db.String(150))
    localite = db.Column(db.String(80))
    type_batiment = db.Column(db.String(60))
    surface = db.Column(db.Float)
    nb_niveaux = db.Column(db.Integer, default=1)
    montant_total = db.Column(db.Float, default=0)
    marge_contingence = db.Column(db.Float, default=0.15)
    details_json = db.Column(db.Text)
    id_user = db.Column(db.Integer, db.ForeignKey('utilisateur.id'))
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id, 'nom_projet': self.nom_projet,
            'localite': self.localite, 'type_batiment': self.type_batiment,
            'surface': self.surface, 'nb_niveaux': self.nb_niveaux,
            'montant_total': self.montant_total,
            'marge_contingence': self.marge_contingence,
            'details': self.details_json,
            'date': self.date_creation.strftime('%Y-%m-%d') if self.date_creation else ''
        }