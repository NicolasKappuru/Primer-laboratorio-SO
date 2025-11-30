// DIMENSIONES (coherentes con CSS)
const COL_WIDTH = 32;   // ancho por tick (px)
const ROW_HEIGHT = 32;  // alto por fila (px)

// arreglo con PIDs (se va llenando con pidNuevo)
window.ejeYPIDs = window.ejeYPIDs || [];

// Actualiza eje X y establece template de columnas para que se use también en el cuerpo
window.actualizarVistaEjeX = function () {
  const contX = document.getElementById("gantt-eje-x");
  const cuerpo = document.getElementById("gantt-cuerpo");
  if (!contX || !cuerpo) return;

  contX.innerHTML = "";

  const n = Number(window.clock) || 0;

  // Crear columnas (ticks) en el eje X
  for (let i = 0; i < n; i++) {
    const t = document.createElement("div");
    t.className = "gantt-tick";
    t.textContent = i + 1;
    contX.appendChild(t);
  }

  // sincronizar grid-template-columns del cuerpo con los ticks
  const cols = n > 0 ? `repeat(${n}, ${COL_WIDTH}px)` : "none";
  cuerpo.style.gridTemplateColumns = cols;

  // también asegurarnos grid-template-rows según PIDs
  const filas = window.ejeYPIDs.length;
  cuerpo.style.gridTemplateRows = filas > 0 ? `repeat(${filas}, ${ROW_HEIGHT}px)` : "none";

  // (reconstruimos las celdas para mantener la alineación)
  rebuildCuerpoGrid();
};

window.agregarPID = function (pidNuevo) {
    if (pidNuevo !== undefined) {
      window.ejeYPIDs.push(pidNuevo);
    }
};

// Actualiza eje Y — recibe pidNuevo opcional
window.actualizarVistaEjeY = function () {
  const contY = document.getElementById("gantt-eje-y");
  const cuerpo = document.getElementById("gantt-cuerpo");
  if (!contY || !cuerpo) return;
  // Limpiar y dibujar Y (de mayor a menor para que lo nuevo quede arriba)
  contY.innerHTML = "";
  const ordenados = [...window.ejeYPIDs].sort((a,b)=> a-b);

  for (let i = ordenados.length - 1; i >= 0; i--) {
    const pid = ordenados[i];
    const fila = document.createElement("div");
    fila.className = "gantt-pid-row";
    fila.textContent = "PID " + pid;
    contY.appendChild(fila);
  }

  // sincronizar grid rows del cuerpo
  const filas = window.ejeYPIDs.length;
  cuerpo.style.gridTemplateRows = filas > 0 ? `repeat(${filas}, ${ROW_HEIGHT}px)` : "none";

  // reconstruir celdas del body para que queden alineadas
  rebuildCuerpoGrid();
};

// Reconstruye (o actualiza) el #gantt-cuerpo con la cantidad correcta de celdas
function rebuildCuerpoGrid() {
  const cuerpo = document.getElementById("gantt-cuerpo");
  if (!cuerpo) return;

  const nCols = (Number(window.clock) || 0);
  const nRows = window.ejeYPIDs.length;

  cuerpo.innerHTML = "";

  if (nCols === 0 || nRows === 0) return;

  // Crear nRows * nCols celdas (vacías por ahora)
  // Recorremos filas de arriba hacia abajo: como usamos grid, el orden de appendChild
  // empieza en la primera celda (fila 1,col1) — para que coincida con ejeY invertido,
  // construiremos en orden de mayor PID a menor PID (coincide con la Y visual).
  const ordenados = [...window.ejeYPIDs].sort((a,b)=> a-b);

  // iterar de mayor a menor (para que la primera fila del grid corresponda al PID mayor,
  // que está en la parte superior de #gantt-eje-y por el column-reverse visual).
  for (let r = ordenados.length - 1; r >= 0; r--) {
    for (let c = 0; c < nCols; c++) {
      const cell = document.createElement("div");
      cell.className = "gantt-cell";
      // opcional: data attributes para identificar celda
      cell.dataset.pid = ordenados[r];
      cell.dataset.col = c + 1;
      cuerpo.appendChild(cell);
    }
  }
}

// Inicial render al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  window.ejeYPIDs = window.ejeYPIDs || [];
  window.actualizarVistaEjeX();
  window.actualizarVistaEjeY(); // redibuja vacío si no hay PIDs
});
