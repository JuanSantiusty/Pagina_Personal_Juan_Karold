/**
 * Clase Sections
 * Contiene métodos estáticos para crear las secciones principales
 * de una página web personal o portafolio. Cada método retorna
 * un elemento `<section>` completamente construido y listo para
 * insertarse en el DOM.
 */

class Sections {
    /**
     * Crea la sección de presentación (Hero) con información personal,
     * una foto de perfil y expectativas profesionales.
     * @param {Object} [config={}] - Configuración de la sección.
     * @param {Object} [config.personalInfo={}] - Información adicional a mostrar (clave: valor). Se fusiona con los datos por defecto.
     * @param {string} [config.profileImage='assets/images/perfil.jpeg'] - Ruta de la imagen de perfil.
     * @param {string} [config.expectations=''] - Texto opcional sobre las expectativas profesionales.
     * @returns {HTMLElement} Sección `<section>` lista para agregar al DOM.
     */
    static createHeroSection(config = {}) {
        const {
            personalInfo = {},
            profileImage = 'assets/images/perfil.jpeg',
            expectations = ''
        } = config;

        const section = document.createElement('section');
        section.className = 'container-fluid py-5';
        section.id = 'inicio';

        const container = document.createElement('div');
        container.className = 'container';

        const row = document.createElement('div');
        row.className = 'row align-items-center';

        // Columna de información personal
        const colInfo = document.createElement('div');
        colInfo.className = 'col-lg-8';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'info-personal';

        const titleElement = document.createElement('h2');
        titleElement.className = 'section-title';
        titleElement.textContent = 'Información Personal';
        infoDiv.appendChild(titleElement);

        const personalDetails = document.createElement('div');
        personalDetails.className = 'personal-details';

        // Información personal
        const infoData = {
            'Nombre': 'Karold Dirley Delgado Arciniegas',
            'Fecha de nacimiento': '7 de mayo de 2003',
            ...personalInfo
        };

        Object.entries(infoData).forEach(([key, value]) => {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${key}:</strong> ${value}`;
            personalDetails.appendChild(p);
        });

        infoDiv.appendChild(personalDetails);

        // Expectativas
        if (expectations) {
            const expectationsDiv = document.createElement('div');
            expectationsDiv.className = 'expectations mt-4';

            const h4 = document.createElement('h4');
            h4.textContent = 'Mis expectativas como profesional';
            expectationsDiv.appendChild(h4);

            const leadP = document.createElement('p');
            leadP.className = 'lead';
            leadP.textContent = expectations;
            expectationsDiv.appendChild(leadP);

            infoDiv.appendChild(expectationsDiv);
        }

        colInfo.appendChild(infoDiv);
        row.appendChild(colInfo);

        // Columna de foto
        const colPhoto = document.createElement('div');
        colPhoto.className = 'col-lg-4 text-center';

        const photoContainer = document.createElement('div');
        photoContainer.className = 'photo-container';

        const img = document.createElement('img');
        img.src = profileImage;
        img.alt = 'Karold Delgado';
        img.className = 'img-fluid rounded-circle profile-photo';
        img.onerror = () => {
            // Si la imagen falla, crear placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'profile-photo profile-placeholder d-flex align-items-center justify-content-center';
            placeholder.style.fontSize = '4rem';
            placeholder.textContent = '👤';
            photoContainer.replaceChild(placeholder, img);
        };

        photoContainer.appendChild(img);
        colPhoto.appendChild(photoContainer);
        row.appendChild(colPhoto);

        container.appendChild(row);
        section.appendChild(container);

        return section;
    }

    /**
     * Crea la sección de trayectoria educativa con un título
     * y una tabla de estudios generada por Table.createEducationTable().
     * @returns {HTMLElement} Sección `<section>` con la tabla educativa.
     */
    static createEducationSection() {
        const section = document.createElement('section');
        section.className = 'container-fluid py-5 bg-light';
        section.id = 'estudios';

        const container = document.createElement('div');
        container.className = 'container';

        const title = document.createElement('h2');
        title.className = 'section-title text-center mb-5';
        title.textContent = 'Trayectoria Educativa';
        container.appendChild(title);

        const row = document.createElement('div');
        row.className = 'row justify-content-center';

        const col = document.createElement('div');
        col.className = 'col-lg-10';

        const table = Table.createEducationTable();
        col.appendChild(table);
        row.appendChild(col);
        container.appendChild(row);
        section.appendChild(container);

        return section;
    }

    /**
     * Crea la sección de pasatiempos (Hobbies) en formato de carrusel Bootstrap.
     * @param {Object} [config={}] - Configuración de la sección.
     * @param {Array<Object>} [config.hobbies] - Lista de pasatiempos.
     * @returns {HTMLElement} Sección `<section>` con un carrusel de pasatiempos.
     */
    static createHobbiesSection(config = {}) {
        const {
            hobbies = [
                {
                    title: 'Lectura',
                    description: 'Mi mayor pasatiempo es la lectura. Me gusta porque me distraigo con las historias y me relajo. Disfruto especialmente de los libros de ciencia ficción y desarrollo personal.',
                    image: 'assets/images/lectura.jpeg'
                },
                {
                    title: 'Taekwondo',
                    description: 'Soy principiante así que manejo los golpes básicos. Me gusta porque quiero ser flexible y aprender a defenderme, me ha ayudado a perder el miedo a hacer actividades que pensaba que no podría.',
                    image: 'assets/images/taekwondo.png'
                },
                {
                    title: 'Series y Películas',
                    description: 'Ver películas y series hace parte de mis días libres. Me entretengo with las tramas que me llaman la atención y es una forma de descansar de mis responsabilidades cuando no tengo energía para actividades físicas.',
                    image: 'assets/images/serie.png'
                }
            ]
        } = config;

        const section = document.createElement('section');
        section.className = 'container-fluid py-5';
        section.id = 'pasatiempos';

        const container = document.createElement('div');
        container.className = 'container';

        const title = document.createElement('h2');
        title.className = 'section-title text-center mb-5';
        title.textContent = 'Mis Pasatiempos';
        container.appendChild(title);

        // Crear carousel
        const carousel = this.createCarousel('carouselPasatiempos', hobbies);
        container.appendChild(carousel);
        section.appendChild(container);

        return section;
    }

    /**
     * Crea la sección de proyectos, mostrando tarjetas (cards) con
     * información de cada proyecto (nombre, descripción, tecnologías, etc.).
     * @returns {HTMLElement} Sección `<section>` con las tarjetas de proyectos.
     */
    static createProjectsSection(config = {}) {
        const {
            projects = [
                {
                    title: 'Aplicación Web para Acciones',
                    description: 'Sistema web para el seguimiento y análisis de acciones bursátiles. Incluye gráficos en tiempo real y alertas personalizadas.',
                    technologies: ['.Net SDK 8', 'Visual Studio 2022', 'Node.js y npm', 'SSMS'],
                    icon: 'fas fa-chart-line',
                    buttonText: 'Ver proyecto',
                    buttonLink: '#'
                },
                {
                    title: 'Tienda Virtual',
                    description: 'E-commerce completo con carrito de compras, gestión de productos y sistema de pagos simulado.',
                    technologies: ['Bootstrap', 'HTML', 'CSS', 'JavaScript'],
                    icon: 'fas fa-shopping-cart',
                    buttonText: 'Ver proyecto',
                    buttonLink: '#'
                }
            ]
        } = config;

        const section = document.createElement('section');
        section.className = 'container-fluid py-5 bg-light';
        section.id = 'proyectos';

        const container = document.createElement('div');
        container.className = 'container';

        const title = document.createElement('h2');
        title.className = 'section-title text-center mb-5';
        title.textContent = 'Mis Proyectos';
        container.appendChild(title);

        const row = document.createElement('div');
        row.className = 'row';

        projects.forEach(project => {
            const col = document.createElement('div');
            col.className = 'col-md-6 mb-4';

            const projectCard = Card.createProject(project);
            col.appendChild(projectCard);
            row.appendChild(col);
        });

        container.appendChild(row);
        section.appendChild(container);

        return section;
    }

    /**
     * Crea la sección de contacto que incluye un formulario y
     * una lista dinámica de contactos guardados.
     * @returns {HTMLElement} Sección `<section>` lista para agregar al DOM.
     */
    static createContactSection() {
        const section = document.createElement('section');
        section.className = 'container-fluid py-5';
        section.id = 'contacto';

        const container = document.createElement('div');
        container.className = 'container';

        const title = document.createElement('h2');
        title.className = 'section-title text-center mb-5';
        title.textContent = 'Contacto';
        container.appendChild(title);

        const row = document.createElement('div');
        row.className = 'row';

        // Columna del formulario
        const colForm = document.createElement('div');
        colForm.className = 'col-lg-8';

        const contactForm = Form.createContactForm();
        colForm.appendChild(contactForm);
        row.appendChild(colForm);

        // Columna de la lista de contactos
        const colList = document.createElement('div');
        colList.className = 'col-lg-4';

        const contactList = this.createContactList();
        colList.appendChild(contactList);
        row.appendChild(colList);

        container.appendChild(row);
        section.appendChild(container);

        return section;
    }

    /**
     * Crea un carrusel Bootstrap genérico que puede reutilizarse en otras secciones.
     * @param {string} carouselId - ID único para el carrusel.
     * @param {Array<Object>} items - Elementos a mostrar.
     * @returns {HTMLElement} Elemento `<div>` con estructura de carrusel.
     */
    static createCarousel(carouselId, items) {
        const carousel = document.createElement('div');
        carousel.id = carouselId;
        carousel.className = 'carousel slide';
        carousel.setAttribute('data-bs-ride', 'carousel');

        // Indicators
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';

        items.forEach((_, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('data-bs-target', `#${carouselId}`);
            button.setAttribute('data-bs-slide-to', index.toString());
            button.setAttribute('aria-label', `Slide ${index + 1}`);
            if (index === 0) {
                button.className = 'active';
                button.setAttribute('aria-current', 'true');
            }
            indicators.appendChild(button);
        });

        carousel.appendChild(indicators);

        // Inner carousel
        const carouselInner = document.createElement('div');
        carouselInner.className = 'carousel-inner';

        items.forEach((item, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = index === 0 ? 'carousel-item active' : 'carousel-item';

            const img = document.createElement('img');
            img.src = item.image;
            img.className = 'd-block w-100 img-fluid carousel-image';
            img.alt = item.title;
            img.onerror = () => {
                // Placeholder si la imagen falla
                const placeholder = document.createElement('div');
                placeholder.className = 'carousel-image image-placeholder carousel-placeholder d-flex align-items-center justify-content-center';
                placeholder.innerHTML = `<i class="fas fa-image" style="font-size: 4rem; opacity: 0.5;"></i>`;
                carouselItem.replaceChild(placeholder, img);
            };

            carouselItem.appendChild(img);

            // Caption
            const caption = document.createElement('div');
            caption.className = 'carousel-caption d-none d-md-block';

            const captionTitle = document.createElement('h5');
            captionTitle.textContent = item.title;
            caption.appendChild(captionTitle);

            const captionDesc = document.createElement('p');
            captionDesc.textContent = item.description;
            caption.appendChild(captionDesc);

            carouselItem.appendChild(caption);
            carouselInner.appendChild(carouselItem);
        });

        carousel.appendChild(carouselInner);

        // Controls
        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-control-prev';
        prevButton.type = 'button';
        prevButton.setAttribute('data-bs-target', `#${carouselId}`);
        prevButton.setAttribute('data-bs-slide', 'prev');

        const prevIcon = document.createElement('span');
        prevIcon.className = 'carousel-control-prev-icon';
        prevIcon.setAttribute('aria-hidden', 'true');
        prevButton.appendChild(prevIcon);

        const prevText = document.createElement('span');
        prevText.className = 'visually-hidden';
        prevText.textContent = 'Anterior';
        prevButton.appendChild(prevText);

        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-control-next';
        nextButton.type = 'button';
        nextButton.setAttribute('data-bs-target', `#${carouselId}`);
        nextButton.setAttribute('data-bs-slide', 'next');

        const nextIcon = document.createElement('span');
        nextIcon.className = 'carousel-control-next-icon';
        nextIcon.setAttribute('aria-hidden', 'true');
        nextButton.appendChild(nextIcon);

        const nextText = document.createElement('span');
        nextText.className = 'visually-hidden';
        nextText.textContent = 'Siguiente';
        nextButton.appendChild(nextText);

        carousel.appendChild(prevButton);
        carousel.appendChild(nextButton);

        return carousel;
    }

