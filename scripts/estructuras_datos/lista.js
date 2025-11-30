
class Nodo {
  constructor(disponible, hex, dec, pid, size) {
    this.hex = hex;
    this.dec = dec;
    this.estado = disponible; //Disponible, ocupado
    this.pid = pid;
    this.size = size; //Tamaño de la particion
    this.tam_proceso = 0;
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
              apuntador.tam_proceso = tamproceso;
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
              bloque.tam_proceso = tamproceso;
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
              bloque.tam_proceso = tamproceso;
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
              if(apuntador.size - tamproceso > 0){
                this.auxiliar = new Nodo("Disponible", (apuntador.dec + tamproceso).toString(16).toUpperCase(), apuntador.dec + tamproceso, null, apuntador.size - tamproceso);
                this.auxiliar.next = apuntador.next;
                apuntador.next = this.auxiliar;
                if(this.auxiliar.next == null){
                  this.ultimo = this.auxiliar;
                }
              }
              apuntador.estado = "Ocupado";
              apuntador.size = tamproceso;
              apuntador.pid = pid;
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
              if(bloque.size - tamproceso > 0){
                this.auxiliar = new Nodo("Disponible", (bloque.dec + tamproceso).toString(16).toUpperCase(), bloque.dec + tamproceso, null, bloque.size - tamproceso);
                this.auxiliar.next = bloque.next;
                bloque.next = this.auxiliar;
                if(this.auxiliar.next == null){
                  this.ultimo = this.auxiliar;
                }
              }
              bloque.estado = "Ocupado";
              bloque.size = tamproceso;
              bloque.pid = pid;
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
              if(bloque.size - tamproceso > 0){
                this.auxiliar = new Nodo("Disponible", (bloque.dec + tamproceso).toString(16).toUpperCase(), bloque.dec + tamproceso, null, bloque.size - tamproceso);
                this.auxiliar.next = bloque.next;
                bloque.next = this.auxiliar;
                if(this.auxiliar.next == null){
                  this.ultimo = this.auxiliar;
                }
              }
              bloque.estado = "Ocupado";
              bloque.size = tamproceso;
              bloque.pid = pid;
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
    // Primero marcamos el bloque como disponible (si existe)
    let encontrado = false;
    let actual = this.head;
    while (actual) {
      if (actual.pid == pid) {
        actual.pid = null;
        actual.estado = "Disponible";
        encontrado = true;
        break;
      }
      actual = actual.next;
    }

    if (!encontrado) return; // nada que hacer

    // Ahora compactamos: dejamos el bloque S.O al inicio, mantenemos el orden relativo de los ocupados
    // y agrupamos todo el espacio libre en un único bloque al final.
    const nodosOcupados = [];
    let freeSpace = 0;
    actual = this.head;
    // Suponemos que la cabeza es S.O y debe conservarse en primer lugar
    let soNodo = null;
    while (actual) {
      if (actual.pid === "S.O") {
        soNodo = actual;
      } else if (actual.estado === "Ocupado") {
        nodosOcupados.push(actual);
      } else if (actual.estado === "Disponible") {
        freeSpace += actual.size;
      }
      actual = actual.next;
    }

    // Reconstruir la lista: soNodo -> nodosOcupados... -> disponible(final)
    // Reset enlaces
    this.head = soNodo;
    let cursor = this.head;
    if (!cursor) return; // protección

    // Reasignar direcciones (dec/hex) desde 0: soNodo mantiene su dec (asumimos 0)
    let currentDec = this.head.dec || 0;
    this.head.previous = null;
    this.head.next = null;
    // Si soNodo no estaba en head original (por seguridad), aseguramos su tamaño/dec
    this.head.dec = currentDec;
    this.head.hex = currentDec.toString(16).toUpperCase();

    // Avanzar a la siguiente dirección
    currentDec += this.head.size;

    for (let nodo of nodosOcupados) {
      // ajustar dec/hex
      nodo.dec = currentDec;
      nodo.hex = currentDec.toString(16).toUpperCase();
      currentDec += nodo.size;

      // enlazar
      cursor.next = nodo;
      nodo.previous = cursor;
      cursor = nodo;
      cursor.next = null;
    }

    // Crear o anexar el bloque disponible final
    if (freeSpace > 0) {
      const nuevoLibre = new Nodo("Disponible", currentDec.toString(16).toUpperCase(), currentDec, null, freeSpace);
      cursor.next = nuevoLibre;
      nuevoLibre.previous = cursor;
      this.ultimo = nuevoLibre;
    } else {
      // No hay espacio libre restante
      this.ultimo = cursor;
    }
  }
}

//console.log("📌 Definición de las clases ListaEnlazada y Nodo cargadas.");
//module.exports = ListaEnlazada 
