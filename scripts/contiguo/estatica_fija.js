// Importar la clase desde lista.js (si no usas "export" en lista.js, simplemente cópialo todo aquí)
const memoria_estatica_fija = new ListaEnlazada();

memoria_estatica_fija.insertar("Ocupado", "0x0000", 0, "S.O", 1048576);

dec = 1048576;
tamParticion = 1048576;

for (let i = 0; i < 15; i++) {
    hex = dec.toString(16).toUpperCase();
    memoria_estatica_fija.insertar("Disponible", hex, dec, null, tamParticion);
    dec += tamParticion;
}

// Exponer globalmente
window.memoria_estatica_fija = memoria_estatica_fija;

// Función para recorrer e imprimir la lista
function imprimirLista(lista) {
  let actual = lista.head;
  let i = 0;
  while (actual) {
    //console.log(`Bloque ${i}:`, {
    //  disponible: actual.estado,
    //  hex: actual.hex,
    //  dec: actual.dec,
    //  pid: actual.pid,
    //  size: actual.size
    //});
    actual = actual.next;
    i++;
  }
}

// Llamada para mostrar tu memoria
imprimirLista(memoria_estatica_fija);






