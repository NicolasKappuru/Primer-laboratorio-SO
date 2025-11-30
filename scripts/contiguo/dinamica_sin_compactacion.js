// Importar la clase desde lista.js (si no usas "export" en lista.js, simplemente cópialo todo aquí)
const memoria_dinamica_sin_compactacion = new ListaEnlazada();

memoria_dinamica_sin_compactacion.insertar("Ocupado", "0x0000", 0, "S.O", 1048576);

dec = 1048576;
tamParticion = 15728640;
hex = dec.toString(16).toUpperCase();
memoria_dinamica_sin_compactacion.insertar("Disponible", hex, dec, null, tamParticion);
 

// Exponer globalmente
window.memoria_dinamica_sin_compactacion = memoria_dinamica_sin_compactacion;

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
imprimirLista(memoria_dinamica_sin_compactacion);

