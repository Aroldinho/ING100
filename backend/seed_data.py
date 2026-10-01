from database import db
from models import Utilisateur, Materiau, PrixLocalise, Projet

def seed():
    if Utilisateur.query.first():
        return

    users = [
        {'nom': 'Ing. Kamga', 'email': 'ingenieur@ing10.cm', 'password': 'demo123', 'role': 'ingenieur', 'localite': 'Douala'},
        {'nom': 'Admin ING10', 'email': 'admin@ing10.cm', 'password': 'admin123', 'role': 'admin', 'localite': 'Yaoundé'},
        {'nom': 'M. Nguema', 'email': 'client@ing10.cm', 'password': 'client123', 'role': 'client', 'localite': 'Yaoundé'}
    ]
    for u in users:
        user = Utilisateur(nom=u['nom'], email=u['email'], role=u['role'], localite=u['localite'])
        user.set_password(u['password'])
        db.session.add(user)

    materiaux_data = [
        ('Ciment 50 kg (CPA 42.5)', 'sac', 'Liant', [
            ('Douala', 4600, 5200, 4900, '2026-09-15'),
            ('Yaoundé', 4900, 5400, 5100, '2026-09-20'),
            ('Ngaoundéré', 5300, 5800, 5500, '2026-09-10'),
            ('Bafoussam', 5000, 5500, 5250, '2026-09-12')
        ]),
        ('Sable fin', 'm³', 'Granulat', [
            ('Douala', 10000, 15000, 12500, '2026-09-18'),
            ('Yaoundé', 11000, 16000, 13500, '2026-09-19')
        ]),
        ('Gravier 15/25', 'm³', 'Granulat', [
            ('Douala', 18000, 25000, 21500, '2026-09-15'),
            ('Yaoundé', 20000, 26000, 23000, '2026-09-17')
        ]),
        ('Fer à béton Ø12 (12 m)', 'barre', 'Acier', [
            ('Douala', 5000, 6500, 5750, '2026-09-14'),
            ('Yaoundé', 5200, 6800, 6000, '2026-09-16')
        ]),
        ('Bloc béton 15x20x40', 'unité', 'Maçonnerie', [
            ('Douala', 400, 550, 475, '2026-09-13'),
            ('Yaoundé', 425, 575, 500, '2026-09-15')
        ]),
        ('Bois coffrage (planche 2 m)', 'unité', 'Coffrage', [
            ('Douala', 1500, 2200, 1850, '2026-09-12')
        ]),
        ('Tôle bac alu 0.4 mm', 'm²', 'Toiture', [
            ('Douala', 4500, 6000, 5250, '2026-09-11'),
            ('Yaoundé', 4800, 6300, 5550, '2026-09-13')
        ])
    ]
    for nom, unite, cat, prix_list in materiaux_data:
        mat = Materiau(nom=nom, unite=unite, categorie=cat)
        db.session.add(mat)
        db.session.flush()
        for ville, pmin, pmax, pmoy, date in prix_list:
            db.session.add(PrixLocalise(
                id_materiau=mat.id, localite=ville,
                prix_min=pmin, prix_max=pmax, prix_moyen=pmoy,
                date_releve=date, source='Relevé terrain'
            ))

    projets = [
        ('Villa Duplex Bonamoussadi', 'Douala', 'Villa', 180, 'en-cours', 24500000),
        ('Immeuble R+2 Yaoundé', 'Yaoundé', 'Immeuble', 420, 'en-cours', 78000000),
        ('Maison 100 m² Ngaoundéré', 'Ngaoundéré', 'Maison', 100, 'termine', 12500000),
        ('Boutique Bafoussam', 'Bafoussam', 'Commercial', 60, 'archive', 6200000)
    ]
    for nom, ville, typ, surf, statut, montant in projets:
        db.session.add(Projet(
            nom=nom, localite=ville, type_batiment=typ,
            surface=surf, statut=statut, montant=montant
        ))

    db.session.commit()
    print('✅ Base initialisée avec les données démo.')