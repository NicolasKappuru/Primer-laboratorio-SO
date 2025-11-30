// total de memoria (16 MB)
const TOTAL = 16777216;

function actualizarVistaMemoriaFija() {
  const memoria = document.getElementById("memoria-estatica-fija");
  if (!memoria) return;

  memoria.innerHTML = "";

  // Guardamos todos los nodos en un array
  let nodos = [];
  let actual = window.memoria_estatica_fija.head;
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

function actualizarVistaMemoriaFijaVariable() {
  const memoria = document.getElementById("memoria-estatica-variable");
  if (!memoria) return;

  memoria.innerHTML = "";

  // Guardamos todos los nodos en un array
  let nodos = [];
  let actual = window.memoria_estatica_variable.head;
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


function actualizarVistaMemoriaDinamicaSinCompactacion() {
  const memoria = document.getElementById("memoria-dinamica-sin");
  if (!memoria) return;

  memoria.innerHTML = "";

  // Guardamos todos los nodos en un array
  let nodos = [];
  let actual = window.memoria_dinamica_sin_compactacion.head;
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

    memoria.appendChild(b);
  }
}

function actualizarVistaMemoriaDinamicaConCompactacion() {
  const memoria = document.getElementById("memoria-dinamica-con");
  if (!memoria) return;

  memoria.innerHTML = "";

  // Guardamos todos los nodos en un array
  let nodos = [];
  let actual = window.memoria_dinamica_con_compactacion ? window.memoria_dinamica_con_compactacion.head : null;
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

    memoria.appendChild(b);
  }
}

function crearTooltip(b, document, nodo){
  const tooltip = document.createElement("div");
  tooltip.id = "tooltip-memoria"; // le damos un ID
  tooltip.style.display = "none";
  document.body.appendChild(tooltip);

  b.addEventListener("mouseover", () => {
    //console.log("Hover sobre bloque:", nodo);
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
    //console.log("Saliste del bloque:", nodo);
    tooltip.style.display = "none";
    tooltip.classList.remove("visible");
  });
}

// === ACTUALIZAR VISTA DE PAGINACIÓN ===
function actualizarVistaPaginacion() {
  const memoria = document.getElementById("tabla-paginas");
  if (!memoria) return;

  memoria.innerHTML = "";

  // Accedemos a la estructura global de memoria paginada
  const lista = (typeof window !== "undefined" ? window.memoria_paginacion : global.memoria_paginacion);
  if (!lista || !lista.head) {
    console.warn("⚠️ No se encontró la memoria paginada inicializada.");
    return;
  }

  // Recorremos todos los nodos de la lista enlazada
  let actual = lista.head;
  const nodos = [];
  while (actual) {
    nodos.push(actual);
    actual = actual.next;
  }

  // Mostramos de arriba hacia abajo (orden natural)
  for (let i = 0; i < nodos.length; i++) {
    const nodo = nodos[i];

    // Determinar clase visual según estado
    let clase = "bloque libre";
    if (nodo.estado === "ocupado") clase = "bloque ocupado";
    if (nodo.pid === "S.O") clase = "bloque so";

    // Crear el bloque visual
    const bloque = document.createElement("div");
    bloque.className = clase;
    const TAM_MARCO = 65536;

    // Cada bloque contiene 5 columnas
    bloque.innerHTML = `
      <div>${nodo.hex || "-"}</div>
      <div>${nodo.dec?.toLocaleString() || "-"}</div>
      <div>${nodo.pid ? nodo.pid + (nodo.tipo_segmento ? " / " + nodo.tipo_segmento : "") : "-"}</div>
      <div>${TAM_MARCO.toLocaleString()}</div>  <!-- ← constante, no cambia -->
      <div>${nodo.num_marco != null ? nodo.num_marco : "-"}</div>
    `;


    memoria.appendChild(bloque);
  }

  //console.log("✅ Vista de memoria de paginación actualizada con", nodos.length, "marcos.");
}


function actualizarVistas(){
  actualizarVistaMemoriaFija();
  actualizarVistaMemoriaFijaVariable();
  actualizarVistaMemoriaDinamicaSinCompactacion();
  actualizarVistaMemoriaDinamicaConCompactacion();
  actualizarVistaPaginacion()
}