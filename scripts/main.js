// Variable global (disponible desde cualquier otro script en esta sesión)
window.algoritmoSeleccionado = null;

// --- Manejar selección de botones ---
function selectOption(option, event) {
  // Guardar en variable global
  window.algoritmoSeleccionado = option;

  // Quitar selección previa
  document.querySelectorAll("button").forEach(btn => btn.classList.remove("selected"));

  // Marcar el botón actual como seleccionado
  event.target.classList.add("selected");

  console.log("Algoritmo seleccionado:", window.algoritmoSeleccionado);
}

// --- Continuar al simulador ---
function continuar() {
  if (!window.algoritmoSeleccionado) {
    alert("Por favor selecciona un algoritmo antes de continuar.");
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
    document.querySelectorAll("button").forEach(btn => {
      if (btn.textContent === guardado) btn.classList.add("selected");
    });

    console.log("Algoritmo recuperado:", guardado);
  }
});
