/**
 * Multi-Page Kochi Metro Rail Management System
 * Simplified JavaScript for multi-page navigation
 * Author: Metro Rail Development Team
 * Version: 2.0.0
 */

'use strict';

// ===== GLOBAL VARIABLES =====
let currentSlide = 0;
let slideInterval;

// ===== APPLICATION INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    try {
        showCreativeLoader('Loading Kochi Metro...');
        const start = Date.now();
        const MIN_VISIBLE = 900; // ms

        // Core functionality
        initializeSlideshow();
        initializeNavigation();
        initializeModals();
        initializeNotifications();
        initializeThemeToggle();
        initializeLiveMap();
        initializeTrainOperations();
        initializeVerifyOperations();
        
        // Update time if element exists
        updateCurrentTime();
        setInterval(updateCurrentTime, 60000);
        
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, MIN_VISIBLE - elapsed);
        setTimeout(() => {
            hideCreativeLoader();
            console.log('Kochi Metro Management System initialized successfully');
        }, remaining);
    } catch (error) {
        hideCreativeLoader(true);
        console.error('Error initializing application:', error);
        showErrorMessage('Failed to initialize application. Please refresh the page.');
    }
}

// ===== SLIDESHOW FUNCTIONALITY =====
/**
 * Initialize hero slideshow (only on dashboard)
 */
function initializeSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const slideshowContainer = document.querySelector('.slideshow-container');
    
    if (slides.length === 0) return; // Not on dashboard page
    
    // Auto-rotate slides
    slideInterval = setInterval(nextSlide, 6000);
    
    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Pause on hover
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', pauseSlideshow);
        slideshowContainer.addEventListener('mouseleave', resumeSlideshow);
    }
    
    // Touch support
    initializeTouchSupport(slideshowContainer);
}

function initializeTouchSupport(container) {
    if (!container) return;
    
    let startX = 0;
    let endX = 0;
    
    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;
        const minSwipeDistance = 50;
        
        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    }, { passive: true });
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    if (!slides || slides.length === 0) return;
    
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlideshow();
}

function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    if (!slides || slides.length === 0) return;
    
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlideshow();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    if (!slides || slides.length === 0 || index < 0 || index >= slides.length) return;
    
    currentSlide = index;
    updateSlideshow();
}

function updateSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides || slides.length === 0) return;
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    if (dots && dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
}

function pauseSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

function resumeSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    slideInterval = setInterval(nextSlide, 6000);
}

// ===== NAVIGATION FUNCTIONALITY =====
/**
 * Initialize navigation
 */
function initializeNavigation() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.contains('show');
            mobileNav.classList.toggle('show');
            mobileMenuToggle.setAttribute('aria-expanded', !isOpen);
            
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.className = mobileNav.classList.contains('show') ? 'fas fa-times' : 'fas fa-bars';
            }
        });
    }
    
    // Dropdown functionality
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = toggle.closest('.nav-dropdown');
            const isOpen = dropdown.classList.contains('show');
            
            // Close all dropdowns
            document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('show'));
            
            // Toggle current dropdown
            if (!isOpen) {
                dropdown.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
            } else {
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
        closeMobileMenu();
    });
    
    // Emergency button
    const emergencyBtn = document.getElementById('emergency-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', showEmergencyContacts);
    }
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    
    if (mobileNav) {
        mobileNav.classList.remove('show');
    }
    
    if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
    }
}

// ===== MODAL FUNCTIONALITY =====
/**
 * Initialize modals
 */
