/**
 * Script de integración simple para Atomic Design
 */

// Verificar que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAtomicDesign);
} else {
    initializeAtomicDesign();
}

function initializeAtomicDesign() {
    console.log('Inicializando Atomic Design...');
    
    // Cargar ComponentLoader si existe
    loadComponentLoader();
}

function loadComponentLoader() {
    // Verificar si ComponentLoader ya existe
    if (typeof ComponentLoader !== 'undefined') {
        startApplication();
        return;
    }

    // Cargar ComponentLoader
    const script = document.createElement('script');
    script.src = 'components/ComponentLoader.js';
    script.onload = startApplication;
    script.onerror = fallbackToBasicEnhancements;
    document.head.appendChild(script);
}

function startApplication() {
    console.log('ComponentLoader disponible, iniciando aplicación completa...');
    
    // ComponentLoader se auto-inicializa
    // Agregar funcionalidades adicionales si es necesario
    setTimeout(() => {
        if (window.mainPage) {
            addExtraFeatures();
        }
    }, 1000);
}

function fallbackToBasicEnhancements() {
    console.log('ComponentLoader no disponible, aplicando mejoras básicas...');
    
    // Mejoras básicas sin componentes
    enhanceExistingElements();
    addBasicInteractivity();
}

function addExtraFeatures() {
    // Agregar botón de demo en la navbar
    addAtomicDesignDemoButton();
    
    // Agregar información en footer
    addAtomicDesignInfo();
    
    console.log('¡Atomic Design completamente integrado!');
}

function addAtomicDesignDemoButton() {
    const navbar = document.querySelector('.navbar-nav');
    if (!navbar || document.getElementById('atomic-demo-btn')) return;

    const li = document.createElement('li');
    li.className = 'nav-item';
    
    const button = document.createElement('a');
    button.id = 'atomic-demo-btn';
    button.className = 'nav-link btn btn-outline-light btn-sm mx-2';
    button.href = '#';
    button.innerHTML = '<i class="fas fa-puzzle-piece me-1"></i>Demo Atomic';
    button.onclick = (e) => {
        e.preventDefault();
        showAtomicDesignInfo();
    };
    
    li.appendChild(button);
    navbar.appendChild(li);
}

function showAtomicDesignInfo() {
    const info = `
 ATOMIC DESIGN IMPLEMENTADO

Esta página está construida siguiendo la metodología Atomic Design:

🔸 ÁTOMOS: Button, Input, Badge
🔸 MOLÉCULAS: Card, Form, Table  
🔸 ORGANISMOS: Header, Sections, Footer
🔸 TEMPLATES: PageTemplate
🔸 PÁGINAS: MainPage

Estado actual: ${typeof ComponentLoader !== 'undefined' ? 'COMPLETO' : 'BÁSICO'}
    `;
    
    alert(info);
    console.log(info);
}

function addAtomicDesignInfo() {
    const footer = document.querySelector('.footer-personal .container .row');
    if (!footer || document.getElementById('atomic-info')) return;

    const atomicInfo = document.createElement('div');
    atomicInfo.id = 'atomic-info';
    atomicInfo.className = 'col-12 text-center mt-3';
    atomicInfo.innerHTML = `
        <small class="text-white-50">
            <i class="fas fa-puzzle-piece me-1"></i>
            Construido con <strong>Atomic Design</strong> | 
            <span class="cursor-pointer text-decoration-underline" onclick="showAtomicDesignInfo()">
                Ver componentes
            </span>
        </small>
    `;
    
    footer.appendChild(atomicInfo);
}

function enhanceExistingElements() {
    // Mejoras básicas para el formulario existente
    const form = document.getElementById('contacto_Form');
    if (form) {
        addBasicFormValidation(form);
    }
    
    // Mejorar botones existentes
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(addButtonHoverEffect);
    
    // Mejorar navegación
    addSmoothScrolling();
}

function addBasicFormValidation(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });
        
        if (isValid) {
            alert('Formulario enviado exitosamente (modo básico)');
            form.reset();
        }
    });
}

function addButtonHoverEffect(button) {
    if (button.classList.contains('enhanced')) return;
    
    button.classList.add('enhanced');
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.transition = 'all 0.3s ease';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
}

function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function addBasicInteractivity() {
    // Animaciones simples al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'all 0.6s ease-out';
            }
        });
    }, observerOptions);
    
    // Observar secciones
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        observer.observe(section);
    });
    
    console.log('Interactividad básica aplicada');
}

// Funciones de utilidad global
window.showAtomicDesignInfo = showAtomicDesignInfo;

// Mensaje de bienvenida
console.log(`
ATOMIC DESIGN INTEGRATION
============================
Este script integra la metodología Atomic Design en la página web.

Funcionalidades:
- Carga automática de componentes
Usa showAtomicDesignInfo() para ver más detalles.
`);