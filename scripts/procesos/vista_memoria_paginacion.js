function iniciarProcesoPaginacion(pidProceso, listaSegmentosPaginacion) {
  const TAM_MARCO = 65536; // tamaño fijo del marco
  let numPagina = 0;       // contador global de páginas dentro del proceso

  // Iteramos sobre los 5 tipos de segmentos
  for (const segmento of listaSegmentosPaginacion) {
    const { tipo, tam_segm } = segmento;
    let restante = tam_segm;

    while (restante > 0) {
      const tamUsado = Math.min(restante, TAM_MARCO); // lo que cabe en esta página

      // Llamamos al método modificar de la lista global
      window.memoria_paginacion.modificar(
        "ocupado",         // estado
        pidProceso,        // PID del proceso
        tipo,              // tipo de segmento (text, data, etc.)
        numPagina,         // número de página secuencial
        tamUsado           // tamaño real ocupado en esta página
      );

      // Restamos lo que ya se ocupó
      restante -= tamUsado;
      numPagina++; // siguiente página
    }
  }

  window.memoria_paginacion.mostrar(); 
}

function finalizarProcesoPaginacion(pidProceso) {
  window.memoria_paginacion.liberarMarcosPorPID(pidProceso);
  window.memoria_paginacion.mostrar(); 
}