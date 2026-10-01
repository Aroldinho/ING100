function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
}

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 21, 0.95)';
        navbar.style.padding = '12px 60px';
    } else {
        navbar.style.background = 'rgba(15, 15, 30, 0.7)';
        navbar.style.padding = '20px 60px';
    }
});

const counters = document.querySelectorAll('[data-count]');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = +el.getAttribute('data-count');
            let current = 0;
            const inc = target / 50;
            const update = () => {
                current += inc;
                if (current < target) {
                    el.textContent = Math.ceil(current);
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target + '+';
                }
            };
            update();
            observer.unobserve(el);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => observer.observe(c));

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});