// =======================
// Paneles (mostrar/ocultar)
// =======================
function showPanel(panelId, btnEl) {
  // ocultar todos los paneles
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  // mostrar el seleccionado
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add("active");

  // manejar estilo de botón activo
  document.querySelectorAll(".toolbar button").forEach(b => b.classList.remove("active-btn"));
  if (btnEl) btnEl.classList.add("active-btn");

  validateActiveAppsForPanel(panelId);
}

// este es para poder traer el panel activo actualmente, esto para el manejo de errores
function getActivePanel() {
  const p = document.querySelector('.panel.active');
  return p ? p.id : null;
}

// Chequea si un tamaño cabe en una memoria específica sin modificarla
function canFitInPanelSize(tamProceso, panelId) {
  let n;
  switch(panelId) {
    case 'estatica_fija':
      if (!window.memoria_estatica_fija) return false;
      n = window.memoria_estatica_fija.head;
      while (n) { if (n.estado === 'Disponible' && Number(n.size) >= Number(tamProceso)) return true; n = n.next; }
      return false;
    case 'estatica_variable':
      if (!window.memoria_estatica_variable) return false;
      n = window.memoria_estatica_variable.head;
      while (n) { if (n.estado === 'Disponible' && Number(n.size) >= Number(tamProceso)) return true; n = n.next; }
      return false;
    case 'dinamica_sin_compactacion':
      if (!window.memoria_dinamica_sin_compactacion) return false;
      n = window.memoria_dinamica_sin_compactacion.head;
      while (n) { if (n.estado === 'Disponible' && Number(n.size) >= Number(tamProceso)) return true; n = n.next; }
      return false;
    case 'dinamica_con_compactacion':
      if (!window.memoria_dinamica_con_compactacion) return false;
      // con compactación puede sumar espacios libres
      n = window.memoria_dinamica_con_compactacion.head;
      let free = 0;
      while (n) { if (n.estado === 'Disponible') free += Number(n.size); n = n.next; }
      return free >= Number(tamProceso);
    default:
      return false;
  }
}

/* Renderiza la tabla en el sidebar */
function renderTabla() {
  const tbody = document.querySelector("#tabla-aplicaciones tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  aplicaciones.forEach((app, index) => {
    const row = document.createElement("tr");

    // PID
    const colPID = document.createElement("td");
    colPID.textContent = app.pid || "-";
    row.appendChild(colPID);

    // Nombre
    const colNombre = document.createElement("td");
    colNombre.textContent = app.nombre;
    row.appendChild(colNombre);

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
        eliminarProceso(Number(colPID.textContent));
        actualizarVistaMemoriaFija();
        actualizarVistaMemoriaFijaVariable();
        actualizarVistaMemoriaDinamicaSinCompactacion();

      };

    } else {
      btnEstado.textContent = "✔"; // inactivo -> iniciar
      btnEstado.title = "Iniciar";
      btnEstado.onclick = async () => {
        console.log(colPID.textContent)
        console.log("Se oprimio en activar", app.nombre);
        const active = getActivePanel();
        const res = iniciarEnPanel(Number(colPID.textContent), active);
        // res: { anyOk: bool, fijaOk, variableOk, dinamicaOk, conOk, warnings: [] }
        if (res && res.anyOk) {
          cambiarEstado(index, true);
        } else {
          showModal('Error', `No hay suficiente memoria para crear el proceso ${app.nombre}.`);
          cambiarEstado(index, false);
        }
        actualizarVistaMemoriaFija();
        actualizarVistaMemoriaFijaVariable();
        actualizarVistaMemoriaDinamicaSinCompactacion();
        actualizarVistaMemoriaDinamicaConCompactacion();
        // Que muestre las advertencias si las hay !!!
        if (res && res.warnings && res.warnings.length > 0) {
          showModal('Advertencias', res.warnings.join('\n'));
        }
      }
    }
    // Botón detalles
    const btnDetalles = document.createElement("button");
    btnDetalles.textContent = "Detalles";
    btnDetalles.style.marginLeft = "6px";
    btnDetalles.onclick = () => mostrarDetalles(app.pid);
    colAcciones.appendChild(btnDetalles);
    colAcciones.appendChild(btnEstado);

    // Botón desinstalar
    const btnBorrar = document.createElement("button");
    btnBorrar.textContent = "Desinstalar";
    btnBorrar.onclick = () => {
      if (confirm(`Desinstalar "${app.nombre}"?`)) desinstalarApp(index);
    };
    colAcciones.appendChild(btnBorrar);

    if(!app.estado) btnBorrar.disabled = false;
    else btnBorrar.disabled = true;

    row.appendChild(colAcciones);
    tbody.appendChild(row);
  });
}

/* Cambiar estado */
function cambiarEstado(index, nuevoEstado) {
  aplicaciones[index].estado = !!nuevoEstado;
  renderTabla();
}

/* Desinstalar */
function desinstalarApp(index) {
  aplicaciones.splice(index, 1);
  renderTabla();
}

// =======================
// Memoria (panel derecho)
// =======================


