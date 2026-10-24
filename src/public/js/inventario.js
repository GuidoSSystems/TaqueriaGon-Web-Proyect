const productosPrueba = [
    { nombre: 'Tacos', categoria: 'Antojito', precio: 20, stock: 0, controla_stock: 0, disponible: 1 },
    { nombre: 'Hamburguesa', categoria: 'Snack', precio: 70, stock: 10, controla_stock: 1, disponible: 1 }
];

document.addEventListener('DOMContentLoaded', () => {
    renderizarTabla(productosPrueba);
});

function renderizarTabla(productos) {
    const tbody = document.querySelector('#tabla-inventario tbody');
    tbody.textContent = ''; // limpiar el contenido del tbody antes de renderizar

    for (let i = 0; i < productos.length; i++) {
        let producto = productos[i];

        // crear la fila de la tabla
        let fila = document.createElement('tr');

        // celda para el nombre
        let celdaNombre = document.createElement('td');
        celdaNombre.textContent = producto.nombre;
        fila.appendChild(celdaNombre);

        // celda para la categoría
        let celdaCategoria = document.createElement('td');
        celdaCategoria.textContent = producto.categoria;
        fila.appendChild(celdaCategoria);

        // celda para el precio (con input numérico y prevención de negativos)
        let celdaPrecio = document.createElement('td');
        let inputPrecio = document.createElement('input');
        inputPrecio.type = 'number';
        inputPrecio.value = producto.precio;
        inputPrecio.min = '0'; // Impide bajar de cero
        celdaPrecio.appendChild(inputPrecio);
        fila.appendChild(celdaPrecio);

        // celda para el Stock (con input numérico y prevención de negativos)
        let celdaStock = document.createElement('td');
        let inputStock = document.createElement('input');
        inputStock.type = 'number';
        inputStock.value = producto.stock;
        inputStock.min = '0'; // Impide bajar de cero
        celdaStock.appendChild(inputStock);
        fila.appendChild(celdaStock);

        // celda para controla_stock (con checkbox y regla visual)
        let celdaControlaStock = document.createElement('td');
        let checkControlaStock = document.createElement('input');
        checkControlaStock.type = 'checkbox';
        checkControlaStock.checked = producto.controla_stock === 1; // Marca la casilla si viene un 1
        inputStock.disabled = producto.controla_stock === 0; // Deshabilita el input si viene un 0

        checkControlaStock.addEventListener('change', (evento) => {
            inputStock.disabled = !evento.target.checked;
        });

        celdaControlaStock.appendChild(checkControlaStock);
        fila.appendChild(celdaControlaStock);

        // celda para disponible (con checkbox)
        let celdaDisponible = document.createElement('td');
        let checkDisponible = document.createElement('input');
        checkDisponible.type = 'checkbox';
        checkDisponible.checked = producto.disponible === 1;
        celdaDisponible.appendChild(checkDisponible);
        fila.appendChild(celdaDisponible);

        // crear boton guardar y recolectar datos
        let celdaAcciones = document.createElement('td');
        let btnGuardar = document.createElement('button');
        btnGuardar.textContent = 'Guardar';

        btnGuardar.addEventListener('click', () => {
            const datosActualizados = {
                nombre: producto.nombre,
                precio: parseFloat(inputPrecio.value),
                stock: parseInt(inputStock.value),
                controla_stock: checkControlaStock.checked ? 1 : 0,
                disponible: checkDisponible.checked ? 1 : 0
            };
            console.log("Listo para enviar (PUT):", datosActualizados);
            alert("Datos recolectados. Revisa la consola (F12)");
        });

        celdaAcciones.appendChild(btnGuardar);
        fila.appendChild(celdaAcciones);

        // fila completa al tbody
        tbody.appendChild(fila);
    }
}