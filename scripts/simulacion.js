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
}

// =======================
// Aplicaciones (panel izquierdo)
// =======================

// tabla global de aplicaciones
window.aplicaciones = window.aplicaciones || [];

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

    // Botón desinstalar
    const btnBorrar = document.createElement("button");
    btnBorrar.textContent = "Desinstalar";
    btnBorrar.onclick = () => {
      if (confirm(`Desinstalar "${app.nombre}"?`)) desinstalarApp(index);
    };
    colAcciones.appendChild(btnBorrar);

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
  // cuando se cargue la página, dibujamos lo que haya en memoria fija
  actualizarVistaMemoriaFija();
  actualizarVistaMemoriaFijaVariable();
  actualizarVistaMemoriaDinamicaSinCompactacion();
});



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

  console.log("Resultado de insertar en memoria:", tamProceso);
  // Llamada para mostrar tu memoria
  imprimirLista(window.memoria_dinamica_sin_compactacion);

}

function eliminarProceso(pid){
  window.memoria_estatica_fija.eliminarFijo(pid); 
  window.memoria_estatica_variable.eliminarFijo(pid);
  window.memoria_dinamica_sin_compactacion.eliminarDinamicoSinCompactacion(pid);
  imprimirLista(window.memoria_dinamica_sin_compactacion);

}

//Para obtener los datos de una app por su PID
function obtenerAppPorPid(pid) {
  return window.aplicaciones.find(app => app.pid == pid);
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

