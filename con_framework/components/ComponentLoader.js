/**
 * Clase encargada de gestionar la carga dinámica de los componentes
 * siguiendo la arquitectura **Atomic Design** (Átomos → Moléculas → Organismos → Templates → Páginas).
 * Permite:
 * - Cargar en orden todos los componentes necesarios.
 * - Cargar componentes bajo demanda.
 * - Verificar dependencias.
 * - Crear instancias de componentes de manera centralizada.
 * - Generar la página completa usando los componentes cargados.
 */
class ComponentLoader {
    constructor() {
        this.loadOrder = [
            // Átomos 
            'atoms/Button.js',
            'atoms/Input.js', 
            'atoms/Badge.js',
            
            // Moléculas (dependen de átomos)
            'molecules/Card.js',
            'molecules/Form.js',
            'molecules/Table.js',
            
            // Organismos (dependen de moléculas y átomos)
            'organisms/Header.js',
            'organisms/Sections.js',
            'organisms/Footer.js',
            
            // Templates (dependen de organismos)
            'templates/PageTemplate.js',
            
            // Páginas (dependen de todo)
            'pages/MainPage.js'
        ];

        this.loadedComponents = new Set();
        this.isLoading = false;
    }

    /**
     * Carga todos los componentes definidos en `loadOrder` en el orden establecido.
     * Evita llamadas concurrentes si ya hay una carga en curso.
     * @returns {Promise<void>}
     */
    async loadAllComponents() { // Carga todos los componentes en orden
        if (this.isLoading) return;
        this.isLoading = true;

        console.log('Iniciando carga de componentes Atomic Design...');

        try {
            for (const component of this.loadOrder) {
                await this.loadComponent(component);
            }

            console.log('Todos los componentes cargados exitosamente');
            this.initializeApplication();
            
        } catch (error) {
            console.error('Error cargando componentes:', error);
        } finally {
            this.isLoading = false;
        }
    }

