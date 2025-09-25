/**
 * Clase principal que controla la inicialización, renderización y 
 * mejora de la página utilizando Atomic Design.
 * Se encarga de validar formularios, manejar eventos y agregar
 * funcionalidades dinámicas a los componentes.
 */
class MainPage {
    constructor() {
        this.isLoaded = false;
    }

    /**
     * Inicializa la página verificando que el DOM esté listo.
     * Si el DOM aún está cargando, espera el evento DOMContentLoaded.
     */
    init() {
        // Verificar que DOM esté cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.render());
        } else {
            this.render();
        }
    }

    /**
     * Renderiza la página.
     * Establece los listeners y marca la página como cargada.
     */
    render() {
        // Método para renderizar usando componentes atómicos
        console.log('Iniciando renderización con Atomic Design...');
        
        // Por ahora mantenemos el HTML existente, pero agregamos funcionalidad
        this.enhanceExistingElements();
        this.initializeEventListeners();
        this.isLoaded = true;
    }

    /**
     * Mejora los elementos HTML existentes agregando funcionalidades
     * como validaciones, efectos en botones y manejo de listas.
     */
    enhanceExistingElements() {
        // Mejorar formulario de contacto con validaciones
        this.enhanceContactForm();
        
        // Mejorar lista de contactos
        this.enhanceContactList();
        
        // Mejorar botones existentes
        this.enhanceButtons();
    }

    /**
     * Aplica validaciones y eventos en tiempo real al formulario de contacto.
     */
    enhanceContactForm() {
        const form = document.getElementById('contacto_Form');
        if (!form) return;

        //validaciones personalizadas usando nuestros componentes
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });

        //validación en tiempo real
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }

    /**
     * Muestra un mensaje cuando la lista de contactos está vacía.
     */
    enhanceContactList() {
        const listContainer = document.getElementById('listaContactos');
        if (!listContainer) return;

        // Inicializar lista vacía si no hay contactos
        if (!listContainer.children.length) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'text-muted text-center p-4';
            emptyMessage.textContent = 'No hay contactos guardados';
            listContainer.appendChild(emptyMessage);
        }
    }

    /**
     * Agrega efectos de hover a todos los botones existentes.
     */
    enhanceButtons() {
        // Mejorar botones existentes con efectos
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            if (!button.classList.contains('enhanced')) {
                button.classList.add('enhanced');
                this.addButtonEffects(button);
            }
        });
    }

    /**
     * Aplica efectos de movimiento a un botón.
     * @param {HTMLElement} button - Elemento de botón al que se aplicarán los efectos.
     */
    addButtonEffects(button) {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    }

    /**
     * Inicializa los eventos de navegación y animaciones de scroll.
     */
    initializeEventListeners() {
        // Smooth scroll para navegación
        document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Animaciones al hacer scroll
        this.initializeScrollAnimations();
    }

    /**
     * Aplica animaciones cuando las secciones entran en el viewport.
     */
    initializeScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        // Observar secciones
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Maneja el envío del formulario de contacto.
     * Valida datos, muestra mensaje de éxito y agrega el contacto si existe un facade.
     * @param {HTMLFormElement} form - Formulario de contacto.
     */
    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validar todos los campos
        const isValid = this.validateForm(form);
        
        if (isValid) {
            // Simular envío exitoso
            this.showSuccessMessage();
            
            // Limpiar formulario
            form.reset();
            
            // Si existe el facade de contactos, agregar a la lista
            if (typeof contactFacade !== 'undefined') {
                contactFacade.agregarContacto(data);
            }
        }
    }

    /**
     * Valida todos los campos requeridos de un formulario.
     * @param {HTMLFormElement} form - Formulario a validar.
     * @returns {boolean} Verdadero si todos los campos son válidos.
     */
    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Valida un campo específico según su tipo (texto, email, teléfono).
     * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} field - Campo a validar.
     * @returns {boolean} Verdadero si el campo es válido.
     */
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Validar campo requerido
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'Este campo es requerido';
        }

        // Validaciones específicas por tipo
        if (value && field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingresa un email válido';
            }
        }

        if (value && field.type === 'tel') {
            const phoneRegex = /^\d{7,15}$/;
            if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                isValid = false;
                errorMessage = 'Ingresa un teléfono válido';
            }
        }

        // Mostrar/ocultar error
        this.showFieldError(field, isValid ? '' : errorMessage);
        
        return isValid;
    }

    /**
     * Muestra o limpia el mensaje de error para un campo.
     * @param {HTMLElement} field - Campo del formulario.
     * @param {string} message - Mensaje de error (vacío para limpiar).
     */
    showFieldError(field, message) {
        const errorId = field.id ? `error${field.id.charAt(0).toUpperCase() + field.id.slice(1)}` : null;
        const errorElement = errorId ? document.getElementById(errorId) : null;
        
        if (errorElement) {
            errorElement.textContent = message;
            field.classList.toggle('is-invalid', !!message);
        }
    }

    /**
     * Limpia el estado de error de un campo.
     * @param {HTMLElement} field - Campo del formulario.
     */
    clearErrors(field) {
        field.classList.remove('is-invalid');
        const errorId = field.id ? `error${field.id.charAt(0).toUpperCase() + field.id.slice(1)}` : null;
        const errorElement = errorId ? document.getElementById(errorId) : null;
        
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    /**
     * Muestra un mensaje de éxito al enviar el formulario.
     * Utiliza Toastify si está disponible, de lo contrario usa alert.
     */
    showSuccessMessage() {
        // Usar Toastify si está disponible
        if (typeof Toastify !== 'undefined') {
            Toastify({
                text: "¡Mensaje enviado exitosamente!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            }).showToast();
        } else {
            alert('¡Mensaje enviado exitosamente!');
        }
    }

    /**
     * Renderiza la página usando un template completo generado por componentes.
     * Limpia el body, agrega elementos necesarios al head y configura eventos.
     */
    renderWithComponents() {
        const body = document.body;
        
        // Limpiar body
        body.innerHTML = '';
        
        // Agregar head necesario
        this.addRequiredHeadElements();
        
        // Generar página usando template
        const pageContent = PageTemplate.createPersonalPortfolio();
        body.appendChild(pageContent);
        
        // Inicializar funcionalidades
        this.initializeEventListeners();
        this.initializeContactFacade();
    }

    /**
     * Agrega enlaces CSS necesarios al head si no existen.
     */
    addRequiredHeadElements() {
        const head = document.head;
        
        // Verificar y agregar elementos necesarios si no existen
        const requiredLinks = [
            { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' },
            { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css' },
            { rel: 'stylesheet', href: 'css/custom.css' }
        ];

        requiredLinks.forEach(linkData => {
            if (!head.querySelector(`link[href="${linkData.href}"]`)) {
                const link = document.createElement('link');
                Object.assign(link, linkData);
                head.appendChild(link);
            }
        });
    }

    /**
     * Carga dinámicamente los scripts de Contacto y crea una instancia de ContactFacade.
     */
    initializeContactFacade() {
        // Cargar scripts de contacto si existen
        const scripts = [
            'js/contacto/domain/Contacto.js',
            'js/contacto/repository/ContactRepository.js',
            'js/contacto/facade/ContactFacade.js'
        ];

        let loadedScripts = 0;
        scripts.forEach(scriptSrc => {
            if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
                const script = document.createElement('script');
                script.src = scriptSrc;
                script.onload = () => {
                    loadedScripts++;
                    if (loadedScripts === scripts.length) {
                        // Todos los scripts cargados, inicializar facade
                        if (typeof ContactFacade !== 'undefined') {
                            window.contactFacade = new ContactFacade();
                        }
                    }
                };
                document.body.appendChild(script);
            }
        });
    }

    /**
     * Demuestra la creación de componentes atómicos, moleculares,
     * organismos y plantillas en la consola.
     * @returns {Object} Estructura con todos los componentes creados.
     */
    demonstrateComponents() {
        console.log('=== Demostración de Atomic Design ===');

        // Átomos
        console.log('1. Creando átomos...');
        const button = Button.create({ text: 'Botón de ejemplo', variant: 'primary' });
        const input = Input.create({
            label: 'Input de ejemplo',
            type: 'text',
            placeholder: 'Escribe algo...'
        });
        const badge = Badge.create({ text: 'JavaScript', variant: 'success' });

        console.log('Átomos creados:', { button, input, badge });

        // Moléculas
        console.log('2. Creando moléculas...');
        const projectCard = Card.createProject({
            title: 'Proyecto de ejemplo',
            description: 'Descripción del proyecto',
            technologies: ['JavaScript', 'HTML', 'CSS']
        });

        const contactForm = Form.createContactForm();
        console.log('Moléculas creadas:', { projectCard, contactForm });

        // Organismos
        console.log('3. Creando organismos...');
        const header = Header.create({ title: 'Mi Portfolio' });
        const heroSection = Sections.createHeroSection();
        const footer = Footer.create();

        console.log('Organismos creados:', { header, heroSection, footer });

        // Template
        console.log('4. Creando template...');
        const fullTemplate = PageTemplate.createPersonalPortfolio();
        console.log('Template creado:', fullTemplate);

        return {
            atoms: { button, input, badge },
            molecules: { projectCard, contactForm },
            organisms: { header, heroSection, footer },
            template: fullTemplate
        };
    }

    /**
     * Reemplaza una sección existente del DOM por un nuevo contenido.
     * @param {string} sectionId - ID de la sección a reemplazar.
     * @param {HTMLElement} newContent - Nuevo contenido para reemplazar.
     */
    replaceSection(sectionId, newContent) {
        const existingSection = document.getElementById(sectionId);
        if (existingSection && newContent) {
            existingSection.parentNode.replaceChild(newContent, existingSection);
            this.initializeEventListeners();
        }
    }

    /**
     * Agrega nuevas características a la página sin romper las existentes.
     */
    addComponentBasedFeatures() {
        // Agregar botón para mostrar componentes
        this.addDemoButton();
        
        // Mejorar interactividad de proyectos
        this.enhanceProjectCards();
        
        // Agregar funcionalidad de filtrado a estudios
        this.addEducationFilters();
    }

    /**
     * Agrega un botón de demostración de componentes en la barra de navegación.
     */
    addDemoButton() {
        const navbar = document.querySelector('.navbar .navbar-nav');
        if (navbar) {
            const demoLi = document.createElement('li');
            demoLi.className = 'nav-item';
            
            const demoButton = Button.create({
                text: 'Demo Componentes',
                variant: 'outline-light',
                size: 'sm',
                onclick: () => this.showComponentDemo()
            });
            
            demoLi.appendChild(demoButton);
            navbar.appendChild(demoLi);
        }
    }

    /**
     * Muestra un modal que demuestra los componentes creados.
     */
    showComponentDemo() {
        const components = this.demonstrateComponents();
        
        // Crear modal para mostrar componentes
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Demostración de Atomic Design</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Los componentes han sido creados usando Atomic Design. Revisa la consola para ver los detalles.</p>
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Átomo - Botón:</h6>
                                <div id="demo-button"></div>
                            </div>
                            <div class="col-md-6">
                                <h6>Átomo - Badge:</h6>
                                <div id="demo-badge"></div>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h6>Molécula - Card:</h6>
                            <div id="demo-card"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Agregar componentes al modal
        document.getElementById('demo-button').appendChild(components.atoms.button);
        document.getElementById('demo-badge').appendChild(components.atoms.badge);
        document.getElementById('demo-card').appendChild(components.molecules.projectCard);
        
        // Mostrar modal usando Bootstrap
        if (typeof bootstrap !== 'undefined') {
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
            
            modal.addEventListener('hidden.bs.modal', () => {
                document.body.removeChild(modal);
            });
        }
    }

    /**
     * Agrega interacción a las tarjetas de proyectos para mostrar más detalles.
     */
    enhanceProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showProjectDetails(index);
            });
        });
    }

    /**
     * Muestra en consola los detalles de un proyecto según su índice.
     * @param {number} projectIndex - Índice del proyecto a mostrar.
     */
    showProjectDetails(projectIndex) {
        const projects = [
            {
                title: 'Aplicación Web para Acciones',
                fullDescription: 'Sistema completo para el seguimiento y análisis de acciones bursátiles en tiempo real. Incluye gráficos interactivos, alertas personalizadas, análisis técnico y gestión de portafolios.',
                features: ['Gráficos en tiempo real', 'Alertas push', 'Análisis técnico', 'Gestión de portafolios'],
                technologies: ['.Net SDK 8', 'Visual Studio 2022', 'Node.js y npm', 'SSMS']
            },
            {
                title: 'Tienda Virtual',
                fullDescription: 'E-commerce completo con todas las funcionalidades necesarias para una tienda online moderna. Incluye carrito de compras, gestión de inventario, sistema de pagos y panel administrativo.',
                features: ['Carrito de compras', 'Gestión de inventario', 'Sistema de pagos', 'Panel admin'],
                technologies: ['Bootstrap', 'HTML', 'CSS', 'JavaScript']
            }
        ];

        const project = projects[projectIndex];
        if (!project) return;

        console.log(`Mostrando detalles del proyecto: ${project.title}`);
        // Aquí podrías abrir un modal con más detalles del proyecto
    }

    /**
     * Agrega un filtro en la sección de educación para mostrar solo estudios completados.
     */
    addEducationFilters() {
        const educationSection = document.getElementById('estudios');
        if (educationSection) {
            const filterContainer = document.createElement('div');
            filterContainer.className = 'text-center mb-4';
            
            const filterButton = Button.create({
                text: 'Filtrar por Estado',
                variant: 'outline-primary',
                onclick: () => this.toggleEducationFilter()
            });
            
            filterContainer.appendChild(filterButton);
            
            const title = educationSection.querySelector('.section-title');
            title.parentNode.insertBefore(filterContainer, title.nextSibling);
        }
    }

    /**
     * Filtra la tabla de educación para mostrar solo los estudios completados.
     */
    toggleEducationFilter() {
        const table = document.querySelector('.table');
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const badge = row.querySelector('.badge');
            if (badge) {
                const isCompleted = badge.textContent.includes('Completado');
                row.style.display = isCompleted ? '' : 'none';
            }
        });

        console.log('Filtro de educación aplicado - mostrando solo estudios completados');
    }
}