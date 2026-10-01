// Configuration globale — modifie ici si besoin
const API_URL = 'http://localhost:5000/api';

// Gestion de session
const Session = {
    get() {
        return JSON.parse(
            localStorage.getItem('ing10_session') ||
            sessionStorage.getItem('ing10_session') ||
            'null'
        );
    },
    set(data, remember = false) {
        const target = remember ? localStorage : sessionStorage;
        target.setItem('ing10_session', JSON.stringify(data));
    },
    clear() {
        localStorage.removeItem('ing10_session');
        sessionStorage.removeItem('ing10_session');
    },
    requireAuth() {
        const s = this.get();
        if (!s) {
            window.location.href = 'login.html';
            return null;
        }
        return s;
    }
};