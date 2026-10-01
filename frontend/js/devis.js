const session = Session.requireAuth();

if (session) {
    const initials = session.user.nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    document.getElementById('avatar').textContent = initials;
    document.getElementById('userName').textContent = session.user.nom;
    document.getElementById('userRole').textContent = session.role;
}

function toggleSidebar() { document.querySelector('.sidebar').classList.toggle('open'); }

function logout() {
    if (confirm('Se déconnecter ?')) {
        Session.clear();
        window.location.href = 'login.html';
    }
}

// ===== MOTEUR DE CALCUL =====
const PRIX_BASE = {
    'Douala':    { ciment: 4900, sable: 12500, gravier: 21500, fer: 5750, bloc: 475, tole: 5250 },
    'Yaoundé':   { ciment: 5100, sable: 13500, gravier: 23000, fer: 6000, bloc: 500, tole: 5550 },
    'Ngaoundéré':{ ciment: 5500, sable: 14000, gravier: 24000, fer: 6300, bloc: 520, tole: 5800 },
    'Bafoussam': { ciment: 5250, sable: 13000, gravier: 22500, fer: 5900, bloc: 510, tole: 5600 }
};

function calculerDevis(data) {
    const p = PRIX_BASE[data.localite] || PRIX_BASE['Douala'];
    const surface = parseFloat(data.surface) || 0;
    const niveaux = parseInt(data.nb_niveaux) || 1;
    const surfaceTotale = surface * niveaux;

    // Fondation
    const volumeBetonFondation = surfaceTotale * 0.15;
    const quantiteCimentFondation = volumeBetonFondation * 7; // 7 sacs/m³
    const quantiteSableFondation = volumeBetonFondation * 0.4;
    const quantiteGravierFondation = volumeBetonFondation * 0.8;
    const poidsFerFondation = surfaceTotale * 8; // kg/m²

    const coutFondation =
        quantiteCimentFondation * p.ciment +
        quantiteSableFondation * p.sable +
        quantiteGravierFondation * p.gravier +
        poidsFerFondation * (p.fer / 12) +
        surfaceTotale * 3500; // main d'œuvre

    // Élévation
    const surfaceMurs = surfaceTotale * 2.8;
    const nbBlocs = surfaceMurs * 12.5;
    const volumeBetonPoteaux = surfaceTotale * 0.06;
    const quantiteCimentElev = volumeBetonPoteaux * 7;
    const poidsFerElev = surfaceTotale * 6;

    const coutElevation =
        nbBlocs * p.bloc +
        quantiteCimentElev * p.ciment +
        poidsFerElev * (p.fer / 12) +
        surfaceTotale * 4500;

    // Finition
    const surfaceEnduit = surfaceMurs * 2;
    const coutFinition =
        surfaceEnduit * 2500 +   // enduit
        surfaceTotale * 3500 +   // carrelage
        surfaceTotale * 1800;    // peinture

    // Toiture
    const surfaceToiture = surface * 1.3;
    const coutToiture =
        surfaceToiture * p.tole +
        surfaceTotale * 1500;

    const sousTotal = coutFondation + coutElevation + coutFinition + coutToiture;
    const contingence = sousTotal * parseFloat(data.marge_contingence || 0.15);
    const total = sousTotal + contingence;

    return {
        fondation: Math.round(coutFondation),
        elevation: Math.round(coutElevation),
        finition: Math.round(coutFinition),
        toiture: Math.round(coutToiture),
        sous_total: Math.round(sousTotal),
        contingence: Math.round(contingence),
        total: Math.round(total)
    };
}

// ===== SUBMIT =====
document.getElementById('devis-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        nom_projet: document.getElementById('nomProjet').value,
        localite: document.getElementById('localite').value,
        type_batiment: document.getElementById('typeBat').value,
        surface: document.getElementById('surface').value,
        nb_niveaux: document.getElementById('niveaux').value,
        marge_contingence: document.getElementById('marge').value
    };

    const resultat = calculerDevis(data);
    data.montant_total = resultat.total;
    data.details = resultat;

    // Affichage
    const res = document.getElementById('devisResult');
    res.style.display = 'block';

    document.getElementById('devisTotal').textContent =
        resultat.total.toLocaleString('fr-FR') + ' FCFA';

    document.getElementById('devisDetails').innerHTML = `
        <div class="devis-detail-item">
            <label>Fondation</label>
            <strong>${resultat.fondation.toLocaleString('fr-FR')} FCFA</strong>
        </div>
        <div class="devis-detail-item">
            <label>Élévation</label>
            <strong>${resultat.elevation.toLocaleString('fr-FR')} FCFA</strong>
        </div>
        <div class="devis-detail-item">
            <label>Finition</label>
            <strong>${resultat.finition.toLocaleString('fr-FR')} FCFA</strong>
        </div>
        <div class="devis-detail-item">
            <label>Toiture</label>
            <strong>${resultat.toiture.toLocaleString('fr-FR')} FCFA</strong>
        </div>
        <div class="devis-detail-item">
            <label>Sous-total</label>
            <strong>${resultat.sous_total.toLocaleString('fr-FR')} FCFA</strong>
        </div>
        <div class="devis-detail-item">
            <label>Contingence</label>
            <strong>${resultat.contingence.toLocaleString('fr-FR')} FCFA</strong>
        </div>
    `;

    // Envoi backend
    try {
        await fetch(`${API_URL}/devis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (err) {
        console.warn('Backend indisponible, devis non sauvegardé');
    }
});