// ============================
// REFERENCIAS
// ============================
const form = document.getElementById("ventaForm");
const tabla = document.getElementById("tablaVentas");
const totalSpan = document.getElementById("total");

const clienteInput = document.getElementById("cliente");
const productoInput = document.getElementById("producto");
const cantidadInput = document.getElementById("cantidad");
const precioInput = document.getElementById("precio");
const estadoInput = document.getElementById("estado");
const editIdInput = document.getElementById("editId");

const modoEdicion = document.getElementById("modoEdicion");
const editandoIdSpan = document.getElementById("editandoId");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

const filtroCliente = document.getElementById("filtroCliente");
const filtroFecha = document.getElementById("filtroFecha");
const ordenarPor = document.getElementById("ordenarPor");

const totalVendidoSpan = document.getElementById("totalVendido");
const cantidadVentasSpan = document.getElementById("cantidadVentas");
const ticketPromedioSpan = document.getElementById("ticketPromedio");

const datalistClientes = document.getElementById("clientes");
const datalistProductos = document.getElementById("productos");

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
// TOTAL EN TIEMPO REAL
// ============================
function calcularTotal() {
    const c = Number(cantidadInput.value);
    const p = Number(precioInput.value);
    totalSpan.textContent = c * p || 0;
}

cantidadInput.addEventListener("input", calcularTotal);
precioInput.addEventListener("input", calcularTotal);

// ============================
// RENDER TABLA + FILTROS + ORDEN
// ============================
function renderVentas() {
    tabla.innerHTML = "";
    let ventas = obtenerVentas();

    if (filtroCliente.value) {
        ventas = ventas.filter(v =>
            v.cliente.toLowerCase().includes(filtroCliente.value.toLowerCase())
        );
    }

    if (filtroFecha.value) {
        ventas = ventas.filter(v => v.fechaISO === filtroFecha.value);
    }

    ventas.sort((a, b) => {
        if (ordenarPor.value === "fecha") {
            return new Date(b.fechaISO) - new Date(a.fechaISO);
        }
        return b[ordenarPor.value] - a[ordenarPor.value];
    });

    ventas.forEach(v => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${v.id}</td>
            <td>${v.cliente}</td>
            <td>${v.producto}</td>
            <td>$${v.total}</td>
            <td>${v.fecha}</td>
            <td>${v.estado}</td>
            <td>
                <button onclick="editarVenta(${v.id})">Editar</button>
                <button onclick="borrarVenta(${v.id})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(tr);
    });

    actualizarStats(ventas);
}

// ============================
// ESTADÍSTICAS
// ============================
function actualizarStats(ventas) {
    const total = ventas.reduce((acc, v) => acc + v.total, 0);
    totalVendidoSpan.textContent = total;
    cantidadVentasSpan.textContent = ventas.length;
    ticketPromedioSpan.textContent =
        ventas.length ? Math.round(total / ventas.length) : 0;
}

// ============================
// FORM SUBMIT
// ============================
form.addEventListener("submit", e => {
    e.preventDefault();

    if (cantidadInput.value <= 0 || precioInput.value <= 0) {
        alert("Cantidad y precio deben ser mayores a 0");
        return;
    }

    const ventas = obtenerVentas();
    const editId = editIdInput.value;

    if (editId) {
        const index = ventas.findIndex(v => v.id == editId);
        ventas[index] = {
            ...ventas[index],
            cliente: clienteInput.value,
            producto: productoInput.value,
            cantidad: Number(cantidadInput.value),
            precio: Number(precioInput.value),
            total: Number(cantidadInput.value) * Number(precioInput.value),
            estado: estadoInput.value
        };

        salirEdicion();
    } else {
        ventas.push({
            id: generarID(ventas),
            cliente: clienteInput.value,
            producto: productoInput.value,
            cantidad: Number(cantidadInput.value),
            precio: Number(precioInput.value),
            total: Number(cantidadInput.value) * Number(precioInput.value),
            estado: estadoInput.value,
            fecha: new Date().toLocaleDateString(),
            fechaISO: new Date().toISOString().split("T")[0]
        });
    }

    guardarVentas(ventas);
    actualizarDatalists(ventas);
    renderVentas();
    form.reset();
    totalSpan.textContent = "0";
});

// ============================
// EDITAR / BORRAR
// ============================
function editarVenta(id) {
    const venta = obtenerVentas().find(v => v.id === id);

    clienteInput.value = venta.cliente;
    productoInput.value = venta.producto;
    cantidadInput.value = venta.cantidad;
    precioInput.value = venta.precio;
    estadoInput.value = venta.estado;
    totalSpan.textContent = venta.total;

    editIdInput.value = id;
    modoEdicion.style.display = "block";
    editandoIdSpan.textContent = id;
    btnGuardar.textContent = "Guardar cambios";
    btnCancelar.style.display = "inline-block";
}

function borrarVenta(id) {
    if (!confirm("¿Eliminar esta venta?")) return;
    guardarVentas(obtenerVentas().filter(v => v.id !== id));
    renderVentas();
}

// ============================
// CANCELAR EDICIÓN
// ============================
btnCancelar.addEventListener("click", salirEdicion);

function salirEdicion() {
    editIdInput.value = "";
    modoEdicion.style.display = "none";
    btnGuardar.textContent = "Guardar venta";
    btnCancelar.style.display = "none";
    form.reset();
    totalSpan.textContent = "0";
}

// ============================
// DATALISTS CLIENTES / PRODUCTOS
// ============================
function actualizarDatalists(ventas) {
    const clientes = [...new Set(ventas.map(v => v.cliente))];
    const productos = [...new Set(ventas.map(v => v.producto))];

    datalistClientes.innerHTML = clientes.map(c => `<option value="${c}">`).join("");
    datalistProductos.innerHTML = productos.map(p => `<option value="${p}">`).join("");
}

// ============================
// BACKUP / RESTAURAR
// ============================
function exportarBackup() {
    const data = localStorage.getItem("ventas") || "[]";
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "backup_ventas.json";
    a.click();
}

function importarBackup(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        localStorage.setItem("ventas", reader.result);
        renderVentas();
    };
    reader.readAsText(file);
}

// ============================
// INIT
// ============================
renderVentas();
actualizarDatalists(obtenerVentas());
