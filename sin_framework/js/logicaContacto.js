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
        const mensaje = document.getElementById('mensaje').value;
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