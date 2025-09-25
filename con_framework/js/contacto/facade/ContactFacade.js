/**
 * ContactFacade - Fachada para simplificar el acceso a la funcionalidad de contactos
 * Patrón: Facade Pattern
 */
class ContactFacade {
    constructor() {
        this.repository = new ContactRepository();
        this.initializeEventListeners();
    }

    /**
     * Inicializa los event listeners del formulario
     */
    initializeEventListeners() {
        // Event listener para el formulario
        const form = document.getElementById('contacto_Form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Event listeners para validación en tiempo real
        this.setupRealTimeValidation();

        // Cargar contactos al inicializar
        this.listarContactos();
    }

    /**
     * Configura la validación en tiempo real de los campos
     */
    setupRealTimeValidation() {
        const fields = ['name', 'email', 'phone', 'subject', 'mensaje'];
        
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', () => this.clearFieldError(fieldName));
            }
        });

        // Validación especial para términos
        const termsField = document.getElementById('terms');
        if (termsField) {
            termsField.addEventListener('change', () => this.validateField('terms'));
        }
    }

    /**
     * Maneja el envío del formulario
     * @param {Event} event Evento del formulario
     */
    async handleFormSubmit(event) {
        event.preventDefault();
        
        try {
            const formData = this.getFormData();
            const success = await this.guardarContacto(formData);
            
            if (success) {
                this.showSuccess('¡Contacto guardado exitosamente!');
                this.resetForm();
                this.listarContactos();
            }
        } catch (error) {
            this.showError('Error al guardar el contacto: ' + error.message);
        }
    }

    /**
     * Obtiene los datos del formulario
     * @returns {object} Datos del formulario
     */
    getFormData() {
        const form = document.getElementById('contacto_Form');
        const formData = new FormData(form);
        
        return {
            nombre: formData.get('name'),
            email: formData.get('email'),
            telefono: formData.get('phone'),
            asunto: formData.get('subject'),
            mensaje: formData.get('mensaje'),
            preferenciaContacto: formData.get('contactoOpcion'),
            aceptaTerminos: formData.has('terms')
        };
    }

    /**
     * Guarda un contacto usando los datos del formulario
     * @param {object} datosFormulario Datos del formulario
     * @returns {boolean} true si se guardó correctamente
     */
    async guardarContacto(datosFormulario) {
        try {
            // Validar formulario completo
            const validationResult = this.validateForm(datosFormulario);
            if (!validationResult.isValid) {
                this.displayValidationErrors(validationResult.errors);
                throw new Error('Por favor corrija los errores en el formulario');
            }

            // Crear contacto
            const contacto = new Contacto(datosFormulario);
            
            // Verificar si ya existe un contacto con el mismo email
            if (this.repository.existsByEmail(contacto.email)) {
                throw new Error('Ya existe un contacto con ese correo electrónico');
            }

            // Guardar en repositorio
            this.repository.add(contacto);
            
            // Mostrar estadísticas actualizadas
            this.updateStorageStats();
            
            return true;
        } catch (error) {
            console.error('Error en guardarContacto:', error);
            throw error;
        }
    }

    /**
     * Lista todos los contactos guardados
     */
    listarContactos() {
        try {
            const contacts = this.repository.getAll();
            this.renderContactList(contacts);
            this.updateContactCounter(contacts.length);
        } catch (error) {
            console.error('Error al listar contactos:', error);
            this.showError('Error al cargar la lista de contactos');
        }
    }

    /**
     * Elimina un contacto por ID
     * @param {string} id ID del contacto a eliminar
     */
    eliminarContacto(id) {
        try {
            // Confirmar eliminación
            if (!confirm('¿Está seguro de que desea eliminar este contacto?')) {
                return;
            }

            const success = this.repository.remove(id);
            
            if (success) {
                this.showSuccess('Contacto eliminado correctamente');
                this.listarContactos();
                this.updateStorageStats();
            }
        } catch (error) {
            console.error('Error al eliminar contacto:', error);
            this.showError('Error al eliminar el contacto: ' + error.message);
        }
    }

    /**
     * Borra todos los contactos
     */
    borrarTodo() {
        try {
            // Confirmar eliminación masiva
            const count = this.repository.count();
            if (count === 0) {
                this.showInfo('No hay contactos para eliminar');
                return;
            }

            if (!confirm(`¿Está seguro de que desea eliminar todos los ${count} contactos? Esta acción no se puede deshacer.`)) {
                return;
            }

            const success = this.repository.clear();
            
            if (success) {
                this.showSuccess('Todos los contactos han sido eliminados');
                this.listarContactos();
                this.updateStorageStats();
            }
        } catch (error) {
            console.error('Error al borrar todos los contactos:', error);
            this.showError('Error al eliminar los contactos: ' + error.message);
        }
    }

    /**
     * Busca contactos por criterio
     * @param {string} searchTerm Término de búsqueda
     */
    buscarContactos(searchTerm) {
        try {
            if (!searchTerm || searchTerm.trim().length === 0) {
                this.listarContactos();
                return;
            }

            const allContacts = this.repository.getAll();
            const filteredContacts = allContacts.filter(contact => 
                contact.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.asunto.toLowerCase().includes(searchTerm.toLowerCase())
            );

            this.renderContactList(filteredContacts);
            this.updateContactCounter(filteredContacts.length, `Resultados para "${searchTerm}"`);
        } catch (error) {
            console.error('Error en búsqueda:', error);
            this.showError('Error al buscar contactos');
        }
    }

    /**
     * Valida todo el formulario
     * @param {object} data Datos a validar
     * @returns {object} Resultado de validación
     */
    validateForm(data) {
        const errors = [];

        // Crear contacto temporal para validación
        const tempContact = new Contacto(data);
        const validation = tempContact.validate();

        return validation;
    }

    /**
     * Valida un campo específico
     * @param {string} fieldName Nombre del campo
     * @returns {boolean} true si es válido
     */
    validateField(fieldName) {
        const field = document.getElementById(fieldName === 'terms' ? 'terms' : fieldName);
        if (!field) return true;

        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                const name = field.value.trim();
                if (!name) {
                    isValid = false;
                    errorMessage = 'El nombre es obligatorio';
                } else if (name.length < 2) {
                    isValid = false;
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                } else if (name.length > 100) {
                    isValid = false;
                    errorMessage = 'El nombre no puede exceder 100 caracteres';
                }
                break;

            case 'email':
                const email = field.value.trim();
                if (!email) {
                    isValid = false;
                    errorMessage = 'El correo electrónico es obligatorio';
                } else {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        isValid = false;
                        errorMessage = 'El formato del correo electrónico no es válido';
                    }
                }
                break;

            case 'phone':
                const phone = field.value.trim();
                if (phone) {
                    const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
                    if (!phoneRegex.test(phone)) {
                        isValid = false;
                        errorMessage = 'El formato del teléfono no es válido';
                    }
                }
                break;

            case 'subject':
                if (!field.value || field.value.trim() === '') {
                    isValid = false;
                    errorMessage = 'Debe seleccionar un asunto de contacto';
                }
                break;

            case 'mensaje':
                const message = field.value.trim();
                if (message && message.length > 1000) {
                    isValid = false;
                    errorMessage = 'El mensaje no puede exceder 1000 caracteres';
                }
                break;

            case 'terms':
                if (!field.checked) {
                    isValid = false;
                    errorMessage = 'Debe aceptar los términos y condiciones';
                }
                break;
        }

        this.showFieldValidation(fieldName, isValid, errorMessage);
        return isValid;
    }

    /**
     * Muestra el estado de validación de un campo
     * @param {string} fieldName Nombre del campo
     * @param {boolean} isValid Si es válido
     * @param {string} errorMessage Mensaje de error
     */
    showFieldValidation(fieldName, isValid, errorMessage) {
        const field = document.getElementById(fieldName === 'terms' ? 'terms' : fieldName);
        const errorDiv = document.getElementById(`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);

        if (!field) return;

        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            if (errorDiv) {
                errorDiv.textContent = '';
                errorDiv.style.display = 'none';
            }
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            if (errorDiv) {
                errorDiv.textContent = errorMessage;
                errorDiv.style.display = 'block';
            }
        }
    }

    /**
     * Limpia el error de un campo
     * @param {string} fieldName Nombre del campo
     */
    clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorDiv = document.getElementById(`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);

        if (field) {
            field.classList.remove('is-invalid');
        }
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    /**
     * Muestra errores de validación en el formulario
     * @param {Array} errors Array de errores
     */
    displayValidationErrors(errors) {
        errors.forEach(error => {
            this.showFieldValidation(error.field, false, error.message);
        });
    }

    /**
     * Renderiza la lista de contactos
     * @param {Array<Contacto>} contacts Array de contactos
     */
    renderContactList(contacts) {
        const container = document.getElementById('listaContactos');
        if (!container) return;

        if (contacts.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="fas fa-inbox fa-3x mb-3"></i>
                    <p>No hay contactos guardados</p>
                </div>
            `;
            return;
        }

        const contactsHtml = contacts.map(contact => `
            <div class="contact-item" data-id="${contact.id}">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="mb-1">${this.escapeHtml(contact.nombre)}</h6>
                    <div class="contact-actions">
                        <button class="btn btn-sm btn-outline-danger" onclick="contactFacade.eliminarContacto('${contact.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="contact-details">
                    <small class="text-muted d-block">
                        <i class="fas fa-envelope me-1"></i>${this.escapeHtml(contact.email)}
                    </small>
                    ${contact.telefono ? `<small class="text-muted d-block">
                        <i class="fas fa-phone me-1"></i>${this.escapeHtml(contact.telefono)}
                    </small>` : ''}
                    <small class="text-muted d-block">
                        <i class="fas fa-tag me-1"></i>${this.escapeHtml(contact.asunto)}
                    </small>
                    <small class="text-muted d-block">
                        <i class="fas fa-clock me-1"></i>${contact.getTimeAgo()}
                    </small>
                    <small class="text-muted d-block">
                        <i class="fas fa-comment me-1"></i>${this.escapeHtml(contact.preferenciaContacto)}
                    </small>
                    ${contact.mensaje ? `<small class="text-muted d-block mt-1">
                        <i class="fas fa-message me-1"></i>${this.escapeHtml(contact.mensaje.substring(0, 100))}${contact.mensaje.length > 100 ? '...' : ''}
                    </small>` : ''}
                </div>
            </div>
        `).join('');

        container.innerHTML = contactsHtml;
    }

    /**
     * Actualiza el contador de contactos
     * @param {number} count Número de contactos
     * @param {string} label Etiqueta personalizada
     */
    updateContactCounter(count, label = null) {
        // Podrías agregar un elemento para mostrar el contador
        console.log(label || `Total de contactos: ${count}`);
    }

    /**
     * Actualiza las estadísticas de almacenamiento
     */
    updateStorageStats() {
        try {
            const stats = this.repository.getStats();
            const storageInfo = this.repository.getStorageInfo();
            
            console.log('Estadísticas:', stats);
            console.log('Almacenamiento:', storageInfo);

            // Advertir si el almacenamiento está llegando al límite
            if (storageInfo.shouldConsiderIndexedDB) {
                this.showWarning(`El almacenamiento está al ${storageInfo.usagePercentage}% de capacidad. Considere usar IndexedDB para mayor capacidad.`);
            }
        } catch (error) {
            console.error('Error al actualizar estadísticas:', error);
        }
    }

    /**
     * Resetea el formulario
     */
    resetForm() {
        const form = document.getElementById('contacto_Form');
        if (form) {
            form.reset();
            
            // Limpiar validaciones
            const fields = form.querySelectorAll('.form-control, .form-select, .form-check-input');
            fields.forEach(field => {
                field.classList.remove('is-valid', 'is-invalid');
            });

            // Limpiar mensajes de error
            const errorDivs = form.querySelectorAll('.invalid-feedback');
            errorDivs.forEach(div => {
                div.textContent = '';
                div.style.display = 'none';
            });
        }
    }

    /**
     * Escapa HTML para prevenir XSS
     * @param {string} text Texto a escapar
     * @returns {string} Texto escapado
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Muestra mensaje de éxito
     * @param {string} message Mensaje
     */
    showSuccess(message) {
        this.showToast(message, 'success');
    }

    /**
     * Muestra mensaje de error
     * @param {string} message Mensaje
     */
    showError(message) {
        this.showToast(message, 'error');
    }

    /**
     * Muestra mensaje de información
     * @param {string} message Mensaje
     */
    showInfo(message) {
        this.showToast(message, 'info');
    }

    /**
     * Muestra mensaje de advertencia
     * @param {string} message Mensaje
     */
    showWarning(message) {
        this.showToast(message, 'warning');
    }

    /**
     * Muestra un toast usando Toastify
     * @param {string} message Mensaje
     * @param {string} type Tipo de mensaje
     */
    showToast(message, type) {
        if (typeof Toastify !== 'undefined') {
            const colors = {
                success: '#198754',
                error: '#dc3545',
                info: '#0dcaf0',
                warning: '#ffc107'
            };

            Toastify({
                text: message,
                duration: 4000,
                gravity: "top",
                position: "right",
                backgroundColor: colors[type] || colors.info,
                close: true,
                stopOnFocus: true
            }).showToast();
        } else {
            // Fallback a alert si Toastify no está disponible
            alert(message);
        }
    }

    /**
     * Exporta contactos
     */
    exportarContactos() {
        try {
            const jsonData = this.repository.exportToJSON();
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `contactos_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showSuccess('Contactos exportados exitosamente');
        } catch (error) {
            console.error('Error al exportar:', error);
            this.showError('Error al exportar contactos');
        }
    }

    /**
     * Obtiene estadísticas para mostrar
     * @returns {object} Estadísticas formateadas
     */
    getDisplayStats() {
        try {
            const stats = this.repository.getStats();
            const storageInfo = this.repository.getStorageInfo();
            
            return {
                ...stats,
                storage: storageInfo
            };
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return null;
        }
    }
}

// Crear instancia global de la fachada
const contactFacade = new ContactFacade();