    /**
     * Crea un listado de contactos con botones para actualizar
     * o borrar todos los registros.
     * @returns {HTMLElement} Contenedor `<div>` con la lista de contactos.
     */
    static createContactList() {
        const contactListDiv = document.createElement('div');
        contactListDiv.className = 'contact-list';

        const title = document.createElement('h4');
        title.textContent = 'Contactos guardados';
        contactListDiv.appendChild(title);

        // Botones de acción
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'd-flex justify-content-between mb-3';

        const refreshButton = Button.create({
            text: 'Actualizar',
            variant: 'outline-primary',
            size: 'sm',
            icon: 'fas fa-refresh',
            onclick: () => {
                if (typeof contactFacade !== 'undefined') {
                    contactFacade.listarContactos();
                }
            }
        });

        const deleteAllButton = Button.create({
            text: 'Borrar todo',
            variant: 'outline-danger',
            size: 'sm',
            icon: 'fas fa-trash',
            onclick: () => {
                if (typeof contactFacade !== 'undefined') {
                    contactFacade.borrarTodo();
                }
            }
        });

        buttonContainer.appendChild(refreshButton);
        buttonContainer.appendChild(deleteAllButton);
        contactListDiv.appendChild(buttonContainer);

        // Contenedor de contactos
        const contactItems = document.createElement('div');
        contactItems.id = 'listaContactos';
        contactItems.className = 'contact-items';
        contactItems.innerHTML = '<!-- Los contactos se cargarán aquí dinámicamente -->';
        
        contactListDiv.appendChild(contactItems);

        return contactListDiv;
    }
}