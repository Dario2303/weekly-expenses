//Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');



//Eventos
eventos();
function eventos () {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto)
}



//Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
}


class UI {
    insertarPresupuesto (cantidad) {
        const { presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;  
    }

    imprimirAlerta (mensaje, tipo) {
        //crear el div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        }else {
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;
        document.querySelector('.primario').insertBefore(divMensaje, formulario)

        setTimeout(() => {
            divMensaje.remove()
        }, 3000);
    }
}
//Instanciar
const ui = new UI();
let presupuesto;

//funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('cual es tu presupuesto?')

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    //luego de comprobar que el presupuesto es valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    
    ui.insertarPresupuesto(presupuesto);

}

//añade gastos
function agregarGasto(e) {
    e.preventDefault();

    //leer datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);


    //validar

    if(nombre ==='' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    }else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('cantidad no valida', 'error')
        return;
    }

    //GENERAR objeto dcon un gasto
    const gasto = { nombre, cantidad } //object literal
    console.log(gasto)
}