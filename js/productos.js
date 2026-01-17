let productos = JSON.parse(localStorage.getItem("productos")) || [];
let editando = null;
let ultimoIdProducto = JSON.parse(localStorage.getItem("ultimoIdProducto")) || 0;

const form = document.getElementById("productoForm");
const tabla = document.getElementById("tablaProductos");
const modoEdicion = document.getElementById("modoEdicionProducto");
const editandoId = document.getElementById("editandoProductoId");

const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const fotoInput = document.getElementById("foto");

form.addEventListener("submit", e => {
    e.preventDefault();

    const producto = {
        id: editando ?? ++ultimoIdProducto,
        nombre: nombreInput.value,
        precio: Number(precioInput.value),
        foto: fotoInput.value || ""
    };

    if (editando) {
        productos = productos.map(p => p.id === editando ? producto : p);
        editando = null;
        modoEdicion.style.display = "none";
    } else {
        productos.push(producto);
    }

    localStorage.setItem("productos", JSON.stringify(productos));
    localStorage.setItem("ultimoIdProducto", JSON.stringify(ultimoIdProducto));

    form.reset();
    renderProductos();
});

function renderProductos() {
    tabla.innerHTML = "";

    productos.forEach(p => {
        tabla.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>
                    ${p.foto ? `<img src="${p.foto}" width="50">` : "—"}
                </td>
                <td>${p.nombre}</td>
                <td>$${p.precio}</td>
                <td>
                    <button onclick="editarProducto(${p.id})">Editar</button>
                    <button onclick="eliminarProducto(${p.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

window.editarProducto = function(id) {
    const p = productos.find(p => p.id === id);

    nombreInput.value = p.nombre;
    precioInput.value = p.precio;
    fotoInput.value = p.foto;

    editando = id;
    modoEdicion.style.display = "block";
    editandoId.textContent = id;
};

window.eliminarProducto = function(id) {
    if (!confirm("¿Eliminar este producto?")) return;

    productos = productos.filter(p => p.id !== id);
    localStorage.setItem("productos", JSON.stringify(productos));
    renderProductos();
};

renderProductos();

