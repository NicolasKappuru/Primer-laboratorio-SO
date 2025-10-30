//import ListaEnlazadaPaginacion from "../estructuras_datos/lista_paginacion.js";

const paginacion = new ListaEnlazadaPaginacion();

const TAM_MEMORIA = 16777216; // 16 MB
const TAM_SO = 1048576

// Exponer globalmente
window.memoria_paginacion = paginacion;

function inicializarPaginacion(){

  let TAM_MARCO = 2**window.offsetPaginacion;
  let NUM_MARCOS = 2**window.numeroPaginacion;

  for (let i = 0; i < NUM_MARCOS; i++) {
    const dec = i * TAM_MARCO;
    const hex = "0x" + dec.toString(16).padStart(5, "0"); // ej: 0x00000, 0x10000, etc.
    window.memoria_paginacion.insertar(hex, dec, null, 0, "libre", null, TAM_MARCO, null, i);
  }

  for (let i = 0; i < parseInt(TAM_SO/TAM_MARCO); i++) {
    window.memoria_paginacion.modificar(
      "ocupado",   // estado
      "S.O",       // pid (simbólico)
      "S.O",       // tipo_segmento
      i,           // num_pagina (0 a 15)
      TAM_MARCO    // tam_segmento real
    );
  }
}

paginacion.mostrar();

