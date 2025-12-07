class ListaBloqueo{
    constructor(){
        this.head = null
    }

    add(prioridad, pid, tiempoEjecucion, inicioBloqueo, duracionBloqueo, tiempoEjecucionActual){
        let nuevoNodo = new NodoPlanificacion(prioridad, pid, tiempoEjecucion, inicioBloqueo, duracionBloqueo, duracionBloqueo, "blocked", tiempoEjecucionActual)

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
                
                colaInsertar.push(apuntador.prioridad, apuntador.pid, 
                                  apuntador.tiempoEjecucion, apuntador.inicioBloqueo, 
                                  apuntador.duracionBloqueo, apuntador.duracionBloqueoActual, 
                                  apuntador.tiempoEjecucionActual)
                console.log("Vuelve a la cola el proceso", apuntador.pid)
                if(apuntador.front) apuntador.front.back = apuntador.back
                if(apuntador.back) apuntador.back.front = apuntador.front
                if(apuntador == this.head) this.head = apuntador.back

            }
            apuntador = apuntador.back
        }
    }

    clockRR(cola){
        let colaInsertar = cola
        let apuntador = this.head
        while(apuntador){
            apuntador.duracionBloqueoActual -= 1
            if(apuntador.duracionBloqueoActual == 0){
                
                colaInsertar.pushRR(apuntador.prioridad, apuntador.pid, 
                                  apuntador.tiempoEjecucion, apuntador.inicioBloqueo, 
                                  apuntador.duracionBloqueo, apuntador.duracionBloqueoActual, 
                                  apuntador.tiempoEjecucionActual)
                console.log("Vuelve a la cola el proceso", apuntador.pid)
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
                `E=${apuntador.estado}, TEA = ${apuntador.tiempoEjecucionActual}`
            );
            apuntador = apuntador.back;
        }

        console.log("=========================\n");
    }

    isEmpty(){
        return this.head == null    
    }

    report(clockActual){
        let apuntador = this.head
        while (apuntador){
            agregarColorNodo(clockActual, apuntador.pid, "red")
            apuntador = apuntador.back
        }
    }

    reportRR(clockActual){
        let apuntador = this.head
        while (apuntador){
            agregarColorNodo(clockActual, apuntador.pid+1, "red")
            apuntador = apuntador.back
        }
    }

}