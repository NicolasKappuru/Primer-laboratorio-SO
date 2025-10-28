// =======================
// Aplicaciones (panel izquierdo)
// =======================

// tabla global de aplicaciones
window.aplicaciones = window.aplicaciones || [];

//Aplicaciones por defecto

if (window.aplicaciones.length === 0) {
  window.aplicaciones.push(
    { id_program: 1, nombre: "Notepad", estado: false, codigo: 19524, datosIni: 12352, datosNoIni: 1165 },
    { id_program: 2, nombre: "Word", estado: false, codigo: 77539, datosIni: 32680, datosNoIni: 4100 },
    { id_program: 3, nombre: "Excel", estado: false, codigo: 99542, datosIni: 24245, datosNoIni: 7557 },
    { id_program: 4, nombre: "AutoCAD", estado: false, codigo: 115000, datosIni: 123470, datosNoIni: 1123 },
    { id_program: 5, nombre: "Calculadora", estado: false, codigo: 12342, datosIni: 1256, datosNoIni: 1756 },
    { id_program: 6, nombre: "P1", estado: false, codigo: 525000, datosIni: 3224000, datosNoIni: 51000 },
    { id_program: 7, nombre: "P2", estado: false, codigo: 590000, datosIni: 974000, datosNoIni: 25000 },
    { id_program: 8, nombre: "P3", estado: false, codigo: 349000, datosIni: 2150000, datosNoIni: 1000 }
    
  );
}


/* Renderiza la tabla en el sidebar */
function renderTablaAplicaciones() {
  const tbody = document.querySelector("#tabla-aplicaciones tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  aplicaciones.forEach((app, index) => {
    const row = document.createElement("tr");

    // id_program
    const colIDProgram = document.createElement("td");
    colIDProgram.textContent = app.id_program || "-";
    row.appendChild(colIDProgram);

    // Nombre
    const colNombre = document.createElement("td");
    colNombre.textContent = app.nombre;
    row.appendChild(colNombre);

    // Acciones
    const colAcciones = document.createElement("td");

    // Botón estado (activar/inactivar)
    const btnEstado = document.createElement("button");
    btnEstado.style.marginRight = "4px";
    
    btnEstado.textContent = "✔"; // inactivo -> iniciar
    btnEstado.title = "Iniciar";
    btnEstado.onclick = () => {
      console.log(colIDProgram.textContent)
      console.log("Se creo el proceso de la app ", app.id_program);
      iniciarProceso(colIDProgram.textContent, window.panelActivo);
      renderTablaProcesos();
      actualizarVistaMemoriaFija();
      actualizarVistaMemoriaFijaVariable();
      actualizarVistaMemoriaDinamicaSinCompactacion();      
    }
    colAcciones.appendChild(btnEstado);

    // Botón desinstalar
    const btnBorrar = document.createElement("button");
    btnBorrar.textContent = "Desinstalar";
    btnBorrar.onclick = () => {
      if (confirm(`Desinstalar "${app.nombre}"?`)) desinstalarApp(index);
    };
    colAcciones.appendChild(btnBorrar);

    if(!app.estado) btnBorrar.disabled = false;
    else btnBorrar.disabled = true;

    row.appendChild(colAcciones);
    tbody.appendChild(row);
  });
}

/* Desinstalar */
function desinstalarApp(index) {
  aplicaciones.splice(index, 1);
  renderTablaAplicaciones();
}