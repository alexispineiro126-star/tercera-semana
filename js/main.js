const URL = "./datos/dato.json"
let productos = []

const descuento = 0.20
const precioConDescuento = (precio) =>(precio * (1 - descuento))

const listaProductos = document.getElementById("productos")
const listaCarrito = document.getElementById("lista")
const panelCarrito = document.querySelector(".carrito")
const busqueda = document.getElementById("busqueda")
const totalCarrito = document.getElementById("total")
const comprar = document.getElementById("compra")
const modoOscuroBtn = document.getElementById("modo-oscuro")
const iconoModo = document.getElementById("icono-modo")
const textoModo = document.getElementById("texto-modo")

modoOscuroBtn.addEventListener("click", () => {
    const modoOscuroActivo = document.body.classList.toggle("modo-oscuro")
    modoOscuroBtn.setAttribute("aria-pressed", String(modoOscuroActivo))
    iconoModo.className = modoOscuroActivo
        ? "bi bi-sun-fill me-2"
        : "bi bi-moon-stars-fill me-2"
    textoModo.textContent = modoOscuroActivo ? "" : ""
})

let carrito = []
let temporizadorNotificacion

async function cargarProductos() {
    listaProductos.setAttribute("aria-busy", "true")
    try {
        const respuesta = await fetch(URL)
        if (!respuesta.ok) {
            throw new Error("Error HTTP: " + respuesta.status)
        }
        productos = await respuesta.json()
        restaurarCarrito()
        renderizarProductos(productos)
        actualizarCarrito()
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "No se pudieron cargar los productos",
            text: "Revisá la conexión e intentá nuevamente."
        })
    } finally {
        listaProductos.setAttribute("aria-busy", "false")
    }
}

cargarProductos()
function restaurarCarrito() {
    const carritoGuardado = localStorage.getItem("carrito")
    if (carritoGuardado === null) {
        return
    }

    let productosGuardados
    try {
        productosGuardados = JSON.parse(carritoGuardado)
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "No se pudo recuperar el carrito",
            text: "Los datos guardados están dañados."
        })
        return
    }

    if (!Array.isArray(productosGuardados)) {
        Swal.fire({
            icon: "error",
            title: "No se pudo recuperar el carrito",
            text: "Los datos guardados tienen un formato inválido."
        })
        return
    }

    productosGuardados.forEach((productoGuardado) => {
        const producto = productos.find((item) => item.id === productoGuardado.id)
        if (producto !== undefined && productoGuardado.cantidad > 0) {
            const cantidadFinal = productoGuardado.cantidad > producto.stock
                ? producto.stock
                : productoGuardado.cantidad
            carrito.push({
                id: producto.id,
                cantidad: cantidadFinal
            })
        }
    })
}


setTimeout(() => {
    Swal.fire({
    title: "20% OFF en todos los productos.",
    width: 600,
    padding: "3em",
    color: "#ff0000",
    background: "#fff url(/images/trees.png)",
    backdrop: `
    rgba(0, 0, 0, 0.4)
    url("/images/nyan-cat.gif")
    left top
    no-repeat`
});
}, 2000)

function cargarCompra() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const faltaStock = carrito.some((item) => {
                const producto = productos.find((producto) => producto.id === item.id)
                return producto === undefined || item.cantidad > producto.stock
            })
            if (faltaStock) {
                reject(new Error("No hay stock suficiente para completar la compra."))
                return
            }
            resolve()
        }, 2000)
    })
}

comprar.addEventListener("click", async () => {
    if (carrito.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Error, el carrito está vacío"
        })
        return
    }
    const textoOriginal = comprar.textContent
    comprar.disabled = true
    comprar.textContent = "Procesando compra..."
    try {
        await cargarCompra()
        carrito.forEach((item) => {
            const producto = productos.find((producto) => producto.id === item.id)
            producto.stock -= item.cantidad
        })
        carrito = []
        guardarCarrito()
        renderizarProductos()
        await Swal.fire({
            title: "Compra exitosa",
            text: "Gracias por tu compra.",
            icon: "success"
        })
    } catch (error) {
        await Swal.fire({
            icon: "error",
            title: "No se pudo completar la compra",
            text: error.message
        })
    } finally {
        comprar.disabled = false
        comprar.textContent = textoOriginal
    }
})

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito))
    actualizarCarrito()
}

function buscarEnCarrito(id) {
    return carrito.find( (item) => {
        return item.id === id
    })
}

