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
      console.log("Se oprimió desactivar en el proceso del programa ", proceso.id_programa, " con pid ", proceso.processID);
      eliminarProceso(colPID.textContent);
      actualizarVistaMemoriaFija();
      actualizarVistaMemoriaFijaVariable();
      actualizarVistaMemoriaDinamicaSinCompactacion();
    };

    colAcciones.appendChild(btnEstado);

    row.appendChild(colAcciones);
    tbody.appendChild(row);
  });
}

function iniciarProceso(id_program){
  console.log("Le pasamos el id__programa: " + id_program);
  console.log(typeof id_program);

  let app = obtenerAppPorIDProgram(id_program);  
  let codigo = app.codigo;
  let datosIni = app.datosIni;
  let datosNoIni = app.datosNoIni;
  let heap = 65536;
  let stack = 131072;

  let pidProceso = window.pidIncremental++;

  const nuevo_proceso = {
    processID: pidProceso,
    id_programa: id_program,
    codigo: codigo,
    datosIni: datosIni,
    datosNoIni: datosNoIni
  }
  window.procesos.push(nuevo_proceso);

  const tamProceso = codigo + datosIni + datosNoIni + heap + stack;

  window.memoria_estatica_fija.insertarProcesoFijo(
    pidProceso,
    tamProceso,
    "PrimerOrden"
  );

  window.memoria_estatica_variable.insertarProcesoFijo(
    pidProceso,
    tamProceso,
    localStorage.getItem("algoritmoElegido") 
  );

  window.memoria_dinamica_sin_compactacion.insertarProcesoDinamico(
    pidProceso,
    tamProceso,
    localStorage.getItem("algoritmoElegido") 
  );

  // Insertar también en la variante con compactación si existe
  window.memoria_dinamica_con_compactacion.insertarProcesoDinamico(
    pidProceso,
    tamProceso,
    "PrimerOrden"
  );
  

  console.log("Resultado de insertar en memoria:", tamProceso);
  // Llamada para mostrar tu memoria
  imprimirLista(window.memoria_dinamica_sin_compactacion);

  // Actualizar vistas (incluida la con-compactacion)
  actualizarVistaMemoriaDinamicaSinCompactacion();
  actualizarVistaMemoriaDinamicaConCompactacion();

}

function eliminarProceso(pid){
  window.memoria_estatica_fija.eliminarFijo(pid); 
  window.memoria_estatica_variable.eliminarFijo(pid);
  window.memoria_dinamica_sin_compactacion.eliminarDinamicoSinCompactacion(pid);
  if (window.memoria_dinamica_con_compactacion) {
    window.memoria_dinamica_con_compactacion.eliminarDinamicoConCompactacion(pid);
  }
  imprimirLista(window.memoria_dinamica_sin_compactacion);

  quitarProcesoTabla(pid);

  // Actualizar vistas (incluida la con-compactacion)
  actualizarVistaMemoriaDinamicaSinCompactacion();
  actualizarVistaMemoriaDinamicaConCompactacion();

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