const API_URL = 'http://localhost:5000/api';

const session = JSON.parse(
    localStorage.getItem('ing10_session') ||
    sessionStorage.getItem('ing10_session') ||
    'null'
);

if (!session) window.location.href = 'login.html';

if (session) {
    const initials = session.user.nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    document.getElementById('avatar').textContent = initials;
    document.getElementById('userName').textContent = session.user.nom;
    document.getElementById('userRole').textContent = session.role;
}

function toggleSidebar() { document.querySelector('.sidebar').classList.toggle('open'); }

function logout() {
    if (confirm('Se déconnecter ?')) {
        localStorage.removeItem('ing10_session');
        sessionStorage.removeItem('ing10_session');
        window.location.href = 'login.html';
    }
}

// ===== DONNÉES DÉMO (fallback si backend éteint) =====
const PRIX_DEMO = [
    { id: 1, nom: 'Ciment 50 kg (CPA 42.5)', unite: 'sac', categorie: 'Liant', localite: 'Douala', prix_min: 4600, prix_max: 5200, prix_moyen: 4900, date_releve: '2026-09-15' },
    { id: 2, nom: 'Ciment 50 kg (CPA 42.5)', unite: 'sac', categorie: 'Liant', localite: 'Yaoundé', prix_min: 4900, prix_max: 5400, prix_moyen: 5100, date_releve: '2026-09-20' },
    { id: 3, nom: 'Ciment 50 kg (CPA 42.5)', unite: 'sac', categorie: 'Liant', localite: 'Ngaoundéré', prix_min: 5300, prix_max: 5800, prix_moyen: 5500, date_releve: '2026-09-10' },
    { id: 4, nom: 'Ciment 50 kg (CPA 42.5)', unite: 'sac', categorie: 'Liant', localite: 'Bafoussam', prix_min: 5000, prix_max: 5500, prix_moyen: 5250, date_releve: '2026-09-12' },
    { id: 5, nom: 'Sable fin', unite: 'm³', categorie: 'Granulat', localite: 'Douala', prix_min: 10000, prix_max: 15000, prix_moyen: 12500, date_releve: '2026-09-18' },
    { id: 6, nom: 'Sable fin', unite: 'm³', categorie: 'Granulat', localite: 'Yaoundé', prix_min: 11000, prix_max: 16000, prix_moyen: 13500, date_releve: '2026-09-19' },
    { id: 7, nom: 'Gravier 15/25', unite: 'm³', categorie: 'Granulat', localite: 'Douala', prix_min: 18000, prix_max: 25000, prix_moyen: 21500, date_releve: '2026-09-15' },
    { id: 8, nom: 'Gravier 15/25', unite: 'm³', categorie: 'Granulat', localite: 'Yaoundé', prix_min: 20000, prix_max: 26000, prix_moyen: 23000, date_releve: '2026-09-17' },
    { id: 9, nom: 'Fer à béton Ø12 (12 m)', unite: 'barre', categorie: 'Acier', localite: 'Douala', prix_min: 5000, prix_max: 6500, prix_moyen: 5750, date_releve: '2026-09-14' },
    { id: 10, nom: 'Fer à béton Ø12 (12 m)', unite: 'barre', categorie: 'Acier', localite: 'Yaoundé', prix_min: 5200, prix_max: 6800, prix_moyen: 6000, date_releve: '2026-09-16' },
    { id: 11, nom: 'Bloc béton 15x20x40', unite: 'unité', categorie: 'Maçonnerie', localite: 'Douala', prix_min: 400, prix_max: 550, prix_moyen: 475, date_releve: '2026-09-13' },
    { id: 12, nom: 'Bloc béton 15x20x40', unite: 'unité', categorie: 'Maçonnerie', localite: 'Yaoundé', prix_min: 425, prix_max: 575, prix_moyen: 500, date_releve: '2026-09-15' },
    { id: 13, nom: 'Bois coffrage (planche 2m)', unite: 'unité', categorie: 'Coffrage', localite: 'Douala', prix_min: 1500, prix_max: 2200, prix_moyen: 1850, date_releve: '2026-09-12' },
    { id: 14, nom: 'Tôle bac alu 0.4mm', unite: 'm²', categorie: 'Toiture', localite: 'Douala', prix_min: 4500, prix_max: 6000, prix_moyen: 5250, date_releve: '2026-09-11' },
    { id: 15, nom: 'Tôle bac alu 0.4mm', unite: 'm²', categorie: 'Toiture', localite: 'Yaoundé', prix_min: 4800, prix_max: 6300, prix_moyen: 5550, date_releve: '2026-09-13' }
];

const FOURNISSEURS = {
    'Douala': [
        { nom: 'COGENI Douala', adresse: 'Bd de l\'Unité', tel: '+237 650 35 66 59' },
        { nom: 'COGENI Bonamoussadi', adresse: 'Bonamoussadi', tel: '+237 650 35 66 60' }
    ],
    'Yaoundé': [
        { nom: 'Maison DG Sarl', adresse: 'Mvog-Mbi', tel: '+237 699 00 11 22' },
        { nom: 'Quincaillerie Centrale', adresse: 'Mokolo', tel: '+237 677 33 44 55' }
    ],
    'Ngaoundéré': [
        { nom: 'Dépôt BTP Nord', adresse: 'Centre-ville', tel: '+237 655 22 33 44' }
    ],
    'Bafoussam': [
        { nom: 'Quincaillerie Ouest', adresse: 'Marché A', tel: '+237 678 55 66 77' }
    ]
};

