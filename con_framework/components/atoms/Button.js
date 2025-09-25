/**
 * Clase utilitaria para crear elementos button dinámicamente usando Bootstrap
 * Proporciona métodos estáticos para generar diferentes tipos de botones
 * con configuraciones predefinidas y personalizables
 */
class Button {
    /**
     * Crea un elemento button personalizable
     * @param {Object} config - Configuración del button
     * @param {string} [config.text='Button'] - Texto a mostrar en el botón
     * @param {string} [config.type='button'] - Tipo de botón HTML (button, submit, reset)
     * @param {string} [config.variant='primary'] - Variante de Bootstrap (primary, secondary, success, danger, warning, info, light, dark)
     * @param {string} [config.size='md'] - Tamaño del botón ('sm', 'md', 'lg')
     * @param {string|null} [config.icon=null] - Clases CSS del icono (ej: 'fas fa-save')
     * @param {Function|null} [config.onclick=null] - Función callback para el evento click
     * @param {boolean} [config.disabled=false] - Si el botón debe estar deshabilitado
     * @param {string} [config.className=''] - Clases CSS adicionales
     * @param {string} [config.id=''] - ID del elemento
     * @returns {HTMLElement} Elemento button con las clases y configuración aplicadas
     */
    static create(config = {}) {
        const {
            text = 'Button',
            type = 'button',
            variant = 'primary',
            size = 'md',
            icon = null,
            onclick = null,
            disabled = false,
            className = '',
            id = ''
        } = config;

        const sizeClasses = {
            sm: 'btn-sm',
            md: '',
            lg: 'btn-lg'
        };

        const buttonElement = document.createElement('button');
        buttonElement.type = type;
        buttonElement.className = `btn btn-${variant} ${sizeClasses[size]} ${className}`.trim();
        
        if (id) buttonElement.id = id;
        if (disabled) buttonElement.disabled = true;
        if (onclick) buttonElement.addEventListener('click', onclick);

        // Agregar icono si se proporciona
        if (icon) {
            const iconElement = document.createElement('i');
            iconElement.className = `${icon} me-2`;
            buttonElement.appendChild(iconElement);
        }

        // Agregar texto
        const textNode = document.createTextNode(text);
        buttonElement.appendChild(textNode);

        return buttonElement;
    }

    /**
     * Crea un botón con estilo outline (solo borde)
     * @param {Object} config - Configuración del botón (mismos parámetros que create())
     * @param {string} [config.variant='primary'] - Variante que se convertirá en outline-{variant}
     * @returns {HTMLElement} Botón con estilo outline
     */
    static createOutline(config = {}) {
        return this.create({
            ...config,
            variant: `outline-${config.variant || 'primary'}`
        });
    }

    /**
     * Crea un botón que solo muestra un icono (sin texto)
     * @param {Object} config - Configuración del botón
     * @param {string} config.icon - Clases CSS del icono (requerido)
     * @param {string} [config.variant='primary'] - Variante de Bootstrap
     * @param {string} [config.size='md'] - Tamaño del botón
     * @param {Function|null} [config.onclick=null] - Función callback para el evento click
     * @param {boolean} [config.disabled=false] - Si el botón debe estar deshabilitado
     * @param {string} [config.className=''] - Clases CSS adicionales
     * @param {string} [config.id=''] - ID del elemento
     * @returns {HTMLElement} Botón con solo icono y clase btn-icon
     */
    static createIcon(config = {}) {
        const { icon, ...restConfig } = config;
        return this.create({
            ...restConfig,
            text: '',
            icon,
            className: `btn-icon ${config.className || ''}`.trim()
        });
    }
}