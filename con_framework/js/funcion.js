/**
 * Funciones Generales para la página personal
 * Incluye funcionalidades de navegación, carrusel y utilidades
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

/**
 * Inicializa todas las funcionalidades del sitio web
 */
function initializeWebsite() {
    console.log('Inicializando sitio web...');
    
    // Inicializar funcionalidades
    initializeSmoothScrolling();
    initializeNavbar();
    initializeCarousel();
    initializeAnimations();
    initializeContactForm();
    initializeResponsiveFeatures();
    
    console.log('Sitio web inicializado correctamente');
}

/**
 * Inicializa el scroll suave para los enlaces de navegación
 */
function initializeSmoothScrolling() {
    // Seleccionar todos los enlaces que apuntan a secciones
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calcular offset para navbar fija
                const navbarHeight = document.querySelector('.navbar').offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Cerrar navbar en mobile si está abierta
                const navbarCollapse = document.querySelector('.navbar-collapse');
                const navbarToggler = document.querySelector('.navbar-toggler');
                
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
                
                // Actualizar estado activo
                updateActiveNavLink(targetId);
            }
        });
    });
}

/**
 * Inicializa funcionalidades de la navbar
 */
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    
    // Cambiar estilo de navbar al hacer scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Actualizar link activo basado en la posición
        updateActiveNavLinkOnScroll();
    });
    
    // Agregar estilos CSS para navbar scrolled
    if (!document.getElementById('navbar-scroll-styles')) {
        const style = document.createElement('style');
        style.id = 'navbar-scroll-styles';
        style.textContent = `
            .navbar.scrolled {
                background-color: rgba(13, 110, 253, 0.95) !important;
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            }
            
            .navbar-nav .nav-link.active {
                color: #fff !important;
                font-weight: 600;
            }
            
            .navbar-nav .nav-link.active::after {
                width: 80% !important;
                left: 10% !important;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Actualiza el link activo de navegación
 * @param {string} targetId ID de la sección activa
 */
function updateActiveNavLink(targetId) {
    // Remover clase active de todos los links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Agregar clase active al link correspondiente
    const activeLink = document.querySelector(`a[href="#${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

/**
 * Actualiza el link activo basado en la posición de scroll
 */
function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navbarHeight = document.querySelector('.navbar').offsetHeight || 0;
    
    let currentActiveSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentActiveSection = section.id;
        }
    });
    
    if (currentActiveSection) {
        updateActiveNavLink(currentActiveSection);
    }
}

/**
 * Inicializa funcionalidades del carrusel
 */
function initializeCarousel() {
    const carousel = document.querySelector('#carouselPasatiempos');
    if (!carousel) return;
    
    // Configuración del carrusel Bootstrap
    const bsCarousel = new bootstrap.Carousel(carousel, {
        interval: 5000, // 5 segundos
        wrap: true,
        pause: 'hover'
    });
    
    // Eventos del carrusel
    carousel.addEventListener('slide.bs.carousel', function(e) {
        console.log('Cambiando a slide:', e.to);
    });
    
    // Pausar carrusel cuando no es visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bsCarousel.cycle();
            } else {
                bsCarousel.pause();
            }
        });
    });
    
    observer.observe(carousel);
    
    // Controles táctiles mejorados para móvil
    let startX = 0;
    let endX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const diffX = startX - endX;
        const threshold = 50; // Mínima distancia para activar swipe
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                bsCarousel.next();
            } else {
                bsCarousel.prev();
            }
        }
    }
}

/**
 * Inicializa animaciones y efectos visuales
 */
