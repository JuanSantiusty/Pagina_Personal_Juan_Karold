/**
 * Clase para la creación y validación de formularios dinámicos.
 * Proporciona métodos de generación de campos (input, select, textarea, etc.)
 * y validación básica de datos de entrada.
 */

class Form {
    /**
     * Crea el formulario completo de contacto con todos los campos
     * (nombre, email, teléfono, asunto, preferencia de contacto, mensaje,
     * aceptación de términos y botón de envío).
     * @returns {HTMLFormElement} Elemento <form> listo para insertarse en el DOM.
     */
    static createContactForm() {
        const formElement = document.createElement('form');
        formElement.id = 'contacto_Form';
        formElement.className = 'contact-form';

        // Primera fila: Nombre y Email
        const row1 = document.createElement('div');
        row1.className = 'row';

        const col1 = document.createElement('div');
        col1.className = 'col-md-6';
        const nameInput = this.createInputField({
            type: 'text',
            label: 'Nombre completo',
            id: 'name',
            name: 'name',
            required: true,
            errorId: 'errorName'
        });
        col1.appendChild(nameInput);
        row1.appendChild(col1);

        const col2 = document.createElement('div');
        col2.className = 'col-md-6';
        const emailInput = this.createInputField({
            type: 'email',
            label: 'Correo electrónico',
            id: 'email',
            name: 'email',
            required: true,
            errorId: 'errorEmail'
        });
        col2.appendChild(emailInput);
        row1.appendChild(col2);

        formElement.appendChild(row1);

        // Segunda fila: Teléfono y Asunto
        const row2 = document.createElement('div');
        row2.className = 'row';

        const col3 = document.createElement('div');
        col3.className = 'col-md-6';
        const phoneInput = this.createInputField({
            type: 'tel',
            label: 'Teléfono',
            id: 'phone',
            name: 'phone',
            errorId: 'errorPhone'
        });
        col3.appendChild(phoneInput);
        row2.appendChild(col3);

        const col4 = document.createElement('div');
        col4.className = 'col-md-6';
        const subjectSelect = this.createSelectField({
            label: 'Asunto de contacto',
            id: 'subject',
            name: 'subject',
            required: true,
            defaultOption: 'Seleccionar asunto...',
            options: [
                { value: 'consulta', text: 'Consulta general' },
                { value: 'soporte', text: 'Soporte técnico' },
                { value: 'entrevista', text: 'Entrevista' },
                { value: 'colaboracion', text: 'Colaboración' },
                { value: 'otros', text: 'Otros' }
            ],
            errorId: 'errorSubject'
        });
        col4.appendChild(subjectSelect);
        row2.appendChild(col4);

        formElement.appendChild(row2);

        // Fieldset para preferencia de contacto
        const fieldset = this.createContactPreference();
        formElement.appendChild(fieldset);

        // Textarea para mensaje
        const messageInput = this.createTextareaField({
            label: 'Mensaje',
            id: 'mensaje',
            name: 'mensaje',
            rows: 5,
            placeholder: 'Escribe tu mensaje aquí...',
            errorId: 'errorMensaje'
        });
        formElement.appendChild(messageInput);

        // Checkbox para términos
        const termsDiv = this.createTermsCheckbox();
        formElement.appendChild(termsDiv);

        // Botón de envío
        const submitContainer = document.createElement('div');
        submitContainer.className = 'd-grid';
        
        const submitButton = this.createSubmitButton();
        submitContainer.appendChild(submitButton);
        formElement.appendChild(submitContainer);

        return formElement;
    }

