/**
 * Clase utilitaria para crear elementos de formulario dinámicamente usando Bootstrap
 * Proporciona métodos estáticos para generar inputs, textareas y selects
 * con configuraciones predefinidas, labels y manejo de errores
 */
class Input {
    /**
     * Crea un elemento input personalizable con label y contenedor
     * @param {Object} config - Configuración del input
     * @param {string} [config.type='text'] - Tipo de input HTML (text, email, password, number, etc.) o 'textarea'
     * @param {string} [config.placeholder=''] - Texto placeholder del input
     * @param {string} [config.label=''] - Texto del label asociado
     * @param {string} [config.id=''] - ID del elemento input
     * @param {string} [config.name=''] - Atributo name del input
     * @param {boolean} [config.required=false] - Si el campo es requerido
     * @param {string} [config.className=''] - Clases CSS adicionales para el input
     * @param {string} [config.value=''] - Valor inicial del input
     * @param {string} [config.errorId=''] - ID del div de error para validación
     * @param {Function|null} [config.onchange=null] - Función callback para el evento change
     * @param {Function|null} [config.oninput=null] - Función callback para el evento input
     * @returns {HTMLElement} Contenedor div con label, input y div de error (si se especifica)
     */
    static create(config = {}) {
        const {
            type = 'text',
            placeholder = '',
            label = '',
            id = '',
            name = '',
            required = false,
            className = '',
            value = '',
            errorId = '',
            onchange = null,
            oninput = null
        } = config;

        const container = document.createElement('div');
        container.className = 'mb-3';

        // Crear label si se proporciona
        if (label) {
            const labelElement = document.createElement('label');
            labelElement.htmlFor = id;
            labelElement.className = 'form-label';
            labelElement.innerHTML = label + (required ? ' <span class="required">*</span>' : '');
            container.appendChild(labelElement);
        }

        // Crear input
        const inputElement = document.createElement(type === 'textarea' ? 'textarea' : 'input');
        if (type !== 'textarea') inputElement.type = type;
        
        inputElement.className = `form-control ${className}`.trim();
        inputElement.placeholder = placeholder;
        if (id) inputElement.id = id;
        if (name) inputElement.name = name;
        if (value) inputElement.value = value;
        if (required) inputElement.required = true;

        // Event listeners
        if (onchange) inputElement.addEventListener('change', onchange);
        if (oninput) inputElement.addEventListener('input', oninput);

        container.appendChild(inputElement);

        // Crear div de error si se proporciona errorId
        if (errorId) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.id = errorId;
            container.appendChild(errorDiv);
        }

        return container;
    }

    /**
     * Crea un textarea usando la configuración base del método create
     * @param {Object} config - Configuración del textarea (mismos parámetros que create())
     * @returns {HTMLElement} Contenedor div con label, textarea y div de error
     */
    static createTextarea(config = {}) {
        return this.create({
            ...config,
            type: 'textarea'
        });
    }

    /**
     * Crea un elemento select con opciones configurables
     * @param {Object} config - Configuración del select
     * @param {string} [config.label=''] - Texto del label asociado
     * @param {string} [config.id=''] - ID del elemento select
     * @param {string} [config.name=''] - Atributo name del select
     * @param {boolean} [config.required=false] - Si el campo es requerido
     * @param {string} [config.className=''] - Clases CSS adicionales para el select
     * @param {Array} [config.options=[]] - Array de objetos con las opciones {value, text, selected}
     * @param {string} [config.defaultOption=''] - Texto para la opción por defecto (value vacío)
     * @param {string} [config.errorId=''] - ID del div de error para validación
     * @param {Function|null} [config.onchange=null] - Función callback para el evento change
     * @returns {HTMLElement} Contenedor div con label, select y div de error
     **/
    static createSelect(config = {}) {
        const {
            label = '',
            id = '',
            name = '',
            required = false,
            className = '',
            options = [],
            defaultOption = '',
            errorId = '',
            onchange = null
        } = config;

        const container = document.createElement('div');
        container.className = 'mb-3';

        // Crear label
        if (label) {
            const labelElement = document.createElement('label');
            labelElement.htmlFor = id;
            labelElement.className = 'form-label';
            labelElement.innerHTML = label + (required ? ' <span class="required">*</span>' : '');
            container.appendChild(labelElement);
        }

        // Crear select
        const selectElement = document.createElement('select');
        selectElement.className = `form-select ${className}`.trim();
        if (id) selectElement.id = id;
        if (name) selectElement.name = name;
        if (required) selectElement.required = true;
        if (onchange) selectElement.addEventListener('change', onchange);

        // Opción por defecto
        if (defaultOption) {
            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.textContent = defaultOption;
            selectElement.appendChild(defaultOpt);
        }

        // Agregar opciones
        options.forEach(option => {
            const optElement = document.createElement('option');
            optElement.value = option.value;
            optElement.textContent = option.text;
            if (option.selected) optElement.selected = true;
            selectElement.appendChild(optElement);
        });

        container.appendChild(selectElement);

        // Crear div de error
        if (errorId) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.id = errorId;
            container.appendChild(errorDiv);
        }

        return container;
    }
}