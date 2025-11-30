class ListaBloqueo{
    constructor(){
        this.head = null
    }

    add(prioridad, pid, tiempoEjecucion, inicioBloqueo, duracionBloqueo){
        let nuevoNodo = new NodoPlanificacion(prioridad, pid, tiempoEjecucion, inicioBloqueo, duracionBloqueo, duracionBloqueo, "blocked")

        if(!this.head){
            this.head = nuevoNodo
        } else{
            nuevoNodo.back = this.head
            this.head.front = nuevoNodo
            this.head = nuevoNodo
        }
    }

    clock(cola){
        let colaInsertar = cola
        let apuntador = this.head
        while(apuntador){
            apuntador.duracionBloqueoActual -= 1
            if(apuntador.duracionBloqueoActual == 0){
                colaInsertar.push(apuntador.prioridad, apuntador.pid, apuntador.tiempoEjecucion, apuntador.inicioBloqueo, apuntador.duracionBloqueo, apuntador.duracionBloqueoActual)
                if(apuntador.front) apuntador.front.back = apuntador.back
                if(apuntador.back) apuntador.back.front = apuntador.front
                if(apuntador == this.head) this.head = apuntador.back

            }
            apuntador = apuntador.back
        }
    }

    print() {
    console.log("=== LISTA DE BLOQUEO ===");
    let apuntador = this.head;

    while (apuntador) {
        console.log(
            `P=${apuntador.prioridad}, PID=${apuntador.pid}, ` +
            `TE=${apuntador.tiempoEjecucion}, IB=${apuntador.inicioBloqueo}, ` +
            `DB=${apuntador.duracionBloqueo}, DBA=${apuntador.duracionBloqueoActual}` +
            `E=${apuntador.estado} `
        );
        apuntador = apuntador.back;
    }

    console.log("=========================\n");
}


}