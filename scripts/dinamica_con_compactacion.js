// Crear una memoria dinámica específica para la variante CON compactación
const memoria_dinamica_con_compactacion = new ListaEnlazada();

memoria_dinamica_con_compactacion.insertar("Ocupado", "0x0000", 0, "S.O", 1048576);

dec = 1048576;
tamParticion = 15728640;
hex = dec.toString(16).toUpperCase();
memoria_dinamica_con_compactacion.insertar("Disponible", hex, dec, null, tamParticion);
 

// Exponer globalmente bajo otro nombre para evitar colisiones
window.memoria_dinamica_con_compactacion = memoria_dinamica_con_compactacion;

// Función para recorrer e imprimir la lista (solo para debug de compactación)
function imprimirListaConCompactacion(lista) {
  let actual = lista.head;
  let i = 0;
  while (actual) {
    console.log(`[CON] Bloque ${i}:`, {
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

// Llamada para mostrar tu memoria (debug)
imprimirListaConCompactacion(memoria_dinamica_con_compactacion);
