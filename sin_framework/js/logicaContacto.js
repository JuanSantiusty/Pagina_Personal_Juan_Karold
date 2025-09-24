document.addEventListener('DOMContentLoaded',function(){
    console.log("DOM cargado")
    const formulario = document.getElementById('contacto_Form');

    formulario.addEventListener('submit',function(e){
        e.preventDefault();
        //Conseguir elementos
        console.log("Enviando Formulario")
        const nombre = document.getElementById('name').value;
        const correo = document.getElementById('email').value;
        const telefono = document.getElementById('phone').value;
        const asunto = document.getElementById('subject').value;
        const preferencia = document.querySelector('input[name="contactoOpcion"]:checked').value;
        const mensaje = document.getElementById('mensajeCon').value;
        console.log(mensaje)
        const terminos = document.getElementById('terms').checked;

                // Validar que los campos no estén vacíos
        if (!nombre || !correo || !telefono || !asunto || !mensaje) {
            console.log("Campos vacios")
            showToast('Se deben llenar todos los campos', 'error');
            return;
        }

        if (!terminos) {
            console.log("Falta terminos")
            showToast('Se deben aceptar los términos y condiciones', 'error');
            return;
        }
        const datosFormulario = {
            nombre: nombre ,
            correo: correo ,
            telefono: telefono,
            motivo: asunto,
            mensaje: mensaje,
            aceptaTerminos: terminos,
            preferenciaContacto: preferencia
        };
        try {
        const contactoGuardado = fachadaCon.guardarContacto(datosFormulario);
        showToast('Contacto guardado correctamente', 'success');
        console.log("Contacto guerdado")
        formulario.reset();
        // mostrarContactosEnTabla();
        } catch (error) {
        showToast('Error al guardar el contacto: ' + error.message, 'error');
        }
    });

    // Evento para los botones eliminar
    tablaContacto.addEventListener('click', function(e) {
        if (e.target.classList.contains('eliminarContactoBtn')) {
            const id = e.target.getAttribute('data-id');
            eliminarContactoEspecifico(id);
        }
    });

});

//Funcion para mostrar mensajes que se eliminar despues de 3 segudnos
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '10px 20px';
    toast.style.background = type === 'error' ? '#ff4444' : 
                            type === 'success' ? '#00C851' : '#33b5e5';
    toast.style.color = 'black';
    toast.style.borderRadius = '4px';
    toast.style.zIndex = '1000';
    
    document.body.appendChild(toast);
        // Eliminar después de 3 segundos
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

const actualizarTablaContacto = document.getElementById('actualizarContactos');
const eliminarContactos = document.getElementById('eliminarContactos');
const tablaContacto = document.getElementById('tablaContactos');

function crearLineaTabla(id, nombre, correo, telefono, mensaje){
    const fila = document.createElement('tr');
    fila.setAttribute('data-id', id); // Agregar atributo con el ID
    fila.innerHTML = `
    <td>${nombre}</td>
    <td>${correo}</td>
    <td>${telefono}</td>
    <td>${mensaje}</td>
    <td><button class="eliminarContactoBtn" data-id="${id}">Eliminar</button></td>
    `;
    tablaContacto.appendChild(fila);
}

function limpiarTabla(){
    let numFilas = tablaContacto.rows.length;
    while (numFilas > 1) {
            tablaContacto.deleteRow(numFilas -1 );
            numFilas--;
    }
}

actualizarTablaContacto.addEventListener('click',function(){
    limpiarTabla();
    const contactos = fachadaCon.listarContactos();
    for (const contacto of contactos) {
        crearLineaTabla(contacto.id,contacto.nombre,contacto.correo,contacto.telefono,contacto.mensaje);
    }
    showToast('Contactos Actualizados','success');
});

eliminarContactos.addEventListener('click',function(){
    bandera = confirm("¿ Esta seguro de eliminar todos los contactos ?");
    if(bandera){
        limpiarTabla();
        fachadaCon.borrarTodo();
        showToast('Contactos eliminados','success');
    }
})

//Funcion para eliminar una fila
function eliminarFila(id) {
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    if (fila) {
        fila.remove();
    }
}

// Función para eliminar contacto específico
function eliminarContactoEspecifico(id) {
    const confirmacion = confirm('¿Estás seguro de eliminar este contacto?');
    
    if (confirmacion) {
        try {
            fachadaCon.eliminarContacto(id);
            eliminarFila(id);
            showToast('Contacto eliminado correctamente', 'success');
        } catch (error) {
            showToast('Error al eliminar el contacto: ' + error.message, 'error');
        }
    }
}