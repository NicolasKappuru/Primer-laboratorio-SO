
class Nodo {
  constructor(disponible, hex, dec, pid, tam) {
    this.hex = hex;
    this.dec = dec;
    this.disponible = disponible; //Disponible, ocupado
    this.pid = pid;
    this.size = tam;
    this.previous = null;
    this.next = null;
  }
}

class ListaEnlazada {
  constructor() {
    this.head = null;
    this.ultimo = null;
  }

  listaVacia(){
    if(this.head == null) return true;
  }

  insertar(disponible, hex, dec, pid) {
    if (this.listaVacia()) {
      this.head = new Nodo(disponible, hex, dec, pid);
      this.ultimo = this.head;
      return;
    }
    let nuevo = new Nodo(disponible, hex, dec, pid);
    this.ultimo.next = this.nuevo;
    this.ultimo = nuevo;
  }

  insertarProceso(pid, tam){
    this.apuntador = this.head;
    while(this.apuntador != null){
        if(this.apuntador.estado == "Disponible" && this.apuntador.size >= tam){
            this.apuntador.estado = "Ocupado";
            this.apuntador.pid = pid;
            break;
        }
        this.apuntador = this.apuntador.next;
    }
    return "Error: No hay espacio suficiente o el proceso es muy grande xD";
  }

  eliminarFijo(pid) {
    this.apuntador = this.head;
    while(this.apuntador != null){
        if(this.apuntador.pid == pid){
            this.apuntador.estado = "Disponible";
            this.apuntador.pid = null;
            break;
        }
        this.apuntador = this.apuntador.next;
    }
    return "Error: El proceso no existe";
  }


  eliminarDinamicoSinCompactacion(pid){
    


  }
    eliminarDinamicoConCompactacion(pid){


    }
}