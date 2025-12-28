document.addEventListener('DOMContentLoaded', () => {
    // Exemple simple pour un menu de navigation mobile si vous l'implémentez
    // const navToggle = document.querySelector('.nav-toggle');
    // const navLinks = document.querySelector('.nav-links');

    // if (navToggle) {
    //     navToggle.addEventListener('click', () => {
    //         navLinks.classList.toggle('active');
    //     });
    // }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