function initializeModals() {
    // Add Train Modal
    const addTrainBtn = document.getElementById('add-train-btn');
    const addTrainModal = document.getElementById('add-train-modal');
    const addTrainModalClose = document.getElementById('add-train-modal-close');
    const cancelAddTrain = document.getElementById('cancel-add-train');
    const submitTrain = document.getElementById('submit-train');
    
    if (addTrainBtn) addTrainBtn.addEventListener('click', () => showModal('add-train-modal'));
    if (addTrainModalClose) addTrainModalClose.addEventListener('click', () => hideModal('add-train-modal'));
    if (cancelAddTrain) cancelAddTrain.addEventListener('click', () => hideModal('add-train-modal'));
    
    if (submitTrain) {
        submitTrain.addEventListener('click', () => {
            const trainId = document.getElementById('train-id')?.value;
            const trainDriver = document.getElementById('train-driver')?.value;
            const trainRoute = document.getElementById('train-route')?.value;
            
            if (trainId && trainDriver && trainRoute) {
                hideModal('add-train-modal');
                showSuccessMessage(`Train ${trainId} added successfully!`);
                const form = document.getElementById('add-train-form');
                if (form) form.reset();
            } else {
                showErrorMessage('Please fill in all required fields.');
            }
        });
    }
    
    // Verification Modal
    const verificationModal = document.getElementById('verification-modal');
    const verificationModalClose = document.getElementById('verification-modal-close');
    const cancelVerification = document.getElementById('cancel-verification');
    const confirmVerification = document.getElementById('confirm-verification');
    
    if (verificationModalClose) verificationModalClose.addEventListener('click', () => hideModal('verification-modal'));
    if (cancelVerification) cancelVerification.addEventListener('click', () => hideModal('verification-modal'));
    
    if (confirmVerification) {
        confirmVerification.addEventListener('click', () => {
            hideModal('verification-modal');
            showSuccessMessage('Operations verified successfully!');
        });
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
        }
    });
    
    // Close modals with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                hideModal(openModal.id);
            }
        }
    });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        const focusableElements = modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// ===== NOTIFICATION FUNCTIONALITY =====
/**
 * Initialize notifications
 */
function initializeNotifications() {
    const notificationBtn = document.getElementById('notification-btn');
    const notificationDropdown = document.getElementById('notification-dropdown');
    const profileBtn = document.getElementById('profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    const logoutBtn = document.getElementById('logout-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    
    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = notificationDropdown.classList.contains('show');
            
            // Close profile dropdown
            if (profileDropdown) profileDropdown.classList.remove('show');
            if (profileBtn) profileBtn.classList.remove('active');
            
            // Toggle notification dropdown
            if (!isOpen) {
                notificationDropdown.classList.add('show');
                notificationBtn.setAttribute('aria-expanded', 'true');
            } else {
                notificationDropdown.classList.remove('show');
                notificationBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = profileDropdown.classList.contains('show');
            
            // Close notification dropdown
            if (notificationDropdown) notificationDropdown.classList.remove('show');
            if (notificationBtn) notificationBtn.setAttribute('aria-expanded', 'false');
            
            // Toggle profile dropdown
            if (!isOpen) {
                profileDropdown.classList.add('show');
                profileBtn.classList.add('active');
                profileBtn.setAttribute('aria-expanded', 'true');
            } else {
                profileDropdown.classList.remove('show');
                profileBtn.classList.remove('active');
                profileBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Logout functionality
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        if (notificationDropdown) {
            notificationDropdown.classList.remove('show');
            if (notificationBtn) notificationBtn.setAttribute('aria-expanded', 'false');
        }
        if (profileDropdown) {
            profileDropdown.classList.remove('show');
            if (profileBtn) {
                profileBtn.classList.remove('active');
                profileBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.clear();
        sessionStorage.clear();
        showSuccessMessage('Logged out successfully');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }
}

// ===== THEME TOGGLE FUNCTIONALITY =====
/**
 * Initialize theme toggle
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Load saved theme or detect system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
}

function setTheme(theme) {
    const themeIcon = document.getElementById('theme-icon');
    const themeToggle = document.getElementById('theme-toggle');
    
    document.documentElement.setAttribute('data-theme', theme);
    
    if (themeIcon && themeToggle) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-moon theme-icon';
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
        } else {
            themeIcon.className = 'fas fa-sun theme-icon';
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        }
    }
    
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#1e293b' : '#2563eb');
    }
    
    localStorage.setItem('theme', theme);
}

// ===== TRAIN OPERATIONS FUNCTIONALITY =====
/**
 * Initialize train operations (only on train operations page)
 */
function initializeTrainOperations() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const trainSearch = document.getElementById('train-search');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            filterTrains(filter);
        });
    });
    
    if (trainSearch) {
        trainSearch.addEventListener('input', debounce((e) => {
            searchTrains(e.target.value);
        }, 300));
    }
}

