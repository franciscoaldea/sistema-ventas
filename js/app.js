let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
let ultimoId = JSON.parse(localStorage.getItem("ultimoId")) || 0;
let editando = null;

// ELEMENTOS
const form = document.getElementById("ventaForm");
const tabla = document.getElementById("tablaVentas");
const modoEdicion = document.getElementById("modoEdicion");
const editandoId = document.getElementById("editandoId");

// INPUTS
const clienteInput = document.getElementById("cliente");
const productoInput = document.getElementById("producto");
const precioInput = document.getElementById("precio");
const estadoInput = document.getElementById("estado");

// FILTROS
const filtroCliente = document.getElementById("filtroCliente");
const filtroFecha = document.getElementById("filtroFecha");

// STATS
const totalVendidoSpan = document.getElementById("totalVendido");
const cantidadVentasSpan = document.getElementById("cantidadVentas");
const ticketPromedioSpan = document.getElementById("ticketPromedio");

// GUARDAR / EDITAR
form.addEventListener("submit", e => {
    e.preventDefault();

    const venta = {
        id: editando ?? Date.now(),
        cliente: clienteInput.value,
        producto: productoInput.value,
        precio: Number(precioInput.value),
        estado: estadoInput.value,
        fecha: new Date().toISOString().split("T")[0]
    };

    if (editando) {
        ventas = ventas.map(v => v.id === editando ? venta : v);
        editando = null;
        modoEdicion.style.display = "none";
    } else {
        ventas.push(venta);
    }

    localStorage.setItem("ventas", JSON.stringify(ventas));
    form.reset();
    renderVentas();
});

// RENDER TABLA
function renderVentas() {
    tabla.innerHTML = "";

    let filtradas = ventas.filter(v => {
        return (
            v.cliente.toLowerCase().includes(filtroCliente.value.toLowerCase()) &&
            (!filtroFecha.value || v.fecha === filtroFecha.value)
        );
    });

    filtradas.forEach(v => {
        tabla.innerHTML += `
            <tr>
                <td>${v.id}</td>
                <td>${v.cliente}</td>
                <td>${v.producto}</td>
                <td>$${v.precio}</td>
                <td>${v.fecha}</td>
                <td>${v.estado}</td>
                <td>
                    <button onclick="editarVenta(${v.id})">Editar</button>
                    <button onclick="eliminarVenta(${v.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    actualizarStats(filtradas);
}

// EDITAR
window.editarVenta = function(id) {
    const v = ventas.find(v => v.id === id);
    clienteInput.value = v.cliente;
    productoInput.value = v.producto;
    precioInput.value = v.precio;
    estadoInput.value = v.estado;

    editando = id;
    modoEdicion.style.display = "block";
    editandoId.textContent = id;
};

// ELIMINAR
window.eliminarVenta = function(id) {
    if (!confirm("¿Eliminar esta venta?")) return;
    ventas = ventas.filter(v => v.id !== id);
    localStorage.setItem("ventas", JSON.stringify(ventas));
    renderVentas();
};

// STATS
function actualizarStats(lista) {
    const total = lista.reduce((acc, v) => acc + v.precio, 0);
    totalVendidoSpan.textContent = total;
    cantidadVentasSpan.textContent = lista.length;
    ticketPromedioSpan.textContent = lista.length ? Math.round(total / lista.length) : 0;
}

// FILTROS
filtroCliente.addEventListener("input", renderVentas);
filtroFecha.addEventListener("change", renderVentas);

// CARGAR AL INICIO
renderVentas();

