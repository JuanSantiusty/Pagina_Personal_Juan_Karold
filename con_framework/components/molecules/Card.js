/**
 * Clase utilitaria para crear elementos card dinámicamente usando Bootstrap
 * Proporciona métodos estáticos para generar diferentes tipos de cards
 * con configuraciones predefinidas y especializadas para proyectos y contactos
 */
class Card {
    /**
     * Crea un elemento card personalizable con header, body y footer opcionales
     * @param {Object} config - Configuración del card
     * @param {string} [config.title=''] - Título que aparecerá en el header como h5
     * @param {string} [config.subtitle=''] - Subtítulo que aparecerá en el header con estilo muted
     * @param {string|HTMLElement} [config.content=''] - Contenido del body (string HTML o elemento DOM)
     * @param {string|HTMLElement} [config.footer=''] - Contenido del footer (string HTML o elemento DOM)
     * @param {string} [config.className=''] - Clases CSS adicionales para el card
     * @param {string} [config.headerClass=''] - Clases CSS adicionales para el header
     * @param {string} [config.bodyClass=''] - Clases CSS adicionales para el body
     * @param {string} [config.footerClass=''] - Clases CSS adicionales para el footer
     * @returns {HTMLElement} Elemento div con la estructura completa del card
     */
    static create(config = {}) {
        const {
            title = '',
            subtitle = '',
            content = '',
            footer = '',
            className = '',
            headerClass = '',
            bodyClass = '',
            footerClass = ''
        } = config;

        const cardElement = document.createElement('div');
        cardElement.className = `card ${className}`.trim();

        // Header si hay título o subtítulo
        if (title || subtitle) {
            const headerElement = document.createElement('div');
            headerElement.className = `card-header ${headerClass}`.trim();

            if (title) {
                const titleElement = document.createElement('h5');
                titleElement.className = 'card-title mb-0';
                titleElement.textContent = title;
                headerElement.appendChild(titleElement);
            }

            if (subtitle) {
                const subtitleElement = document.createElement('p');
                subtitleElement.className = 'card-subtitle mb-0 text-muted';
                subtitleElement.textContent = subtitle;
                headerElement.appendChild(subtitleElement);
            }

            cardElement.appendChild(headerElement);
        }

        // Body
        if (content) {
            const bodyElement = document.createElement('div');
            bodyElement.className = `card-body ${bodyClass}`.trim();
            
            if (typeof content === 'string') {
                bodyElement.innerHTML = content;
            } else {
                bodyElement.appendChild(content);
            }

            cardElement.appendChild(bodyElement);
        }

        // Footer
        if (footer) {
            const footerElement = document.createElement('div');
            footerElement.className = `card-footer ${footerClass}`.trim();
            
            if (typeof footer === 'string') {
                footerElement.innerHTML = footer;
            } else {
                footerElement.appendChild(footer);
            }

            cardElement.appendChild(footerElement);
        }

        return cardElement;
    }
    /**
     * Crea un card especializado para mostrar información de proyectos
     * @param {Object} config - Configuración del card de proyecto
     * @param {string} [config.title=''] - Título del proyecto
     * @param {string} [config.description=''] - Descripción del proyecto
     * @param {Array<string>} [config.technologies=[]] - Array de nombres de tecnologías
     * @param {string} [config.buttonText='Ver proyecto'] - Texto del botón de acción
     * @param {string} [config.buttonLink='#'] - URL de destino del botón
     * @param {string|null} [config.icon=null] - Clases CSS del icono para el título
     * @returns {HTMLElement} Card con estructura específica para proyectos
     */
    static createProject(config = {}) {
        const {
            title = '',
            description = '',
            technologies = [],
            buttonText = 'Ver proyecto',
            buttonLink = '#',
            icon = null
        } = config;

        // Crear contenido del body
        const bodyContent = document.createElement('div');

        // Título con icono
        const titleElement = document.createElement('h5');
        titleElement.className = 'card-title';
        
        if (icon) {
            const iconElement = document.createElement('i');
            iconElement.className = `${icon} me-2`;
            titleElement.appendChild(iconElement);
        }
        
        titleElement.appendChild(document.createTextNode(title));
        bodyContent.appendChild(titleElement);

        // Descripción
        if (description) {
            const descElement = document.createElement('p');
            descElement.className = 'card-text';
            descElement.textContent = description;
            bodyContent.appendChild(descElement);
        }

        // Tecnologías
        if (technologies.length > 0) {
            const techContainer = document.createElement('div');
            techContainer.className = 'technologies mb-3';
            
            technologies.forEach(tech => {
                const badge = Badge.createTechnology(tech);
                techContainer.appendChild(badge);
            });
            
            bodyContent.appendChild(techContainer);
        }

        // Botón
        const button = Button.createOutline({
            text: buttonText,
            onclick: () => window.location.href = buttonLink
        });
        bodyContent.appendChild(button);

        return this.create({
            content: bodyContent,
            className: 'project-card h-100'
        });
    }
    /**
     * Crea un card especializado para mostrar información de contactos
     * @param {Object} contact - Objeto con los datos del contacto
     * @param {string} [contact.name=''] - Nombre del contacto
     * @param {string} [contact.email=''] - Email del contacto
     * @param {string} [contact.phone=''] - Teléfono del contacto (opcional)
     * @param {string} [contact.subject=''] - Asunto del mensaje
     * @param {string} [contact.message=''] - Mensaje del contacto (opcional)
     * @param {Date} [contact.timestamp=new Date()] - Fecha y hora del contacto
     * @param {string|number} [contact.id] - ID único del contacto para eliminación
     * @returns {HTMLElement} Card con estructura específica para mostrar contactos
     * 
     * @dependencies
     * - Requiere la clase Button para el botón de eliminar
     * - Requiere la variable global contactFacade para la funcionalidad de eliminación
     */
    static createContact(contact) {
        const {
            name = '',
            email = '',
            phone = '',
            subject = '',
            message = '',
            timestamp = new Date()
        } = contact;

        const bodyContent = document.createElement('div');

        // Nombre
        const nameElement = document.createElement('h6');
        nameElement.textContent = name;
        bodyContent.appendChild(nameElement);

        // Email
        const emailElement = document.createElement('p');
        emailElement.className = 'mb-1';
        emailElement.innerHTML = `<strong>Email:</strong> ${email}`;
        bodyContent.appendChild(emailElement);

        // Teléfono
        if (phone) {
            const phoneElement = document.createElement('p');
            phoneElement.className = 'mb-1';
            phoneElement.innerHTML = `<strong>Teléfono:</strong> ${phone}`;
            bodyContent.appendChild(phoneElement);
        }

        // Asunto
        const subjectElement = document.createElement('p');
        subjectElement.className = 'mb-1';
        subjectElement.innerHTML = `<strong>Asunto:</strong> ${subject}`;
        bodyContent.appendChild(subjectElement);

        // Mensaje
        if (message) {
            const messageElement = document.createElement('p');
            messageElement.className = 'mb-2';
            messageElement.innerHTML = `<strong>Mensaje:</strong> ${message}`;
            bodyContent.appendChild(messageElement);
        }

        // Timestamp
        const timeElement = document.createElement('small');
        timeElement.className = 'text-muted';
        timeElement.textContent = new Date(timestamp).toLocaleString();
        bodyContent.appendChild(timeElement);

        // Botón eliminar
        const deleteButton = Button.create({
            text: 'Eliminar',
            variant: 'outline-danger',
            size: 'sm',
            icon: 'fas fa-trash',
            onclick: () => {
                if (typeof contactFacade !== 'undefined') {
                    contactFacade.eliminarContacto(contact.id || Date.now());
                }
            }
        });
        bodyContent.appendChild(deleteButton);

        return this.create({
            content: bodyContent,
            className: 'contact-item'
        });
    }
}