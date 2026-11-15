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
let carrito = []
let temporizadorNotificacion
let checkoutEnProceso = false

async function cargarProductos() {
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
    }
}

cargarProductos()
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
            const faltaStock = carrito.some(({ id, cantidad }) => {
                const producto = productos.find(({ id: idProducto }) => idProducto === id)
                return producto === undefined || cantidad > producto.stock
            })
            if (faltaStock) {
                reject(new Error("No hay stock suficiente para completar la compra."))
                return
            }
            resolve()
        }, 2000)
    })
}

function buscarEnCarrito(id) {
    return carrito.find(({ id: idProducto }) => idProducto === id)
}

function agregarAlCarrito(id) {
    const producto = productos.find(({ id: idProducto }) => idProducto === id)
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
        const { id, nombre, marca, precio, stock, imagen } = producto
        const tarjeta = document.createElement("article")
        tarjeta.className = "box"
        const precioFinal = precioConDescuento(precio)
        tarjeta.innerHTML = `
        <img class="img-producto" src="${imagen}" alt="${nombre}">
        <h3 class="nombre-producto">${nombre}</h3>
        <p> marca: ${marca}</p>
        <p class="precio">Precio:
            <span class="precio-descuento">$${precioFinal}</span>
            <span class="precio-original">$${precio}</span>
            <span class="etiqueta-descuento">20% OFF</span>
        </p>
        <P>Disponibles: ${stock}</P>
        <button type="button" class="btn-producto">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
<path d="M0 1.5a.5.5 0 0 1 .5-.5H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
</svg> Agregar al carrito</button>
        <div class="noti" id="notificacion-${id}">
        Agregaste ${nombre} al carrito
        </div>
</article>`
        const botonProducto = tarjeta.querySelector(".btn-producto")
        if (stock === 0) {
            botonProducto.textContent = "Sin stock"
            botonProducto.classList.add("sin-stock")
        } else {
            botonProducto.addEventListener("click", () => {
                agregarAlCarrito(id)
            })
        }
        listaProductos.appendChild(tarjeta)
    })
}

