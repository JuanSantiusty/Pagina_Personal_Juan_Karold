//** Repositorio que utiliza localStorage para guardar informacion de contacto */
class ContactoRepository {
    constructor(){
        this.claveContactos = "contactos"
        this.cargarAlmacenamiento();
    }

    //Cargar datos del LocalStorage a un array
    cargarAlmacenamiento(){
        const datos = localStorage.getItem(this.claveContactos);
        this.repo = datos ? JSON.parse(datos) : [];
    }

    //Guardar array en localStorage
    guardarAlmacenamiento(){
        localStorage.setItem(this.claveContactos,JSON.stringify(this.repo));
    }

    getAll(){
        this.cargarAlmacenamiento();
        return this.repo;
    } 
    getById(id){
        this.cargarAlmacenamiento();
        return this.repo.find(c => c.id === id);
    } 
    add(contacto) {
        this.cargarAlmacenamiento();
        this.repo.push(contacto);
        this.guardarAlmacenamiento();
    }
    update(contacto){
        this.cargarAlmacenamiento();
        let indiceActualizar = this.indiceElemento(contacto.id);
        if( indiceActualizar> 0){
            contacto.fechaCreacion = this.repo[indiceActualizar].fechaCreacion;
            this.repo[indiceActualizar] = contacto;
            this.guardarAlmacenamiento();
            return true;
        }
        return false;
    }
    remove(id){
        this.cargarAlmacenamiento();
        let indiceEliminar = this.indiceElemento(id)
        if( indiceEliminar !== -1){
            this.repo.splice(indiceEliminar,1);
            this.guardarAlmacenamiento();
            return true;
        }
        return false;
    }
    clear(){
        this.repo = []; 
        this.guardarAlmacenamiento();
    }

    indiceElemento(id){
        this.cargarAlmacenamiento();
        let indice = -1;
        for(let i = 0; i < this.repo.length; i++){
            // Convertir ambos a string para comparar
            if(String(this.repo[i].id) === String(id)){
                indice = i;
                break;
            }
        }
        return indice;
    }
}

const contactoRepo = new ContactoRepository();