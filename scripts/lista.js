
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
          // Si o si tienen que ser de tipo numerico 
          const sizeNum = Number(apuntador.size);
          const tamNum = Number(tamproceso);
          if(apuntador.estado == "Disponible" && sizeNum >= tamNum){
              apuntador.estado = "Ocupado";
              apuntador.pid = pid;
              return true;
          }
          apuntador = apuntador.next;
        }
        return `Error: No hay suficiente memoria para crear el proceso ${pid}.`;
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
          if ( Number(bloque.size) >= Number(tamproceso)) {
              bloque.estado = "Ocupado";
              bloque.pid = pid;
              return true;
          }
        }
        return `Error: No hay suficiente memoria para crear el proceso ${pid}.`;
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
          if ( Number(bloque.size) >= Number(tamproceso)) {
              bloque.estado = "Ocupado";
              bloque.pid = pid;
              return true;
          }
        }
        return `Error: No hay suficiente memoria para crear el proceso ${pid}.`;
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
        console.log(`[Dinamica PrimerOrden] intentar insertar pid=${pid} size=${tamproceso}`);
        while(apuntador != null){
          const bloqueDec = Number(apuntador.dec);
          const bloqueSize = Number(apuntador.size);
          const tamNum = Number(tamproceso);
          console.log(`  -> revisar bloque dec=${bloqueDec} size=${bloqueSize} estado=${apuntador.estado}`);
          if(apuntador.estado == "Disponible" && bloqueSize >= tamNum){
              if(bloqueSize - tamNum > 0){
                const newDec = bloqueDec + tamNum;
                this.auxiliar = new Nodo("Disponible", newDec.toString(16).toUpperCase(), newDec, null, bloqueSize - tamNum);
                this.auxiliar.next = apuntador.next;
                apuntador.next = this.auxiliar;
                if(this.auxiliar.next == null){
                  this.ultimo = this.auxiliar;
                }
              }
              apuntador.estado = "Ocupado";
              apuntador.size = tamNum;
              apuntador.pid = pid;
              return true;
          }
          apuntador = apuntador.next;
        }
        console.log(` [Dinamica PrimerOrden] no se encontró bloque disponible para pid=${pid}`);
        return `Error: No hay suficiente memoria para crear el proceso ${pid}.`;
      break;
      case "MejorAjuste":
        console.log(`🔍 [Dinamica MejorAjuste] intentar insertar pid=${pid} size=${tamproceso}`);
        while(apuntador != null){
          bloques.push(apuntador);
          apuntador = apuntador.next;
        }
        bloques.sort((a, b) => Number(a.size) - Number(b.size));
        for (let bloque of bloques) {
          const bloqueSize = Number(bloque.size);
          const bloqueDec = Number(bloque.dec);
          console.log(`  -> candidato size=${bloqueSize} estado=${bloque.estado}`);
          if ( bloqueSize >= Number(tamproceso) && bloque.estado == "Disponible") {
              if(bloqueSize - Number(tamproceso) > 0){
                const newDec = bloqueDec + Number(tamproceso);
                this.auxiliar = new Nodo("Disponible", newDec.toString(16).toUpperCase(), newDec, null, bloqueSize - Number(tamproceso));
                this.auxiliar.next = bloque.next;
                bloque.next = this.auxiliar;
                if(this.auxiliar.next == null){
                  this.ultimo = this.auxiliar;
                }
              }
              bloque.estado = "Ocupado";
              bloque.size = Number(tamproceso);
              bloque.pid = pid;
              return true;
          }
        }
        console.log(`[Dinamica MejorAjuste] no se encontró bloque disponible para pid=${pid}`);
        return `Error: No hay suficiente memoria para crear el proceso ${pid}.`;
      break;
      case "PeorAjuste":
        console.log(`[Dinamica PeorAjuste] intentar insertar pid=${pid} size=${tamproceso}`);
        while(apuntador != null){
          bloques.push(apuntador);
          apuntador = apuntador.next;
        }
        bloques.sort((a, b) => Number(b.size) - Number(a.size));
        for (let bloque of bloques) {
          const bloqueSize = Number(bloque.size);
          const bloqueDec = Number(bloque.dec);
          console.log(`  -> candidato size=${bloqueSize} estado=${bloque.estado}`);
          if ( bloqueSize >= Number(tamproceso) && bloque.estado == "Disponible") {
              if(bloqueSize - Number(tamproceso) > 0){
                const newDec = bloqueDec + Number(tamproceso);
                this.auxiliar = new Nodo("Disponible", newDec.toString(16).toUpperCase(), newDec, null, bloqueSize - Number(tamproceso));
                this.auxiliar.next = bloque.next;
                bloque.next = this.auxiliar;
                if(this.auxiliar.next == null){
                  this.ultimo = this.auxiliar;
                }
              }
              bloque.estado = "Ocupado";
              bloque.size = Number(tamproceso);
              bloque.pid = pid;
              return true;
          }
        }
        console.log(`[Dinamica PeorAjuste] no se encontró bloque disponible para pid=${pid}`);
        return `Error: No hay suficiente memoria para crear el proceso ${pid}.`;
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
    let encontrado = false;
    let apuntador = this.head;
    while (apuntador) {
      if (apuntador.pid == pid) {
        apuntador.pid = null;
        apuntador.estado = "Disponible";
        encontrado = true;
        break;
      }
      apuntador = apuntador.next;
    }

    if (!encontrado) return; // no hace nada, literalmente no encuentra nada

    const nodosOcupados = [];
    let freeSpace = 0;
    apuntador = this.head;
    // La cabeza siempre siempre debe de ser el S.O
    let soNodo = null;
    while (apuntador) {
      if (apuntador.pid === "S.O") {
        soNodo = apuntador;
      } else if (apuntador.estado === "Ocupado") {
        nodosOcupados.push(apuntador);
      } else if (apuntador.estado === "Disponible") {
        freeSpace += Number(apuntador.size);
      }
      apuntador = apuntador.next;
    }

    this.head = soNodo;
    let cursor = this.head;
    if (!cursor) return; 

  let currentDec = Number(this.head.dec) || 0;
    this.head.previous = null;
    this.head.next = null;
    this.head.dec = currentDec;
    this.head.hex = currentDec.toString(16).toUpperCase();

  currentDec += Number(this.head.size);

    for (let nodo of nodosOcupados) {
  nodo.dec = currentDec;
  nodo.hex = currentDec.toString(16).toUpperCase();
  currentDec += Number(nodo.size);

      cursor.next = nodo;
      nodo.previous = cursor;
      cursor = nodo;
      cursor.next = null;
    }

    if (freeSpace > 0) {
      const nuevoLibre = new Nodo("Disponible", currentDec.toString(16).toUpperCase(), currentDec, null, Number(freeSpace));
      cursor.next = nuevoLibre;
      nuevoLibre.previous = cursor;
      this.ultimo = nuevoLibre;
    } else {
      // En caso de que no halla espacio libre, el último es el último ocupado
      this.ultimo = cursor;
    }
  }
}

console.log("Definición de las clases ListaEnlazada y Nodo cargadas.");
//module.exports = ListaEnlazada 
