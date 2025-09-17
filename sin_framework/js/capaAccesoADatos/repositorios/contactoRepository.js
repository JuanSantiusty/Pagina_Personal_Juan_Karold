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
        if((indice = this.indiceElemento(contacto.id)) > 0){
            contacto.fechaCreacion = this.repo[indice].fechaCreacion;
            this.repo[indice] = contacto;
            this.guardarAlmacenamiento();
            return true;
        }
        return false;
    }
    remove(id){
        this.cargarAlmacenamiento();
        if((indice = this.indiceElemento(id) > 0)){
            this.repo.splice(indice,1);
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
        indice = -1;
        for(i=0;i<this.repo.length;i++){
            if(this.repo[i].id === id){
                indice = i;
                break;
            }
        }
        return indice;
    }
}

const contactoRepo = new ContactoRepository();