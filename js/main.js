const URL = "./datos/dato.json"
let productos = []

fetch (URL)
.then(Response =>Response.json())
.then((data) =>{
    productos = data
    restaurarCarrito()
    renderizarProductos(data)
    actualizarCarrito()
}).catch((error) =>{
    console.log("error", error)
})

const descuento = 0.20
const precioConDescuento = (precio) =>(precio * (1 - descuento))

const listaProductos = document.getElementById("productos")
const listaCarrito = document.getElementById("lista")
const panelCarrito = document.querySelector(".carrito")
const busqueda = document.getElementById("busqueda")
const totalCarrito = document.getElementById("total")
const comprar = document.getElementById("compra")

let carrito = []

function restaurarCarrito() {
    const carritoGuardado = localStorage.getItem("carrito")
    if (carritoGuardado === null) {
        return
    }

    let productosGuardados
    try {
        productosGuardados = JSON.parse(carritoGuardado)
    } catch (error) {
        console.error("No se pudo leer el carrito guardado:", error)
        return
    }

    if (!Array.isArray(productosGuardados)) {
        console.error("El carrito guardado no tiene un formato válido.")
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

comprar.addEventListener("click", async () => {
    if (carrito.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Error, el carrito esta vacio",
            text: "Something went wrong!",

        })
        return
    }
    try {
        await new Promise((resolve) => {
            setTimeout(resolve, 2000)
        })
        Swal.fire({
            title: "Compra exitosa",
            icon: "success",
            draggable: true
        })
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error, el carrito esta vacio",
            text: "Something went wrong!",
        })
    } finally {
        console.log("proceso de compra finalizado")
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
    const producto = productos.find( (item) => {
        return item.id === id
    })
    const productoEnCarrito = buscarEnCarrito(id)

if (productoEnCarrito !== undefined) {
    if (productoEnCarrito.cantidad < producto.stock) {
        productoEnCarrito.cantidad++
    }
} else if (producto.stock > 0) {
    carrito.push({ id: producto.id, cantidad: 1 })
}
guardarCarrito()
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
    productos.forEach( (producto) => {
        listaProductos.innerHTML += 
        `<article class="box">
        <h3 class= "">${producto.nombre}</h3>
        <p> marca: ${producto.marca}</p> 
        <p class="precio">
            <span class="precio-original">$${producto.precio}</span>
            <span class="precio-descuento">$${precioConDescuento(producto.precio)}</span>
            <span class="etiqueta-descuento">20% OFF</span>
        </p>
        <P>Disponible: ${producto.stock}</P>
        <button type="button" class="btn" data-id="${producto.id}" ${producto.stock === 0 ? "disabled" : ""}>
        + Agregar al carrito</button></article>`
    })
    const botones = listaProductos.querySelectorAll(".btn")
    botones.forEach((boton) => {
        boton.addEventListener("click", () => {
            agregarAlCarrito(Number(boton.dataset.id))
        })
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
        <span>${producto.nombre} - <del>$${producto.precio.toLocaleString("es-AR")}</del> $${precioConDescuento(producto.precio).toLocaleString("es-AR")}</span>
        <div class = "controles-cantidad">
        <button type= "button" class= "btn-restar">-</button>
        <span>${item.cantidad}</span>
        <button type= "button" class="btn-sumar">+</button>
        </div>
        <button type= "button" class= "btn-eliminar">Eliminar</button>`
        elemento.querySelector(".btn-eliminar").addEventListener("click", ()=>{
            eliminarDelCarrito(producto.id)
        })
        elemento.querySelector(".btn-restar").addEventListener("click", ()=>{
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

document.getElementById("vaciar").addEventListener("click", () => {
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
