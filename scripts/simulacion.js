// =======================
// Paneles (mostrar/ocultar)
// =======================
window.panelActivo = "estatica_fija";

window.ejeYPIDs = [];

function showPanel(panelId, btnEl) {
  // ocultar todos los paneles
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  // mostrar el seleccionado
  const panel = document.getElementById(panelId);
  //console.log("Panel seleccionado: ", panelId);
  if (panel) panel.classList.add("active");
  window.panelActivo = panelId;
  
  // manejar estilo de botón activo
  document.querySelectorAll(".toolbar button").forEach(b => b.classList.remove("active-btn"));
  if (btnEl) btnEl.classList.add("active-btn");

  // actualizar vistas según panel activo
  if (panelId === "fcfs" && typeof window.actualizarVistaEjeX === "function") {
    window.actualizarVistaEjeX();
  }

  if (panelId === "fcfs" && typeof window.actualizarVistaEjeY === "function") {
      window.actualizarVistaEjeY(); 
  }
}



// =======================
// Ejemplo dinámico SOLO en estática fija
// =======================
document.addEventListener("DOMContentLoaded", () => {
  //console.log("Panel Actual "+window.panelActivo);
  renderTablaAplicaciones();
  renderTablaProcesos();
  actualizarVistas();
  actualizarVistaDiscontiguas();

  actualizarVistaEjeX();     // <<< NUEVO

});