function agregarAlCarrito(id) {
    const producto = productos.find((item) => {
        return item.id === id
    })
    if (producto === undefined || producto.stock <= 0) {
        return
    }

    const productoEnCarrito = buscarEnCarrito(id)

    if (productoEnCarrito !== undefined) {
        if (productoEnCarrito.cantidad >= producto.stock) {
            return
        }
        productoEnCarrito.cantidad++
    } else {
        carrito.push({ id: producto.id, cantidad: 1 })
    }
    guardarCarrito()

    const notificacion = document.getElementById(`notificacion-${producto.id}`)
    document.querySelectorAll(".noti.mostrar").forEach((elemento) => {
        elemento.classList.remove("mostrar")
    })
    clearTimeout(temporizadorNotificacion)
    notificacion.classList.add("mostrar")
    temporizadorNotificacion = setTimeout(() => {
        notificacion.classList.remove("mostrar")
    }, 2000)
}

function cambiarCantidad(id, cambio) {
    const producto = productos.find( (item) => {
        return item.id === id
    })
    const productoEnCarrito = buscarEnCarrito(id)
    if (productoEnCarrito === undefined) {
        return
    }
productoEnCarrito.cantidad += cambio

if (productoEnCarrito.cantidad <= 0) {
    eliminarDelCarrito(id)
    return
}

if (productoEnCarrito.cantidad > producto.stock) {
    productoEnCarrito.cantidad = producto.stock
}
guardarCarrito()
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter( (item) =>{
        return item.id !== id
    })
    guardarCarrito()
}

function renderizarProductos() {
    listaProductos.innerHTML = ""
    productos.forEach((producto) => {
        const tarjeta = document.createElement("article")
        tarjeta.className = "box"
        tarjeta.innerHTML = `
        <img class="img-producto" src="${producto.imagen}" alt="${producto.nombre}">
        <h3 class="nombre-producto">${producto.nombre}</h3>
        <p> marca: ${producto.marca}</p> 
        <p class="precio">Precio:
            <span class="precio-descuento">$${precioConDescuento(producto.precio)}</span>
            <span class="precio-original">$${producto.precio}</span>
            <span class="etiqueta-descuento">20% OFF</span>
        </p>
        <P>Disponibles: ${producto.stock}</P>
        <button type="button" class="btn-producto" ${producto.stock === 0 ? "disabled" : ""}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
<path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
</svg> Agregar al carrito</button>
        <div class="noti" id="notificacion-${producto.id}">
        Agregaste ${producto.nombre} al carrito
        </div>
</article>`
        tarjeta.querySelector(".btn-producto").addEventListener("click", () => {
            agregarAlCarrito(producto.id)
        })
        listaProductos.appendChild(tarjeta)
    })
}

function actualizarCarrito() {
    listaCarrito.innerHTML= ""
    let total = 0
    carrito.forEach( (item) => {
        const producto = productos.find( (productoCatalogo) => {
            return productoCatalogo.id === item.id
        })
        if(producto === undefined) {
            return
        }
        const elemento = document.createElement("li")
        elemento.innerHTML= `
        <span><img class="img-carrito" src="${producto.imagen}" alt="${producto.nombre}">   ${producto.nombre} $${precioConDescuento(producto.precio)}<span class="carrito-descuento">20% OFF</span></span>
        <div class = "controles-cantidad">
        <button type= "button" class= "btn-restar">-</button>
        <span>${item.cantidad}</span>
        <button type= "button" class="btn-sumar">+</button>
        </div>
        <button type= "button" class= "btn-eliminar">Eliminar</button>`
        elemento.querySelector(".btn-eliminar").addEventListener("click", ()=>{
            eliminarDelCarrito(producto.id)
        })
        elemento.querySelector(".btn-restar").addEventListener("click",()=>{
            cambiarCantidad(producto.id, -1)
        })
        elemento.querySelector(".btn-sumar").addEventListener("click",()=>{
            if(item.cantidad >= producto.stock){
                return
            }
            cambiarCantidad(producto.id, 1)
        })
        listaCarrito.appendChild(elemento)
        total += precioConDescuento(producto.precio) * item.cantidad
    })
    totalCarrito.textContent = `Total: $${total.toLocaleString("es-AR")}`
}

function filtrarProductos() {
    const texto = busqueda.value.toLocaleLowerCase()
    const tarjetas = listaProductos.querySelectorAll(".box")

    tarjetas.forEach( (tarjeta) => {
        const nombre = tarjeta.querySelector("h3").textContent.toLocaleLowerCase()
        tarjeta.classList.toggle("oculto", !nombre.includes(texto))
    })
}

document.getElementById("vaciar").addEventListener("click", async () => {
    if (carrito.length === 0) {
        await Swal.fire({
            icon: "info",
            title: "El carrito ya está vacío"
        })
        return
    }

    const resultado = await Swal.fire({
        title: "¿Seguro que querés vaciar el carrito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "No, volver"
    })
    if (!resultado.isConfirmed) {
        return
    }
    carrito = []
    guardarCarrito()
})

document.getElementById("ver-carrito").addEventListener("click", () => {
    panelCarrito.classList.add("active")
})

document.querySelector(".cerrar").addEventListener("click", () => {
    panelCarrito.classList.remove("active")
})

busqueda.addEventListener("input", filtrarProductos)

actualizarCarrito()
