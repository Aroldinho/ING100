// ===== VÉRIFICATION SESSION =====
const session = JSON.parse(
    localStorage.getItem('ing10_session') ||
    sessionStorage.getItem('ing10_session') ||
    'null'
);

if (!session) {
    window.location.href = 'login.html';
}

// ===== AFFICHAGE UTILISATEUR =====
if (session) {
    const initials = session.user.nom.split(' ')
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    document.getElementById('userName').textContent = session.user.nom;
    document.getElementById('userRole').textContent = session.role;
    document.getElementById('greetingName').textContent = session.user.nom;
    document.querySelector('.avatar').textContent = initials;
    document.getElementById('badgeVille').textContent = '📍 ' + (session.user.localite || 'Douala');
}

// ===== MENU MOBILE =====
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
}

// ===== DÉCONNEXION =====
function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('ing10_session');
        sessionStorage.removeItem('ing10_session');
        window.location.href = 'login.html';
    }
}

// ===== COMPTEURS ANIMÉS =====
function animateCounter(id, target) {
    const el = document.getElementById(id);
    let current = 0;
    const increment = target / 40;
    const update = () => {
        current += increment;
        if (current < target) {
            el.textContent = Math.ceil(current);
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    };
    update();
}

animateCounter('totalDevis', 12);
animateCounter('totalProjets', 5);
animateCounter('totalClients', 8);
animateCounter('totalMontant', 48500000);

// ===== PROJETS DÉMO =====
const projets = [
    { nom: 'Villa Duplex Bonamoussadi', ville: