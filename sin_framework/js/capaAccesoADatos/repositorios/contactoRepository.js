class ContactoRepository {
    constructor(){
        this.repo = [];
    }
    getAll(){
        return this.repo;
    } 
    getById(id){
        return this.repo.find(c => c.id === id);
    } 
    add(contacto) {
        this.repo.push(contacto);
    }
    update(contacto){
        if((indice = this.indiceElemento(contacto.id)) > 0){
            this.repo[indice] = contacto;
        }
    }
    remove(id){
        if((indice = this.indiceElemento(id) > 0)){
            this.repo.splice(indice,1);
        }
    }
    clear(){
        this.repo.clear();
    }

    indiceElemento(id){
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