function initializeAnimations() {
    // Animaciones de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Elementos a animar
    const animatedElements = document.querySelectorAll(
        '.info-personal, .project-card, .contact-form, .contact-list, .table, .carousel'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Agregar estilos de animación
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            .info-personal,
            .project-card,
            .contact-form,
            .contact-list,
            .table,
            .carousel {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease-out;
            }
            
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .project-card:nth-child(even) {
                transform: translateX(-30px);
                opacity: 0;
            }
            
            .project-card:nth-child(even).animate-in {
                transform: translateX(0) !important;
            }
            
            .project-card:nth-child(odd) {
                transform: translateX(30px);
                opacity: 0;
            }
            
            .project-card:nth-child(odd).animate-in {
                transform: translateX(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Efectos de hover mejorados
    addHoverEffects();
}

/**
 * Agrega efectos de hover mejorados
 */
function addHoverEffects() {
    // Efecto paralaje en cards de proyecto
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // Efecto ripple en botones
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Agregar estilos para efectos
    if (!document.getElementById('hover-effects-styles')) {
        const style = document.createElement('style');
        style.id = 'hover-effects-styles';
        style.textContent = `
            .btn {
                position: relative;
                overflow: hidden;
            }
            
            .ripple {
                position: absolute;
                width: 20px;
                height: 20px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .project-card {
                transition: all 0.3s ease;
                transform-style: preserve-3d;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Inicializa funcionalidades del formulario de contacto
 */
function initializeContactForm() {
    const form = document.getElementById('contacto_Form');
    if (!form) return;
    
    // Contador de caracteres para el textarea
    const messageField = document.getElementById('mensaje');
    if (messageField) {
        const maxLength = 1000;
        
        // Crear contador
        const counter = document.createElement('small');
        counter.className = 'text-muted';
        counter.id = 'message-counter';
        messageField.parentNode.appendChild(counter);
        
        function updateCounter() {
            const remaining = maxLength - messageField.value.length;
            counter.textContent = `${messageField.value.length}/${maxLength} caracteres`;
            
            if (remaining < 100) {
                counter.classList.add('text-warning');
                counter.classList.remove('text-muted');
            } else {
                counter.classList.remove('text-warning');
                counter.classList.add('text-muted');
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        updateCounter(); // Inicializar contador
    }
    
    // Auto-resize para textarea
    if (messageField) {
        messageField.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
    
    // Formatear número de teléfono automáticamente
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Formato para números colombianos
            if (value.length >= 10) {
                if (value.startsWith('57')) {
                    value = '+57 ' + value.substring(2, 5) + ' ' + value.substring(5, 8) + ' ' + value.substring(8, 12);
                } else {
                    value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 10);
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Mejorar la experiencia del select
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
        // Agregar opciones dinámicas si es necesario
        const customOption = document.createElement('option');
        customOption.value = 'personalizado';
        customOption.textContent = 'Otro (especificar en mensaje)';
        subjectSelect.appendChild(customOption);
    }
}

/**
 * Inicializa características responsivas
 */
function initializeResponsiveFeatures() {
    // Detectar dispositivo móvil
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Optimizaciones para móvil
        optimizeForMobile();
    }
    
    // Listener para cambios de orientación
    window.addEventListener('resize', function() {
        handleResize();
    });
    
    // Listener para cambio de orientación
    window.addEventListener('orientationchange', function() {
        setTimeout(handleResize, 500);
    });
}

/**
 * Optimizaciones para dispositivos móviles
 */
function optimizeForMobile() {
    // Reducir animaciones en móviles para mejor rendimiento
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (reducedMotionQuery.matches || window.innerWidth <= 576) {
        document.body.classList.add('reduced-motion');
        
        const style = document.createElement('style');
        style.textContent = `
            .reduced-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Mejorar rendimiento del carrusel en móvil
    const carousel = document.querySelector('#carouselPasatiempos');
    if (carousel && window.innerWidth <= 576) {
        // Pausar autoplay en móviles muy pequeños
        const bsCarousel = bootstrap.Carousel.getInstance(carousel);
        if (bsCarousel) {
            bsCarousel.pause();
        }
    }
}

/**
 * Maneja el redimensionamiento de ventana
 */
function handleResize() {
    // Actualizar alturas de elementos
    updateElementHeights();
    
    // Reactivar animaciones si es necesario
    if (window.innerWidth > 768) {
        document.body.classList.remove('reduced-motion');
    } else {
        optimizeForMobile();
    }
}

/**
 * Actualiza alturas de elementos responsivos
 */
function updateElementHeights() {
    const carouselImages = document.querySelectorAll('.carousel-image');
    
    carouselImages.forEach(img => {
        if (window.innerWidth <= 576) {
            img.style.height = '250px';
        } else if (window.innerWidth <= 768) {
            img.style.height = '300px';
        } else {
            img.style.height = '400px';
        }
    });
}

/**
 * Utilidades adicionales
 */

/**
 * Muestra un loader durante operaciones asíncronas
 * @param {boolean} show Mostrar u ocultar loader
 */
function toggleLoader(show) {
    let loader = document.getElementById('global-loader');
    
    if (show && !loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.innerHTML = `
            <div class="loader-backdrop">
                <div class="loader-spinner">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .loader-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            
            .loader-spinner {
                text-align: center;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(loader);
    } else if (!show && loader) {
        loader.remove();
    }
}

/**
 * Genera un ID único
 * @returns {string} ID único
 */
function generateUniqueId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Valida si un email es válido
 * @param {string} email Email a validar
 * @returns {boolean} true si es válido
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Formatea una fecha para mostrar
 * @param {Date|string} date Fecha a formatear
 * @returns {string} Fecha formateada
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Debounce para optimizar eventos que se disparan frecuentemente
 * @param {Function} func Función a debounce
 * @param {number} wait Tiempo de espera
 * @returns {Function} Función con debounce
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

/**
 * Throttle para limitar la frecuencia de ejecución
 * @param {Function} func Función a throttle
 * @param {number} limit Límite de tiempo
 * @returns {Function} Función con throttle
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Aplicar debounce a eventos de scroll y resize para mejor rendimiento
window.addEventListener('scroll', debounce(updateActiveNavLinkOnScroll, 10));
window.addEventListener('resize', debounce(handleResize, 250));

// Funciones globales para uso en HTML
window.contactFacade = contactFacade;
window.toggleLoader = toggleLoader;
window.formatDate = formatDate;