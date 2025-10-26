class Nodo {
  constructor(hex, dec, pid, size, estado, tipo_segmento, tam_segmento, num_pagina, num_marco) {
    this.hex = hex;
    this.dec = dec;
    this.pid = pid;
    this.size = size; // Tamaño del marco
    this.estado = estado; // libre u ocupado
    this.tipo_segmento = tipo_segmento; // código, datosIni, etc.
    this.tam_segmento = tam_segmento; // tamaño del segmento
    this.num_pagina = num_pagina; // número de la página dentro del proceso
    this.num_marco = num_marco; // número del marco físico
    this.previous = null;
    this.next = null;
  }
}

class ListaEnlazadaPaginacion {
  constructor() {
    this.head = null;
    this.ultimo = null;
  }

  // Insertar un nuevo marco en la lista
  insertar(hex, dec, pid, size, estado, tipo_segmento, tam_segmento, num_pagina, num_marco) {
    const nuevoNodo = new Nodo(hex, dec, pid, size, estado, tipo_segmento, tam_segmento, num_pagina, num_marco);

    if (!this.head) {
      this.head = nuevoNodo;
      this.ultimo = nuevoNodo;
    } else {
      this.ultimo.next = nuevoNodo;
      nuevoNodo.previous = this.ultimo;
      this.ultimo = nuevoNodo;
    }
  }

  // Mostrar todos los marcos (memoria)
  mostrar() {
    let actual = this.head;
    const nodos = [];
    while (actual) {
      nodos.push({
        Hex: actual.hex,
        Dec: actual.dec,
        Marco: actual.num_marco,
        Estado: actual.estado,
        PID: actual.pid,
        Segmento: actual.tipo_segmento,
        Pagina: actual.num_pagina,
        TamSegmento: actual.tam_segmento
      });
      actual = actual.next;
    }
    console.table(nodos);
  }


  // Asignar un marco libre a un proceso (inserción tipo "fija")
  asignarMarco(pid, tipo_segmento, tam_segmento, num_pagina) {
    let actual = this.head;
    while (actual) {
      if (actual.estado === "libre") {
        actual.estado = "ocupado";
        actual.pid = pid;
        actual.tipo_segmento = tipo_segmento;
        actual.tam_segmento = tam_segmento;
        actual.num_pagina = num_pagina;
        return true;
      }
      actual = actual.next;
    }
    return false; // No hay marcos libres
  }

  // Liberar los marcos de un proceso
  liberarMarcos(pid) {
    let actual = this.head;
    let liberados = 0;
    while (actual) {
      if (actual.pid === pid) {
        actual.pid = null;
        actual.estado = "libre";
        actual.tipo_segmento = null;
        actual.tam_segmento = null;
        actual.num_pagina = null;
        liberados++;
      }
      actual = actual.next;
    }
    return liberados;
  }

  modificar(estado, pid, tipo_segmento, num_pagina, tam_segmento) {
    let actual = this.head;
    while (actual) {
      if (actual.estado === "libre" || actual.estado == null) {
        actual.estado = estado;
        actual.pid = pid;
        actual.tipo_segmento = tipo_segmento;
        actual.num_pagina = num_pagina;
        actual.tam_segmento = tam_segmento;
        return actual.num_marco;
      }
      actual = actual.next;
    }
    return -1; // No hay marcos libres
  }

    // Vaciar todos los marcos asociados a un PID
  vaciar_PID(pid) {
    let actual = this.head;
    let encontrado = false;

    while (actual) {
      if (actual.pid === pid) {
        actual.estado = "libre";
        actual.pid = null;
        actual.tipo_segmento = null;
        actual.num_pagina = null;
        actual.tam_segmento = 0;
        encontrado = true;
      }
      actual = actual.next;
    }

    if (!encontrado) {
      console.warn(`⚠️  No se encontraron segmentos asociados al PID ${pid}.`);
    } else {
      console.log(`✅ Se liberaron correctamente los marcos del PID ${pid}.`);
    }
  }


}

export default ListaEnlazadaPaginacion;
