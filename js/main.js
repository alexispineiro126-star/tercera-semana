class productos {
    constructor(id, nombre, marca, precio, stock) {
        this.id = id
        this.nombre = nombre
        this.marca = marca
        this.precio = precio
        this.stock = stock
    }

    Vender(cantidad) {
        if (cantidad <= this.stock) {
            this.stock -= cantidad
            alert("Compraste " + cantidad + " de " + this.nombre + "\nCantidad disponible ahora: " + this.stock + " de " + this.nombre + "\nmarca: " + this.marca + "\nprecio final: " + cantidad * this.precio)
        } else {
            alert("no hay suficiente cantidad de stok de " + this.stock)
        }
    }

    aplicardescuento(aplicar) {
        if (aplicar < 0 || aplicar > 100) {
            alert("El descuento debe estar entre 0 y 100")
            return
        }
        const precioAnterior = this.precio
        const descuento = this.precio * aplicar / 100
        this.precio = this.precio - descuento
        alert("Descuento aplicado a " + this.nombre + " " + this.marca + "\nPrecio anterior: " + precioAnterior + "\nPrecio final: " + this.precio)
    }
}

const panaderia = [
    new productos(1, "pan", "baguettes", 1000, 50),
    new productos(2, "galletitas", "Diversión", 2000, 50),
    new productos(3, "facturas", "central", 1400, 12),
    new productos(4, "chipitas", "Doña laura", 1200, 5),
    new productos(5, "torta", "todo dulce", 1500, 4)
]

const mostrarproductos = function() {
    let mensaje = "Productos disponibles de la panaderia:\n\n "
    panaderia.forEach(function(mostrar, indice) {
        mensaje += (indice + 1) + ". " + mostrar.nombre + " marca: " + mostrar.marca + " - precio:  " + mostrar.precio + " - Disponibles:  " + mostrar.stock + "\n\n"
    })
    alert(mensaje)
}

const carrito = []

function venderproductos() {
    let opciones = parseInt(prompt("Ingresá del 1 al 5 para comprar el prodcuto que deseá"))
    let elegido = panaderia.find(producto => producto.id === opciones)
    if (elegido) {
        let cantidad = parseInt(prompt("¿Cuántos " + elegido.nombre + " deseás?"))
        if (cantidad > 0 && cantidad <= elegido.stock) {
            elegido.Vender(cantidad)
            carrito.push({
                producto: elegido.nombre,
                cantidad: cantidad,
                subtotal: cantidad * elegido.precio
            })
            const totalCarrito = carrito.reduce(
                (total, compra) => total + compra.subtotal,
                0
            )
            alert("Total acumulado de tu carrito: $" + totalCarrito)
        } else {
            alert("Ingresá una cantidad válida y disponible.")
        }
    } else {
        alert("No existe producto con ese número, elija del 1 al 5.")
    }
}

function mostrarCarrito() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.")
    }
    let mensaje = "Compras de tu carrito:\n\n"
    carrito.forEach(function(compra, indice) {
        mensaje += (indice + 1) + ". " + compra.cantidad + " de " + compra.producto + " - subtotal: $" + compra.subtotal + "\n"
    })
    const totalCarrito = carrito.reduce(
        (total, compra) => total + compra.subtotal,
        0
    )
    mensaje += "\nTotal: $" + totalCarrito
    alert(mensaje)
}

function quitarUltimo() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.")
    }
    const quitar = carrito.pop()
    const cambiarproducto = panaderia.find(function(producto) {
        return producto.nombre === quitar.producto
    })
    if (cambiarproducto) {
        cambiarproducto.stock += quitar.cantidad
    }
    alert("Se quitó del carrito la compra de " + quitar.cantidad + " de " + quitar.producto + ". El stock fue actualizado.")
}

function aplicardescuentoproductos() {
    let opciones = parseInt(prompt("Que producto desea aplicar el descuento"))
    let elegido = panaderia[opciones - 1]
    if (elegido) {
        let cantidad = parseInt(prompt("Cuanto es el descuento % que desea aplicar al produdcto " + elegido.nombre + "?"))
        elegido.aplicardescuento(cantidad)
    } else {
        alert("elegi según el orden de los productos del 1 al 5")
    }
}

function buscarProducto() {
    const busqueda = prompt("Escribí el nombre del producto que buscás:").toLowerCase()
    const resultados = panaderia.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda)
    )
    if (resultados.length > 0) {
        let mensaje = "Productos encontrados:\n\n"
        resultados.forEach(function(producto) {
            mensaje += producto.id + ". " + producto.nombre + "  Marca: " + producto.marca + "  Precio: $" + producto.precio + "  Stock: " + producto.stock + "\n\n"
        })
        alert(mensaje)
    } else {
        alert("No encontramos productos con ese nombre, porfavor revise el menú.")
    }
}

let consulta = "si"

while (consulta === "si") {
    let opciones = parseInt(prompt("Que desea hacer?\n1. Ver el menú: \n2. Comprar productos de la tienda   \n3. Aplicar descuento \n4. Buscar productos\n5. Ver carrito\n6. Quitar última compra del carrito"))
    switch (opciones) {
        case 1:
            mostrarproductos()
            break
        case 2:
            venderproductos()
            break
        case 3:
            aplicardescuentoproductos()
            break
        case 4:
            buscarProducto()
            break
        case 5:
            mostrarCarrito()
            break
        case 6:
            quitarUltimo()
            break
        default:
            alert("Opcion invalida, elija del 1 al 6")
    }

    consulta = prompt("Deseas volver al inicio? (si/no)").toLowerCase()
}