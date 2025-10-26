const memoria_segmentacion = new ListaSegmentacion();

memoria_segmentacion.insertarNodoSegmentacion("Ocupado", "0x0000", 0, "S.O", 1048576);

dec = 1048576;
tamParticion = 15728640;
hex = dec.toString(16).toUpperCase();
memoria_segmentacion.insertarNodoSegmentacion("Disponible", hex, dec, null, tamParticion);
 

// Exponer globalmente
window.memoria_segmentacion = memoria_segmentacion;

// Función para recorrer e imprimir la lista
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

// Llamada para mostrar tu memoria
//imprimirLista(memoria_segmentacion);