    /**
     * Crea un campo de entrada de texto (input) genérico con etiqueta,
     * validación y contenedor de error.
     * @param {Object} config - Configuración del campo.
     * @param {string} [config.type='text'] - Tipo de input (text, email, tel, etc.).
     * @param {string} [config.label] - Texto de la etiqueta asociada.
     * @param {string} [config.id] - ID del input.
     * @param {string} [config.name] - Nombre del input.
     * @param {string} [config.placeholder] - Texto placeholder.
     * @param {boolean} [config.required=false] - Indica si el campo es obligatorio.
     * @param {string} [config.errorId] - ID del div para mostrar errores.
     * @param {string} [config.className] - Clases CSS adicionales.
     * @param {string} [config.value] - Valor inicial del input.
     * @returns {HTMLDivElement} Contenedor con label, input y feedback de error.
     */
    static createInputField(config = {}) {
        const {
            type = 'text',
            label = '',
            id = '',
            name = '',
            placeholder = '',
            required = false,
            errorId = '',
            className = '',
            value = ''
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

        // Crear input
        const inputElement = document.createElement('input');
        inputElement.type = type;
        inputElement.className = `form-control ${className}`.trim();
        inputElement.placeholder = placeholder;
        if (id) inputElement.id = id;
        if (name) inputElement.name = name;
        if (value) inputElement.value = value;
        if (required) inputElement.required = true;

        container.appendChild(inputElement);

        // Crear div de error
        if (errorId) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.id = errorId;
            container.appendChild(errorDiv);
        }

        return container;
    }

