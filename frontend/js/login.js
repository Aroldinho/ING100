// ===== AFFICHER / MASQUER LE MOT DE PASSE =====
function togglePassword() {
    const input = document.getElementById('password');
    const icon = document.querySelector('.toggle-password');
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = '🙈';
    } else {
        input.type = 'password';
        icon.textContent = '👁️';
    }
}

// ===== AFFICHER MESSAGES =====
function showError(message) {
    const el = document.getElementById('error-msg');
    el.textContent = '⚠️ ' + message;
    el.style.display = 'block';
    document.getElementById('success-msg').style.display = 'none';
    setTimeout(() => el.style.display = 'none', 5000);
}

function showSuccess(message) {
    const el = document.getElementById('success-msg');
    el.textContent = '✅ ' + message;
    el.style.display = 'block';
    document.getElementById('error-msg').style.display = 'none';
}

// ===== SOUMISSION DU FORMULAIRE =====
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    const remember = document.getElementById('remember').checked;

    // Validations
    if (!email || !password) {
        showError('Veuillez remplir tous les champs.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Adresse email invalide.');
        return;
    }

    if (password.length < 6) {
        showError('Le mot de passe doit contenir au moins 6 caractères.');
        return;
    }

    // Animation bouton
    const btn = document.getElementById('btn-submit');
    btn.classList.add('loading');
    btn.disabled = true;

    try {
        // ⚠️ Pour l'instant simulation. On branchera le backend Flask/FastAPI après.
        const response = await fakeLoginAPI(email, password, role);

        if (response.success) {
            showSuccess('Connexion réussie ! Redirection...');

            // Sauvegarde session
            const session = {
                user: response.user,
                role: role,
                token: response.token,
                timestamp: Date.now()
            };

            if (remember) {
                localStorage.setItem('ing10_session', JSON.stringify(session));
            } else {
                sessionStorage.setItem('ing10_session', JSON.stringify(session));
            }

            // Redirection selon rôle
            setTimeout(() => {
                if (role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }, 1200);
        } else {
            showError(response.message || 'Identifiants incorrects.');
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    } catch (err) {
        showError('Erreur de connexion au serveur.');
        btn.classList.remove('loading');
        btn.disabled = false;
    }
});

// ===== API SIMULÉE (à remplacer par le vrai backend) =====
async function fakeLoginAPI(email, password, role) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Comptes de démo
            const users = {
                'ingenieur@ing10.cm': { password: 'demo123', nom: 'Ing. Kamga', role: 'ingenieur' },
                'admin@ing10.cm':     { password: 'admin123', nom: 'Admin ING10', role: 'admin' },
                'client@ing10.cm':    { password: 'client123', nom: 'M. Nguema', role: 'client' }
            };

            const user = users[email];
            if (user && user.password === password && user.role === role) {
                resolve({
                    success: true,
                    user: { email, nom: user.nom, role: user.role },
                    token: 'fake-token-' + Date.now()
                });
            } else {
                resolve({
                    success: false,
                    message: 'Email, mot de passe ou rôle incorrect.'
                });
            }
        }, 1200);
    });
}

// ===== AUTO-FOCUS =====
window.addEventListener('load', () => {
    document.getElementById('email').focus();
});

// ===== ENTRÉE POUR SOUMETTRE =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const form = document.getElementById('login-form');
        if (document.activeElement.tagName === 'INPUT') {
            form.requestSubmit();
        }
    }
});

console.log('%c🔐 Page de connexion ING10 chargée', 'color: #FF8C00; font-weight: bold;');