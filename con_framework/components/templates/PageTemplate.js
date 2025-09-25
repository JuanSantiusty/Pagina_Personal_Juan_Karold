/**
 * Clase que representa la plantilla principal de la página.  
 * Permite generar la estructura completa de un portafolio personal
 * con **Header**, **Navbar**, secciones de contenido y **Footer**.
 */
class PageTemplate {
    /**
     * Crea un portafolio personal a partir de una configuración opcional.
     * @param {Object} [config={}] - Objeto de configuración del portafolio.
     * @param {Object} [config.header={}] - Configuración para el encabezado.
     * @param {Object} [config.navbar={}] - Configuración para la barra de navegación.
     * @param {Object} [config.sections={}] - Configuración de las secciones.
     * @param {Object} [config.sections.hero={}] - Ajustes para la sección de inicio (hero).
     * @param {Object} [config.footer={}] - Configuración para el pie de página.
     * @returns {DocumentFragment} - Fragmento del documento con la estructura del portafolio.
     */
    static createPersonalPortfolio(config = {}) {
        const {
            header = {},
            navbar = {},
            sections = {},
            footer = {}
        } = config;

        // Crear estructura base
        const fragment = document.createDocumentFragment();

        // Header
        const headerElement = Header.create({
            title: 'Karold Delgado',
            subtitle: '',
            ...header
        });
        fragment.appendChild(headerElement);

        // Navbar
        const navbarElement = Navbar.createMainNavbar();
        fragment.appendChild(navbarElement);

        // Sección Inicio
        const heroSection = Sections.createHeroSection({
            personalInfo: {
                'Nombre': 'Karold Dirley Delgado Arciniegas',
                'Fecha de nacimiento': '7 de mayo de 2003'
            },
            expectations: 'Como futura ingeniera de sistemas, aspiro convertirme en una analista de sistemas competente y creativa. Mi objetivo es diseñar soluciones tecnológicas que optimicen procesos empresariales y mejoren la experiencia del usuario.',
            ...sections.hero
        });
        fragment.appendChild(heroSection);

        // Sección Estudios
        const educationSection = Sections.createEducationSection();
        fragment.appendChild(educationSection);

        // Sección Pasatiempos
        const hobbiesSection = Sections.createHobbiesSection();
        fragment.appendChild(hobbiesSection);

        // Sección Proyectos
        const projectsSection = Sections.createProjectsSection();
        fragment.appendChild(projectsSection);

        // Sección Contacto
        const contactSection = Sections.createContactSection();
        fragment.appendChild(contactSection);

        // Footer
        const footerElement = Footer.create();
        fragment.appendChild(footerElement);

        return fragment;
    }

    /**
     * Crea el layout completo de la página y lo retorna como un `DocumentFragment`.
     * Útil para construir el contenido del `<body>` en una sola llamada.
     * @returns {DocumentFragment} Estructura completa del portafolio generada por {@link createPersonalPortfolio}.
     */
    static createLayout() {
        // Crear el body si no existe (para casos de generación completa)
        const body = document.body;
        
        // Limpiar contenido existente si es necesario
        // body.innerHTML = '';

        // Generar y agregar el portfolio completo
        const portfolio = this.createPersonalPortfolio();
        
        return portfolio;
    }
}