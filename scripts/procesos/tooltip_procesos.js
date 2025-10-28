// ======================================================
// Tooltip para tabla de procesos (segmentación y paginación)
// ======================================================

// Crear el tooltip si no existe
let tooltip = document.getElementById('tooltip-memoria');
if (!tooltip) {
  tooltip = document.createElement('div');
  tooltip.id = 'tooltip-memoria';
  document.body.appendChild(tooltip);
}

// ------------------------------------------------------
// Función auxiliar: determina si el hover está permitido
// ------------------------------------------------------
function hoverPermitido() {
  const pag = document.getElementById('paginacion');
  const seg = document.getElementById('segmentacion');
  return (pag && pag.classList.contains('active')) || (seg && seg.classList.contains('active'));
}

// ------------------------------------------------------
// Función para generar tabla de Paginación
// ------------------------------------------------------
function generarTablaPaginas(pid) {
  const lista = window.memoria_paginacion; // lista global de paginación
  if (!lista || !lista.head) return "<em>No hay datos de paginación</em>";

  let actual = lista.head;
  const filas = [];

  while (actual) {
    if (actual.pid == pid) {
      filas.push({ pagina: actual.num_pagina, marco: actual.num_marco });
    }
    actual = actual.next;
  }

  if (filas.length === 0) return "<em>PID sin páginas asignadas</em>";

  filas.sort((a, b) => a.pagina - b.pagina);

  let tabla = `<table class="tabla-tooltip">
                  <thead><tr><th>Página</th><th>Marco</th></tr></thead>
                  <tbody>`;
  for (const f of filas) {
    tabla += `<tr><td>${f.pagina}</td><td>${f.marco}</td></tr>`;
  }
  tabla += "</tbody></table>";

  return tabla;
}

// ------------------------------------------------------
// Función para generar tabla de Segmentación
// ------------------------------------------------------
function generarTablaSegmentos(pid) {
  const lista = window.listaSegmentosGlobal; // lista global de segmentos
  if (!lista || !lista.head) return "<em>No hay datos de segmentación</em>";

  let actual = lista.head;
  const filas = [];

  while (actual) {
    if (actual.pid == pid) {
      filas.push({
        num: actual.num,
        binario: actual.binario,
        dec: actual.dec,
        hex: actual.hex,
        size: actual.size,
        permisos: actual.permisos,
        tipo: actual.tipo,
        pid: actual.pid,
      });
    }
    actual = actual.next;
  }

  if (filas.length === 0) return "<em>PID sin segmentos asignados</em>";

  filas.sort((a, b) => a.num - b.num);

  let tabla = `<table class="tabla-tooltip">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Binario</th>
                      <th>Dec</th>
                      <th>Hex</th>
                      <th>Size</th>
                      <th>Permisos</th>
                      <th>Tipo</th>
                      <th>PID</th>
                    </tr>
                  </thead>
                  <tbody>`;

  for (const f of filas) {
    tabla += `<tr>
                <td>${f.num}</td>
                <td>${f.binario}</td>
                <td>${f.dec}</td>
                <td>${f.hex}</td>
                <td>${f.size}</td>
                <td>${f.permisos}</td>
                <td>${f.tipo}</td>
                <td>${f.pid}</td>
              </tr>`;
  }

  tabla += "</tbody></table>";
  return tabla;
}

// ------------------------------------------------------
// Delegación de eventos sobre el tbody de la tabla
// ------------------------------------------------------
const tbodyProcesos = document.querySelector('#tabla-procesos tbody');

if (tbodyProcesos) {
  let tooltipVisible = false;
  let tooltipFijo = false;

  // Mostrar tooltip al entrar sobre una celda PID
  tbodyProcesos.addEventListener('mouseenter', (ev) => {
    const td = ev.target.closest('td');
    if (!td || !td.classList.contains('pid-cell')) return;
    if (!hoverPermitido()) return;

    const pid = td.dataset.pid || td.textContent.trim();
    const pag = document.getElementById('paginacion');
    const seg = document.getElementById('segmentacion');

    if (pag && pag.classList.contains('active')) {
      tooltip.innerHTML = generarTablaPaginas(pid);
    } else if (seg && seg.classList.contains('active')) {
      tooltip.innerHTML = generarTablaSegmentos(pid);
    } else {
      return;
    }

    // Calcular posición inicial solo una vez
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = ev.pageX + 20;
    let y = ev.pageY - tooltipRect.height / 2;

    if (x + tooltipRect.width > viewportWidth - 10)
      x = ev.pageX - tooltipRect.width - 20;
    if (y < 10) y = 10;
    if (y + tooltipRect.height > viewportHeight - 10)
      y = viewportHeight - tooltipRect.height - 10;

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;

    tooltip.classList.add('visible');
    tooltip.setAttribute('aria-hidden', 'false');
    tooltipVisible = true;
    tooltipFijo = true;
  }, true);

  // Ocultar tooltip al salir completamente (ni celda PID ni tooltip)
  document.addEventListener('mousemove', (ev) => {
    if (!tooltipVisible) return;

    const target = ev.target;
    const sobreTooltip = tooltip.contains(target);
    const sobreCeldaPID = target.closest && target.closest('.pid-cell');

    if (!sobreTooltip && !sobreCeldaPID) {
      tooltip.classList.remove('visible');
      tooltip.setAttribute('aria-hidden', 'true');
      tooltipVisible = false;
      tooltipFijo = false;
    }
  });
}
