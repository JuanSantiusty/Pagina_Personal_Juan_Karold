/**
 * Clase utilitaria para crear elementos badge dinámicamente usando Bootstrap
 * Proporciona métodos estáticos para generar diferentes tipos de badges
 * con configuraciones predefinidas y personalizables
 */
class Badge {
    /**
     * Crea un elemento badge personalizable
     * @param {Object} config - Configuración del badge
     * @param {string} [config.text=''] - Texto a mostrar en el badge
     * @param {string} [config.variant='primary'] - Variante de Bootstrap (primary, secondary, info, warning, success, danger)
     * @param {string} [config.size='normal'] - Tamaño del badge ('normal' o 'small')
     * @param {boolean} [config.pill=false] - Si el badge debe ser tipo pill (redondeado)
     * @param {string} [config.className=''] - Clases CSS adicionales
     * @returns {HTMLElement} Elemento span con las clases de badge aplicadas
     */
    static create(config = {}) {
        const {
            text = '',
            variant = 'primary',
            size = 'normal',
            pill = false,
            className = ''
        } = config;

        const badgeElement = document.createElement('span');
        
        let badgeClass = `badge bg-${variant}`;
        if (pill) badgeClass += ' rounded-pill';
        if (size === 'small') badgeClass += ' badge-sm';
        
        badgeElement.className = `${badgeClass} ${className}`.trim();
        badgeElement.textContent = text;

        return badgeElement;
    }

    /**
     * Crea un badge con forma de píldora (redondeado)
     * @param {Object} config - Configuración del badge (mismos parámetros que create())
     * @returns {HTMLElement} Elemento badge tipo pill
     */
    static createPill(config = {}) {
        return this.create({
            ...config,
            pill: true
        });
    }

    /**
     * Crea un badge específico para tecnologías con colores predefinidos
     * @param {string} technology - Nombre de la tecnología
     * @returns {HTMLElement} Badge con el color asignado a la tecnología
     */
    static createTechnology(technology) {
        const variants = {
            '.Net SDK 8': 'primary',
            'Visual Studio 2022': 'info',
            'Node.js y npm': 'warning',
            'SSMS': 'success',
            'Bootstrap': 'primary',
            'HTML': 'info',
            'CSS': 'warning',
            'JavaScript': 'success',
            'React': 'primary',
            'Node.js': 'success',
            'MongoDB': 'success',
            'Express': 'warning',
            'Vue.js': 'success',
            'Angular': 'danger',
            'Python': 'warning',
            'PHP': 'secondary',
            'MySQL': 'info',
            'PostgreSQL': 'primary'
        };

        return this.create({
            text: technology,
            variant: variants[technology] || 'secondary',
            className: 'me-1 mb-1'
        });
    }

    /**
     * Crea un badge para mostrar estados con colores apropiados
     * @param {string} status - Estado a mostrar (En curso, Completado, Pendiente, etc.)
     * @returns {HTMLElement} Badge con el color correspondiente al estado
     */
    static createStatus(status) {
        const statusConfig = {
            'En curso': { text: 'En curso', variant: 'success' },
            'Completado': { text: 'Completado', variant: 'primary' },
            'Pendiente': { text: 'Pendiente', variant: 'warning' },
            'Cancelado': { text: 'Cancelado', variant: 'danger' },
            'Activo': { text: 'Activo', variant: 'success' },
            'Inactivo': { text: 'Inactivo', variant: 'secondary' },
            'Nuevo': { text: 'Nuevo', variant: 'info' }
        };

        return this.create(statusConfig[status] || { text: status, variant: 'secondary' });
    }

    /**
     * Crea un badge de contador, típicamente usado para notificaciones
     * @param {Object} config - Configuración del contador
     * @param {number} [config.count=0] - Número a mostrar
     * @param {string} [config.variant='primary'] - Variante de Bootstrap
     * @param {number} [config.maxCount=99] - Número máximo antes de mostrar "+"
     * @returns {HTMLElement} Badge tipo pill con posicionamiento absoluto
     */
    static createCount(config = {}) {
        const { count = 0, variant = 'primary', maxCount = 99 } = config;
        
        let displayCount = count;
        if (count > maxCount) {
            displayCount = `${maxCount}+`;
        }

        return this.create({
            text: displayCount.toString(),
            variant,
            pill: true,
            className: 'position-absolute top-0 start-100 translate-middle'
        });
    }

    /**
     * Crea un badge de tamaño pequeño
     * @param {Object} config - Configuración del badge (mismos parámetros que create())
     * @returns {HTMLElement} Badge de tamaño pequeño
     */
    static createSmall(config = {}) {
        return this.create({
            ...config,
            size: 'small',
            className: `${config.className || ''} badge-sm`
        });
    }

    /**
     * Crea un badge para mostrar niveles de experiencia o habilidad
     * @param {string} level - Nivel de experiencia (Principiante, Básico, Intermedio, Avanzado, Experto)
     * @returns {HTMLElement} Badge tipo pill con el color correspondiente al nivel
     */
    static createLevel(level) {
        const levelConfig = {
            'Principiante': { variant: 'secondary' },
            'Básico': { variant: 'info' },
            'Intermedio': { variant: 'warning' },
            'Avanzado': { variant: 'success' },
            'Experto': { variant: 'danger' }
        };

        const config = levelConfig[level] || { variant: 'secondary' };
        return this.create({
            text: level,
            ...config,
            pill: true
        });
    }

    /**
     * Crea un badge para indicar prioridades
     * @param {string} priority - Nivel de prioridad (Baja, Media, Alta, Crítica)
     * @returns {HTMLElement} Badge con el color y estilo correspondiente a la prioridad
     */
    static createPriority(priority) {
        const priorityConfig = {
            'Baja': { variant: 'secondary' },
            'Media': { variant: 'warning' },
            'Alta': { variant: 'danger' },
            'Crítica': { variant: 'danger', className: 'text-white fw-bold' }
        };

        const config = priorityConfig[priority] || { variant: 'secondary' };
        return this.create({
            text: priority,
            ...config
        });
    }
}