class NodoSegmentacion {
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

window.listaSegmentosGlobal = new ListaSegmentos();

class ListaSegmentacion{
  constructor() {
    this.listaSegmentos = window.listaSegmentosGlobal;
    this.head = null;
    this.ultimo = null;

    this.insertarSegmentacion = this.insertarSegmentacion.bind(this);
    this.insertarProcesoDinamico = this.insertarProcesoDinamico.bind(this);
  }

  listaVaciaSegmentacion(){
    if(this.head == null) return true;
  }

  insertarNodoSegmentacion(disponible, hex, dec, pid, size) {
    if (this.listaVaciaSegmentacion()) {
      this.head = new NodoSegmentacion(disponible, hex, dec, pid, size);
      this.ultimo = this.head;
      return;
    }
    let nuevo = new NodoSegmentacion(disponible, hex, dec, pid, size);
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

  insertarProcesoDinamico(pid, tamproceso, algoritmo, permiso, tipo, num_segmento) {
  console.log("=== insertarProcesoDinamico ===");
  console.log("PID:", pid, "Tamaño:", tamproceso, "Algoritmo:", algoritmo);

  let apuntador = this.head;
  let bloques = [];
  let decimal = 0;

  switch (algoritmo) {
    case "PrimerOrden":
      while (apuntador != null) {
        if (apuntador.estado === "Disponible" && apuntador.size >= tamproceso) {
          decimal = apuntador.dec; 
          if (apuntador.size - tamproceso > 0) {
            this.auxiliar = new NodoSegmentacion(
              "Disponible",
              (decimal + tamproceso).toString(16).toUpperCase(),
              decimal + tamproceso,
              null,
              apuntador.size - tamproceso
            );
            this.auxiliar.next = apuntador.next;
            apuntador.next = this.auxiliar;
            if (!this.auxiliar.next) this.ultimo = this.auxiliar;
          }

          apuntador.estado = "Ocupado";
          apuntador.size = tamproceso;
          apuntador.tam_proceso = tamproceso; 
          apuntador.pid = pid;
          break;
        }
        apuntador = apuntador.next;
      }
      break;

    case "MejorAjuste":
      while (apuntador != null) {
        bloques.push(apuntador);
        apuntador = apuntador.next;
      }
      bloques.sort((a, b) => a.size - b.size);
      for (let bloque of bloques) {
        if (bloque.estado === "Disponible" && bloque.size >= tamproceso) {
          decimal = bloque.dec; 
          if (bloque.size - tamproceso > 0) {
            this.auxiliar = new NodoSegmentacion(
              "Disponible",
              (decimal + tamproceso).toString(16).toUpperCase(),
              decimal + tamproceso,
              null,
              bloque.size - tamproceso
            );
            this.auxiliar.next = bloque.next;
            bloque.next = this.auxiliar;
            if (!this.auxiliar.next) this.ultimo = this.auxiliar;
          }

          bloque.estado = "Ocupado";
          bloque.size = tamproceso;
          bloque.tam_proceso = tamproceso;
          bloque.pid = pid;
          break;
        }
      }
      break;

    case "PeorAjuste":
      while (apuntador != null) {
        bloques.push(apuntador);
        apuntador = apuntador.next;
      }
      bloques.sort((a, b) => b.size - a.size);
      for (let bloque of bloques) {
        if (bloque.estado === "Disponible" && bloque.size >= tamproceso) {
          decimal = bloque.dec; 
          if (bloque.size - tamproceso > 0) {
            this.auxiliar = new NodoSegmentacion(
              "Disponible",
              (decimal + tamproceso).toString(16).toUpperCase(),
              decimal + tamproceso,
              null,
              bloque.size - tamproceso
            );
            this.auxiliar.next = bloque.next;
            bloque.next = this.auxiliar;
            if (!this.auxiliar.next) this.ultimo = this.auxiliar;
          }

          bloque.estado = "Ocupado";
          bloque.size = tamproceso;
          bloque.tam_proceso = tamproceso;
          bloque.pid = pid;
          break;
        }
      }
      break;

    default:
      console.error("Algoritmo no reconocido:", algoritmo);
      return false;
  }

  // ✅ Registrar en la lista de segmentos global
  this.listaSegmentos.insertar(
    num_segmento,
    num_segmento.toString(2),
    decimal,
    decimal.toString(16),
    tamproceso,
    permiso,
    tipo,
    pid
  );

  return true; // ✅ devolver éxito
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