let allPrix = [];

// ===== CHARGEMENT DES PRIX =====
async function loadPrix() {
    const grid = document.getElementById('prixGrid');
    grid.innerHTML = '<div class="loading-state">Chargement des prix…</div>';

    try {
        const res = await fetch(`${API_URL}/prix`);
        if (!res.ok) throw new Error('Backend indisponible');
        allPrix = await res.json();
    } catch (e) {
        // Fallback démo
        allPrix = PRIX_DEMO;
    }

    renderPrix(allPrix);
}

// ===== RENDU =====
function renderPrix(liste) {
    const grid = document.getElementById('prixGrid');
    document.getElementById('resultCount').textContent = liste.length;

    if (!liste.length) {
        grid.innerHTML = `
            <div class="empty-state">
                <span>🔍</span>
                <p>Aucun matériau trouvé.</p>
                <p style="font-size:0.85rem;margin-top:8px;">Essayez un autre mot-clé ou changez de ville.</p>
            </div>`;
        return;
    }

    grid.innerHTML = liste.map(p => `
        <div class="prix-card" onclick="openModal(${p.id})">
            <div class="prix-header-card">
                <div>
                    <div class="prix-nom">${p.nom}</div>
                    <div class="prix-unite">par ${p.unite}</div>
                </div>
                <span class="prix-categorie">${p.categorie}</span>
            </div>
            <div class="prix-valeur">${Number(p.prix_moyen).toLocaleString('fr-FR')} <small>FCFA</small></div>
            <div class="prix-range">Fourchette : ${Number(p.prix_min).toLocaleString('fr-FR')} – ${Number(p.prix_max).toLocaleString('fr-FR')} FCFA</div>
            <div class="prix-footer">
                <span class="prix-ville">📍 ${p.localite}</span>
                <span class="prix-date">${p.date_releve}</span>
            </div>
        </div>
    `).join('');
}

// ===== FILTRES =====
function filtrer() {
    const q = document.getElementById('searchInput').value.toLowerCase().trim();
    const ville = document.getElementById('villeSelect').value;
    const tri = document.getElementById('sortSelect').value;

    let resultats = allPrix.filter(p => {
        const matchQ = !q || p.nom.toLowerCase().includes(q) || p.categorie.toLowerCase().includes(q);
        const matchVille = !ville || p.localite === ville;
        return matchQ && matchVille;
    });

    if (tri === 'prix-asc') resultats.sort((a, b) => a.prix_moyen - b.prix_moyen);
    else if (tri === 'prix-desc') resultats.sort((a, b) => b.prix_moyen - a.prix_moyen);
    else resultats.sort((a, b) => a.nom.localeCompare(b.nom));

    renderPrix(resultats);
}

// ===== MODAL DÉTAIL =====
function openModal(id) {
    const p = allPrix.find(x => x.id === id);
    if (!p) return;

    const fournisseurs = FOURNISSEURS[p.localite] || [];

    document.getElementById('modalBody').innerHTML = `
        <h2>${p.nom}</h2>
        <p style="color:#aaa;">Catégorie : <span class="accent">${p.categorie}</span></p>

        <div class="modal-prix">
            ${Number(p.prix_moyen).toLocaleString('fr-FR')} <small>FCFA / ${p.unite}</small>
        </div>

        <div class="modal-info">
            <div class="info-item">
                <label>Prix minimum</label>
                <strong>${Number(p.prix_min).toLocaleString('fr-FR')} FCFA</strong>
            </div>
            <div class="info-item">
                <label>Prix maximum</label>
                <strong>${Number(p.prix_max).toLocaleString('fr-FR')} FCFA</strong>
            </div>
            <div class="info-item">
                <label>Ville</label>
                <strong>📍 ${p.localite}</strong>
            </div>
            <div class="info-item">
                <label>Date du relevé</label>
                <strong>${p.date_releve}</strong>
            </div>
        </div>

        ${fournisseurs.length ? `
            <div class="modal-fournisseurs">
                <h3>Fournisseurs à ${p.localite}</h3>
                ${fournisseurs.map(f => `
                    <div class="fournisseur-item">
                        <div class="fournisseur-info">
                            <strong>${f.nom}</strong>
                            <span>${f.adresse} • ${f.tel}</span>
                        </div>
                        <a href="https://wa.me/${f.tel.replace(/\D/g, '')}" target="_blank" class="btn-whatsapp">
                            📱 WhatsApp
                        </a>
                    </div>
                `).join('')}
            </div>
        ` : ''}

        <p style="font-size:0.8rem;color:#888;margin-top:20px;font-style:italic;">
            ⚠️ Prix indicatifs — à confirmer auprès des fournisseurs locaux.
        </p>
    `;

    document.getElementById('modal').classList.add('show');
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
});

// ===== EVENT LISTENERS =====
document.getElementById('btnSearch').addEventListener('click', filtrer);
document.getElementById('searchInput').addEventListener('input', filtrer);
document.getElementById('villeSelect').addEventListener('change', filtrer);
document.getElementById('sortSelect').addEventListener('change', filtrer);

// Init
loadPrix();