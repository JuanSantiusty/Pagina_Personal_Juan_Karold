/**
 * ContactRepository - Maneja la persistencia de contactos en localStorage
 * Patrón: Repository Pattern
 */
class ContactRepository {
    constructor() {
        this.storageKey = 'contactos';
        this.initializeStorage();
    }

    /**
     * Inicializa el almacenamiento si no existe
     */
    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    /**
     * Obtiene todos los contactos del localStorage
     * @returns {Array<Contacto>} Array de contactos
     */
    getAll() {
        try {
            const data = localStorage.getItem(this.storageKey);
            const contactsData = JSON.parse(data) || [];
            return contactsData.map(contactData => Contacto.fromJSON(contactData));
        } catch (error) {
            console.error('Error al obtener contactos:', error);
            this.handleStorageError();
            return [];
        }
    }

    /**
     * Obtiene un contacto por su ID
     * @param {string} id ID del contacto
     * @returns {Contacto|null} Contacto encontrado o null
     */
    getById(id) {
        try {
            const contacts = this.getAll();
            return contacts.find(contact => contact.id === id) || null;
        } catch (error) {
            console.error('Error al obtener contacto por ID:', error);
            return null;
        }
    }

    /**
     * Busca contactos por criterios
     * @param {object} criteria Criterios de búsqueda
     * @returns {Array<Contacto>} Array de contactos que coinciden
     */
    findBy(criteria) {
        try {
            const contacts = this.getAll();
            return contacts.filter(contact => {
                return Object.keys(criteria).every(key => {
                    if (typeof criteria[key] === 'string') {
                        return contact[key] && contact[key].toLowerCase().includes(criteria[key].toLowerCase());
                    }
                    return contact[key] === criteria[key];
                });
            });
        } catch (error) {
            console.error('Error en búsqueda:', error);
            return [];
        }
    }

    /**
     * Agrega un nuevo contacto
     * @param {Contacto} contacto Contacto a agregar
     * @returns {boolean} true si se agregó correctamente
     */
    add(contacto) {
        try {
            if (!(contacto instanceof Contacto)) {
                throw new Error('El objeto debe ser una instancia de Contacto');
            }

            // Validar el contacto antes de guardarlo
            const validation = contacto.validate();
            if (!validation.isValid) {
                throw new Error('Contacto inválido: ' + validation.errors.map(e => e.message).join(', '));
            }

            // Verificar que no exista un contacto con el mismo ID
            if (this.getById(contacto.id)) {
                throw new Error('Ya existe un contacto con el mismo ID');
            }

            const contacts = this.getAll();
            contacts.push(contacto);
            this.saveToStorage(contacts);
            
            console.log('Contacto agregado:', contacto.getSummary());
            return true;
        } catch (error) {
            console.error('Error al agregar contacto:', error);
            throw error;
        }
    }

    /**
     * Actualiza un contacto existente
     * @param {Contacto} contacto Contacto a actualizar
     * @returns {boolean} true si se actualizó correctamente
     */
    update(contacto) {
        try {
            if (!(contacto instanceof Contacto)) {
                throw new Error('El objeto debe ser una instancia de Contacto');
            }

            // Validar el contacto antes de actualizarlo
            const validation = contacto.validate();
            if (!validation.isValid) {
                throw new Error('Contacto inválido: ' + validation.errors.map(e => e.message).join(', '));
            }

            const contacts = this.getAll();
            const index = contacts.findIndex(c => c.id === contacto.id);
            
            if (index === -1) {
                throw new Error('Contacto no encontrado');
            }

            // Actualizar fecha de modificación
            contacto.touch();
            contacts[index] = contacto;
            this.saveToStorage(contacts);
            
            console.log('Contacto actualizado:', contacto.getSummary());
            return true;
        } catch (error) {
            console.error('Error al actualizar contacto:', error);
            throw error;
        }
    }

    /**
     * Elimina un contacto por su ID
     * @param {string} id ID del contacto a eliminar
     * @returns {boolean} true si se eliminó correctamente
     */
    remove(id) {
        try {
            const contacts = this.getAll();
            const index = contacts.findIndex(contact => contact.id === id);
            
            if (index === -1) {
                throw new Error('Contacto no encontrado');
            }

            const removedContact = contacts[index];
            contacts.splice(index, 1);
            this.saveToStorage(contacts);
            
            console.log('Contacto eliminado:', removedContact.getSummary());
            return true;
        } catch (error) {
            console.error('Error al eliminar contacto:', error);
            throw error;
        }
    }

    /**
     * Elimina todos los contactos
     * @returns {boolean} true si se eliminaron correctamente
     */
    clear() {
        try {
            const count = this.getAll().length;
            localStorage.setItem(this.storageKey, JSON.stringify([]));
            console.log(`${count} contactos eliminados`);
            return true;
        } catch (error) {
            console.error('Error al limpiar contactos:', error);
            throw error;
        }
    }

    /**
     * Cuenta el número total de contactos
     * @returns {number} Número de contactos
     */
    count() {
        try {
            return this.getAll().length;
        } catch (error) {
            console.error('Error al contar contactos:', error);
            return 0;
        }
    }

    /**
     * Verifica si existe un contacto con el email dado
     * @param {string} email Email a verificar
     * @param {string} excludeId ID a excluir de la búsqueda (para actualizaciones)
     * @returns {boolean} true si existe
     */
    existsByEmail(email, excludeId = null) {
        try {
            const contacts = this.getAll();
            return contacts.some(contact => 
                contact.email.toLowerCase() === email.toLowerCase() && 
                contact.id !== excludeId
            );
        } catch (error) {
            console.error('Error al verificar email:', error);
            return false;
        }
    }

