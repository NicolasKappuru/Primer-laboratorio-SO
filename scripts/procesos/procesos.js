window.pidIncremental = window.pidIncremental || 1;

window.procesos = window.procesos || [];

/* Renderiza la tabla en el sidebar */
function renderTablaProcesos() {
  const tbody = document.querySelector("#tabla-procesos tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  procesos.forEach((proceso, index) => {
    const row = document.createElement("tr");

    // PID
    const colPID = document.createElement("td");
    colPID.textContent = proceso.processID || "-";
    
    // Sirve para el hover de Paginacion y Segmentacion
    colPID.classList.add('pid-cell');
    colPID.dataset.pid = proceso.processID || '';
    
    row.appendChild(colPID);

    // ID Programa
    const colID_Programa = document.createElement("td");
    colID_Programa.textContent = proceso.id_programa;
    row.appendChild(colID_Programa);

    // Acciones
    const colAcciones = document.createElement("td");

    // Botón estado (activar/inactivar)
    const btnEstado = document.createElement("button");
    btnEstado.style.marginRight = "4px";
    
    btnEstado.textContent = "✖"; // activo -> parar
    btnEstado.title = "Parar";
    btnEstado.onclick = () => {
      //console.log("Se oprimió desactivar en el proceso del programa ", proceso.id_programa, " con pid ", proceso.processID);
      eliminarProceso(colPID.textContent, window.panelActivo);
      actualizarVistas();
      actualizarVistaDiscontiguas();
    };

    colAcciones.appendChild(btnEstado);

    row.appendChild(colAcciones);
    tbody.appendChild(row);
  });
}

function iniciarProceso(id_program, panelActual){
  //console.log("Le pasamos el id__programa: " + id_program);
  //console.log(typeof id_program);

  let app = obtenerAppPorIDProgram(id_program);  
  let codigo = app.codigo;
  let datosIni = app.datosIni;
  let datosNoIni = app.datosNoIni;
  let heap = 65536;
  let stack = 131072;

  let pidProceso = window.pidIncremental++;

  let tiempoEjecucion = app.tiempo_ejecucion; 
  let inicioBloqueo = app.inicio_bloqueo;
  let duracion = app.duracion; 

  const nuevo_proceso = {
    processID: pidProceso,
    id_programa: id_program,
    codigo: codigo,
    datosIni: datosIni,
    datosNoIni: datosNoIni,
    tiempo_ejecucion: tiempoEjecucion,
    inicio_bloqueo: inicioBloqueo,
    duracion: duracion
  }
  window.procesos.push(nuevo_proceso);

  const tamProceso = codigo + datosIni + datosNoIni + heap + stack;
  
  switch (panelActual){
    case "estatica_fija":
      window.memoria_estatica_fija.insertarProcesoFijo(
        pidProceso,
        tamProceso,
        "PrimerOrden"
      );
    break;
    case "estatica_variable":
      window.memoria_estatica_variable.insertarProcesoFijo(
        pidProceso,
        tamProceso,
        window.algoritmoSeleccionado
      );
    break;
    case "dinamica_sin_compactacion":
      window.memoria_dinamica_sin_compactacion.insertarProcesoDinamico(
        pidProceso,
        tamProceso,
        window.algoritmoSeleccionado
      );
    break;
    case "dinamica_con_compactacion":
      // Insertar también en la variante con compactación si existe
      window.memoria_dinamica_con_compactacion.insertarProcesoDinamico(
        pidProceso,
        tamProceso,
        "PrimerOrden"
      );
    break;
    case "segmentacion":
      let listaProceso = [
        { tipo: "text", tam_segm: codigo, permiso: "RX"},
        { tipo: "data", tam_segm: datosIni, permiso: "RW"},
        { tipo: "bss", tam_segm: datosNoIni, permiso: "RW"},
        { tipo: "heap", tam_segm: heap, permiso: "RW"},
        { tipo: "stack", tam_segm: stack, permiso: "RW"}
      ];

      let tam_max = 262144
      let num_segmento = 1;

      for(i=0;i<5;i++){
        num_segmento = window.memoria_segmentacion.insertarSegmentacion(
          num_segmento, 
          listaProceso[i].tam_segm, 
          listaProceso[i].tipo, 
          tam_max, 
          pidProceso, 
          window.algoritmoSeleccionado,
          listaProceso[i].permiso
        );
      }   
      if(!window.memoria_segmentacion.procesoCompletoSegmentacion(pidProceso, tamProceso)){
        eliminarProceso(pidProceso, panelActual)
      }
    break;
    case "paginacion":

      let listaSegmentosPaginacion = [
        { tipo: "text", tam_segm: codigo},
        { tipo: "data", tam_segm: datosIni},
        { tipo: "bss", tam_segm: datosNoIni},
        { tipo: "heap", tam_segm: heap},
        { tipo: "stack", tam_segm: stack}
      ];
      //Insertamos la paginacion
      iniciarProcesoPaginacion(pidProceso, listaSegmentosPaginacion, tamProceso);
    break;

    case "fcfs":
    actualizarVistaEjeY(pidProceso);  // PASAR EL PID NUEVO
    actualizarVistaEjeX();             // actualiza ticks / columnas y reconstruye la grid
    break; 

  }

  //console.log("Resultado de insertar en memoria:", tamProceso);
  // Llamada para mostrar tu memoria
  //imprimirLista(window.memoria_segmentacion);

  actualizarVistas();
  actualizarVistaDiscontiguas();

}

function eliminarProceso(pid, panelActual){
  switch (panelActual){
    case "estatica_fija": 
      window.memoria_estatica_fija.eliminarFijo(pid); 
    break;
    case "estatica_variable":
      window.memoria_estatica_variable.eliminarFijo(pid);
    break;
    case "dinamica_sin_compactacion":
      window.memoria_dinamica_sin_compactacion.eliminarDinamicoSinCompactacion(pid);
    break;
    case "dinamica_con_compactacion":
      if (window.memoria_dinamica_con_compactacion) {
        window.memoria_dinamica_con_compactacion.eliminarDinamicoConCompactacion(pid);
      }
    break;
    case "segmentacion":
      window.memoria_segmentacion.eliminarDinamicoSegmentacion(pid);
    break;
    case "paginacion":
      finalizarProcesoPaginacion(pid);
    break;
  }
  
  quitarProcesoTabla(pid);

  actualizarVistas();
  actualizarVistaDiscontiguas();

}

//Para obtener los datos de una app por su id_program
function obtenerAppPorIDProgram(id_program) {
  return window.aplicaciones.find(app => app.id_program == id_program);
}

// Funcion de test para imprimir lista
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

function quitarProcesoTabla(index){
  let val = procesos.findIndex(obj => obj.processID == index);
  procesos.splice(val, 1);
  renderTablaProcesos();
}



