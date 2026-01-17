const form = document.getElementById("ventaForm");
const tabla = document.getElementById("tablaVentas");
const totalSpan = document.getElementById("total");

const cantidadInput = document.getElementById("cantidad");
const precioInput = document.getElementById("precio");

function obtenerVentas() {
    return JSON.parse(localStorage.getItem("ventas")) || [];
}

function guardarVentas(ventas) {
    localStorage.setItem("ventas", JSON.stringify(ventas));
}

function generarID(ventas) {
    return ventas.length ? ventas[ventas.length - 1].id + 1 : 1;
}

function renderVentas() {
    tabla.innerHTML = "";
    const ventas = obtenerVentas();

    ventas.forEach(v => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${v.id}</td>
            <td>${v.cliente}</td>
            <td>${v.producto}</td>
            <td>$${v.total}</td>
            <td>${v.fecha}</td>
        `;
        tabla.appendChild(tr);
    });
}

cantidadInput.addEventListener("input", calcularTotal);
precioInput.addEventListener("input", calcularTotal);

function calcularTotal() {
    const cantidad = Number(cantidadInput.value);
    const precio = Number(precioInput.value);
    totalSpan.textContent = cantidad * precio || 0;
}

form.addEventListener("submit", e => {
    e.preventDefault();

    const ventas = obtenerVentas();

    const nuevaVenta = {
        id: generarID(ventas),
        cliente: cliente.value,
        producto: producto.value,
        cantidad: Number(cantidad.value),
        precio: Number(precio.value),
        total: Number(cantidad.value) * Number(precio.value),
        fecha: new Date().toLocaleDateString()
    };

    ventas.push(nuevaVenta);
    guardarVentas(ventas);
    renderVentas();
    form.reset();
    totalSpan.textContent = "0";
});

renderVentas();
