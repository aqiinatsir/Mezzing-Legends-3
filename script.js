// ==================== MOBILE MENU TOGGLE ====================

// Create hamburger menu button
function createHamburgerMenu() {
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    
    // Create hamburger button
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger-menu';
    hamburger.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    // Insert hamburger button before user section
    const userSection = document.querySelector('.user-section');
    navbar.insertBefore(hamburger, userSection);
    
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close menu when a nav item is clicked
    const navItems = navMenu.querySelectorAll('a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navbar.contains(e.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// Initialize hamburger menu when DOM is loaded
document.addEventListener('DOMContentLoaded', createHamburgerMenu);

// ==================== SMOOTH SCROLL ====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== ACTIVE NAV LINK ====================

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ==================== BUTTON CLICK EFFECTS ====================

const buttons = document.querySelectorAll('.btn, .btn-small');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ==================== FEATURE CARDS ANIMATION ====================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideIn 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .p2w-card, .team-card').forEach(card => {
    observer.observe(card);
});

// ==================== SCROLL ANIMATIONS ====================

const elementsToAnimate = document.querySelectorAll('.feature-card, .feature-item, .p2w-card, .team-card, .about-content');

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

elementsToAnimate.forEach(element => {
    animationObserver.observe(element);
});

// ==================== HEADER SCROLL EFFECT ====================

let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(204, 0, 0, 0.4)';
    } else {
        header.style.boxShadow = '0 2px 15px rgba(204, 0, 0, 0.3)';
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// ==================== PAGE LOAD ANIMATION ====================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ==================== UTILITY FUNCTIONS ====================

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==================== MODAL SMOOTH CLOSE ====================

const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.close');

closeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const modal = button.closest('.modal');
        if (modal) {
            modal.classList.remove('show');
        }
    });
});

// Close modal when clicking outside
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});

// ==================== PREVENT BODY SCROLL WHEN MODAL OPEN ====================

function toggleBodyScroll(disable) {
    if (disable) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

modals.forEach(modal => {
    const observer = new MutationObserver(() => {
        if (modal.classList.contains('show')) {
            toggleBodyScroll(true);
        } else {
            toggleBodyScroll(false);
        }
    });
    
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
});

// ==================== KEYBOARD EVENTS ====================

document.addEventListener('keydown', (e) => {
    // Close modals on Escape
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            if (modal.classList.contains('show')) {
                modal.classList.remove('show');
            }
        });
    }
    
    // Close mobile menu on Escape
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger-menu');
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ==================== CONSOLE WELCOME MESSAGE ====================

console.log('%c🎮 Selamat Datang di Mezzing Legends!', 'color: #FF3333; font-size: 20px; font-weight: bold;');
console.log('%cServer Minecraft Terbaik dengan Komunitas Ramah', 'color: #CC0000; font-size: 14px;');
console.log('%cIP: play.mld.net | Version 1.20.1', 'color: #b0b0b0; font-size: 12px;');
