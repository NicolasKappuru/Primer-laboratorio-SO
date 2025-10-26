//import ListaEnlazadaPaginacion from "../estructuras_datos/lista_paginacion.js";

const paginacion = new ListaEnlazadaPaginacion();

const TAM_MEMORIA = 16777216; // 16 MB
const TAM_MARCO = 65536;
const NUM_MARCOS = 256;

// Inicializamos la memoria vacía con 256 marcos
for (let i = 0; i < NUM_MARCOS; i++) {
  const dec = i * TAM_MARCO;
  const hex = "0x" + dec.toString(16).padStart(5, "0"); // ej: 0x00000, 0x10000, etc.
  paginacion.insertar(hex, dec, null, 0, "libre", null, TAM_MARCO, null, i);
}

// Exponer globalmente
window.memoria_paginacion = paginacion;

for (let i = 0; i < 16; i++) {
  window.memoria_paginacion.modificar(
    "ocupado",   // estado
    "S.O",       // pid (simbólico)
    "S.O",       // tipo_segmento
    i,           // num_pagina (0 a 15)
    TAM_MARCO    // tam_segmento real
  );
}

paginacion.mostrar();

