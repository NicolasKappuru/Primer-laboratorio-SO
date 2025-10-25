class Nodo {
  constructor(num, binario, dec, hex, size, permisos, tipo, pid) {
    this.num = num;
    this.dec = dec;
    this.binario = binario; //Disponible, ocupado
    this.hex = hex;
    this.size = size; //Tamaño de la particion
    this.permisos = permisos;
    this.pid = pid 
    this.tipo = tipo; 
    this.next = null;
  }
}

class ListaSegmentos {
  constructor() {
    this.head = null;
    this.ultimo = null;
  }

  listaVacia(){
    if(this.head == null) return true;
  }



  insertar(num, binario, dec, hex, size, permisos, tipo, pid) {
    const nuevoNodo = new Nodo(num, binario, dec, hex, size, permisos, tipo, pid);

    if (this.listaVacia()) {
      this.head = nuevoNodo;
      this.ultimo = nuevoNodo;
    } else {
      this.ultimo.next = nuevoNodo;
      this.ultimo = nuevoNodo;
    }
  }

  eliminar(pid){
    let apuntador = this.head.next;
    let anterior = this.head;
    let varia = false;
    while(apuntador != null){
      varia = false;
      if(apuntador.pid == pid){
        if(apuntador.next){
          anterior.next = apuntador.next.next;
          apuntador = anterior.next;
          varia = true;
        }
      
      }
      if(!varia){
        anterior = apuntador;
        apuntador = apuntador.next;
      }
      
    }
  }

  mostrar(pid) {
    let actual = this.head;

    while (actual) {
      if(actual.pid==pid){
        console.log(
          `Num_Segm: ${actual.num} | Bin = ${actual.binario} | Dec = ${actual.dec} (${actual.hex}) | Size: ${actual.size} | Tipo: ${actual.tipo} | Permisos: ${actual.permisos}`
        );
      }
      actual = actual.next;
    }
  }
}

module.exports = ListaSegmentos;