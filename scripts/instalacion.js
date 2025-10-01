/* instalacion.js */

// contador global de PID
window.nextPID = window.nextPID || 1;

document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("dialog-instalar");
  const btnInstalar = document.getElementById("btn-instalar");
  const form = document.getElementById("form-instalar");
  const btnCancelar = document.getElementById("btn-cancelar");

  if (!dialog || !btnInstalar || !form) return;

  // abrir modal
  btnInstalar.addEventListener("click", () => {
    form.reset(); // limpiar antes de mostrar
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  });

  // cancelar
  btnCancelar.addEventListener("click", () => {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  });

  // submit: crear app y guardarla en la tabla global
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevaApp = {
      pid: window.nextPID++, // ✅ asigna PID secuencial
      nombre: document.getElementById("nombre").value.trim(),
      codigo: Number(document.getElementById("codigo").value) || 0,
      datosIni: Number(document.getElementById("datosIni").value) || 0,
      datosNoIni: Number(document.getElementById("datosNoIni").value) || 0,
      estado: false // inicia inactiva
    };

    // guardar en arreglo global
    window.aplicaciones.push(nuevaApp);

    // re-render tabla
    if (typeof renderTabla === "function") renderTabla();

    // cerrar modal
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  });
});