function actualizarCarrito() {
    listaCarrito.innerHTML= ""
    let total = 0
    carrito.forEach(({ id, cantidad }) => {
        const producto = productos.find(({ id: idProducto }) => idProducto === id)
        if(producto === undefined) {
            return
        }
        const elemento = document.createElement("li")
        const precioFinal = precioConDescuento(producto.precio)
        elemento.innerHTML= `
        <span><img class="img-carrito" src="${producto.imagen}" alt="${producto.nombre}">   ${producto.nombre} $${precioFinal}<span class="carrito-descuento">20% OFF</span></span>
        <div class = "controles-cantidad">
        <button type= "button" class= "btn-restar">-</button>
        <span>${cantidad}</span>
        <button type= "button" class="btn-sumar">+</button>
        </div>
        <button type= "button" class= "btn-eliminar">Eliminar</button>`
        elemento.querySelector(".btn-eliminar").addEventListener("click", ()=>{
            eliminarDelCarrito(id)
        })
        elemento.querySelector(".btn-restar").addEventListener("click",()=>{
            cambiarCantidad(id, -1)
        })
        elemento.querySelector(".btn-sumar").addEventListener("click",()=>{
            if(cantidad >= producto.stock){
                return
            }
            cambiarCantidad(id, 1)
        })
        listaCarrito.appendChild(elemento)
        total += precioConDescuento(producto.precio) * cantidad
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

const checkout = document.getElementById("checkout")
const checkoutForm = document.getElementById("checkout-form")

comprar.addEventListener("click", () => {
    if (carrito.length === 0) {
        Swal.fire({
            icon: "error",
            title: "El carrito está vacío"
        })
        return
    }
    checkout.hidden = false
})

checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault()
    if (checkoutEnProceso) {
        return
    }
    if (carrito.length === 0) {
        await Swal.fire({
            icon: "error",
            title: "El carrito está vacío"
        })
        checkout.hidden = true
        return
    }
    const datosFormulario = Object.fromEntries(new FormData(checkoutForm))
    const cliente = {
        nombre: datosFormulario.nombre.trim(),
        telefono: datosFormulario.telefono.trim(),
        direccion: datosFormulario.direccion.trim(),
        email: datosFormulario.email.trim(),
        metodoPago: datosFormulario.metodoPago
    }

    if (!cliente.nombre || !cliente.direccion || !cliente.email || cliente.telefono.replace(/\D/g, "").length < 8 || !cliente.metodoPago) {
        await Swal.fire({
            icon: "warning",
            title: "Revisá los datos",
            text: "Completá todos los campos y verificá que el teléfono tenga al menos 8 números."
        })
        return
    }

    const botonConfirmar = checkoutForm.querySelector('[type="submit"]')
    const textoOriginal = botonConfirmar.textContent
    checkoutEnProceso = true
    botonConfirmar.textContent = "Procesando compra..."

try {
    const pedido = carrito.map(({ id, cantidad }) => {
        const producto = productos.find(({ id: idProducto }) => idProducto === id)
        if (producto === undefined) {
            return null
        }
        const precioUnitario = precioConDescuento(producto.precio)
        return {
            nombre: producto.nombre,
            cantidad,
            precioUnitario,
            subtotal: precioUnitario * cantidad
        }
    })
    if (pedido.some((item) => item === null)) {
        throw new Error("Uno o más productos del carrito ya no están disponibles.")
    }
    
    const totalPedido = pedido.reduce((total, item) => total + item.subtotal, 0)
    
    const detalleProductos = pedido.map((item) =>
        `• ${item.nombre} x ${item.cantidad} ($${item.precioUnitario.toLocaleString("es-AR")} c/u): $${item.subtotal.toLocaleString("es-AR")}`
    ).join("\n")
    const metodosPago = {
        efectivo: "Efectivo al recibir",
        transferencia: "Transferencia",
        tarjeta: "Tarjeta de crédito o débito"
    }
    const resumenPedido = [
        `Cliente: ${cliente.nombre}`,
        `Teléfono: ${cliente.telefono}`,
        `Dirección: ${cliente.direccion}`,
        `Email: ${cliente.email}`,
        `Pago: ${metodosPago[cliente.metodoPago]}`,
        "",
        "Productos:",
        detalleProductos,
        "",
        `Total a pagar: $${totalPedido.toLocaleString("es-AR")}`
    ].join("\n")
    const confirmacion = await Swal.fire({
        title: "Revisá tu pedido",
        text: resumenPedido,
        customClass: { htmlContainer: "comprobante-texto" },
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmar compra",
        cancelButtonText: "Volver a editar"
    })
    if (!confirmacion.isConfirmed) {
        return
    }
    await cargarCompra()
    carrito.forEach(({ id, cantidad }) => {
        const producto = productos.find(({ id: idProducto }) => idProducto === id)
        producto.stock -= cantidad
    })
    carrito = []
    guardarCarrito()
    renderizarProductos()
    actualizarCarrito()
    checkout.hidden = true
    checkoutForm.reset()
    panelCarrito.classList.remove("active")
    await Swal.fire({
        title: "Comprobante de compra",
        text: `${resumenPedido}\n\nEstado: compra confirmada. ¡Gracias por tu compra!`,
        customClass: { htmlContainer: "comprobante-texto" },
        icon: "success"
    })
} catch (error) {
    await Swal.fire({
        icon: "error",
        title: "No se pudo completar la compra",
        text: error.message
    })
} finally {
    checkoutEnProceso = false
    botonConfirmar.textContent = textoOriginal
    }
})

document.getElementById("cancelar-checkout").addEventListener("click", () => {
    checkout.hidden = true
})

document.getElementById("ver-carrito").addEventListener("click", () => {
    panelCarrito.classList.add("active")
})

document.querySelector(".cerrar").addEventListener("click", () => {
    panelCarrito.classList.remove("active")
})

busqueda.addEventListener("input", filtrarProductos)

actualizarCarrito()
