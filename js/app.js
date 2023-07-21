//Variables y selectores
const gastos = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');



//Eventos
eventos();
function eventos () {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)
}



//Clases
class Presupuesto {

}


class UI {
    
}



//funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('cual es tu presupuesto?')

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

}