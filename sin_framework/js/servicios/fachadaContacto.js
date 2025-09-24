class fachadaContacto{
    constructor(repo){
        this.repo = repo;
    }
    guardarContacto(datosFormulario){
        //Crear contacto con datos del formulaio
        const nuevoContacto = new Contacto(
            Date.now(),
            datosFormulario.nombre,
            datosFormulario.correo,
            datosFormulario.telefono,
            datosFormulario.motivo,
            datosFormulario.mensaje,
            datosFormulario.aceptaTerminos,
            datosFormulario.preferenciaContacto,
            new Date().toISOString(), // fechaCreación
            new Date().toISOString()  // fechaActualización
        )

        this.repo.add(nuevoContacto);
        return nuevoContacto;
    }
    listarContactos(){
        return this.repo.getAll();
    }
    eliminarContacto(id){
        return this.repo.remove(id);
    }
    borrarTodo(){
        this.repo.clear();
    }
    actualizarContacto(datosFormulario){
        const actualizarContacto = new Contacto(
            datosFormulario.id,
            datosFormulario.nombre,
            datosFormulario.correo,
            datosFormulario.telefono,
            datosFormulario.motivo,
            datosFormulario.mensaje,
            datosFormulario.aceptaTerminos,
            datosFormulario.preferenciaContacto,
            new Date().toISOString(), // fechaCreación
            new Date().toISOString()  // fechaActualización
        )
        return this.repo.update(actualizarContacto);
    }
}

const fachadaCon = new fachadaContacto(contactoRepo);