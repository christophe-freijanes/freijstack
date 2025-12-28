// ============================================
// SMOOTH SCROLLING & NAVIGATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Navigation active state on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById(this.getAttribute('data-section'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger?.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu?.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('section, .project-card, .skill-category, .timeline-item').forEach(el => {
        observer.observe(el);
    });
});

// ============================================
// CONTACT FORM HANDLING (with captcha + sanitization)
// ============================================

const contactForm = document.getElementById('contactForm');

// Simple sanitizer for client-side (server-side mandatory)
function sanitizeInput(str){
    return String(str).replace(/[<>]/g, function(c){ return {'<':'&lt;','>':'&gt;'}[c]; });
}

// Captcha simple : addition de deux nombres (1-9)
var expectedCaptcha = null;
function generateCaptcha(){
    var a = Math.floor(Math.random()*9) + 1;
    var b = Math.floor(Math.random()*9) + 1;
    expectedCaptcha = a + b;
    var q = document.getElementById('captchaQuestion');
    if(q) q.textContent = 'Antispam : ' + a + ' + ' + b + ' = ?';
}

// Attach data-alert click handlers (replaces inline onclick)
document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('[data-alert]').forEach(function(el){
        el.addEventListener('click', function(e){
            e.preventDefault();
            alert(el.getAttribute('data-alert'));
        });
    });

    // Email link if present (obfuscated link support) — open mailto in new tab/window
    document.querySelectorAll('[data-user][data-domain]').forEach(function(link){
        link.addEventListener('click', function(e){
            e.preventDefault();
            var user = link.getAttribute('data-user');
            var domain = link.getAttribute('data-domain');
            if(!(user && domain)) return;
            var mailto = 'mailto:' + user + '@' + domain;
            // Try window.open first to open in new tab
            var w = null;
            try { w = window.open(mailto, '_blank'); } catch(err){ w = null; }
            if(!w){
                // fallback: create temporary anchor and click
                var tmp = document.createElement('a');
                tmp.href = mailto;
                tmp.target = '_blank';
                tmp.rel = 'noopener noreferrer';
                tmp.style.display = 'none';
                document.body.appendChild(tmp);
                tmp.click();
                tmp.remove();
            }
        }, false);
    });

    // Keep footer email text readable but obfuscated visually; update aria-label for screen readers
    var footerEmail = document.getElementById('footerEmail');
    if(footerEmail){
        footerEmail.setAttribute('title', 'Envoyer un e-mail');
        footerEmail.setAttribute('aria-label', 'Envoyer un e-mail');
    }

    // Init captcha if present
    if(document.getElementById('captchaQuestion')) generateCaptcha();
    var refresh = document.getElementById('refreshCaptcha');
    if(refresh) refresh.addEventListener('click', function(){ generateCaptcha(); }, false);
});

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var nameEl = document.getElementById('name');
        var emailEl = document.getElementById('email');
        var subjectEl = document.getElementById('subject');
        var messageEl = document.getElementById('message');
        var captchaAns = document.getElementById('captchaAnswer');

        var name = nameEl ? nameEl.value.trim() : '';
        var email = emailEl ? emailEl.value.trim() : '';
        var subject = subjectEl ? subjectEl.value.trim() : '';
        var message = messageEl ? messageEl.value.trim() : '';

        // Basic checks
        if (!name || !email || !message) {
            showNotification('Veuillez remplir tous les champs requis', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showNotification('Veuillez entrer une adresse email valide', 'error');
            return;
        }

        // Length checks (defensive)
        if(name.length > 100){ showNotification('Le nom est trop long (max 100 caractères).', 'error'); return; }
        if(email.length > 254){ showNotification('L\'email est trop long (max 254 caractères).', 'error'); return; }
        if(subject.length > 150){ showNotification('Le sujet est trop long (max 150 caractères).', 'error'); return; }
        if(message.length > 2000){ showNotification('Le message est trop long (max 2000 caractères).', 'error'); return; }

        // Captcha validation
        if(captchaAns){
            var v = parseInt(captchaAns.value, 10);
            if(isNaN(v) || expectedCaptcha === null || v !== expectedCaptcha){
                showNotification('Réponse au captcha incorrecte.', 'error');
                generateCaptcha();
                if(captchaAns) captchaAns.value = '';
                return;
            }
        }

        // Client-side sanitization (for UX only)
        if(nameEl) nameEl.value = sanitizeInput(name);
        if(subjectEl) subjectEl.value = sanitizeInput(subject);
        if(messageEl) messageEl.value = sanitizeInput(message);

        // Simulate form submission (replace with server call)
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn ? submitBtn.textContent : 'Envoyer';
        if(submitBtn){ submitBtn.textContent = 'Envoi en cours...'; submitBtn.disabled = true; }

        setTimeout(() => {
            console.log('Form data:', { name: nameEl.value, email, subject: subjectEl ? subjectEl.value : subject, message: messageEl ? messageEl.value : message });
            showNotification('Message envoyé avec succès! Je vous recontacterai bientôt.', 'success');
            contactForm.reset();
            if(submitBtn){ submitBtn.textContent = originalText; submitBtn.disabled = false; }
        }, 1200);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#51cf66' : '#ff6b6b'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideInDown 0.3s ease-out;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============================================
// CV DOWNLOAD
// ============================================

const downloadCVBtn = document.getElementById('downloadCV');

if (downloadCVBtn) {
    downloadCVBtn.addEventListener('click', function(e) {
        // Le lien pointe directement vers Google Drive, pas besoin de preventDefault
        // showNotification('Ouverture de votre CV...', 'info');
    });
}

// ============================================
// PARALLAX EFFECT
// ============================================

window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    const heroSection = document.querySelector('.hero');
    
    if (heroSection && scrollY < window.innerHeight) {
        heroSection.style.backgroundPosition = `center ${scrollY * 0.5}px`;
    }
});

