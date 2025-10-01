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
      btnEstado.onclick = () => cambiarEstado(index, false);
    } else {
      btnEstado.textContent = "✔"; // inactivo -> iniciar
      btnEstado.title = "Iniciar";
      btnEstado.onclick = () => cambiarEstado(index, true);
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
  const memoria = document.getElementById("memoria-estatica-fija");
  if (memoria) {
    memoria.innerHTML = "";

    // valores de prueba — cámbialos y verás cómo se ajusta la proporción
    crearBloque(memoria, { hex: "0x000000", dec: 0, pid: "", tam: 8388608 });        // 8 MB libre
    crearBloque(memoria, { hex: "0x800000", dec: 14000000, pid: 1, tam: 20000000 });   // 7 MB ocupado
    crearBloque(memoria, { hex: "0xF00000", dec: 15728640, pid: "S.O", tam: 1048576 }); // 1 MB SO
  }
});
