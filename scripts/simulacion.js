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
// Ejemplo dinámico SOLO en estática fija
// =======================
document.addEventListener("DOMContentLoaded", () => {
  renderTablaAplicaciones();
  renderTablaProcesos();
  actualizarVistas();
  actualizarVistaDiscontiguas();
});


