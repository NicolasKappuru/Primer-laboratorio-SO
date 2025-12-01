class SJF {
    constructor() {
        this.await_queue = new ColaPrioridad(); 
        this.nodo_exec = null;
        this.blocked = new ListaBloqueo();
    }

    startProcess(prioridad, pid, tiempoEjecucion, inicioBloqueo, duracionBloqueo) {

        // ⬅️ Aquí está el ÚNICO cambio respecto a FCFS

        if (this.nodo_exec == null) {
            this.nodo_exec = new NodoPlanificacion(
                prioridad, pid,
                tiempoEjecucion, inicioBloqueo,
                duracionBloqueo, duracionBloqueo,
                "exec", 0
            );
        } else {
            this.await_queue.push(
                prioridad, pid,
                tiempoEjecucion, inicioBloqueo,
                duracionBloqueo, duracionBloqueo,
                0
            );
        }
    }

    processLogic() {

        this.blocked.clock(this.await_queue);

        if (this.nodo_exec) {

            if (
                this.nodo_exec.inicioBloqueo > 0 && 
                this.nodo_exec.tiempoEjecucionActual == this.nodo_exec.inicioBloqueo
            ) {
                this.blocked.add(
                    this.nodo_exec.prioridad, this.nodo_exec.pid,
                    this.nodo_exec.tiempoEjecucion, this.nodo_exec.inicioBloqueo,
                    this.nodo_exec.duracionBloqueo, this.nodo_exec.tiempoEjecucionActual
                );
                this.insertFromQueue();

            } else if (this.nodo_exec.tiempoEjecucionActual == this.nodo_exec.tiempoEjecucion) {
                this.insertFromQueue();
            }

        } else {
            this.insertFromQueue();
        }

        if (this.nodo_exec) {
            this.nodo_exec.tiempoEjecucionActual += 1;
        }

        console.log("Clock SJF: ", window.clockSJF);
        this.await_queue.print();
        this.blocked.print();
        console.log("=== Nodo en Ejecucion ===");
        console.log(this.nodo_exec);
        console.log("=========================\n");
    }

    insertFromQueue() {
        if (!this.await_queue.isEmpty()) {
            let data = this.await_queue.pop();
            this.nodo_exec = new NodoPlanificacion(
                data.prioridad, data.pid,
                data.tiempoEjecucion, data.inicioBloqueo,
                data.duracionBloqueo, data.duracionBloqueoActual,
                "exec", data.tiempoEjecucionActual
            );
        } else {
            this.nodo_exec = null;
        }
    }

    report() {

        if (!this.blocked.isEmpty()) {
            this.blocked.report(window.clockSJF);
        }

        if (!this.await_queue.isEmpty()) {
            this.await_queue.report(window.clockSJF);
        }

        if (this.nodo_exec) {
            agregarColorNodo(window.clockSJF, this.nodo_exec.pid, "green");
        }
    }
}

const sjf = new SJF();
window.sjf = sjf;
