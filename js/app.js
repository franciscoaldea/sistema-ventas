// ============================
// REFERENCIAS A ELEMENTOS
// ============================
const form = document.getElementById("ventaForm");
const tabla = document.getElementById("tablaVentas");
const totalSpan = document.getElementById("total");

const clienteInput = document.getElementById("cliente");
const productoInput = document.getElementById("producto");
const cantidadInput = document.getElementById("cantidad");
const precioInput = document.getElementById("precio");
const editIdInput = document.getElementById("editId");

const modoEdicion = document.getElementById("modoEdicion");
const editandoIdSpan = document.getElementById("editandoId");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

// ============================
// STORAGE
// ============================
function obtenerVentas() {
    return JSON.parse(localStorage.getItem("ventas")) || [];
}

function guardarVentas(ventas) {
    localStorage.setItem("ventas", JSON.stringify(ventas));
}

function generarID(ventas) {
    return ventas.length ? ventas[ventas.length - 1].id + 1 : 1;
}

// ============================
// CALCULO TOTAL
// ============================
function calcularTotal() {
    const cantidad = Number(cantidadInput.value);
    const precio = Number(precioInput.value);
    totalSpan.textContent = cantidad * precio || 0;
}

cantidadInput.addEventListener("input", calcularTotal);
precioInput.addEventListener("input", calcularTotal);

// ============================
// RENDER TABLA
// ============================
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
            <td>
                <button onclick="editarVenta(${v.id})">Editar</button>
                <button onclick="borrarVenta(${v.id})">Eliminar</button>
            </td>
        `;

        tabla.appendChild(tr);
    });
}

// ============================
// SUBMIT FORM
// ============================
form.addEventListener("submit", e => {
    e.preventDefault();

    const ventas = obtenerVentas();
    const editId = editIdInput.value;

    if (editId) {
        // EDITAR
        const index = ventas.findIndex(v => v.id == editId);

        ventas[index] = {
            ...ventas[index],
            cliente: clienteInput.value,
            producto: productoInput.value,
            cantidad: Number(cantidadInput.value),
            precio: Number(precioInput.value),
            total: Number(cantidadInput.value) * Number(precioInput.value)
        };

        editIdInput.value = "";
    } else {
        // CREAR
        ventas.push({
            id: generarID(ventas),
            cliente: clienteInput.value,
            producto: productoInput.value,
            cantidad: Number(cantidadInput.value),
            precio: Number(precioInput.value),
            total: Number(cantidadInput.value) * Number(precioInput.value),
            fecha: new Date().toLocaleDateString()
        });
    }

    guardarVentas(ventas);
    renderVentas();
    form.reset();
    totalSpan.textContent = "0";
});

// ============================
// BORRAR
// ============================
function borrarVenta(id) {
    if (!confirm("¿Seguro que querés eliminar esta venta?")) return;

    const ventas = obtenerVentas().filter(v => v.id !== id);
    guardarVentas(ventas);
    renderVentas();
}

// ============================
// EDITAR
// ============================
function editarVenta(id) {
    const ventas = obtenerVentas();
    const venta = ventas.find(v => v.id === id);

    clienteInput.value = venta.cliente;
    productoInput.value = venta.producto;
    cantidadInput.value = venta.cantidad;
    precioInput.value = venta.precio;
    totalSpan.textContent = venta.total;

    editIdInput.value = id;
}

// ============================
// INIT
// ============================
renderVentas();

