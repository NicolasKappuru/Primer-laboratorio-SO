// Variables globales
window.numeroSegmentacion = null; //Pagina-Segmento xD
window.offsetSegmentacion = null; //Pues el offset :v

window.numeroPaginacion = null; //Pagina-Segmento xD
window.offsetPaginacion = null; //Pues el offset :v

window.tam_maxSegmentacion = 0;

function guardarNumerosSegmentacion() {
    // Leer los valores de los inputs

    let numero = parseInt(document.getElementById("numeroSegmentacion").value);
    let offset = parseInt(document.getElementById("offsetSegmentacion").value);

    if( (numero+offset) === 24){
        window.numeroSegmentacion = numero;
        window.offsetSegmentacion = offset;

        window.tam_maxSegmentacion = 2**offset;

        alert("Números guardados correctamente");
    }
    else alert("Los numeros no suman los 24 bits disponibles")
}

function guardarNumerosPaginacion() {
    // Leer los valores de los inputs

    let numero = parseInt(document.getElementById("numeroPaginacion").value);
    let offset = parseInt(document.getElementById("offsetPaginacion").value);

    if( (numero+offset) === 24){
        window.numeroPaginacion = numero;
        window.offsetPaginacion = offset;

        alert("Números guardados correctamente");

        inicializarPaginacion();
        actualizarVistas();
    }
    else alert("Los numeros no suman los 24 bits disponibles")
}