document.addEventListener("DOMContentLoaded", () => {
    // 1. Light/Dark Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggleBtn.querySelector('i');

    // Check if user has a saved preference in their browser
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        
        // Switch the icon and save preference
        if (body.classList.contains('light-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });

    // 2. Mobile Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
});

/* =========================================
   CURSOR PARTICLE EFFECT (Orange Dust)
========================================= */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fill window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particlesArray = [];
const mouse = { x: null, y: null };

// Track mouse movement
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
    // Spawn 3 particles per mouse move for a nice density
    for (let i = 0; i < 3; i++) {
        particlesArray.push(new Particle());
    }
});

class Particle {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        // Random size between 1 and 4
        this.size = Math.random() * 3 + 1;
        // Random drift speed and direction
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        // Start fully opaque
        this.life = 100; 
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // Shrink particle slowly
        if (this.size > 0.1) this.size -= 0.05;
        // Fade out
        this.life -= 2;
    }

    draw() {
        // Reduced max opacity by multiplying by 0.3 (so it peaks at 30% opacity instead of 100%)
        const opacity = (this.life / 100) * 0.3; 
        
        ctx.fillStyle = `rgba(255, 87, 34, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Remove particle from array when it fades out
        if (particlesArray[i].life <= 0) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
}

// Continuous animation loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();


/* =========================================
   CERTIFICATE LIGHTBOX LOGIC
========================================= */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.querySelector('.close-lightbox');
const certImages = document.querySelectorAll('.cert-media img');

// 1. Open lightbox when a certificate is clicked
certImages.forEach(img => {
    img.addEventListener('click', () => {
        lightbox.classList.add('active');
        lightboxImg.src = img.src; // Copies the clicked image into the big popup
    });
});

// 2. Close lightbox when the 'X' is clicked
if (closeLightbox) {
    closeLightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });
}

// 3. Close lightbox if you click anywhere in the dark background
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.classList.remove('active');
        }
    });
}