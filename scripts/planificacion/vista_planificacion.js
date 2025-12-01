// Lista global (persistente)
window.procesosVerticales = window.procesosVerticales || [];

(function () {

  // filas: filas[0] = fila clock, filas[1..N] = filas de procesos (de abajo hacia arriba)
  let filas = [];

  // -----------------------
  // Inicializa la estructura base (no carga procesosVerticales)
  // -----------------------
  function initState() {
    filas = [];
    filas.push([""]); // fila clock: 1 columna vacía por defecto
  }

  // -----------------------
  // Reconstruye filas (usada SOLO desde addClockColumn)
  // -----------------------
  function actualizarFilasVerticales(numCols) {
    // Guardar la fila clock actual (si existe) para preservarla
    const priorClock = filas[0] ? filas[0].slice() : new Array(numCols).fill("");

    // Reiniciar filas con la fila clock preservada (si priorClock tiene menos columnas, lo rellenamos)
    const clockRow = priorClock.slice();
    while (clockRow.length < numCols) clockRow.push("");

    filas = [];
    filas.push(clockRow);

    // Crear una fila por cada PID en window.procesosVerticales (desde abajo hacia arriba)
    // Cada fila de proceso tendrá longitud numCols y el PID en la PRIMERA COLUMNA (índice 0)
    for (let pid of window.procesosVerticales) {
      const arr = new Array(numCols).fill("");
      arr[0] = String(pid); // colocar el PID en la primera celda de esa fila
      filas.push(arr);
    }
  }

  // -----------------------
  // Renderiza las filas en el DOM
  // -----------------------
  function renderGrid() {
    const grid = document.getElementById("grid-clock");
    if (!grid) return;

    const columnas = filas[0].length;
    grid.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;
    grid.innerHTML = "";

    // Pintar desde la fila superior (última) hacia la fila 0 (clock)
    for (let r = filas.length - 1; r >= 0; r--) {
      for (let c = 0; c < columnas; c++) {
        const d = document.createElement("div");
        d.className = "cell";
        d.textContent = filas[r][c] || "";
        grid.appendChild(d);
      }
    }

    grid.scrollLeft = grid.scrollWidth;
  }

  // -----------------------
  // Expuesta: inicializar vista (NO carga procesosVerticales)
  // Llamada al entrar al panel — NO debe mostrar procesos añadidos hasta que se pulse Clock
  // -----------------------
  window.renderGridProcesos = function () {
    initState();
    // IMPORTANTE: NO llamamos a actualizarFilasVerticales aquí para evitar que la vista cambie
    // al registrar procesos. La vista solo se actualiza (vertical + horizontal) cuando se presiona Clock.
    renderGrid();
  };

  // -----------------------
  // Expuesta: añadir columna del clock (se llama al oprimir Clock)
  // -----------------------
  window.addClockColumn = function (clockNumber) {

    // Asegurar que hay estructura inicial
    if (!filas || filas.length === 0) initState();

    // Guardar copia de la fila clock actual
    const priorClock = filas[0] ? filas[0].slice() : [""];

    const currentCols = priorClock.length;

    // Reconstruir filas verticales con la cantidad actual de columnas (preserva priorClock)
    actualizarFilasVerticales(currentCols);

    // Restaurar la fila clock preservada
    filas[0] = priorClock.slice();

    // Añadir la nueva columna: clockNumber en fila clock, "" en filas de procesos
    for (let i = 0; i < filas.length; i++) {
      if (i === 0) filas[i].push(clockNumber.toString());
      else filas[i].push("");
    }

    // Ahora que las filas están listas y alineadas, renderizamos
    renderGrid();
  };

  // -----------------------
  // Expuesta: registrar proceso (solo modifica la lista global)
  // -----------------------
  window.registrarProcesoVertical = function(pid) {
    window.procesosVerticales.push(pid);
    // NOTA: No renderizamos aquí. La vista solo cambia cuando se presiona Clock.
  };





  // -----------------------
  // Es es el metodo que usaremos, para colorear la grid
  // -----------------------
  
  window.paintCell = function(x_in, y_in, color) {
    const x = x_in + 1;
    const y = y_in + 1;

    const grid = document.getElementById("grid-clock");
    if (!grid) return;

    const columnas = filas[0].length;
    if (x < 1 || x > columnas) {
      console.warn("Columna fuera de rango:", x);
      return;
    }
    if (y < 1 || y > filas.length) {
      console.warn("Fila fuera de rango:", y);
      return;
    }

    // filaDesdeArriba: 1 = top DOM row, filas.length = bottom (clock)
    const filaDesdeArriba = (filas.length + 1) - y;
    const domIndex = (filaDesdeArriba - 1) * columnas + (x - 1);

    const cell = grid.children[domIndex];
    if (!cell) return;

    cell.style.background = color;
  };

})();
