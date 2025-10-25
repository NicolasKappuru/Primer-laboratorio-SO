
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


const ListaSegmentos = require('./lista_segmentos.js');

class ListaSegmentacion{
  constructor() {
    this.listaSegmentos = new ListaSegmentos()
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

  insertarSegmentacion(num_segmento, tam_segm, tipo, tam_max, pid, algoritmo, permiso){
    let tam_anterior = 0
    do{
      tam_anterior = tam_segm
      if(tam_segm>tam_max){
        this.insertarProcesoDinamico(pid, tam_max, algoritmo, permiso, tipo, num_segmento)
        tam_segm -= tam_max;
      }else{
        this.insertarProcesoDinamico(pid, tam_segm, algoritmo, permiso, tipo, num_segmento)
      }
      num_segmento += 1;

    }while(tam_anterior>tam_max)
    return num_segmento
  }

  insertarProcesoDinamico(pid, tamproceso, algoritmo, permiso, tipo, num_segmento){
    let apuntador = this.head;
    let bloques = [];
    let decimal = 0;
    //let pid_tipo = pid+"("+tipo+")";
    switch(algoritmo){
      case "PrimerOrden":
        while(apuntador != null){
          if(apuntador.estado == "Disponible" && apuntador.size >= tamproceso){
              if(apuntador.size - tamproceso > 0){
                decimal = apuntador.dec;
                this.auxiliar = new Nodo("Disponible", (decimal + tamproceso).toString(16).toUpperCase(), apuntador.dec + tamproceso, null, apuntador.size - tamproceso);
                this.auxiliar.next = apuntador.next;
                apuntador.next = this.auxiliar;
                if(this.auxiliar.next == null){
                  this.ultimo = this.auxiliar;
                }
              }
              apuntador.estado = "Ocupado";
              apuntador.size = tamproceso;
              apuntador.pid = pid;
              //apuntador.pid = pid_tipo;
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
                decimal = bloque.dec
                this.auxiliar = new Nodo("Disponible", (decimal + tamproceso).toString(16).toUpperCase(), decimal + tamproceso, null, bloque.size - tamproceso);
                this.auxiliar.next = bloque.next;
                bloque.next = this.auxiliar;
                if(this.auxiliar.next == null){
                  this.ultimo = this.auxiliar;
                }
              }
              bloque.estado = "Ocupado";
              bloque.size = tamproceso;
              bloque.pid = pid;
              //bloque.pid = pid_tipo;
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
                decimal = bloque.dec
                this.auxiliar = new Nodo("Disponible", (decimal + tamproceso).toString(16).toUpperCase(), decimal + tamproceso, null, bloque.size - tamproceso);
                this.auxiliar.next = bloque.next;
                bloque.next = this.auxiliar;
                if(this.auxiliar.next == null){
                  this.ultimo = this.auxiliar;
                }
              }
              bloque.estado = "Ocupado";
              bloque.size = tamproceso;
              bloque.pid = pid;
              //bloque.pid = pid_tipo;
              break;
          }
        }
      break;
      default:
        return "Error: Algoritmo no reconocido";
    }

    this.listaSegmentos.insertar(num_segmento, num_segmento.toString(2), decimal, decimal.toString(16), tamproceso, permiso, tipo, pid);
  }

  eliminarDinamicoSinCompactacion(pid){
    let apuntador = this.head.next;
    let anterior = this.head;
    let variar = false;
    let combina_atras = false;
    while(apuntador != null){
      variar = false;
      combina_atras = false;
      if(apuntador.pid == pid){
        if(apuntador.next && apuntador.next.estado == "Disponible"){
          apuntador.size += apuntador.next.size;
          apuntador.next = apuntador.next.next;
          variar = true;
        }
        if(anterior.estado == "Disponible"){
          anterior.size += apuntador.size;
          anterior.next = apuntador.next;
          combina_atras = true;
          variar = true;
        }
        apuntador.pid = null;
        apuntador.estado = "Disponible";

        if(combina_atras){
          apuntador = anterior.next;
        }
      }
      if(!variar){
        anterior = apuntador;
        apuntador = apuntador.next;
      }
    }
    this.listaSegmentos.eliminar(pid);
  }

  mostrar() {
    let actual = this.head;
    while (actual) {
      console.log(
        `Dir: ${actual.dec} (${actual.hex}) | Estado: ${actual.estado} | PID: ${actual.pid} | Tamaño: ${actual.size}`
      );
      actual = actual.next;
    }
  }

}


// const listaBloques = new ListaSegmentacion();

// listaBloques.insertar("Disponible", "0", 0, null, 15000000);

// num = 1
// num = listaBloques.insertarSegmentacion(num, 250, "Código", 200, "1", "PrimerOrden", "R");

// num = listaBloques.insertarSegmentacion(num, 180, "Datos", 200, "1", "PrimerOrden", "A");

// num = listaBloques.insertarSegmentacion(num, 300, "Stack", 200, "1", "PrimerOrden", "R");

// num = 1
// num = listaBloques.insertarSegmentacion(num, 20, "Código", 200, "2", "PrimerOrden", "R");

// num = listaBloques.insertarSegmentacion(num, 210, "Datos", 200, "2", "PrimerOrden", "A");

// num = listaBloques.insertarSegmentacion(num, 650, "Stack", 200, "2", "PrimerOrden", "R");

// num = 1
// num = listaBloques.insertarSegmentacion(num, 100, "Código", 200, "3", "PrimerOrden", "R");

// num = listaBloques.insertarSegmentacion(num, 20, "Datos", 200, "3", "PrimerOrden", "A");

// num = listaBloques.insertarSegmentacion(num, 200, "Stack", 200, "3", "PrimerOrden", "R");

// console.log("\n=== 🧠 Memoria ===");
// listaBloques.mostrar();

// console.log("\n=== 🧠 Lista Segmentos PID 1 ===");
// listaBloques.listaSegmentos.mostrar(1);

// console.log("\n=== 🧠 Lista Segmentos PID 2 ===");
// listaBloques.listaSegmentos.mostrar(2);

// console.log("\n=== 🧠 Lista Segmentos PID 3 ===");
// listaBloques.listaSegmentos.mostrar(3);



// listaBloques.eliminarDinamicoSinCompactacion(2);

// console.log("\n=== 🧠 Memoria TRAS ELIMINAR ===");
// listaBloques.mostrar();

// console.log("\n=== 🧠 Lista Segmentos PID 1 ===");
// listaBloques.listaSegmentos.mostrar(1);

// console.log("\n=== 🧠 Lista Segmentos PID 2 ===");
// listaBloques.listaSegmentos.mostrar(2);

// console.log("\n=== 🧠 Lista Segmentos PID 3 ===");
// listaBloques.listaSegmentos.mostrar(3);

// listaBloques.eliminarDinamicoSinCompactacion(3);

// console.log("\n=== 🧠 Memoria TRAS ELIMINAR 3 ===");
// listaBloques.mostrar();

// console.log("\n=== 🧠 Lista Segmentos PID 1 ===");
// listaBloques.listaSegmentos.mostrar(1);

// console.log("\n=== 🧠 Lista Segmentos PID 2 ===");
// listaBloques.listaSegmentos.mostrar(2);

// console.log("\n=== 🧠 Lista Segmentos PID 3 ===");
// listaBloques.listaSegmentos.mostrar(3);