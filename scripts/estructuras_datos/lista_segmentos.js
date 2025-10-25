class Nodo {
  constructor(num, binario, dec, hex, size, permisos, tipo) {
    this.num = num;
    this.dec = dec;
    this.binario = binario; //Disponible, ocupado
    this.hex = hex;
    this.size = size; //Tamaño de la particion
    this.permisos = permisos; 
    this.tipo = tipo; 
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



  insertar(num, binario, dec, hex, size, permisos, tipo) {
    const nuevoNodo = new Nodo(num, binario, dec, hex, size, permisos, tipo);

    if (this.listaVacia()) {
      this.head = nuevoNodo;
      this.ultimo = nuevoNodo;
    } else {
      this.ultimo.next = nuevoNodo;
      this.ultimo = nuevoNodo;
    }
  }
}

