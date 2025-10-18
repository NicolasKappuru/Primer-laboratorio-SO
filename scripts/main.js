// Variable global (disponible desde cualquier otro script en esta sesión)
window.algoritmoSeleccionado = null;

// --- Manejar selección de botones ---
function selectOption(option, event) {
  // Guardar en variable global
  window.algoritmoSeleccionado = option;

  // Quitar selección previa
  document.querySelectorAll(".options button").forEach(btn => btn.classList.remove("selected"));

  // Marcar el botón actual como seleccionado
  event.target.classList.add("selected");

  // hide any previous warning
  const warn = document.getElementById('warning-message');
  if (warn) warn.style.display = 'none';
  console.log("Algoritmo seleccionado:", window.algoritmoSeleccionado);
}

// --- Continuar al simulador ---
function continuar() {
  if (!window.algoritmoSeleccionado) {
    // show inline warning instead of alert
    const warn = document.getElementById('warning-message');
    if (warn) {
      warn.textContent = 'Por favor selecciona un algoritmo antes de continuar.';
      warn.style.display = 'block';
      // focus the options container for accessibility
      const firstBtn = document.querySelector('.options button');
      if (firstBtn) firstBtn.focus();
    } else {
      alert('Por favor selecciona un algoritmo antes de continuar.');
    }
    return;
  }

  // Guardar selección en localStorage (para que persista entre páginas)
  localStorage.setItem("algoritmoElegido", window.algoritmoSeleccionado);

  console.log("Guardado en localStorage:", window.algoritmoSeleccionado);

  // Ir al simulador
  window.location.href = "simulacion.html";


}

// --- Al cargar la página ---
document.addEventListener("DOMContentLoaded", () => {
  // Si ya había algo guardado en localStorage, lo recuperamos
  const guardado = localStorage.getItem("algoritmoElegido");
  if (guardado) {
    window.algoritmoSeleccionado = guardado;

    // Marcar visualmente el botón correspondiente
    // Prefer matching by data-option attribute
    const matched = document.querySelector(`.options button[data-option="${guardado}"]`);
    if (matched) {
      matched.classList.add('selected');
    } else {
      // fallback: try match by textContent
      document.querySelectorAll('.options button').forEach(btn => {
        if (btn.textContent.trim() === guardado) btn.classList.add('selected');
      });
    }

    console.log("Algoritmo recuperado:", guardado);
  }
});