function filterTrains(filter) {
    const trainItems = document.querySelectorAll('.train-item');
    
    trainItems.forEach(item => {
        const status = item.getAttribute('data-status');
        const shouldShow = filter === 'all' || status === filter;
        
        item.style.display = shouldShow ? 'flex' : 'none';
    });
}

function searchTrains(searchTerm) {
    const trainItems = document.querySelectorAll('.train-item');
    const term = searchTerm.toLowerCase().trim();
    
    trainItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        const shouldShow = !term || text.includes(term);
        
        item.style.display = shouldShow ? 'flex' : 'none';
    });
}

// ===== VERIFY OPERATIONS FUNCTIONALITY =====
/**
 * Initialize verification operations
 */
function initializeVerifyOperations() {
    const verifyBtns = document.querySelectorAll('.btn-verify');
    
    verifyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const trainId = btn.getAttribute('data-train');
            showVerificationModal(trainId);
        });
    });
}

function showVerificationModal(trainId) {
    const verifyTrainId = document.getElementById('verify-train-id');
    if (verifyTrainId) {
        verifyTrainId.textContent = trainId;
    }
    showModal('verification-modal');
}

// ===== LIVE MAP FUNCTIONALITY =====
/**
 * Initialize live map (only on live map page)
 */
function initializeLiveMap() {
    const stations = document.querySelectorAll('.station');
    
    stations.forEach(station => {
        station.addEventListener('click', () => {
            const stationName = station.getAttribute('data-station');
            showStationDetails(stationName);
            
            stations.forEach(s => s.classList.remove('active'));
            station.classList.add('active');
        });
    });
}

function showStationDetails(stationName) {
    const stationDetails = document.getElementById('station-details');
    const noSelection = stationDetails?.querySelector('.no-selection');
    const stationInfo = stationDetails?.querySelector('.station-info');
    const selectedStationName = document.getElementById('selected-station-name');
    
    if (noSelection) noSelection.style.display = 'none';
    if (stationInfo) stationInfo.style.display = 'block';
    if (selectedStationName) selectedStationName.textContent = stationName;
    
    const stationOfficers = document.getElementById('station-officers');
    const stationTrains = document.getElementById('station-trains');
    
    if (stationOfficers) stationOfficers.textContent = Math.floor(Math.random() * 5) + 2;
    if (stationTrains) stationTrains.textContent = Math.floor(Math.random() * 30) + 15;
}

