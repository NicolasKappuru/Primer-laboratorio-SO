//const ListaEnlazada = require('./lista.js');


// Importar la clase desde lista.js (si no usas "export" en lista.js, simplemente cópialo todo aquí)
const memoria_estatica_variable = new ListaEnlazada();

memoria_estatica_variable.insertar("Ocupado", "0x0000", 0, "S.O", 1048576);

dec = 1048576;
tamParticion = 524288;

for (let i = 1; i < 9; i++) {
    hex = dec.toString(16).toUpperCase();
    memoria_estatica_variable.insertar("Disponible", hex, dec, null, tamParticion);
    if( i % 2 == 0) tamParticion = tamParticion*2;
    dec += tamParticion;
}



// Exponer globalmente
window.memoria_estatica_variable = memoria_estatica_variable;

function imprimirLista(lista) {
  let actual = lista.head;
  let i = 0;
  while (actual) {
    console.log(`Bloque ${i}:`, {
      disponible: actual.estado,
      hex: actual.hex,
      dec: actual.dec,
      pid: actual.pid,
      size: actual.size
    });
    actual = actual.next;
    i++;
  }
}

imprimirLista(memoria_estatica_variable);
