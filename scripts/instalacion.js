/* instalacion.js */


// contador global de PID
window.nextPID = window.nextPID || 1;


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

    const tamProceso = nuevaApp.codigo + nuevaApp.datosIni + nuevaApp.datosNoIni;
    
    window.memoria_estatica_fija.insertarProcesoFijo(
    nuevaApp.pid,
    tamProceso,
    "PrimerOrden" 
    );

    console.log("Resultado de insertar en memoria:", tamProceso);


    // Llamada para mostrar tu memoria
    imprimirLista(window.memoria_estatica_fija);






    // guardar en arreglo global
    window.aplicaciones.push(nuevaApp);

    // re-render tabla
    if (typeof renderTabla === "function") renderTabla();

    // cerrar modal
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  });
});
