/* Renderiza la tabla en el sidebar */
function renderTablaProcesos() {
  const tbody = document.querySelector("#tabla-procesos tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  aplicaciones.forEach((app, index) => {
    const row = document.createElement("tr");

    // PID
    const colPID = document.createElement("td");
    colPID.textContent = app.pid || "-";
    row.appendChild(colPID);

    // ID Programa
    const colID_Programa = document.createElement("td");
    colID_Programa.textContent = app.nombre;
    row.appendChild(colID_Programa);

    // Acciones
    const colAcciones = document.createElement("td");

    // Botón estado (activar/inactivar)
    const btnEstado = document.createElement("button");
    btnEstado.style.marginRight = "4px";
    if (app.estado) {
      btnEstado.textContent = "✖"; // activo -> parar
      btnEstado.title = "Parar";
      btnEstado.onclick = () => {
        console.log(colPID.textContent)
        console.log("Se oprimió desactivar", app.nombre);
        cambiarEstado(index, false);
        eliminarProceso(colPID.textContent);
        actualizarVistaMemoriaFija();
        actualizarVistaMemoriaFijaVariable();
        actualizarVistaMemoriaDinamicaSinCompactacion();

      };

    } else {
      btnEstado.textContent = "✔"; // inactivo -> iniciar
      btnEstado.title = "Iniciar";
      btnEstado.onclick = () => {
        cambiarEstado(index, true);
        console.log(colPID.textContent)
        console.log("Se oprimio en activar", app.nombre);
        iniciarProceso(colPID.textContent);
        actualizarVistaMemoriaFija();
        actualizarVistaMemoriaFijaVariable();
        actualizarVistaMemoriaDinamicaSinCompactacion();

      }
    }
    colAcciones.appendChild(btnEstado);

    row.appendChild(colAcciones);
    tbody.appendChild(row);
  });
}

function iniciarProceso(pid){
  console.log("Le pasamos el pid: " + pid);
  console.log(typeof pid);

  let app = obtenerAppPorPid(pid);  
  let codigo = 0;
  let datosIni = 0;
  let datosNoIni = 0;

  if (app) {
    codigo = app.codigo;
    datosIni = app.datosIni;
    datosNoIni = app.datosNoIni;
    console.log("App encontrada");
  } else {
    console.log("No existe una app con ese PID");
    return;
  }

  const tamProceso =codigo + datosIni + datosNoIni;
  window.memoria_estatica_fija.insertarProcesoFijo(
    pid,
    tamProceso,
    "PrimerOrden" 
  );

  window.memoria_estatica_variable.insertarProcesoFijo(
    pid,
    tamProceso,
    localStorage.getItem("algoritmoElegido") 
  );

  window.memoria_dinamica_sin_compactacion.insertarProcesoDinamico(
    pid,
    tamProceso,
    localStorage.getItem("algoritmoElegido") 
  );

  // Insertar también en la variante con compactación si existe
  if (window.memoria_dinamica_con_compactacion) {
    window.memoria_dinamica_con_compactacion.insertarProcesoDinamico(
      pid,
      tamProceso,
      localStorage.getItem("algoritmoElegido")
    );
  }

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

  // Actualizar vistas (incluida la con-compactacion)
  actualizarVistaMemoriaDinamicaSinCompactacion();
  actualizarVistaMemoriaDinamicaConCompactacion();

}

//Para obtener los datos de una app por su PID
function obtenerAppPorPid(pid) {
  return window.aplicaciones.find(app => app.pid == pid);
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


function cambiarEstado(index, nuevoEstado) {
  aplicaciones[index].estado = !!nuevoEstado;
  renderTablaAplicaciones();
}