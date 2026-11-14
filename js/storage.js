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

    productosGuardados.forEach(({ id, cantidad }) => {
        const producto = productos.find(({ id: idProducto }) => idProducto === id)
        if (producto !== undefined && cantidad > 0) {
            const cantidadFinal = cantidad > producto.stock
                ? producto.stock
                : cantidad
            carrito.push({
                id,
                cantidad: cantidadFinal
            })
        }
    })
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito))
    actualizarCarrito()
}
