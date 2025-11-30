import ListaBloqueo from './lista_bloqueo.mjs'
import ColaPrioridad from './cola_prioridad.mjs'

let cola_prioridad = new ColaPrioridad()
let lista_bloqueo = new ListaBloqueo()


cola_prioridad.push(1, 1, 3, 2, 2, 2)
cola_prioridad.push(2, 2, 5, 2, 1, 1)
cola_prioridad.push(3, 3, 2, 1, 1, 1)

cola_prioridad.print()


let datos = cola_prioridad.pop()

console.log("Primeros Datos: ", datos)

lista_bloqueo.add(datos.prioridad, datos.pid, datos.tiempoEjecucion, datos.inicioBloqueo, datos.duracionBloqueo)

datos = cola_prioridad.pop()

console.log("Segundos Datos: ", datos)

lista_bloqueo.add(datos.prioridad, datos.pid, datos.tiempoEjecucion, datos.inicioBloqueo, datos.duracionBloqueo)

lista_bloqueo.print()

lista_bloqueo.clock(cola_prioridad)

console.log("Clock 1:")
cola_prioridad.print()
lista_bloqueo.print()

lista_bloqueo.clock(cola_prioridad)

console.log("Clock 2:")
cola_prioridad.print()
lista_bloqueo.print()