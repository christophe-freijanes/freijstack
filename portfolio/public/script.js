document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Initialize ScrollReveal
    const sr = ScrollReveal({
        distance: '60px',
        duration: 1500,
        delay: 200,
        easing: 'cubic-bezier(.5, 0, 0, 1)'
    });

    // Reveal Hero content
    sr.reveal('.hero-content h1', { origin: 'top' });
    sr.reveal('.hero-content p', { origin: 'left', delay: 300 });
    sr.reveal('.hero-content .btn', { origin: 'bottom', delay: 400 });

    // Reveal About section
    sr.reveal('.about-section h2', { origin: 'top' });
    sr.reveal('.about-section p', { origin: 'left', delay: 200 });

    // Reveal Skills section
    sr.reveal('.skills-section h2', { origin: 'top' });
    sr.reveal('.skill-item', { interval: 100, origin: 'bottom', delay: 300 });

    // Reveal Projects section
    sr.reveal('.projects-section h2', { origin: 'top' });
    sr.reveal('.project-item', { interval: 100, origin: 'right', delay: 200 });

    // Reveal SaaS section
    sr.reveal('.saas-section h2', { origin: 'top' });
    sr.reveal('.saas-section p', { origin: 'left', delay: 200 });
    sr.reveal('.saas-item', { interval: 100, origin: 'bottom', delay: 300 });

    // Reveal Contact section
    sr.reveal('.contact-section h2', { origin: 'top' });
    sr.reveal('.contact-section p', { origin: 'left', delay: 200 });
    sr.reveal('.contact-form input, .contact-form textarea, .contact-form button', { interval: 100, origin: 'bottom', delay: 300 });

    // Reveal Footer
    sr.reveal('footer .container', { origin: 'bottom', delay: 200 });
});