// ===== ANIMATIONS MODULE =====
function initializeAnimations() {
    // Respect reduced motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Inject styles once
    if (!document.getElementById('app-anim-styles')) {
        const s = document.createElement('style');
        s.id = 'app-anim-styles';
        s.textContent = `
            :root{ --anim-ease: cubic-bezier(.22,.9,.28,1); }
            .anim-reveal{ opacity:0; transform:translateY(14px); transition: opacity 480ms var(--anim-ease), transform 480ms var(--anim-ease); will-change: opacity, transform; }
            .anim-visible{ opacity:1; transform:none; }
            .img-fade{ opacity:0; transform:scale(1.02); transition: opacity 480ms var(--anim-ease), transform 480ms var(--anim-ease); will-change: opacity, transform; }
            .img-fade.anim-visible{ opacity:1; transform:none; }
            .btn-anim{ transition: transform 180ms var(--anim-ease), box-shadow 180ms var(--anim-ease); will-change: transform; }
            .btn-anim.hoverable:hover{ transform:translateY(-4px) scale(1.02); box-shadow: 0 10px 24px rgba(2,6,23,0.08); }
            .btn-anim:active{ transform:scale(.985); }
            [data-parallax]{ will-change: transform; }
            @media (prefers-reduced-motion: reduce){ .anim-reveal, .img-fade, .btn-anim, [data-parallax]{ transition:none !important; transform:none !important; } }
        `;
        document.head.appendChild(s);
    }

    if (reduced) return;

    // Reveal observer
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const d = Number(el.dataset.animDelay || el.dataset.delay || 0);
                if (d) el.style.transitionDelay = d + 'ms';
                el.classList.add('anim-visible');
                // lazy-load images
                if (el.tagName === 'IMG' && el.dataset.src) {
                    el.src = el.dataset.src;
                    el.removeAttribute('data-src');
                }
                obs.unobserve(el);
            }
        });
    }, { root:null, rootMargin:'0px 0px -8% 0px', threshold: 0.06 });

    // Attach reveal classes
    const revealEls = document.querySelectorAll('[data-animate], .anim-reveal, h1, h2, h3, p, .card, .slide, .train-item, .station, .about-mission');
    revealEls.forEach(el => {
        if (el.tagName === 'IMG') el.classList.add('img-fade');
        else if (!el.classList.contains('anim-reveal')) el.classList.add('anim-reveal');
        io.observe(el);
    });

    // Button interactions
    document.querySelectorAll('button, .btn, a.btn').forEach(b => {
        b.classList.add('btn-anim');
        // only add hoverable class if pointer capable
        if (window.matchMedia('(hover: hover)').matches) b.classList.add('hoverable');
        b.addEventListener('pointerdown', () => b.style.transform = 'scale(.985)');
        b.addEventListener('pointerup', () => b.style.transform = '');
        b.addEventListener('pointerleave', () => b.style.transform = '');
    });

    // Optional parallax
    const parallax = document.querySelectorAll('[data-parallax]');
    if (parallax.length) {
        let raf = null; let sx = 0; let sy = 0;
        window.addEventListener('mousemove', (e) => {
            sx = (e.clientX / window.innerWidth) - 0.5;
            sy = (e.clientY / window.innerHeight) - 0.5;
            if (raf) return;
            raf = requestAnimationFrame(() => {
                parallax.forEach(el => {
                    const depth = parseFloat(el.dataset.parallax) || 0.35;
                    el.style.transform = `translate3d(${sx * 12 * depth}px, ${sy * 8 * depth}px, 0)`;
                });
                raf = null;
            });
        }, { passive: true });
    }
}

// ===== UTILITY FUNCTIONS =====
/**
 * Update current time display
 */
function updateCurrentTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        timeElement.textContent = now.toLocaleDateString('en-IN', options);
    }
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
    showToast(message, 'success');
}

/**
 * Show error message
 */
function showErrorMessage(message) {
    showToast(message, 'error');
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.success};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 1100;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-size: 0.875rem;
        font-weight: 500;
    `;
    
    if (window.innerWidth <= 576) {
        toast.style.cssText += `
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
            transform: translateY(-100%);
        `;
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (window.innerWidth <= 576) {
            toast.style.transform = 'translateY(0)';
        } else {
            toast.style.transform = 'translateX(0)';
        }
    }, 100);
    
    setTimeout(() => {
        if (window.innerWidth <= 576) {
            toast.style.transform = 'translateY(-100%)';
        } else {
            toast.style.transform = 'translateX(100%)';
        }
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

/**
 * Emergency contacts function
 */
function showEmergencyContacts() {
    const emergencyInfo = `
Emergency Contacts:

Control Room: +91 484 400 6000
Fire Department: 101
Police: 100
Medical Emergency: 108
Station Master: +91 484 400 6001
Security: +91 484 400 6002