    /**
     * Crea un campo de selección (select) con opciones y validación.
     * @param {Object} config - Configuración del select.
     * @param {string} [config.label] - Texto de la etiqueta.
     * @param {string} [config.id] - ID del select.
     * @param {string} [config.name] - Nombre del select.
     * @param {boolean} [config.required=false] - Campo obligatorio.
     * @param {string} [config.className] - Clases CSS extra.
     * @param {Array<{value:string,text:string,selected?:boolean}>} [config.options] - Opciones disponibles.
     * @param {string} [config.defaultOption] - Texto de la opción por defecto.
     * @param {string} [config.errorId] - ID del div de error.
     * @returns {HTMLDivElement} Contenedor con label, select y feedback de error.
     */
    static createSelectField(config = {}) {
        const {
            label = '',
            id = '',
            name = '',
            required = false,
            className = '',
            options = [],
            defaultOption = '',
            errorId = ''
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

    /**
     * Crea un campo de texto multilínea (textarea) con validación.
     * @param {Object} config - Configuración del textarea.
     * @param {string} [config.label] - Etiqueta del campo.
     * @param {string} [config.id] - ID del textarea.
     * @param {string} [config.name] - Nombre del textarea.
     * @param {string} [config.placeholder] - Texto placeholder.
     * @param {number} [config.rows=3] - Número de filas visibles.
     * @param {boolean} [config.required=false] - Campo obligatorio.
     * @param {string} [config.errorId] - ID del div de error.
     * @param {string} [config.className] - Clases CSS extra.
     * @returns {HTMLDivElement} Contenedor con label, textarea y feedback de error.
     */
    static createTextareaField(config = {}) {
        const {
            label = '',
            id = '',
            name = '',
            placeholder = '',
            rows = 3,
            required = false,
            errorId = '',
            className = ''
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

        // Crear textarea
        const textareaElement = document.createElement('textarea');
        textareaElement.className = `form-control ${className}`.trim();
        textareaElement.placeholder = placeholder;
        textareaElement.rows = rows;
        if (id) textareaElement.id = id;
        if (name) textareaElement.name = name;
        if (required) textareaElement.required = true;

        container.appendChild(textareaElement);

        // Crear div de error
        if (errorId) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.id = errorId;
            container.appendChild(errorDiv);
        }

        return container;
    }

    /**
     * Crea un grupo de opciones tipo radio para elegir la preferencia de contacto.
     * @returns {HTMLFieldSetElement} Fieldset con las opciones de contacto (Email, Teléfono, WhatsApp).
     */
    static createContactPreference() {
        const fieldset = document.createElement('fieldset');
        fieldset.className = 'mb-3';

        const legend = document.createElement('legend');
        legend.className = 'form-label';
        legend.textContent = 'Preferencia de contacto';
        fieldset.appendChild(legend);

        const row = document.createElement('div');
        row.className = 'row';

        const options = [
            { id: 'contactEmail', value: 'Email', text: 'Correo electrónico', checked: true },
            { id: 'contactPhone', value: 'Telefono', text: 'Teléfono' },
            { id: 'contactWhatsapp', value: 'WhatsApp', text: 'WhatsApp' }
        ];

        options.forEach(option => {
            const col = document.createElement('div');
            col.className = 'col-md-4';

            const formCheck = document.createElement('div');
            formCheck.className = 'form-check';

            const input = document.createElement('input');
            input.className = 'form-check-input';
            input.type = 'radio';
            input.name = 'contactoOpcion';
            input.id = option.id;
            input.value = option.value;
            if (option.checked) input.checked = true;

            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.htmlFor = option.id;
            label.textContent = option.text;

            formCheck.appendChild(input);
            formCheck.appendChild(label);
            col.appendChild(formCheck);
            row.appendChild(col);
        });

        fieldset.appendChild(row);
        return fieldset;
    }

    /**
     * Crea el checkbox de aceptación de términos y condiciones.
     * Incluye link de términos y div para mostrar errores.
     * @returns {HTMLDivElement} Contenedor con checkbox y label.
     */
    static createTermsCheckbox() {
        const formCheck = document.createElement('div');
        formCheck.className = 'form-check mb-3';

        const input = document.createElement('input');
        input.className = 'form-check-input';
        input.type = 'checkbox';
        input.id = 'terms';
        input.name = 'terms';
        input.required = true;

        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.htmlFor = 'terms';
        label.innerHTML = `
            Acepto los <a href="#" class="text-primary">términos y condiciones</a> 
            y la política de privacidad <span class="required">*</span>
        `;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.id = 'errorTerms';

        formCheck.appendChild(input);
        formCheck.appendChild(label);
        formCheck.appendChild(errorDiv);

        return formCheck;
    }

    /**
     * Crea el botón de envío del formulario.
     * Si existe una clase global Button, la utiliza; de lo contrario, crea un botón HTML básico.
     * @returns {HTMLButtonElement} Botón de envío.
     */
    static createSubmitButton() {
        // Usar Button si está disponible, sino crear manualmente
        if (typeof Button !== 'undefined') {
            return Button.create({
                text: 'Enviar mensaje',
                type: 'submit',
                variant: 'primary',
                size: 'lg',
                icon: 'fas fa-paper-plane',
                id: 'enviarContacto'
            });
        } else {
            // Fallback si Button no está disponible
            const button = document.createElement('button');
            button.type = 'submit';
            button.id = 'enviarContacto';
            button.className = 'btn btn-primary btn-lg';
            button.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Enviar mensaje';
            return button;
        }
    }

    /**
     * Crea un formulario genérico a partir de una configuración de campos.
     * Permite definir distintos tipos de inputs, selects, textareas, etc.
     * @param {Object} config - Configuración del formulario.
     * @param {string} [config.id] - ID del formulario.
     * @param {string} [config.className] - Clases CSS del formulario.
     * @param {Array<Object>} [config.fields] - Lista de campos a crear.
     * @param {string} [config.submitText='Enviar'] - Texto del botón de envío.
     * @param {Function} [config.onSubmit] - Callback a ejecutar en el evento submit.
     * @returns {HTMLFormElement} Elemento <form> completamente armado.
     */
    static createGenericForm(config = {}) {
        const {
            id = '',
            className = '',
            fields = [],
            submitText = 'Enviar',
            onSubmit = null
        } = config;

        const formElement = document.createElement('form');
        if (id) formElement.id = id;
        formElement.className = className;

        // Agregar campos
        fields.forEach(field => {
            let fieldElement;

            switch (field.type) {
                case 'text':
                case 'email':
                case 'tel':
                case 'password':
                case 'number':
                    fieldElement = this.createInputField(field);
                    break;
                case 'textarea':
                    fieldElement = this.createTextareaField(field);
                    break;
                case 'select':
                    fieldElement = this.createSelectField(field);
                    break;
                case 'checkbox':
                    fieldElement = this.createCheckboxField(field);
                    break;
                case 'radio':
                    fieldElement = this.createRadioField(field);
                    break;
                default:
                    fieldElement = this.createInputField(field);
            }

            if (fieldElement) {
                formElement.appendChild(fieldElement);
            }
        });

        // Botón de envío
        const submitContainer = document.createElement('div');
        submitContainer.className = 'd-grid mt-3';

        const submitButton = typeof Button !== 'undefined' 
            ? Button.create({
                text: submitText,
                type: 'submit',
                variant: 'primary'
            })
            : (() => {
                const btn = document.createElement('button');
                btn.type = 'submit';
                btn.className = 'btn btn-primary';
                btn.textContent = submitText;
                return btn;
            })();

        submitContainer.appendChild(submitButton);
        formElement.appendChild(submitContainer);

        // Event listener para submit
        if (onSubmit) {
            formElement.addEventListener('submit', onSubmit);
        }

        return formElement;
    }

    /**
     * Crea un campo de tipo checkbox con etiqueta.
     * @param {Object} config - Configuración del checkbox.
     * @param {string} [config.label] - Texto de la etiqueta.
     * @param {string} [config.id] - ID del checkbox.
     * @param {string} [config.name] - Nombre del checkbox.
     * @param {boolean} [config.checked=false] - Estado inicial.
     * @param {boolean} [config.required=false] - Campo obligatorio.
     * @param {string} [config.className] - Clases CSS extra.
     * @returns {HTMLDivElement} Contenedor con checkbox y label.
     */
    static createCheckboxField(config = {}) {
        const {
            label = '',
            id = '',
            name = '',
            checked = false,
            required = false,
            className = ''
        } = config;

        const container = document.createElement('div');
        container.className = 'mb-3';

        const formCheck = document.createElement('div');
        formCheck.className = 'form-check';

        const input = document.createElement('input');
        input.className = 'form-check-input';
        input.type = 'checkbox';
        if (id) input.id = id;
        if (name) input.name = name;
        if (checked) input.checked = true;
        if (required) input.required = true;

        const labelElement = document.createElement('label');
        labelElement.className = 'form-check-label';
        if (id) labelElement.htmlFor = id;
        labelElement.innerHTML = label + (required ? ' <span class="required">*</span>' : '');

        formCheck.appendChild(input);
        formCheck.appendChild(labelElement);
        container.appendChild(formCheck);

        return container;
    }

    /**
     * Crea un grupo de botones de radio a partir de una lista de opciones.
     * @param {Object} config - Configuración del grupo de radio.
     * @param {string} [config.label] - Etiqueta del grupo.
     * @param {string} [config.name] - Nombre del grupo de radio.
     * @param {Array<{id?:string,value:string,text?:string,label?:string,checked?:boolean}>} [config.options] - Opciones disponibles.
     * @param {boolean} [config.required=false] - Si es obligatorio elegir una opción.
     * @returns {HTMLDivElement} Contenedor con opciones de radio.
     */
    static createRadioField(config = {}) {
        const {
            label = '',
            name = '',
            options = [],
            required = false
        } = config;

        const container = document.createElement('div');
        container.className = 'mb-3';

        if (label) {
            const labelElement = document.createElement('label');
            labelElement.className = 'form-label';
            labelElement.innerHTML = label + (required ? ' <span class="required">*</span>' : '');
            container.appendChild(labelElement);
        }

        options.forEach((option, index) => {
            const formCheck = document.createElement('div');
            formCheck.className = 'form-check';

            const input = document.createElement('input');
            input.className = 'form-check-input';
            input.type = 'radio';
            input.name = name;
            input.id = option.id || `${name}_${index}`;
            input.value = option.value;
            if (option.checked) input.checked = true;
            if (required) input.required = true;

            const optionLabel = document.createElement('label');
            optionLabel.className = 'form-check-label';
            optionLabel.htmlFor = input.id;
            optionLabel.textContent = option.text || option.label;

            formCheck.appendChild(input);
            formCheck.appendChild(optionLabel);
            container.appendChild(formCheck);
        });

        return container;
    }

    /**
     * Valida todos los campos requeridos de un formulario.
     * @param {HTMLFormElement} form - Formulario a validar.
     * @returns {boolean} true si todos los campos son válidos, false en caso contrario.
     */
    static validateForm(form) {
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
     * Valida un campo individual según su tipo y requisitos.
     * @param {HTMLElement} field - Campo de formulario a validar.
     * @returns {boolean} true si el campo es válido, false si no lo es.
     */
    static validateField(field) {
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
     * Muestra o limpia el mensaje de error para un campo dado.
     * Agrega o quita la clase 'is-invalid' según corresponda.
     * @param {HTMLElement} field - Campo de formulario.
     * @param {string} message - Mensaje de error a mostrar (vacío para limpiar).
     */
    static showFieldError(field, message) {
        const errorId = field.id ? `error${field.id.charAt(0).toUpperCase() + field.id.slice(1)}` : null;
        const errorElement = errorId ? document.getElementById(errorId) : null;
        
        if (errorElement) {
            errorElement.textContent = message;
            field.classList.toggle('is-invalid', !!message);
        }
    }
}