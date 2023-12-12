const pantalonesDisponibles = [
    { id: 1, modelo: "Pantalón Casual", precio: 29.99, talle: "S", stock: 10 },
    { id: 2, modelo: "Pantalón Deportivo", precio: 39.99, talle: "M", stock: 8 },
    { id: 3, modelo: "Pantalón Formal", precio: 49.99, talle: "L", stock: 4 },
    { id: 4, modelo: "Bermuda", precio: 19.99, talle: "XL", stock: 4 },
    { id: 5, modelo: "Short De Playa", precio: 19.99, talle: "S", stock: 7 },
    { id: 6, modelo: "Pantalón Urbano", precio: 19.99, talle: "M", stock: 7 },
];

// Recupera el carrito almacenado en localStorage
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

document.addEventListener("DOMContentLoaded", function () {
    const talleContainer = document.getElementById("talleContainer");
    const modeloContainer = document.getElementById("modeloContainer");

    modeloContainer.innerHTML = ""; // Limpiar contenido previo

    pantalonesDisponibles.forEach((pantalon, index) => {
        const modeloLabel = document.createElement("label");
        modeloLabel.className = "modelo-label";
        modeloLabel.onclick = () => seleccionarModelo(pantalon.modelo, index);
        modeloLabel.innerHTML = `
            <input type="radio" name="modelo" value="${pantalon.modelo}">
            <img src="./imagenes/${pantalon.modelo.replace(/\s+/g, '')}.png" alt="${pantalon.modelo}">
            ${pantalon.modelo}
        `;

        modeloContainer.appendChild(modeloLabel);
    });

    const comprarBtn = document.getElementById("comprarBtn");
    if (comprarBtn) {
        comprarBtn.style.margin = "20px auto"; // Establecer margen y centrar el botón
    }
});

function seleccionarModelo(modelo, index) {
    const radioButtons = document.getElementsByName('modelo');
    radioButtons[index].checked = true;
}

function agregarAlCarrito(pantalonElegido) {
    carrito.push(pantalonElegido);
    actualizarCantidadCarrito();
}

function actualizarCantidadCarrito() {
    const cantidadCarritoSpan = document.getElementById("cantidadCarrito");
    if (cantidadCarritoSpan) {
        cantidadCarritoSpan.textContent = carrito.length;
    }

    // Almacena el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function realizarCompra() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const modeloSeleccionado = document.querySelector('input[name="modelo"]:checked');
    const talleSeleccionado = document.querySelector('input[name="talle"]:checked');

    if (!nombre || !apellido || !modeloSeleccionado || !talleSeleccionado) {
        mostrarError("Por favor, complete todos los campos.");
        return;
    }

    const pantalonElegido = pantalonesDisponibles.find(p => p.modelo === modeloSeleccionado.value && p.talle === talleSeleccionado.value);

    if (pantalonElegido && pantalonElegido.stock > 0) {
        pantalonElegido.stock--;
        agregarAlCarrito({
            nombre,
            apellido,
            modelo: modeloSeleccionado.value,
            talle: talleSeleccionado.value,
            precio: pantalonElegido.precio,
        });
        mostrarCompraExitosa(nombre, apellido, modeloSeleccionado.value, talleSeleccionado.value, pantalonElegido.precio, pantalonElegido.stock);
    } else {
        mostrarError(`Lo siento, el ${modeloSeleccionado.value} de talle ${talleSeleccionado.value} no está disponible.`);
    }
}

function mostrarCompraExitosa(nombre, apellido, modelo, talle, precio, stock) {
    const resultadoCompra = document.createElement("div");
    resultadoCompra.innerHTML = `<p>¡Compra exitosa!</p>
                                <p>${nombre} ${apellido}, has comprado un ${modelo} de talle ${talle} por $${precio.toFixed(2)}.</p>
                                <p>Stock restante: ${stock}</p>`;
    resultadoCompra.classList.add("success");
    document.getElementById("resultadosCompra").innerHTML = ""; // Limpiar contenido previo
    document.getElementById("resultadosCompra").appendChild(resultadoCompra);

    // Actualizar el contenido del carrito
    mostrarCarrito();
}

function mostrarError(mensaje) {
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML = `<p>${mensaje}</p>`;
    errorDiv.classList.add("error");
    document.getElementById("resultadosCompra").innerHTML = ""; // Limpiar contenido previo
    document.getElementById("resultadosCompra").appendChild(errorDiv);
}

function mostrarCarrito() {
    const carritoContenido = document.getElementById("carritoContenido");
    carritoContenido.innerHTML = ""; // Limpiar contenido previo

    if (carrito.length === 0) {
        const mensajeCarritoVacio = document.createElement("p");
        mensajeCarritoVacio.textContent = "El carrito está vacío.";
        carritoContenido.appendChild(mensajeCarritoVacio);
    } else {
        carrito.forEach((item, index) => {
            const productoCarrito = document.createElement("div");
            productoCarrito.innerHTML = `
                <p>${item.modelo} - Talle ${item.talle}</p>
                <p>Precio: $${item.precio.toFixed(2)}</p>
                <hr>
            `;
            carritoContenido.appendChild(productoCarrito);
        });

        const totalCarrito = document.createElement("p");
        const precioTotal = carrito.reduce((total, item) => total + item.precio, 0);
        totalCarrito.textContent = `Total: $${precioTotal.toFixed(2)}`;
        carritoContenido.appendChild(totalCarrito);
    }

    // Mostrar el carrito
    carritoContenido.classList.add("mostrar");
}

function ocultarCarrito() {
    const carritoContenido = document.getElementById("carritoContenido");
    carritoContenido.classList.remove("mostrar");
}
