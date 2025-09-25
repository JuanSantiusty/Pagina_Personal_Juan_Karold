/**
 * Clase Header
 * Genera un encabezado (<header>) para la página con un título principal
 * y un subtítulo opcional, usando estilos de Bootstrap.
 */
class Header {
    /**
     * Crea un elemento de encabezado (header) dinámico.
     * @param {Object} [config={}] - Configuración del encabezado.
     * @param {string} [config.title='Karold Delgado'] - Título principal que se mostrará en el header.
     * @param {string} [config.subtitle=''] - Subtítulo opcional que se muestra debajo del título principal.
     * @param {string} [config.className=''] - Clases CSS adicionales para personalizar el header.
     * @returns {HTMLElement} Elemento `<header>` listo para insertar en el DOM.
     */
    static create(config = {}) {
        const {
            title = 'Karold Delgado',
            subtitle = '',
            className = ''
        } = config;

        const header = document.createElement('header');
        header.className = `header-personal ${className}`.trim();

        const containerFluid = document.createElement('div');
        containerFluid.className = 'container-fluid';

        const textCenter = document.createElement('div');
        textCenter.className = 'text-center py-4';

        const titleElement = document.createElement('h1');
        titleElement.className = 'display-4 fw-bold text-white';
        titleElement.textContent = title;
        textCenter.appendChild(titleElement);

        if (subtitle) {
            const subtitleElement = document.createElement('p');
            subtitleElement.className = 'lead text-white';
            subtitleElement.textContent = subtitle;
            textCenter.appendChild(subtitleElement);
        }

        containerFluid.appendChild(textCenter);
        header.appendChild(containerFluid);

        return header;
    }
}

/**
 * Clase Navbar
 * Genera una barra de navegación (<nav>) responsiva basada en Bootstrap,
 * con enlaces configurables y opción de navbar fijo en la parte superior.
 */
class Navbar {
    /**
     * Crea un elemento de barra de navegación.
     * @param {Object} [config={}] - Configuración de la barra de navegación.
     * @param {string} [config.brand=''] - (Opcional) Nombre o logo de la marca.
     * @param {Array<Object>} [config.links=[]] - Lista de enlaces de navegación.
     * @param {string} [config.className=''] - Clases CSS adicionales para el nav.
     * @param {boolean} [config.sticky=true] - Si es `true`, fija la barra en la parte superior.
     * @returns {HTMLElement} Elemento `<nav>` listo para insertar en el DOM.
     */
    static create(config = {}) {
        const {
            brand = '',
            links = [],
            className = '',
            sticky = true
        } = config;

        const nav = document.createElement('nav');
        let navClasses = 'navbar navbar-expand-lg navbar-dark bg-primary';
        if (sticky) navClasses += ' sticky-top';
        nav.className = `${navClasses} ${className}`.trim();

        const containerFluid = document.createElement('div');
        containerFluid.className = 'container-fluid';

        // Toggle button for mobile
        const toggleButton = document.createElement('button');
        toggleButton.className = 'navbar-toggler';
        toggleButton.type = 'button';
        toggleButton.setAttribute('data-bs-toggle', 'collapse');
        toggleButton.setAttribute('data-bs-target', '#navbarNav');
        toggleButton.setAttribute('aria-controls', 'navbarNav');
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.setAttribute('aria-label', 'Toggle navigation');

        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'navbar-toggler-icon';
        toggleButton.appendChild(toggleIcon);

        containerFluid.appendChild(toggleButton);

        // Collapsible navbar content
        const navbarCollapse = document.createElement('div');
        navbarCollapse.className = 'collapse navbar-collapse';
        navbarCollapse.id = 'navbarNav';

        const navbarNav = document.createElement('ul');
        navbarNav.className = 'navbar-nav mx-auto';

        // Add navigation links
        links.forEach(link => {
            const navItem = document.createElement('li');
            navItem.className = 'nav-item';

            const navLink = document.createElement('a');
            navLink.className = 'nav-link';
            navLink.href = link.href || '#';
            navLink.textContent = link.text;
            
            if (link.onclick) {
                navLink.addEventListener('click', link.onclick);
            }

            navItem.appendChild(navLink);
            navbarNav.appendChild(navItem);
        });

        navbarCollapse.appendChild(navbarNav);
        containerFluid.appendChild(navbarCollapse);
        nav.appendChild(containerFluid);

        return nav;
    }

    /**
     * Crea una barra de navegación predeterminada con enlaces a las
     * secciones principales de un portafolio o página personal.
     * @returns {HTMLElement} Navbar principal lista para insertar en el DOM.
     */
    static createMainNavbar() {
        const links = [
            { text: 'Inicio', href: '#inicio' },
            { text: 'Estudios', href: '#estudios' },
            { text: 'Pasatiempos', href: '#pasatiempos' },
            { text: 'Proyectos', href: '#proyectos' },
            { text: 'Contacto', href: '#contacto' }
        ];

        return this.create({ links });
    }
}