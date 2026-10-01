let currentStep = 1;
const totalSteps = 3;

// ===== AFFICHAGE MOT DE PASSE =====
function togglePwd(id) {
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// ===== NAVIGATION ENTRE ÉTAPES =====
function showStep(step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');

    document.getElementById('progressFill').style.width = (step / totalSteps * 100) + '%';
    document.getElementById('btnPrev').style.display = step > 1 ? 'block' : 'none';
    document.getElementById('btnNext').style.display = step < totalSteps ? 'block' : 'none';
    document.getElementById('btnSubmit').style.display = step === totalSteps ? 'flex' : 'none';
}

// ===== VALIDATION PAR ÉTAPE =====
function validateStep(step) {
    if (step === 1) {
        const nom = document.getElementById('nom').value.trim();
        const email = document.getElementById('email').value.trim();
        if (!nom) return 'Veuillez entrer votre nom.';
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email invalide.';
    }
    if (step === 2) {
        const localite = document.getElementById('localite').value;
        if (!localite) return 'Veuillez choisir une ville.';
    }
    return null;
}

document.getElementById('btnNext').addEventListener('click', () => {
    const err = validateStep(currentStep);
    if (err) return showError(err);
    currentStep++;
    showStep(currentStep);
});

document.getElementById('btnPrev').addEventListener('click', () => {
    currentStep--;
    showStep(currentStep);
});

// ===== FORCE DU MOT DE PASSE =====
document.getElementById('password').addEventListener('input', (e) => {
    const pwd = e.target.value;
    const bar = document.getElementById('strengthBar');
    const label = document.getElementById('strengthLabel');
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    const config = [
        { w: '0%', c: '#666', t: '' },
        { w: '25%', c: '#ff4757', t: 'Faible' },
        { w: '50%', c: '#ffa502', t: 'Moyen' },
        { w: '75%', c: '#2ed573', t: 'Bon' },
        { w: '100%', c: '#26de81', t: 'Excellent' }
    ];
    bar.style.width = config[strength].w;
    bar.style.background = config[strength].c;
    label.textContent = config[strength].t;
    label.style.color = config[strength].c;
});

// ===== SOUMISSION =====
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const pwd = document.getElementById('password').value;
    const pwd2 = document.getElementById('password2').value;

    if (pwd.length < 6) return showError('Le mot de passe doit contenir au moins 6 caractères.');
    if (pwd !== pwd2) return showError('Les mots de passe ne correspondent pas.');
    if (!document.getElementById('cgu').checked) return showError('Veuillez accepter les CGU.');

    const btn = document.getElementById('btnSubmit');
    btn.classList.add('loading');
    btn.disabled = true;

    const data = {
        nom: document.getElementById('nom').value.trim(),
        email: document.getElementById('email').value.trim(),
        telephone: document.getElementById('telephone').value.trim(),
        localite: document.getElementById('localite').value,
        role: document.querySelector('input[name="role"]:checked').value,
        password: pwd
    };

    // Simulation (à remplacer par POST /api/register)
    setTimeout(() => {
        showSuccess('Compte créé avec succès ! Redirection...');
        setTimeout(() => window.location.href = 'login.html', 1500);
    }, 1400);
});

// ===== MESSAGES =====
function showError(msg) {
    const el = document.getElementById('error-msg');
    el.textContent = '⚠️ ' + msg;
    el.style.display = 'block';
    document.getElementById('success-msg').style.display = 'none';
    setTimeout(() => el.style.display = 'none', 4000);
}
function showSuccess(msg) {
    const el = document.getElementById('success-msg');
    el.textContent = '✅ ' + msg;
    el.style.display = 'block';
    document.getElementById('error-msg').style.display = 'none';
}

showStep(1);