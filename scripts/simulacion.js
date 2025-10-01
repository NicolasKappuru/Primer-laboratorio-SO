//Pedazo para paneles
function loadScript(file) {
  let script = document.createElement("script");
  script.src = file;
  document.body.appendChild(script);
}

function showPanel(panelId) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.getElementById(panelId).classList.add("active");

  if (panelId === "estatica_fija") loadScript("../scripts/estatica_fija.js");
  if (panelId === "estatica_variable") loadScript("../scripts/estatica_variable.js");
  if (panelId === "dinamica_sin_compactacion") loadScript("../scripts/dinamica_sin_compactacion.js");
  if (panelId === "dinamica_con_compactacion") loadScript("../scripts/dinamica_con_compactacion.js");
}

//Aplicaciones
/* simulacion.js */

// tabla global de aplicaciones
window.aplicaciones = window.aplicaciones || [];

/* Renderiza la tabla en el sidebar */
function renderTabla() {
  const tbody = document.querySelector("#tabla-aplicaciones tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  aplicaciones.forEach((app, index) => {
    const row = document.createElement("tr");

    // Nombre
    const colNombre = document.createElement("td");
    colNombre.textContent = app.nombre;
    row.appendChild(colNombre);

    // Acciones
    const colAcciones = document.createElement("td");

    // Botón estado (activar/inactivar)
    const btnEstado = document.createElement("button");
    btnEstado.style.marginRight = "8px";
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

/* Manejo de paneles en el lado derecho.
   showPanel recibe el id del panel y opcionalmente el botón que lo llamó (btnEl).
*/
function showPanel(panelId, btnEl) {
  // ocultar todos
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  // mostrar el seleccionado
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add("active");

  // manejar estilo de botón activo
  document.querySelectorAll(".toolbar button").forEach(b => b.classList.remove("active-btn"));
  if (btnEl) btnEl.classList.add("active-btn");
}

//Para imprimir tabla en consola
document.addEventListener("DOMContentLoaded", () => {
  const btnImprimir = document.getElementById("imprimir_tabla");

  if (btnImprimir) {
    btnImprimir.addEventListener("click", () => {
      console.clear();
      console.log("📋 Tabla lógica de aplicaciones:");
      console.table(window.aplicaciones);
    });
  }
});
