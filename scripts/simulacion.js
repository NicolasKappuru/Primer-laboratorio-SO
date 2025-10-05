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

  // Validar las aplicaciones activas para el panel seleccionado; si no caben, desactivarlas
  validateActiveAppsForPanel(panelId);
}

// Devuelve el id del panel actualmente activo en la UI
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

function validateActiveAppsForPanel(panelId) {
  const desactivados = [];
  const indicesToDeactivate = [];

  // Helper: comprueba si un PID ya está presente en la memoria del panel
  function isProcessInMemory(panelId, pid) {
    let n;
    switch(panelId) {
      case 'estatica_fija':
        if (!window.memoria_estatica_fija) return false;
        n = window.memoria_estatica_fija.head; break;
      case 'estatica_variable':
        if (!window.memoria_estatica_variable) return false;
        n = window.memoria_estatica_variable.head; break;
      case 'dinamica_sin_compactacion':
        if (!window.memoria_dinamica_sin_compactacion) return false;
        n = window.memoria_dinamica_sin_compactacion.head; break;
      case 'dinamica_con_compactacion':
        if (!window.memoria_dinamica_con_compactacion) return false;
        n = window.memoria_dinamica_con_compactacion.head; break;
      default:
        return false;
    }
    while (n) { if (n.pid == pid) return true; n = n.next; }
    return false;
  }

  // Helper: eliminar pid de todas las memorias excepto la del panelId indicado
  function removePidFromOtherMemories(panelId, pid) {
    // Estática fija
    if (panelId !== 'estatica_fija' && window.memoria_estatica_fija) window.memoria_estatica_fija.eliminarFijo(pid);
    // Estática variable
    if (panelId !== 'estatica_variable' && window.memoria_estatica_variable) window.memoria_estatica_variable.eliminarFijo(pid);
    // Dinámica sin compactación
    if (panelId !== 'dinamica_sin_compactacion' && window.memoria_dinamica_sin_compactacion) window.memoria_dinamica_sin_compactacion.eliminarDinamicoSinCompactacion(pid);
    // Dinámica con compactación
    if (panelId !== 'dinamica_con_compactacion' && window.memoria_dinamica_con_compactacion) window.memoria_dinamica_con_compactacion.eliminarDinamicoConCompactacion(pid);
  }

  // Para cada app activa intentamos garantizar que exista en la memoria del panel seleccionado.
  aplicaciones.forEach((app, idx) => {
    if (!app.estado) return; // solo considerar activas
    const pid = app.pid;

    // Si ya está en la memoria destino, nada que hacer
    if (isProcessInMemory(panelId, pid)) return;

    // Intentar insertar en el panel activo (si no cabe, será desactivada)
    const ins = iniciarEnPanel(pid, panelId);
    if (ins && ins.anyOk) {
      // inserción exitosa en panel destino: limpiar posibles rastros en otras memorias
      removePidFromOtherMemories(panelId, pid);
      // actualizar vistas ahora (se hace al final en lote también)
    } else {
      // No se pudo insertar: desactivar y eliminar de todas las memorias
      indicesToDeactivate.push(idx);
      eliminarProceso(pid);
      desactivados.push(app.nombre);
    }
  });

  // Si hubo desactivaciones, desactivarlas en la tabla y notificar
  if (indicesToDeactivate.length > 0) {
    indicesToDeactivate.forEach(i => { aplicaciones[i].estado = false; });
    renderTabla();
    showModal('Procesos desactivados', `Para el esquema ${panelId} los siguientes procesos no caben y han sido desactivados:\n- ${desactivados.join('\n- ')}`);
  }
}

// Modal helpers
function showModal(title, body) {
  const modal = document.getElementById('modal-message');
  if (!modal) return alert(body);
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').textContent = body;
  modal.style.display = 'flex';
}

function hideModal() {
  const modal = document.getElementById('modal-message');
  if (!modal) return;
  modal.style.display = 'none';
}

// cerrar modal
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('modal-close');
  if (btn) btn.addEventListener('click', hideModal);
});

// =======================
// Aplicaciones (panel izquierdo)
// =======================

// tabla global de aplicaciones
window.aplicaciones = window.aplicaciones || [];

//Aplicaciones por defecto

