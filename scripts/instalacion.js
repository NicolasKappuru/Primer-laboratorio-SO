/* instalacion.js */


// contador global de id_program
window.nextIDProgram = window.nextIDProgram || 9; // empieza en 9 porque hay 8 apps por defecto

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
      id_program: window.nextIDProgram++, // ✅ asigna id_program secuencial
      nombre: document.getElementById("nombre").value.trim(),
      codigo: Number(document.getElementById("codigo").value) || 0,
      datosIni: Number(document.getElementById("datosIni").value) || 0,
      datosNoIni: Number(document.getElementById("datosNoIni").value) || 0,
      estado: false, // inicia inactiva

      tiempo_ejecucion: 0,
      inicio_bloqueo: 0,
      duracion: 0
    };

  
    // guardar en arreglo global
    window.aplicaciones.push(nuevaApp);

    // re-render tabla
    if (typeof renderTablaAplicaciones === "function") renderTablaAplicaciones();

    // cerrar modal
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  
    imprimirAplicaciones();
  });
});


function imprimirAplicaciones() {
  console.log("=== Tabla Global de Aplicaciones ===");
  if (window.aplicaciones.length === 0) {
    console.log("No hay aplicaciones instaladas.");
    return;
  }

  window.aplicaciones.forEach(app => {
    console.log(`id_program: ${app.id_program} | Nombre: ${app.nombre} | Estado: ${app.estado ? "Activo" : "Inactivo"}`);
  });

  console.log("=== Fin de tabla ===");
}
