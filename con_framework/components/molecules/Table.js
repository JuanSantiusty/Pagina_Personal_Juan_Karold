/**
 * Clase utilitaria para generar tablas dinámicas con Bootstrap y funcionalidades extendidas.
 * Permite crear tablas con encabezados, filas, badges, acciones y herramientas
 * como filtrado, ordenamiento y paginación.
 */
class Table {
    /**
     * Crea una tabla HTML dinámica con opciones de estilo y datos.
     * @param {Object} config - Configuración de la tabla.
     * @param {Array<string|Object>} [config.headers=[]] - Encabezados de la tabla. 
     *        Puede ser texto simple o un objeto { text, className, width }.
     * @param {Array<Array>} [config.rows=[]] - Filas de datos. Cada celda puede ser texto, 
     *        HTML, un objeto con propiedades { content, className, align }, o un elemento DOM.
     * @param {string} [config.className=''] - Clases adicionales para la tabla.
     * @param {boolean} [config.striped=true] - Aplica estilo rayado (striped).
     * @param {boolean} [config.hover=true] - Aplica estilo hover al pasar el ratón.
     * @param {boolean} [config.responsive=true] - Envuelve la tabla en un contenedor responsivo.
     * @param {boolean} [config.bordered=false] - Aplica bordes a la tabla.
     * @param {boolean} [config.dark=false] - Aplica tema oscuro.
     * @returns {HTMLElement} Tabla creada (o contenedor si es responsiva).
     */
    static create(config = {}) {
        const {
            headers = [],
            rows = [],
            className = '',
            striped = true,
            hover = true,
            responsive = true,
            bordered = false,
            dark = false
        } = config;

        const container = responsive ? document.createElement('div') : document.createDocumentFragment();
        if (responsive) container.className = 'table-responsive';

        const table = document.createElement('table');
        let tableClasses = 'table';
        if (striped) tableClasses += ' table-striped';
        if (hover) tableClasses += ' table-hover';
        if (bordered) tableClasses += ' table-bordered';
        if (dark) tableClasses += ' table-dark';
        
        table.className = `${tableClasses} ${className}`.trim();

        // Crear header si se proporciona
        if (headers.length > 0) {
            const thead = document.createElement('thead');
            thead.className = dark ? 'table-dark' : 'table-primary';
            
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.scope = 'col';
                
                if (typeof header === 'string') {
                    th.textContent = header;
                } else {
                    th.textContent = header.text || '';
                    if (header.className) th.className = header.className;
                    if (header.width) th.style.width = header.width;
                }
                
                headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
        }

        // Crear body si se proporcionan filas
        if (rows.length > 0) {
            const tbody = document.createElement('tbody');
            
            rows.forEach(rowData => {
                const tr = document.createElement('tr');
                
                rowData.forEach(cellData => {
                    const td = document.createElement('td');
                    
                    if (typeof cellData === 'string') {
                        td.innerHTML = cellData;
                    } else if (cellData.element) {
                        // Si es un elemento DOM
                        td.appendChild(cellData.element);
                    } else if (cellData.html) {
                        // Si contiene HTML
                        td.innerHTML = cellData.html;
                    } else {
                        // Si es un objeto con propiedades
                        td.innerHTML = cellData.content || cellData.text || '';
                        if (cellData.className) td.className = cellData.className;
                        if (cellData.align) td.style.textAlign = cellData.align;
                    }
                    
                    tr.appendChild(td);
                });
                
                tbody.appendChild(tr);
            });
            
            table.appendChild(tbody);
        }

        if (responsive) {
            container.appendChild(table);
            return container;
        } else {
            return table;
        }
    }