if (window.aplicaciones.length === 0) {
  window.aplicaciones.push(
    { pid: 1, nombre: "Notepad", estado: false, codigo: 19524, datosIni: 12352, datosNoIni: 1165 },
    { pid: 2, nombre: "Word", estado: false, codigo: 77539, datosIni: 32680, datosNoIni: 4100 },
    { pid: 3, nombre: "Excel", estado: false, codigo: 99542, datosIni: 24245, datosNoIni: 7557 },
    { pid: 4, nombre: "AutoCAD", estado: false, codigo: 115000, datosIni: 123470, datosNoIni: 1123 },
    { pid: 5, nombre: "Calculadora", estado: false, codigo: 12342, datosIni: 1256, datosNoIni: 1756 },
    { pid: 6, nombre: "P1", estado: false, codigo: 525000, datosIni: 3224000, datosNoIni: 51000 },
    { pid: 7, nombre: "P2", estado: false, codigo: 590000, datosIni: 974000, datosNoIni: 25000 },
    { pid: 8, nombre: "P3", estado: false, codigo: 349000, datosIni: 2150000, datosNoIni: 1000 }
    
  );
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
          // no se pudo cargar en ninguna memoria
          showModal('Error', `No hay suficiente memoria para crear el proceso ${app.nombre}.`);
          cambiarEstado(index, false);
        }
        // actualizar vistas siempre
        actualizarVistaMemoriaFija();
        actualizarVistaMemoriaFijaVariable();
        actualizarVistaMemoriaDinamicaSinCompactacion();
        actualizarVistaMemoriaDinamicaConCompactacion();
        // si hubo advertencias (por ejemplo fija no entró), mostrarlas
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

// total de memoria (16 MB)
const TOTAL = 16777216;

/* Crear un bloque dentro de un contenedor de memoria */
function crearBloque(container, { hex, dec, pid, tam }) {
  const b = document.createElement("div");

  if (pid === "S.O") b.className = "bloque so";
  else if (pid) b.className = "bloque ocupado";
  else b.className = "bloque libre";

  // altura proporcional al tamaño
  const proporcion = tam / TOTAL;
  b.style.flexGrow = proporcion;

  // contenido en 4 columnas
  b.innerHTML = `
    <div>${hex}</div>
    <div>${dec}</div>
    <div>${pid || ""}</div>
    <div>${tam.toLocaleString()}</div>
  `;

  container.appendChild(b);
}

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
  // Reaplicar procesos activos con el algoritmo actualmente seleccionado (si los hay)
  if (window.aplicaciones && window.aplicaciones.some(a => a.estado)) {
    reapplyActiveProcessesWithNewAlgorithm();
  }
});