// ============================================
// TYPING EFFECT (OPTIONAL)
// ============================================

function typeText(element, text, speed = 50) {
    if (!element) return;
    
    element.textContent = '';
    let i = 0;
    
    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Add any additional initialization here
    console.log('Portfolio loaded and ready!');
});

// Ensure external links (icons, external anchors) open in a new tab
document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a[href]').forEach(function(a){
        var href = a.getAttribute('href') || '';
        if(!href) return;
        // skip internal anchors and javascript pseudo-links
        if(href.startsWith('#') || href.startsWith('javascript:')) return;
        // don't override placeholders that use data-alert
        if(a.hasAttribute('data-alert')) return;
        // only handle external/http or mailto links
        if(href.indexOf('http') === 0 || href.indexOf('mailto:') === 0){
            // preserve any original target set in HTML to avoid double-opening
            var originalTarget = a.getAttribute('target');
            a.setAttribute('target','_blank');
            a.setAttribute('rel','noopener noreferrer');
            a.addEventListener('click', function(e){
                // allow modifier keys to keep default behavior
                if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                // if the anchor originally specified target="_blank", don't intercept (let browser handle it)
                if(originalTarget === '_blank') return;
                e.preventDefault();
                // Special handling for mailto: links to avoid replacing current page
                if(href.indexOf('mailto:') === 0){
                    var w = null;
                    try { w = window.open(href, '_blank'); } catch(err){ w = null; }
                    if(!w){
                        var tmp = document.createElement('a');
                        tmp.href = href;
                        tmp.target = '_blank';
                        tmp.rel = 'noopener noreferrer';
                        tmp.style.display = 'none';
                        document.body.appendChild(tmp);
                        tmp.click();
                        tmp.remove();
                    }
                    return;
                }

                var w = null;
                try { w = window.open(href, '_blank', 'noopener'); } catch(err){ w = null; }
                if(!w) window.location.href = href;
            });
        }
    });
});

// ============================================
// DARK MODE TOGGLE (OPTIONAL)
// ============================================

const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
};

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
