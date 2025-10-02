
class Nodo {
  constructor(disponible, hex, dec, pid, size) {
    this.hex = hex;
    this.dec = dec;
    this.disponible = disponible; //Disponible, ocupado
    this.pid = pid;
    this.size = size;
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

  insertar(disponible, hex, dec, pid, size) {
    if (this.listaVacia()) {
      this.head = new Nodo(disponible, hex, dec, pid, size);
      this.ultimo = this.head;
      return;
    }
    let nuevo = new Nodo(disponible, hex, dec, pid, size);
    this.ultimo.next = this.nuevo;
    this.ultimo = nuevo;
  }

  insertarProcesoFijo(pid, tamproceso, algoritmo){
    this.apuntador = this.head;
    let bloques = [];
    switch(algoritmo){
      case "PrimerOrden":
        while(this.apuntador != null){
          if(this.apuntador.estado == "Disponible" && this.apuntador.size >= tamproceso){
              this.apuntador.estado = "Ocupado";
              this.apuntador.pid = pid;
              break;
          }
          this.apuntador = this.apuntador.next;
        }
      break;
      case "MejorAjuste":
        while(this.apuntador != null){
          if (this.apuntador.estado == "Disponible") {
            bloques.push(this.apuntador);
          }
          this.apuntador = this.apuntador.next;
        }
        bloques.sort((a, b) => a.size - b.size);
        for (let bloque of bloques) {
          if ( bloque.size >= tamproceso) {
              bloque.estado = "Ocupado";
              bloque.pid = pid;
              break;
          }
        }
      break;
      case "PeorAjuste":
        while(this.apuntador != null){
          if (this.apuntador.estado == "Disponible") {
            bloques.push(this.apuntador);
          }
          this.apuntador = this.apuntador.next;
        }
        bloques.sort((a, b) => b.size - a.size);
        for (let bloque of bloques) {
          if ( bloque.size >= tamproceso) {
              bloque.estado = "Ocupado";
              bloque.pid = pid;
              break;
          }
        }
      break;
      default:
        return "Error: Algoritmo no reconocido";
      break;
    }
  }

  insertarProcesoDinamico(pid, tamproceso, algoritmo){
    this.apuntador = this.head;
    let bloques = [];
    switch(algoritmo){
      case "PrimerOrden":
        while(this.apuntador != null){
          if(this.apuntador.estado == "Disponible" && this.apuntador.size >= tamproceso){
              this.auxiliar = new Nodo("Disponible", (this.apuntador.dec - tamproceso).toString(16).toUpperCase(), this.apuntador.dec - tamproceso, null, this.apuntador.size - tamproceso);
              this.apuntador.estado = "Ocupado";
              this.apuntador.hex = (tamproceso).toString(16).toUpperCase();
              this.apuntador.dec = tamproceso;
              this.apuntador.size = tamproceso;
              this.apuntador.pid = pid;
              this.auxiliar.next = this.apuntador.next;
              this.apuntador.next = this.auxiliar;
              if(this.auxiliar.next == null){
                this.ultimo = this.auxiliar;
              }
              break;
          }
          this.apuntador = this.apuntador.next;
        }
      break;
      case "MejorAjuste":
        while(this.apuntador != null){
          bloques.push(this.apuntador);
          this.apuntador = this.apuntador.next;
        }
        bloques.sort((a, b) => a.size - b.size);
        for (let bloque of bloques) {
          if ( bloque.size >= tamproceso && bloque.estado == "Disponible") {
              this.auxiliar = new Nodo("Disponible", (bloque.dec - tamproceso).toString(16).toUpperCase(), bloque.dec - tamproceso, null, bloque.size - tamproceso);
              bloque.estado = "Ocupado";
              bloque.hex = (tamproceso).toString(16).toUpperCase();
              bloque.dec = tamproceso;
              bloque.size = tamproceso;
              bloque.pid = pid;
              this.auxiliar.next = bloque.next;
              bloque.next = this.auxiliar;
              if(this.auxiliar.next == null){
                this.ultimo = this.auxiliar;
              }
              break;
          }
        }
      break;
      case "PeorAjuste":
        while(this.apuntador != null){
          bloques.push(this.apuntador);
          this.apuntador = this.apuntador.next;
        }
        bloques.sort((a, b) => b.size - a.size);
        for (let bloque of bloques) {
          if ( bloque.size >= tamproceso && bloque.estado == "Disponible") {
              this.auxiliar = new Nodo("Disponible", (bloque.dec - tamproceso).toString(16).toUpperCase(), bloque.dec - tamproceso, null, bloque.size - tamproceso);
              bloque.estado = "Ocupado";
              bloque.hex = (tamproceso).toString(16).toUpperCase();
              bloque.dec = tamproceso;
              bloque.size = tamproceso;
              bloque.pid = pid;
              this.auxiliar.next = bloque.next;
              bloque.next = this.auxiliar;
              if(this.auxiliar.next == null){
                this.ultimo = this.auxiliar;
              }
              break;
          }
        }
      break;
      default:
        return "Error: Algoritmo no reconocido";
    }
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
    this.apuntador = this.head.next;
    this.anterior = this.head;
    while(this.apuntador != null){
      if(this.apuntador.pid == pid){
        if(this.apuntador.next != null && this.apuntador.next.estado == "Disponible"){
          this.apuntador.size += this.apuntador.next.size;
          this.apuntador.next = this.apuntador.next.next;

        }
        if(this.anterior.estado == "Disponible"){
          this.anterior.size += this.apuntador.size;
          this.anterior.next = this.apuntador.next;
          break;
        }
        this.apuntador.pid = null;
        this.apuntador.estado = "Disponible";
        break;
      }
      this.anterior = this.apuntador;
      this.apuntador = this.apuntador.next;
    }
  }
  
  eliminarDinamicoConCompactacion(pid){
    this.apuntador = this.head.next;
    this.anterior = this.head;
    while(this.apuntador != null){
      if(this.apuntador.pid == pid){
        this.anterior.next = this.apuntador.next;
        if(this.ultimo.estado == "Disponible"){
          this.ultimo.size += this.apuntador.size;

        } 
        else{
          this.ultimo.next = this.apuntador;
          this.ultimo = this.apuntador;
        }
        this.apuntador.pid = null;
        this.apuntador.estado = "Disponible";
        break;
      }
      this.anterior = this.apuntador;
      this.apuntador = this.apuntador.next;
    }
  }
}