    /**
     * Obtiene estadísticas de los contactos
     * @returns {object} Objeto con estadísticas
     */
    getStats() {
        try {
            const contacts = this.getAll();
            const stats = {
                total: contacts.length,
                bySubject: {},
                byContactPreference: {},
                recentContacts: 0
            };

            // Estadísticas por asunto
            contacts.forEach(contact => {
                // Por asunto
                stats.bySubject[contact.asunto] = (stats.bySubject[contact.asunto] || 0) + 1;
                
                // Por preferencia de contacto
                stats.byContactPreference[contact.preferenciaContacto] = 
                    (stats.byContactPreference[contact.preferenciaContacto] || 0) + 1;
                
                // Contactos recientes (últimas 24 horas)
                const created = new Date(contact.fechaCreacion);
                const now = new Date();
                const diffHours = (now - created) / (1000 * 60 * 60);
                if (diffHours <= 24) {
                    stats.recentContacts++;
                }
            });

            return stats;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return {
                total: 0,
                bySubject: {},
                byContactPreference: {},
                recentContacts: 0
            };
        }
    }

    /**
     * Exporta todos los contactos a JSON
     * @returns {string} JSON string con todos los contactos
     */
    exportToJSON() {
        try {
            const contacts = this.getAll();
            return JSON.stringify(contacts.map(c => c.toJSON()), null, 2);
        } catch (error) {
            console.error('Error al exportar:', error);
            throw error;
        }
    }

    /**
     * Importa contactos desde JSON
     * @param {string} jsonString JSON string con contactos
     * @returns {object} Resultado de la importación
     */
    importFromJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (!Array.isArray(data)) {
                throw new Error('El JSON debe contener un array de contactos');
            }

            const currentContacts = this.getAll();
            let imported = 0;
            let skipped = 0;
            let errors = [];

            data.forEach((contactData, index) => {
                try {
                    const contacto = Contacto.fromJSON(contactData);
                    const validation = contacto.validate();
                    
                    if (!validation.isValid) {
                        errors.push(`Contacto ${index + 1}: ${validation.errors.map(e => e.message).join(', ')}`);
                        return;
                    }

                    // Verificar si ya existe
                    if (this.getById(contacto.id)) {
                        skipped++;
                        return;
                    }

                    currentContacts.push(contacto);
                    imported++;
                } catch (error) {
                    errors.push(`Contacto ${index + 1}: ${error.message}`);
                }
            });

            this.saveToStorage(currentContacts);

            return {
                imported,
                skipped,
                errors,
                total: data.length
            };
        } catch (error) {
            console.error('Error al importar:', error);
            throw error;
        }
    }

    /**
     * Guarda el array de contactos en localStorage
     * @param {Array<Contacto>} contacts Array de contactos
     */
    saveToStorage(contacts) {
        try {
            const data = contacts.map(contact => contact.toJSON());
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                throw new Error('Espacio de almacenamiento insuficiente. Considere usar IndexedDB para mayor capacidad.');
            }
            throw error;
        }
    }

    /**
     * Maneja errores de almacenamiento reinicializando si es necesario
     */
    handleStorageError() {
        console.warn('Reinicializando almacenamiento debido a errores...');
        try {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        } catch (error) {
            console.error('No se pudo reinicializar el almacenamiento:', error);
        }
    }

    /**
     * Verifica la integridad del almacenamiento
     * @returns {object} Resultado de la verificación
     */
    checkIntegrity() {
        try {
            const contacts = this.getAll();
            let valid = 0;
            let invalid = 0;
            let duplicates = 0;
            const seen = new Set();
            const errors = [];

            contacts.forEach((contact, index) => {
                // Verificar duplicados
                if (seen.has(contact.id)) {
                    duplicates++;
                    errors.push(`Contacto duplicado en índice ${index}: ${contact.id}`);
                    return;
                }
                seen.add(contact.id);

                // Verificar validez
                const validation = contact.validate();
                if (validation.isValid) {
                    valid++;
                } else {
                    invalid++;
                    errors.push(`Contacto inválido en índice ${index}: ${validation.errors.map(e => e.message).join(', ')}`);
                }
            });

            return {
                total: contacts.length,
                valid,
                invalid,
                duplicates,
                errors
            };
        } catch (error) {
            console.error('Error al verificar integridad:', error);
            return {
                total: 0,
                valid: 0,
                invalid: 0,
                duplicates: 0,
                errors: ['Error al acceder al almacenamiento']
            };
        }
    }

    /**
     * Obtiene información sobre el uso del almacenamiento
     * @returns {object} Información del almacenamiento
     */
    getStorageInfo() {
        try {
            const data = localStorage.getItem(this.storageKey);
            const sizeBytes = new Blob([data]).size;
            const sizeKB = Math.round(sizeBytes / 1024 * 100) / 100;
            const sizeMB = Math.round(sizeKB / 1024 * 100) / 100;

            // Estimación del límite de localStorage (usualmente ~5MB)
            const estimatedLimit = 5 * 1024; // KB
            const usagePercentage = Math.round((sizeKB / estimatedLimit) * 100);

            return {
                sizeBytes,
                sizeKB,
                sizeMB,
                usagePercentage,
                shouldConsiderIndexedDB: usagePercentage > 70
            };
        } catch (error) {
            console.error('Error al obtener información de almacenamiento:', error);
            return {
                sizeBytes: 0,
                sizeKB: 0,
                sizeMB: 0,
                usagePercentage: 0,
                shouldConsiderIndexedDB: false
            };
        }
    }
}