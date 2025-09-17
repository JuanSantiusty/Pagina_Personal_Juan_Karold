class fachadaContacto{
    constructor(repo){
        this.repo = repo;
    }
    guardarContacto(datosFormulario){

    }
    listarContactos(){
        this.repo.getAll();
    }
    eliminarContacto(id){
        this.repo.remove(id);
    }
    borrarTodo(){
        this.repo.clear();
    }
    actualizarContacto(datosFormulario){
        
    }
}

const fachadaCon = new fachadaContacto(contactoRepo);