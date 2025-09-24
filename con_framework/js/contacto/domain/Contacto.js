/**
 * Clase Contacto - Representa un contacto del formulario
 * Patrón: Domain Object
 */
class Contacto {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.nombre = data.nombre || '';
        this.email = data.email || '';
        this.telefono = data.telefono || '';
        this.asunto = data.asunto || '';
        this.mensaje = data.mensaje || '';
        this.preferenciaContacto = data.preferenciaContacto || 'Email';
        this.aceptaTerminos = data.aceptaTerminos || false;
        this.fechaCreacion = data.fechaCreacion || new Date().toISOString();
        this.fechaActualizacion = data.fechaActualizacion || new Date().toISOString();
    }

    /**
     * Genera un ID único para el contacto
     * @returns {string} ID único basado en timestamp y número aleatorio
     */
    generateId() {
        return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Actualiza la fecha de modificación
     */
    touch() {
        this.fechaActualizacion = new Date().toISOString();
    }

    /**
     * Valida que los datos del contacto sean correctos
     * @returns {object} Objeto con isValid (boolean) y errors (array)
     */
    validate() {
        const errors = [];

        // Validación del nombre
        if (!this.nombre || this.nombre.trim().length === 0) {
            errors.push({ field: 'nombre', message: 'El nombre es obligatorio' });
        } else if (this.nombre.trim().length < 2) {
            errors.push({ field: 'nombre', message: 'El nombre debe tener al menos 2 caracteres' });
        } else if (this.nombre.trim().length > 100) {
            errors.push({ field: 'nombre', message: 'El nombre no puede exceder 100 caracteres' });
        }

        // Validación del email
        if (!this.email || this.email.trim().length === 0) {
            errors.push({ field: 'email', message: 'El correo electrónico es obligatorio' });
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email.trim())) {
                errors.push({ field: 'email', message: 'El formato del correo electrónico no es válido' });
            }
        }

        // Validación del teléfono (opcional pero si se proporciona debe ser válido)
        if (this.telefono && this.telefono.trim().length > 0) {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
            if (!phoneRegex.test(this.telefono.trim())) {
                errors.push({ field: 'telefono', message: 'El formato del teléfono no es válido' });
            }
        }

        // Validación del asunto
        if (!this.asunto || this.asunto.trim().length === 0) {
            errors.push({ field: 'asunto', message: 'Debe seleccionar un asunto de contacto' });
        }

        // Validación del mensaje (opcional)
        if (this.mensaje && this.mensaje.trim().length > 1000) {
            errors.push({ field: 'mensaje', message: 'El mensaje no puede exceder 1000 caracteres' });
        }

        // Validación de términos y condiciones
        if (!this.aceptaTerminos) {
            errors.push({ field: 'terms', message: 'Debe aceptar los términos y condiciones' });
        }

        // Validación de preferencia de contacto
        const preferencasValidas = ['Email', 'Telefono', 'WhatsApp'];
        if (!preferencasValidas.includes(this.preferenciaContacto)) {
            errors.push({ field: 'preferenciaContacto', message: 'Debe seleccionar una preferencia de contacto válida' });
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Convierte el objeto a JSON para almacenamiento
     * @returns {object} Objeto plano para serialización
     */
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre.trim(),
            email: this.email.trim().toLowerCase(),
            telefono: this.telefono.trim(),
            asunto: this.asunto,
            mensaje: this.mensaje.trim(),
            preferenciaContacto: this.preferenciaContacto,
            aceptaTerminos: this.aceptaTerminos,
            fechaCreacion: this.fechaCreacion,
            fechaActualizacion: this.fechaActualizacion
        };
    }

    /**
     * Crea una instancia de Contacto desde datos JSON
     * @param {object} jsonData Datos del contacto en formato JSON
     * @returns {Contacto} Nueva instancia de Contacto
     */
    static fromJSON(jsonData) {
        return new Contacto(jsonData);
    }

    /**
     * Compara dos contactos para verificar si son iguales
     * @param {Contacto} otroContacto Otro contacto para comparar
     * @returns {boolean} true si son iguales, false en caso contrario
     */
    equals(otroContacto) {
        if (!(otroContacto instanceof Contacto)) {
            return false;
        }

        return this.id === otroContacto.id;
    }

    /**
     * Crea una copia del contacto
     * @returns {Contacto} Nueva instancia con los mismos datos
     */
    clone() {
        return new Contacto(this.toJSON());
    }

    /**
     * Obtiene una representación en texto del contacto
     * @returns {string} Representación legible del contacto
     */
    toString() {
        return `Contacto: ${this.nombre} (${this.email}) - ${this.asunto}`;
    }

    /**
     * Obtiene el tiempo transcurrido desde la creación
     * @returns {string} Tiempo transcurrido en formato legible
     */
    getTimeAgo() {
        const now = new Date();
        const created = new Date(this.fechaCreacion);
        const diffTime = Math.abs(now - created);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

        if (diffDays > 0) {
            return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
        } else if (diffHours > 0) {
            return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        } else if (diffMinutes > 0) {
            return `hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
        } else {
            return 'hace un momento';
        }
    }

    /**
     * Verifica si el contacto fue modificado después de su creación
     * @returns {boolean} true si fue modificado, false en caso contrario
     */
    wasModified() {
        return this.fechaCreacion !== this.fechaActualizacion;
    }

    /**
     * Obtiene un resumen corto del contacto
     * @returns {object} Objeto con información resumida
     */
    getSummary() {
        return {
            id: this.id,
            nombre: this.nombre,
            email: this.email,
            asunto: this.asunto,
            fechaCreacion: this.getTimeAgo(),
            wasModified: this.wasModified()
        };
    }
}