    /**
     * Crea una tabla de educación preconfigurada con datos de ejemplo.
     * Usa la clase Badge (si está disponible) para mostrar estados.
     * @returns {HTMLElement} Tabla de educación lista para insertar en el DOM.
     */
    static createEducationTable() {
        const headers = [
            'Nivel',
            'Institución', 
            'Años',
            'Ubicación',
            'Estado'
        ];
        
        // Usando Badge para los estados si está disponible
        const createStatusBadge = (status) => {
            if (typeof Badge !== 'undefined') {
                return Badge.createStatus(status);
            } else {
                // Fallback si Badge no está disponible
                const span = document.createElement('span');
                span.className = status === 'En curso' ? 'badge bg-success' : 'badge bg-primary';
                span.textContent = status;
                return span;
            }
        };
        
        const rows = [
            [
                'Universidad',
                'Universidad del Cauca - Ingeniería de Sistemas',
                '2021-2025',
                'Popayán, Colombia',
                { element: createStatusBadge('En curso') }
            ],
            [
                'Bachillerato',
                'Institución Educativa Normal Superior del Putumayo',
                '2015-2020',
                'Putumayo, Colombia',
                { element: createStatusBadge('Completado') }
            ],
            [
                'Primaria',
                'Institución Educativa Almirante Padilla',
                '2009-2014',
                'Putumayo, Colombia',
                { element: createStatusBadge('Completado') }
            ]
        ];

        return this.create({
            headers,
            rows,
            className: 'education-table'
        });
    }

    /**
     * Crea una tabla para mostrar proyectos.
     * @param {Array<Object>} projects - Lista de proyectos.
     * @param {string} [projects[].name] - Nombre del proyecto.
     * @param {Array<string>} [projects[].technologies] - Tecnologías usadas.
     * @param {string} [projects[].status] - Estado del proyecto (Ej: "En curso").
     * @param {string} [projects[].url] - URL para ver el proyecto.
     * @returns {HTMLElement} Tabla de proyectos.
     */
    static createProjectTable(projects = []) {
        const headers = [
            'Proyecto',
            'Tecnologías',
            'Estado',
            'Acciones'
        ];

        const rows = projects.map(project => [
            project.name || 'Sin nombre',
            {
                element: this.createTechnologiesList(project.technologies || [])
            },
            {
                element: typeof Badge !== 'undefined' 
                    ? Badge.createStatus(project.status || 'Pendiente')
                    : document.createTextNode(project.status || 'Pendiente')
            },
            {
                element: this.createActionButtons(project)
            }
        ]);

        return this.create({
            headers,
            rows,
            className: 'projects-table'
        });
    }

    /**
     * Crea una tabla para mostrar contactos.
     * @param {Array<Object>} contacts - Lista de contactos.
     * @param {string} [contacts[].name] - Nombre de la persona.
     * @param {string} [contacts[].email] - Correo electrónico.
     * @param {string} [contacts[].subject] - Asunto o motivo de contacto.
     * @param {number|Date} [contacts[].date] - Fecha de creación.
     * @returns {HTMLElement} Tabla de contactos.
     */
    static createContactTable(contacts = []) {
        const headers = [
            'Nombre',
            'Email',
            'Asunto',
            'Fecha',
            'Acciones'
        ];

        const rows = contacts.map(contact => [
            contact.name || 'Sin nombre',
            contact.email || 'Sin email',
            contact.subject || 'Sin asunto',
            new Date(contact.date || Date.now()).toLocaleDateString(),
            {
                element: this.createContactActions(contact)
            }
        ]);

        return this.create({
            headers,
            rows,
            className: 'contacts-table'
        });
    }

    /**
     * Genera una lista de tecnologías como elementos visuales (badges).
     * @param {Array<string>} technologies - Tecnologías a mostrar.
     * @returns {HTMLElement} Contenedor con badges de tecnologías.
     */
    static createTechnologiesList(technologies) {
        const container = document.createElement('div');
        
        technologies.forEach(tech => {
            if (typeof Badge !== 'undefined') {
                const badge = Badge.createTechnology(tech);
                container.appendChild(badge);
            } else {
                // Fallback
                const span = document.createElement('span');
                span.className = 'badge bg-secondary me-1';
                span.textContent = tech;
                container.appendChild(span);
            }
        });

        return container;
    }

    /**
     * Genera botones de acción (ver, editar) para un proyecto.
     * @param {Object} project - Proyecto asociado a las acciones.
     * @param {string} [project.url] - URL para abrir en nueva pestaña.
     * @returns {HTMLElement} Contenedor con botones de acción.
     */
    static createActionButtons(project) {
        const container = document.createElement('div');
        container.className = 'd-flex gap-2';

        // Botón ver
        const viewBtn = document.createElement('button');
        viewBtn.className = 'btn btn-sm btn-outline-primary';
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        viewBtn.title = 'Ver proyecto';
        viewBtn.onclick = () => {
            console.log('Ver proyecto:', project);
            if (project.url) {
                window.open(project.url, '_blank');
            }
        };

        // Botón editar
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-outline-secondary';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Editar proyecto';
        editBtn.onclick = () => {
            console.log('Editar proyecto:', project);
        };

        container.appendChild(viewBtn);
        container.appendChild(editBtn);

        return container;
    }

