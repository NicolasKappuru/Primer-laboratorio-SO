class NodoPlanificacion {
    constructor(prioridad, pid, tiempoEjecucion, inicioBloqueo, duracionBloqueo, duracionBloqueoActual, estado, tiempoEjecucionActual) {
        this.prioridad = prioridad
        this.pid = pid
        this.tiempoEjecucion = tiempoEjecucion
        this.inicioBloqueo = inicioBloqueo
        this.duracionBloqueo = duracionBloqueo
        this.duracionBloqueoActual = duracionBloqueoActual
        this.tiempoEjecucionActual = tiempoEjecucionActual

        this.estado = estado

        this.front = null
        this.back = null;
    }
}