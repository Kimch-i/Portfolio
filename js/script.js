document.addEventListener("DOMContentLoaded", () => {

    /* ─────────────────────────────────────────
       1. LIGHT / DARK MODE TOGGLE
    ───────────────────────────────────────── */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggleBtn.querySelector('i');

    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });

    /* ─────────────────────────────────────────
       2. MOBILE HAMBURGER MENU (Fixed)
    ───────────────────────────────────────── */
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');
    const hamburgerIcon = hamburger.querySelector('i');

    // Toggle menu and swap icon
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            hamburgerIcon.classList.replace('fa-bars', 'fa-times');
        } else {
            hamburgerIcon.classList.replace('fa-times', 'fa-bars');
        }
    });

    // Close menu and reset icon when clicking a link
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburgerIcon.classList.replace('fa-times', 'fa-bars');
        });
    });

    // Close menu when clicking completely outside of it
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburgerIcon.classList.replace('fa-times', 'fa-bars');
        }
    });

    /* ─────────────────────────────────────────
       3. PROJECTS — TAB / INDEX SWITCHER
    ───────────────────────────────────────── */
    const projTabs   = document.querySelectorAll('.proj-tab');
    const projPanels = document.querySelectorAll('.proj-panel');

    if (projTabs.length > 0) {
        projTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const idx = tab.dataset.project;

                // Update tabs
                projTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update panels
                projPanels.forEach(p => p.classList.remove('active'));
                const target = document.querySelector(`.proj-panel[data-panel="${idx}"]`);
                if (target) target.classList.add('active');

                // On mobile, scroll the panel into view cleanly below the header
                if (window.innerWidth < 1024 && target) {
                    const headerOffset = 90; // Height of your sticky nav
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* ─────────────────────────────────────────
       4. CERTIFICATE LIGHTBOX
    ───────────────────────────────────────── */
    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');
    const certImages    = document.querySelectorAll('.cert-media img');

    certImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
        });
    });

    if (closeLightbox) {
        closeLightbox.addEventListener('click', () => lightbox.classList.remove('active'));
    }

    if (lightbox) {
        lightbox.addEventListener('click', e => {
            if (e.target !== lightboxImg) lightbox.classList.remove('active');
        });
    }

    // Also close with Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') lightbox.classList.remove('active');
    });
});

/* ─────────────────────────────────────────
       5. VIDEO MUTE/UNMUTE TOGGLE
    ───────────────────────────────────────── */
    const shiftedVideo = document.getElementById('shifted-video');
    const muteToggleBtn = document.getElementById('mute-toggle-btn');

    if (shiftedVideo && muteToggleBtn) {
        const volumeIcon = muteToggleBtn.querySelector('i');

        muteToggleBtn.addEventListener('click', () => {
            // Toggle the muted property
            shiftedVideo.muted = !shiftedVideo.muted;

            // Swap the icon based on the current state
            if (shiftedVideo.muted) {
                volumeIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
            } else {
                volumeIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
            }
        });
    }

/* ─────────────────────────────────────────
   CURSOR PARTICLE EFFECT (Orange Dust)
───────────────────────────────────────── */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particlesArray = [];
const mouse = { x: null, y: null };

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    for (let i = 0; i < 3; i++) particlesArray.push(new Particle());
});

class Particle {
    constructor() {
        this.x      = mouse.x;
        this.y      = mouse.y;
        this.size   = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2.5;
        this.speedY = (Math.random() - 0.5) * 2.5;
        this.life   = 100;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.05;
        this.life -= 2;
    }
    draw() {
        const opacity = (this.life / 100) * 0.25;
        ctx.fillStyle = `rgba(255, 87, 34, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particlesArray.length - 1; i >= 0; i--) {
        particlesArray[i].update();
        particlesArray[i].draw();
        if (particlesArray[i].life <= 0) particlesArray.splice(i, 1);
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();
