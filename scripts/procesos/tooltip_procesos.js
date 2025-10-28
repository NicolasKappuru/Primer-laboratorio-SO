// --- Inicio: código tooltip para tabla de procesos ---
// Asegúrate de ejecutar esto después de que exista #tabla-procesos en el DOM.
// Si lo añades al final de procesos.js debería bastar.

// Obtener referencia al tooltip (si no existe, crear uno)
let tooltip = document.getElementById('tooltip-memoria');
if (!tooltip) {
  tooltip = document.createElement('div');
  tooltip.id = 'tooltip-memoria';
  document.body.appendChild(tooltip);
}

// Helper: determina si el hover está permitido
function hoverPermitido() {
  const pag = document.getElementById('paginacion');
  const seg = document.getElementById('segmentacion');
  // comprobamos la clase 'active' usada en tu HTML para paneles visibles
  return (pag && pag.classList.contains('active')) || (seg && seg.classList.contains('active'));
}

// Delegación: escucha sobre el tbody para no tener que re-ligar listeners cada render
const tbodyProcesos = document.querySelector('#tabla-procesos tbody');

if (tbodyProcesos) {
  // mouseover y mouseout (mouseenter/mouseleave no burbujean -> delegación con mouseover/mouseout)
  tbodyProcesos.addEventListener('mouseover', (ev) => {
    const td = ev.target.closest('td');
    if (!td || !tbodyProcesos.contains(td)) return;

    if (!td.classList.contains('pid-cell')) return;
    if (!hoverPermitido()) return;

    const pid = td.dataset.pid || td.textContent.trim();
    tooltip.textContent = `Hola PID ${pid}`;
    tooltip.classList.add('visible');
    tooltip.setAttribute('aria-hidden', 'false');
    // posicionarlo cerca del cursor si tenemos info de mouse (mouseover no trae coords fiables),
    // así que no lo posicionamos aquí; lo posicionaremos en mousemove.
  });

  tbodyProcesos.addEventListener('mousemove', (ev) => {
    const td = ev.target.closest('td');
    if (!td || !td.classList.contains('pid-cell')) {
      tooltip.classList.remove('visible');
      tooltip.setAttribute('aria-hidden', 'true');
      return;
    }
    if (!hoverPermitido()) {
      tooltip.classList.remove('visible');
      tooltip.setAttribute('aria-hidden', 'true');
      return;
    }

    // offset para no cubrir el cursor
    const x = ev.pageX + 10;
    const y = ev.pageY + 12;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  });

  tbodyProcesos.addEventListener('mouseout', (ev) => {
    // Cuando el cursor sale de la celda, ocultar tooltip
    const related = ev.relatedTarget;
    const fromTd = ev.target.closest('td');
    if (!fromTd) return;
    if (related && fromTd.contains(related)) return; // si todavía está dentro, no ocultar

    if (fromTd.classList.contains('pid-cell')) {
      tooltip.classList.remove('visible');
      tooltip.setAttribute('aria-hidden', 'true');
    }
  });
}
// --- Fin: código tooltip para tabla de procesos ---