    /**
     * Genera botones de acción (responder, eliminar) para un contacto.
     * @param {Object} contact - Contacto asociado a las acciones.
     * @param {string} [contact.email] - Email para responder.
     * @param {string} [contact.subject] - Asunto del contacto.
     * @returns {HTMLElement} Contenedor con botones de acción.
     */
    static createContactActions(contact) {
        const container = document.createElement('div');
        container.className = 'd-flex gap-2';

        // Botón responder
        const replyBtn = document.createElement('button');
        replyBtn.className = 'btn btn-sm btn-outline-success';
        replyBtn.innerHTML = '<i class="fas fa-reply"></i>';
        replyBtn.title = 'Responder';
        replyBtn.onclick = () => {
            if (contact.email) {
                window.location.href = `mailto:${contact.email}?subject=Re: ${contact.subject}`;
            }
        };

        // Botón eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-outline-danger';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Eliminar';
        deleteBtn.onclick = () => {
            if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
                console.log('Eliminar contacto:', contact);
                // Aquí iría la lógica de eliminación
            }
        };

        container.appendChild(replyBtn);
        container.appendChild(deleteBtn);

        return container;
    }

    /**
     * Aplica un filtro a una columna de una tabla existente.
     * @param {HTMLTableElement} table - Tabla a filtrar.
     * @param {number} columnIndex - Índice de la columna a filtrar (0-based).
     * @param {string} filterValue - Texto a buscar (insensible a mayúsculas).
     * @returns {void}
     */
    static addFilter(table, columnIndex, filterValue) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.forEach(row => {
            const cell = row.cells[columnIndex];
            if (cell) {
                const cellText = cell.textContent.toLowerCase();
                const shouldShow = cellText.includes(filterValue.toLowerCase());
                row.style.display = shouldShow ? '' : 'none';
            }
        });
    }

    /**
     * Ordena las filas de una tabla por una columna específica.
     * @param {HTMLTableElement} table - Tabla a ordenar.
     * @param {number} columnIndex - Índice de la columna para el orden.
     * @param {boolean} [ascending=true] - `true` para ascendente, `false` para descendente.
     * @returns {void}
     */
    static sortTable(table, columnIndex, ascending = true) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((a, b) => {
            const aText = a.cells[columnIndex]?.textContent || '';
            const bText = b.cells[columnIndex]?.textContent || '';

            if (ascending) {
                return aText.localeCompare(bText);
            } else {
                return bText.localeCompare(aText);
            }
        });

        // Reorganizar las filas
        rows.forEach(row => tbody.appendChild(row));
    }

    /**
     * Agrega controles de paginación a una tabla.
     * @param {HTMLTableElement} table - Tabla a paginar.
     * @param {number} [rowsPerPage=10] - Cantidad de filas por página.
     * @returns {HTMLElement} Contenedor con los botones de paginación.
     */
    static addPagination(table, rowsPerPage = 10) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        let currentPage = 0;

        const showPage = (pageNumber) => {
            const start = pageNumber * rowsPerPage;
            const end = start + rowsPerPage;

            rows.forEach((row, index) => {
                row.style.display = (index >= start && index < end) ? '' : 'none';
            });
        };

        // Crear controles de paginación
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'd-flex justify-content-center mt-3';

        const totalPages = Math.ceil(rows.length / rowsPerPage);

        for (let i = 0; i < totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'btn btn-outline-primary me-2';
            pageBtn.textContent = i + 1;
            pageBtn.onclick = () => {
                currentPage = i;
                showPage(currentPage);
                
                // Actualizar botón activo
                paginationContainer.querySelectorAll('.btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                pageBtn.classList.add('active');
            };

            if (i === 0) pageBtn.classList.add('active');
            paginationContainer.appendChild(pageBtn);
        }

        // Insertar después de la tabla
        table.parentNode.insertBefore(paginationContainer, table.nextSibling);
        
        // Mostrar primera página
        showPage(0);

        return paginationContainer;
    }
}