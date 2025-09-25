/**
 * Clase Footer
 * Genera un elemento <footer> personalizable con texto de derechos de autor
 * y enlaces a redes sociales. Usa clases de Bootstrap para el diseño.
 */
class Footer {
    /**
     * Crea un elemento de pie de página (footer) dinámico.
     * @param {Object} [config={}] - Configuración del footer.
     * @param {string} [config.copyrightText=' '] - Texto que se mostrará en la sección de derechos de autor.
     * @param {Array<Object>} [config.socialLinks] - Lista de enlaces sociales.
     * @param {string} [config.className=''] - Clases CSS adicionales para el footer.
     * @returns {HTMLElement} Elemento <footer> listo para insertar en el DOM.
     */
    static create(config = {}) {
        const {
            copyrightText = '© 2025 Karold Delgado. Todos los derechos reservados.',
            socialLinks = [
                { icon: 'fab fa-linkedin', href: '#' },
                { icon: 'fab fa-github', href: '#' },
                { icon: 'fas fa-envelope', href: '#' }
            ],
            className = ''
        } = config;

        const footer = document.createElement('footer');
        footer.className = `footer-personal py-4 ${className}`.trim();

        const container = document.createElement('div');
        container.className = 'container';

        const row = document.createElement('div');
        row.className = 'row align-items-center';

        // Columna de copyright
        const copyrightCol = document.createElement('div');
        copyrightCol.className = 'col-md-6';

        const copyrightP = document.createElement('p');
        copyrightP.className = 'mb-0 text-white';
        copyrightP.textContent = copyrightText;
        copyrightCol.appendChild(copyrightP);

        row.appendChild(copyrightCol);

        // Columna de redes sociales
        const socialCol = document.createElement('div');
        socialCol.className = 'col-md-6 text-md-end';

        const socialLinksDiv = document.createElement('div');
        socialLinksDiv.className = 'social-links';

        socialLinks.forEach((link, index) => {
            const socialLink = document.createElement('a');
            socialLink.href = link.href || '#';
            socialLink.className = `text-white ${index < socialLinks.length - 1 ? 'me-3' : ''}`;
            socialLink.innerHTML = `<i class="${link.icon}"></i>`;
            
            if (link.onclick) {
                socialLink.addEventListener('click', link.onclick);
            }

            socialLinksDiv.appendChild(socialLink);
        });

        socialCol.appendChild(socialLinksDiv);
        row.appendChild(socialCol);

        container.appendChild(row);
        footer.appendChild(container);

        return footer;
    }
}