// =======================
// Ejemplo dinámico SOLO en estática fija
// =======================
document.addEventListener("DOMContentLoaded", () => {
  renderTabla();
  // cuando se cargue la página, dibujamos lo que haya en las memorias
  actualizarVistaMemoriaFija();
  actualizarVistaMemoriaFijaVariable();
  actualizarVistaMemoriaDinamicaSinCompactacion();
  actualizarVistaMemoriaDinamicaConCompactacion();
  if (window.aplicaciones && window.aplicaciones.some(a => a.estado)) {
    reapplyActiveProcessesWithNewAlgorithm();
  }
});

// Que se aplique si se puede los nuevos procesos que se hagan desde otro algoritmo 
// (quitar esto si se quiere que funcionen por separado pero da errores :c)
function reapplyActiveProcessesWithNewAlgorithm() {
  const failed = [];
  const apps = Array.from(window.aplicaciones || []);
  apps.forEach(app => {
    if (!app.estado) return;
    const pid = app.pid;
    eliminarProceso(pid);
    const res = iniciarProceso(pid);
    if (!res || !res.anyOk) {
      // Se desactiva si no se puede reubicar
      const idx = window.aplicaciones.findIndex(a => a.pid == pid);
      if (idx !== -1) window.aplicaciones[idx].estado = false;
      failed.push(app.nombre);
    }
  });

  renderTabla();
  actualizarVistaMemoriaFija();
  actualizarVistaMemoriaFijaVariable();
  actualizarVistaMemoriaDinamicaSinCompactacion();
  actualizarVistaMemoriaDinamicaConCompactacion();

  if (failed.length > 0) {
    showModal('Procesos perdidos', `Los siguientes procesos activos no pudieron reasignarse con el nuevo método y han sido desactivados:\n- ${failed.join('\n- ')}`);
  }
}

// Exponer para llamadas manuales desde consola u otros scripts
window.reapplyActiveProcessesWithNewAlgorithm = reapplyActiveProcessesWithNewAlgorithm;

// Permite cambiar el algoritmo en tiempo de ejecución y reintentar reasignar procesos activos
function changeAlgorithmAndReapply(algName) {
  if (!algName) return;
  localStorage.setItem('algoritmoElegido', algName);
  reapplyActiveProcessesWithNewAlgorithm();
}
window.changeAlgorithmAndReapply = changeAlgorithmAndReapply;

// Inserta un proceso solo en la memoria correspondiente al panel indicado
function iniciarEnPanel(pid, panelId) {
  const app = obtenerAppPorPid(pid);
  if (!app) return { anyOk: false };
  const tamProceso = app.codigo + app.datosIni + app.datosNoIni;
  // Aceptamos pid como string (desde el DOM) o number; normalizamos a number
  const pidNum = parseInt(pid, 10);
  const result = { anyOk: false, warnings: [] };


  //Hay comentarios en mensajes porque me salia doble error,
  // pienso que con solo mostrar una vez que la memoria está llena esta bien, para cambiarlo quitar los comentarios
  switch(panelId) {
    case 'estatica_fija':
      // insertar en estática fija
      const r1 = window.memoria_estatica_fija.insertarProcesoFijo(pidNum, tamProceso, 'PrimerOrden');
      if (typeof r1 === 'string' && r1.startsWith('Error')) {
        //result.warnings.push(`No hay espacio en Estática Fija para ${app.nombre}.`);
      } else {
        result.anyOk = true;
      }
      break;
    case 'estatica_variable':
      const r2 = window.memoria_estatica_variable.insertarProcesoFijo(pidNum, tamProceso, localStorage.getItem('algoritmoElegido'));
      if (typeof r2 === 'string' && r2.startsWith('Error')) {
        //result.warnings.push(`No hay espacio en Estática Variable para ${app.nombre}.`);
      } else {
        result.anyOk = true;
      }
      break;
    case 'dinamica_sin_compactacion':
      const r3 = window.memoria_dinamica_sin_compactacion.insertarProcesoDinamico(pidNum, tamProceso, localStorage.getItem('algoritmoElegido'));
      if (typeof r3 === 'string' && r3.startsWith('Error')) {
        //result.warnings.push(`No hay espacio en Dinámica (sin compactación) para ${app.nombre}.`);
      } else {
        result.anyOk = true;
      }
      break;
    case 'dinamica_con_compactacion':
      if (!window.memoria_dinamica_con_compactacion) { result.warnings.push('Memoria con compactación no inicializada.'); break; }
      const r4 = window.memoria_dinamica_con_compactacion.insertarProcesoDinamico(pidNum, tamProceso, localStorage.getItem('algoritmoElegido'));
      if (typeof r4 === 'string' && r4.startsWith('Error')) {
        //result.warnings.push(`No hay espacio en Dinámica (con compactación) para ${app.nombre}.`);
      } else {
        result.anyOk = true;
      }
      break;
    default:
      result.warnings.push('Panel desconocido');
  }

  actualizarVistaMemoriaFija();
  actualizarVistaMemoriaFijaVariable();
  actualizarVistaMemoriaDinamicaSinCompactacion();
  actualizarVistaMemoriaDinamicaConCompactacion();

  return result;
}