    /**
    * Carga de manera asíncrona un único componente añadiendo
    * dinámicamente su `<script>` al documento.
    * @param {string} componentPath - Ruta relativa dentro de la carpeta `components/`.
    * @returns {Promise<void>} - Resuelve cuando el componente se ha cargado o si no existe.
    */
    async loadComponent(componentPath) { // Carga un componente individual
        const fullPath = `components/${componentPath}`;
        
        if (this.loadedComponents.has(fullPath)) {
            return; // Ya está cargado
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = fullPath;
            script.async = true;

            script.onload = () => {
                this.loadedComponents.add(fullPath);
                console.log(`✓ Componente cargado: ${componentPath}`);
                resolve();
            };

            script.onerror = () => {
                console.warn(`No se pudo cargar: ${componentPath} (puede no existir aún)`);
                // No rechazamos para permitir que continúe la carga
                resolve();
            };

            document.head.appendChild(script);
        });
    }

    /**
     * Inicializa la aplicación principal una vez que todos los componentes
     * han sido cargados. Crea una instancia de `MainPage` si está disponible
     * y expone los componentes a `window.AtomicComponents` para depuración.
     */
    initializeApplication() {
        // Inicializar la aplicación principal
        if (typeof MainPage !== 'undefined') {
            window.mainPage = new MainPage();
            window.mainPage.init();
            
            // Agregar funcionalidades basadas en componentes
            window.mainPage.addComponentBasedFeatures();
            
            console.log('Aplicación inicializada con Atomic Design');
        } else {
            console.warn('MainPage no está disponible');
        }

        // Hacer componentes globalmente accesibles para debugging
        window.AtomicComponents = {
            Button: typeof Button !== 'undefined' ? Button : null,
            Input: typeof Input !== 'undefined' ? Input : null,
            Badge: typeof Badge !== 'undefined' ? Badge : null,
            Card: typeof Card !== 'undefined' ? Card : null,
            Form: typeof Form !== 'undefined' ? Form : null,
            Table: typeof Table !== 'undefined' ? Table : null,
            Header: typeof Header !== 'undefined' ? Header : null,
            Sections: typeof Sections !== 'undefined' ? Sections : null,
            Footer: typeof Footer !== 'undefined' ? Footer : null,
            PageTemplate: typeof PageTemplate !== 'undefined' ? PageTemplate : null
        };
    }

    /**
     * Carga un componente específico bajo demanda y retorna su constructor global.
     * @param {string} componentName - Nombre del componente (ej: "Button", "Form").
     * @returns {Promise<Function|null>} Constructor del componente o `null` si no se encuentra.
     */
    async loadComponentOnDemand(componentName) {
        const componentMap = {
            'Button': 'atoms/Button.js',
            'Input': 'atoms/Input.js',
            'Badge': 'atoms/Badge.js',
            'Card': 'molecules/Card.js',
            'Form': 'molecules/Form.js',
            'Table': 'molecules/Table.js',
            'Header': 'organisms/Header.js',
            'Sections': 'organisms/Sections.js',
            'Footer': 'organisms/Footer.js',
            'PageTemplate': 'templates/PageTemplate.js',
            'MainPage': 'pages/MainPage.js'
        };

        const componentPath = componentMap[componentName];
        if (componentPath) {
            await this.loadComponent(componentPath);
            return window[componentName] || null;
        }

        return null;
    }

    /**
     * Verifica si las dependencias de cada componente están disponibles.
     * @returns {string[]} Lista de dependencias faltantes en formato legible.
     */
    checkDependencies() {
        const dependencies = {
            'Card': ['Button', 'Badge'],
            'Form': ['Input', 'Button'],
            'Sections': ['Card', 'Table', 'Form'],
            'PageTemplate': ['Header', 'Sections', 'Footer'],
            'MainPage': ['PageTemplate']
        };

        const missing = [];
        
        Object.entries(dependencies).forEach(([component, deps]) => {
            if (typeof window[component] !== 'undefined') {
                deps.forEach(dep => {
                    if (typeof window[dep] === 'undefined') {
                        missing.push(`${component} necesita ${dep}`);
                    }
                });
            }
        });

        if (missing.length > 0) {
            console.warn('Dependencias faltantes:', missing);
        }

        return missing;
    }

    /**
     * Crea una instancia de un componente atómico/molecular/organismo
     * usando un nombre genérico y su configuración.
     * @param {string} type - Tipo de componente (button, input, card, etc.).
     * @param {Object} [config={}] - Configuración a pasar al método `create` del componente.
     * @returns {HTMLElement|null} Elemento DOM generado o `null` si el tipo no es reconocido.
     */
    createComponent(type, config = {}) {
        const componentMap = {
            'button': () => Button?.create(config),
            'input': () => Input?.create(config), 
            'badge': () => Badge?.create(config),
            'card': () => Card?.create(config),
            'form': () => Form?.createContactForm(),
            'table': () => Table?.create(config),
            'header': () => Header?.create(config),
            'footer': () => Footer?.create(config)
        };

        const creator = componentMap[type.toLowerCase()];
        if (creator) {
            return creator();
        }

        console.error(`Tipo de componente no reconocido: ${type}`);
        return null;
    }

    /**
     * Genera la página completa usando la plantilla de componentes.
     * Limpia el `<body>` actual tras una confirmación del usuario.
     */
    generateFullPage() {
        if (typeof PageTemplate === 'undefined') {
            console.error('PageTemplate no está cargado');
            return;
        }

        console.log('Generando página completa usando componentes...');
        
        // Limpiar body actual (cuidado: esto removerá todo)
        const confirmGenerate = confirm('¿Deseas generar la página completa con componentes? Esto reemplazará el contenido actual.');
        
        if (confirmGenerate) {
            document.body.innerHTML = '';
            
            const fullPage = PageTemplate.createPersonalPortfolio();
            document.body.appendChild(fullPage);
            
            // Reinicializar aplicación
            this.initializeApplication();
            
            console.log('✅ Página generada completamente con componentes');
        }
    }

    /**
     * Obtiene estadísticas actuales sobre el estado de los componentes.
     * @returns {Object} Estadísticas de carga.
     */
    getStats() {
        return {
            totalComponents: this.loadOrder.length,
            loadedComponents: this.loadedComponents.size,
            availableComponents: Object.keys(window.AtomicComponents || {}).filter(key => 
                window.AtomicComponents[key] !== null
            ),
            missingDependencies: this.checkDependencies()
        };
    }
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.componentLoader = new ComponentLoader();
    
    // Cargar componentes automáticamente
    window.componentLoader.loadAllComponents();
    
    // Agregar método helper global
    window.createComponent = (type, config) => 
        window.componentLoader.createComponent(type, config);
        
    // Agregar comando de consola para estadísticas
    window.showComponentStats = () => {
        const stats = window.componentLoader.getStats();
        console.table(stats);
        return stats;
    };
    
    console.log('ComponentLoader listo. Usa showComponentStats() para ver el estado.');
});