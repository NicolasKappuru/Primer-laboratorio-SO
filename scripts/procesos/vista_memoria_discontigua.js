function actualizarVistaMemoriaSegmentacion() {
  const memoria = document.getElementById("tabla-segmentos");
  if (!memoria) return;

  memoria.innerHTML = "";

  // Guardamos todos los nodos en un array
  let nodos = [];
  let actual = window.memoria_segmentacion.head;
  while (actual) {
    nodos.push(actual);
    actual = actual.next;
  }

  // Recorremos en orden inverso (para que se dibuje de abajo hacia arriba)
  for (let i = nodos.length - 1; i >= 0; i--) {
    const nodo = nodos[i];

    // Determinar clase de bloque según estado
    let clase = "bloque libre";
    if (nodo.pid === "S.O") {
      clase = "bloque so";
    } else if (nodo.estado === "Ocupado") {
      clase = "bloque ocupado"; // verde
    }

    const b = document.createElement("div");
    b.className = clase;
    b.style.flexGrow = nodo.size / TOTAL;

    b.innerHTML = `
      <div>${nodo.hex}</div>
      <div>${nodo.dec}</div>
      <div>${nodo.pid || ""}</div>
      <div>${nodo.size.toLocaleString()}</div>
    `;

    crearTooltip(b, document, nodo);

    memoria.appendChild(b);
  }
}


function crearTooltip(b, document, nodo){
  const tooltip = document.createElement("div");
  tooltip.id = "tooltip-memoria"; // le damos un ID
  tooltip.style.display = "none";
  document.body.appendChild(tooltip);

  b.addEventListener("mouseover", () => {
    console.log("Hover sobre bloque:", nodo);
    tooltip.textContent = `Tamaño usado: ${nodo.tam_proceso.toLocaleString()} bytes\n`;
    tooltip.textContent += `Tamaño sin usar: ${(nodo.size-nodo.tam_proceso).toLocaleString()} bytes`;
    tooltip.style.display = "block";
    tooltip.classList.add("visible");
  });

  b.addEventListener("mousemove", (e) => {
    tooltip.style.left = e.pageX + 10 + "px";
    tooltip.style.top = e.pageY + 10 + "px";
  });

  b.addEventListener("mouseout", () => {
    console.log("Saliste del bloque:", nodo);
    tooltip.style.display = "none";
    tooltip.classList.remove("visible");
  });
}

function actualizarVistaDiscontiguas(){
    actualizarVistaMemoriaSegmentacion();
}