// Reaplicar procesos activos usando el algoritmo actual guardado en localStorage.
// Intenta conservar los procesos que puedan ser asignados; los que no, se desactivan.
function reapplyActiveProcessesWithNewAlgorithm() {
  const failed = [];
  // Hacemos una copia de la lista de aplicaciones para no modificar mientras iteramos
  const apps = Array.from(window.aplicaciones || []);
  apps.forEach(app => {
    if (!app.estado) return;
    const pid = app.pid;
    // Eliminamos cualquier rastro previo en las memorias
    eliminarProceso(pid);
    // Intentamos insertar con el algoritmo actual (iniciarProceso intenta todas las memorias)
    const res = iniciarProceso(pid);
    if (!res || !res.anyOk) {
      // No se pudo reubicar: desactivar
      const idx = window.aplicaciones.findIndex(a => a.pid == pid);
      if (idx !== -1) window.aplicaciones[idx].estado = false;
      failed.push(app.nombre);
    }
  });

  // Actualizar UI
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


  //Hay comentarios en mensajes porque me salia doble error, pienso que con solo mostrar una vez que la memoria está llena esta bien, para cambiarlo quitar los errores
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

  // actualizar vistas
  actualizarVistaMemoriaFija();
  actualizarVistaMemoriaFijaVariable();
  actualizarVistaMemoriaDinamicaSinCompactacion();
  actualizarVistaMemoriaDinamicaConCompactacion();

  return result;
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
  // Intentar insertar en todas las memorias y devolver un resumen
  const result = {
    anyOk: false,
    fijaOk: false,
    variableOk: false,
    dinamicaOk: false,
    conOk: false,
    warnings: []
  };

  // Estática fija (no fatal)
  const resFija = window.memoria_estatica_fija.insertarProcesoFijo(
    pid,
    tamProceso,
    "PrimerOrden"
  );
  if (typeof resFija === 'string' && resFija.startsWith('Error')) {
  //  result.warnings.push(`Advertencia: No hay espacio en Estática Fija para el proceso ${obtenerAppPorPid(pid).nombre}.`);
  } else {
    result.fijaOk = true;
    result.anyOk = true;
  }

  // Estática variable (fatal)
  const resVariable = window.memoria_estatica_variable.insertarProcesoFijo(
    pid,
    tamProceso,
    localStorage.getItem("algoritmoElegido")
  );
  if (typeof resVariable === 'string' && resVariable.startsWith('Error')) {
    // si variable falla, revertir fija si se insertó
    if (result.fijaOk) window.memoria_estatica_fija.eliminarFijo(pid);
    return { anyOk: false, warning: resVariable };
  } else {
    result.variableOk = true;
    result.anyOk = true;
  }

  // Dinámica sin compactación (fatal)
  const resDinamica = window.memoria_dinamica_sin_compactacion.insertarProcesoDinamico(
    pid,
    tamProceso,
    localStorage.getItem("algoritmoElegido")
  );
  if (typeof resDinamica === 'string' && resDinamica.startsWith('Error')) {
    if (result.fijaOk) window.memoria_estatica_fija.eliminarFijo(pid);
    if (result.variableOk) window.memoria_estatica_variable.eliminarFijo(pid);
    return { anyOk: false, warning: resDinamica };
  } else {
    result.dinamicaOk = true;
    result.anyOk = true;
  }

  // Dinámica con compactación (opcional)
  if (window.memoria_dinamica_con_compactacion) {
    const resCon = window.memoria_dinamica_con_compactacion.insertarProcesoDinamico(
      pid,
      tamProceso,
      localStorage.getItem("algoritmoElegido")
    );
    if (typeof resCon === 'string' && resCon.startsWith('Error')) {
      // revertir las otras que ya se insertaron
      if (result.fijaOk) window.memoria_estatica_fija.eliminarFijo(pid);
      if (result.variableOk) window.memoria_estatica_variable.eliminarFijo(pid);
      if (result.dinamicaOk) window.memoria_dinamica_sin_compactacion.eliminarDinamicoSinCompactacion(pid);
      return { anyOk: false, warning: resCon };
    } else {
      result.conOk = true;
    }
  }

  // actualizar vistas
  imprimirLista(window.memoria_dinamica_sin_compactacion);
  actualizarVistaMemoriaDinamicaSinCompactacion();
  actualizarVistaMemoriaDinamicaConCompactacion();

  return result;
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

// Mostrar detalles de un proceso (rápido: alert). Puede reemplazarse por un modal más elegante.
function mostrarDetalles(pid) {
  const app = obtenerAppPorPid(pid);
  if (!app) return showModal('Error', 'No se encontró la aplicación.');
  const tamProceso = app.codigo + app.datosIni + app.datosNoIni;
  const msg = `PID: ${app.pid}\nNombre: ${app.nombre}\nCódigo: ${app.codigo.toLocaleString()}\nDatos ini: ${app.datosIni.toLocaleString()}\nDatos no ini: ${app.datosNoIni.toLocaleString()}\nTamaño total: ${tamProceso.toLocaleString()} bytes`;
  showModal('Detalles del proceso', msg);
}

function actualizarVistaMemoriaFija() {
  const memoria = document.getElementById("memoria-estatica-fija");
  if (!memoria) return;

  memoria.innerHTML = "";

  // Guardamos todos los nodos en un array
  let nodos = [];
  let actual = window.memoria_estatica_fija.head;
  while (actual) {
    nodos.push(actual);
    actual = actual.next;
  }

  // Recorremos en orden inverso (para que se dibuje de abajo hacia arriba)
  for (let i = nodos.length - 1; i >= 0; i--) {
    const nodo = nodos[i];

    // Determinar clase de bloque según estado
    let clase = "bloque libre";
    if (nodo.pid === "S.O") {
      clase = "bloque so";
    } else if (nodo.estado === "Ocupado") {
      clase = "bloque ocupado"; // verde
    }

    const b = document.createElement("div");
    b.className = clase;
    b.style.flexGrow = nodo.size / TOTAL;

    b.innerHTML = `
      <div>${nodo.hex}</div>
      <div>${nodo.dec}</div>
      <div>${nodo.pid || ""}</div>
      <div>${nodo.size.toLocaleString()}</div>
    `;

    memoria.appendChild(b);
  }
}

function actualizarVistaMemoriaDinamicaConCompactacion() {
  const memoria = document.getElementById("memoria-dinamica-con");
  if (!memoria) return;

  memoria.innerHTML = "";

  // Guardamos todos los nodos en un array
  let nodos = [];
  let actual = window.memoria_dinamica_con_compactacion ? window.memoria_dinamica_con_compactacion.head : null;
  while (actual) {
    nodos.push(actual);
    actual = actual.next;
  }

  // Recorremos en orden inverso (para que se dibuje de abajo hacia arriba)
  for (let i = nodos.length - 1; i >= 0; i--) {
    const nodo = nodos[i];

    // Determinar clase de bloque según estado
    let clase = "bloque libre";
    if (nodo.pid === "S.O") {
      clase = "bloque so";
    } else if (nodo.estado === "Ocupado") {
      clase = "bloque ocupado"; // verde
    }

    const b = document.createElement("div");
    b.className = clase;
    b.style.flexGrow = nodo.size / TOTAL;

    b.innerHTML = `
      <div>${nodo.hex}</div>
      <div>${nodo.dec}</div>
      <div>${nodo.pid || ""}</div>
      <div>${nodo.size.toLocaleString()}</div>
    `;

    memoria.appendChild(b);
  }
}

function actualizarVistaMemoriaFijaVariable() {
  const memoria = document.getElementById("memoria-estatica-variable");
  if (!memoria) return;

  memoria.innerHTML = "";

  // Guardamos todos los nodos en un array
  let nodos = [];
  let actual = window.memoria_estatica_variable.head;
  while (actual) {
    nodos.push(actual);
    actual = actual.next;
  }

  // Recorremos en orden inverso (para que se dibuje de abajo hacia arriba)
  for (let i = nodos.length - 1; i >= 0; i--) {
    const nodo = nodos[i];

    // Determinar clase de bloque según estado
    let clase = "bloque libre";
    if (nodo.pid === "S.O") {
      clase = "bloque so";
    } else if (nodo.estado === "Ocupado") {
      clase = "bloque ocupado"; // verde
    }

    const b = document.createElement("div");
    b.className = clase;
    b.style.flexGrow = nodo.size / TOTAL;

    b.innerHTML = `
      <div>${nodo.hex}</div>
      <div>${nodo.dec}</div>
      <div>${nodo.pid || ""}</div>
      <div>${nodo.size.toLocaleString()}</div>
    `;

    memoria.appendChild(b);
  }
}


function actualizarVistaMemoriaDinamicaSinCompactacion() {
  const memoria = document.getElementById("memoria-dinamica-sin");
  if (!memoria) return;

  memoria.innerHTML = "";

  // Guardamos todos los nodos en un array
  let nodos = [];
  let actual = window.memoria_dinamica_sin_compactacion.head;
  while (actual) {
    nodos.push(actual);
    actual = actual.next;
  }

  // Recorremos en orden inverso (para que se dibuje de abajo hacia arriba)
  for (let i = nodos.length - 1; i >= 0; i--) {
    const nodo = nodos[i];

    // Determinar clase de bloque según estado
    let clase = "bloque libre";
    if (nodo.pid === "S.O") {
      clase = "bloque so";
    } else if (nodo.estado === "Ocupado") {
      clase = "bloque ocupado"; // verde
    }

    const b = document.createElement("div");
    b.className = clase;
    b.style.flexGrow = nodo.size / TOTAL;

    b.innerHTML = `
      <div>${nodo.hex}</div>
      <div>${nodo.dec}</div>
      <div>${nodo.pid || ""}</div>
      <div>${nodo.size.toLocaleString()}</div>
    `;

    memoria.appendChild(b);
  }
}


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

