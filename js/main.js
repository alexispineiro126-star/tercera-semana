class productos{
    constructor(nombre ,marca,precio, stock){
    this.nombre= nombre
    this.marca= marca 
    this.precio= precio
    this.stock= stock
    }
Vender(cantidad){
if(cantidad <= this.stock){
    this.stock -= cantidad
    alert(`Compraste ${cantidad} de ${this.nombre} \nCantidad disponible ahora: ${this.stock} de ${this.nombre} \nmarca: ${this.marca} \nprecio final: ${cantidad * this.precio} `)
        }else{
            alert(`no hay suficiente cantidad de stok de ${this.stock}`)
        }
    }
    aplicardescuento(aplicar){
        if (aplicar < 0 || aplicar > 100) {
            alert('El descuento debe estar entre 0 y 100')
            return
        }
        const descuento = this.precio * aplicar / 100
        this.precio = this.precio - descuento
        alert(`Descuento aplicado a ${this.nombre} (${this.marca})\nPrecio anterior: $${this.precio + descuento}\nPrecio final: $${this.precio}`)
    }
}

const panaderia = [
    new productos ("pan","baguettes", 1000, 50),
    new productos ("galletitas","Divercion", 2000, 50),
    new productos ("facturas","central", 1400,12),
    new productos ("chipitas","Doña laura", 1200,5 ),
    new productos ("torta","todo dulce", 1500, 4)
]

const mostrarproductos = function(){
    let mensaje = "Productos disponibles de la panaderia:\n\n"
    let i = 1
    for (const mostrar of panaderia) {
        mensaje += `${i}. ${mostrar.nombre} marca: ${mostrar.marca} - precio:  ${mostrar.precio} - disponibles:  ${mostrar.stock}\n\n`
        i++
    }
    alert(mensaje)
}

function venderprductos(){
    let opciones = parseInt(prompt(`elija el producto que desea \n1`))
    let elegido = panaderia [opciones - 1]
    if (elegido){
        let cantidad = parseInt(prompt(`cuantos ${elegido.nombre} desea?`))
        elegido.Vender(cantidad)
    }else{
        alert("elige según el orden de los productos del 1 al 5")
    }
}

function aplicardescuentoproducto(){
    let opciones = parseInt(prompt(`Que producto desea aplicar el descuento`))
    let elegido = panaderia [opciones - 1]
    if (elegido){
        let cantidad = parseInt(prompt(`Cuanto es el descuento % que desea aplicar al produdcto ${elegido.nombre}?`))
        elegido.aplicardescuento(cantidad)
    }else{
        alert("elegi según el orden de los prductos del 1 al 5")
    }
}

let consulta = "si"

while (consulta === "si") {

let opciones = parseInt(prompt(`Que desea hacer?\n1. Ver el menú: \n2. Comprar productos de la tienda   \n3. Aplicar descuento`))
switch(opciones){
case 1:
    mostrarproductos()
    break
case 2:
    venderprductos()
    break
case 3:
    aplicardescuentoproducto()
    break
default:
    alert("Opcion invalida, elija del 1 al 3")
}

consulta = prompt("Deseas volver al inicio? (si/no)").toLowerCase()
}