For immediate assistance, contact the Control Room.
    `;
    
    alert(emergencyInfo);
}

/**
 * Debounce function
 */
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

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showErrorMessage('An unexpected error occurred. Please try again.');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showErrorMessage('A network error occurred. Please check your connection.');
});

// Creative delayed loading overlay
function showCreativeLoader(message = 'Loading') {
    if (document.getElementById('creative-loader')) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Styles
    if (!document.getElementById('creative-loader-styles')) {
        const style = document.createElement('style');
        style.id = 'creative-loader-styles';
        style.textContent = `
#creative-loader{ position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, rgba(2,6,23,0.8), rgba(37,99,235,0.45)); z-index:2000; backdrop-filter: blur(4px); }
#creative-loader .loader { display:flex; flex-direction:column; align-items:center; gap:12px; color:#fff; font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial; }
/* shimmering bar */
.loader-bar{ width:260px; height:6px; border-radius:999px; background:linear-gradient(90deg,#ffffff22,#ffffff55,#ffffff22); background-size:200% 100%; animation: shimmer 1600ms var(--anim-ease) infinite; }
@keyframes shimmer{ 0%{background-position:0%}50%{background-position:100%}100%{background-position:0%} }
/* bouncing dots */
.dots{ display:flex; gap:8px; }
.dot{ width:10px; height:10px; border-radius:50%; background:#fff; opacity:0.95; transform:translateY(0); }
.dot:nth-child(1){ animation: bounce 900ms var(--anim-ease) infinite; animation-delay:0ms }
.dot:nth-child(2){ animation: bounce 900ms var(--anim-ease) infinite; animation-delay:120ms }
.dot:nth-child(3){ animation: bounce 900ms var(--anim-ease) infinite; animation-delay:240ms }
@keyframes bounce{ 0%{ transform:translateY(0); } 40%{ transform:translateY(-8px); } 100%{ transform:translateY(0); } }
/* subtle train icon motion */
.train-wrap{ display:flex; align-items:center; gap:10px; transform:translateX(0); }
.train-icon{ width:48px; height:22px; background:linear-gradient(90deg,#fff,#dbeafe); border-radius:6px; box-shadow:0 6px 18px rgba(2,6,23,0.12); position:relative; overflow:hidden; }
.train-icon::after{ content:''; position:absolute; left:-40%; top:0; width:40%; height:100%; background:linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); transform:translateX(0); animation: gloss 1400ms var(--anim-ease) infinite; }
@keyframes gloss{ 0%{ transform:translateX(-120%);}100%{ transform:translateX(220%);} }
/* message */
.loader-msg{ font-size:0.95rem; opacity:0.98; }

@media (prefers-reduced-motion: reduce){ .loader-bar, .dot, .train-icon::after{ animation:none !important; } }
        `;
        document.head.appendChild(style);
    }

    const overlay = document.createElement('div');
    overlay.id = 'creative-loader';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');

    const wrap = document.createElement('div');
    wrap.className = 'loader';

    const trainWrap = document.createElement('div');
    trainWrap.className = 'train-wrap';
    const trainIcon = document.createElement('div');
    trainIcon.className = 'train-icon';
    trainWrap.appendChild(trainIcon);

    const bar = document.createElement('div');
    bar.className = 'loader-bar';

    const dots = document.createElement('div');
    dots.className = 'dots';
    for (let i = 0; i < 3; i++) {
        const d = document.createElement('div');
        d.className = 'dot';
        dots.appendChild(d);
    }

    const msg = document.createElement('div');
    msg.className = 'loader-msg';
    msg.textContent = message;

    wrap.appendChild(trainWrap);
    wrap.appendChild(bar);
    wrap.appendChild(dots);
    wrap.appendChild(msg);
    overlay.appendChild(wrap);
    document.body.appendChild(overlay);

    // entrance animation
    if (!prefersReduced) {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 260ms ease';
        requestAnimationFrame(() => overlay.style.opacity = '1');
    }
}

function hideCreativeLoader(fast = false) {
    const overlay = document.getElementById('creative-loader');
    if (!overlay) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || fast) {
        overlay.remove();
        return;
    }
    overlay.style.opacity = '0';
    setTimeout(() => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 260);
}