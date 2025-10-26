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

class ListaEnlazada {
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


// Creamos la lista de memoria (ya definida previamente)
const memoria = new ListaEnlazada();

// Tamaño del marco (constante en paginación)
const TAM_MARCO = 65536;

// Insertamos los marcos vacíos (20 marcos físicos)
for (let i = 0; i < 20; i++) {
  const hex = "0x" + (i * TAM_MARCO).toString(16).padStart(4, "0");
  memoria.insertar(hex, i * TAM_MARCO, null, TAM_MARCO, "libre", null, 0, null, i);
}

const segmentos = ["codigo", "dataInit", "dataNoInit", "heap", "stack"];

// PID 1
memoria.modificar("ocupado", 1, "codigo", 0, 32000);
memoria.modificar("ocupado", 1, "dataInit", 1, 25000);
memoria.modificar("ocupado", 1, "dataNoInit", 2, 18000);
memoria.modificar("ocupado", 1, "heap", 3, 10000);
memoria.modificar("ocupado", 1, "stack", 4, 12000);

// PID 2
memoria.modificar("ocupado", 2, "codigo", 0, 30000);
memoria.modificar("ocupado", 2, "dataInit", 1, 50000);
memoria.modificar("ocupado", 2, "dataNoInit", 2, 20000);
memoria.modificar("ocupado", 2, "heap", 3, 16000);
memoria.modificar("ocupado", 2, "stack", 4, 10000);

// PID 3
memoria.modificar("ocupado", 3, "codigo", 0, 28000);
memoria.modificar("ocupado", 3, "dataInit", 1, 40000);
memoria.modificar("ocupado", 3, "dataNoInit", 2, 25000);
memoria.modificar("ocupado", 3, "heap", 3, 15000);
memoria.modificar("ocupado", 3, "stack", 4, 12000);

// Mostrar la memoria cargada
memoria.mostrar();


// Liberar todos los segmentos del proceso 2
memoria.vaciar_PID(2);

// Mostrar la memoria actualizada
memoria.mostrar();