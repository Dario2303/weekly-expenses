//VARIABLES Y SELECTORES
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');



//EVENTOS
eventos();
function eventos () {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto)
}



//CLASES
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante();//a este metodo lo llamo cuando se agrega un nuevo gasto
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gastoActual) => total + gastoActual.cantidad, 0 )
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();

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

    mostrarGastos(gastos) {

        this.limpiarHTML(); //elimina el HTML previo

        //iterando sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad , nombre, id } = gasto;

            const nuevoGasto = document.createElement('LI');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            //agregar el html del gasto
            nuevoGasto.innerHTML = `
                ${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>
            `;

            //creando boton para borrar
            const btnBorrar = document.createElement('BUTTON');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;';
            //agregando boton de borrar en el registro de gasto
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //agregando el HTML
            gastoListado.appendChild(nuevoGasto);

        });         
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto , restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        //comprobar 25%
        if((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-warning', 'alert-danger');
            restanteDiv.classList.add('alert-success');
        }

        //si total es menor o igual a 0 
        if(restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha acabado', 'error')
            formulario.querySelector('button[type="submit"]').disabled = true; 
        }
    }
}
//Instanciar UI
const ui = new UI();
let presupuesto;



//FUNCIONES
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
    const gasto = { nombre, cantidad, id: Date.now() } //object literal enhancement

    //añade un nuevo gasto
    presupuesto.nuevoGasto(gasto)


    //imprime mensaje de correcto
    ui.imprimirAlerta('Gasto agregado correctamente')

    //imprimir los gastos que me traigo de la clase presupuesto
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto) //tomamos todo el presupuesto por que necesitamos el valor inicial y el restante para poder calcular el porcentaje de lo disponible y darle formato segun lo gastado
    //resetea/limpia el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    //elimina gastos de la clase
    presupuesto.eliminarGasto(id);

    //eliminar gastos del html
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)
}