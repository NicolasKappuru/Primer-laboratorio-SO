
class Nodo {
  constructor(disponible, hex, dec, pid, size) {
    this.hex = hex;
    this.dec = dec;
    this.estado = disponible; //Disponible, ocupado
    this.pid = pid;
    this.size = size; //Tamaño de la particion
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
    this.ultimo.next = nuevo;
    this.ultimo = nuevo;
  }

  insertarProcesoFijo(pid, tamproceso, algoritmo){
    let apuntador = this.head;
    let bloques = [];
    switch(algoritmo){
      case "PrimerOrden":
        while(apuntador != null){
          if(apuntador.estado == "Disponible" && apuntador.size >= tamproceso){
              apuntador.estado = "Ocupado";
              apuntador.pid = pid;
              break;
          }
          apuntador = apuntador.next;
        }
      break;
      case "MejorAjuste":
        while(apuntador != null){
          if (apuntador.estado == "Disponible") {
            bloques.push(apuntador);
          }
          apuntador = apuntador.next;
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
        while(apuntador != null){
          if (apuntador.estado == "Disponible") {
            bloques.push(apuntador);
          }
          apuntador = apuntador.next;
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
    let apuntador = this.head;
    let bloques = [];
    switch(algoritmo){
      case "PrimerOrden":
        while(apuntador != null){
          if(apuntador.estado == "Disponible" && apuntador.size >= tamproceso){
              this.auxiliar = new Nodo("Disponible", (apuntador.dec - tamproceso).toString(16).toUpperCase(), apuntador.dec - tamproceso, null, apuntador.size - tamproceso);
              apuntador.estado = "Ocupado";
              apuntador.hex = (tamproceso).toString(16).toUpperCase();
              apuntador.dec = tamproceso;
              apuntador.size = tamproceso;
              apuntador.pid = pid;
              this.auxiliar.next = apuntador.next;
              apuntador.next = this.auxiliar;
              if(this.auxiliar.next == null){
                this.ultimo = this.auxiliar;
              }
              break;
          }
          apuntador = apuntador.next;
        }
      break;
      case "MejorAjuste":
        while(apuntador != null){
          bloques.push(apuntador);
          apuntador = apuntador.next;
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
        while(apuntador != null){
          bloques.push(apuntador);
          apuntador = apuntador.next;
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
    let apuntador = this.head;
    while(apuntador != null){
        if(apuntador.pid == pid){
            apuntador.estado = "Disponible";
            apuntador.pid = null;
            break;
        }
        apuntador = apuntador.next;
    }
    return "Error: El proceso no existe";
  }


  eliminarDinamicoSinCompactacion(pid){
    let apuntador = this.head.next;
    let anterior = this.head;
    while(apuntador != null){
      if(apuntador.pid == pid){
        if(apuntador.next != null && apuntador.next.estado == "Disponible"){
          apuntador.size += apuntador.next.size;
          apuntador.next = apuntador.next.next;

        }
        if(anterior.estado == "Disponible"){
          anterior.size += apuntador.size;
          anterior.next = apuntador.next;
          break;
        }
        apuntador.pid = null;
        apuntador.estado = "Disponible";
        break;
      }
      anterior = apuntador;
      apuntador = apuntador.next;
    }
  }
  
  eliminarDinamicoConCompactacion(pid){
    let apuntador = this.head.next;
    let anterior = this.head;
    while(apuntador != null){
      if(apuntador.pid == pid){
        anterior.next = apuntador.next;
        if(this.ultimo.estado == "Disponible"){
          this.ultimo.size += apuntador.size;

        } 
        else{
          this.ultimo.next = apuntador;
          this.ultimo = apuntador;
        }
        apuntador.pid = null;
        apuntador.estado = "Disponible";
        break;
      }
      anterior = apuntador;
      apuntador = apuntador.next;
    }
  }
}

console.log("📌 Definición de las clases ListaEnlazada y Nodo cargadas.");
//module.exports = ListaEnlazada 
