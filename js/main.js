const panaderia = []

function agregarproducto() {
    let producto = (prompt("Agregue el nombre del productos que desea comprar: \n1.Pan \n2.Galletitas \n3.Facturas \n4.Chipitas \n5.Torta "))
    panaderia.push(producto)
}
function agregarproducto2() {
    let producto = (prompt("Agregue otro producto: \n1.Pan \n2.Galletitas \n3.Facturas \n4.Chipitas \n5.Torta"))
    panaderia.unshift(producto)
}

const mostrarproductos = function(){
    let mensaje = "agregaste estos productos:\n"
    for (const mostrar of panaderia) {
        mensaje += mostrar + "\n"
        alert(mensaje)
    }
}
function eliminarproductos(){
    let eliminar = prompt("Elimina algún producto:")
    if (panaderia.includes(eliminar)){
        let  posicion =  panaderia.indexOf(eliminar)
        panaderia.splice(posicion,1)
    alert("eliminaste el producto: " + eliminar)
    }else{
        alert("Ese prodcuto no existe")
    }
}
function eliminar2() {
    let confirmar = prompt("Desea eliminar el último producto? (si/no)").toLowerCase()
    if (confirmar === "si") {
        let eliminado = panaderia.pop()
        alert("Se ha eliminado el producto: " + eliminado)
    }
}

let consulta = "si"
while (consulta === "si") {
agregarproducto()
agregarproducto2()
mostrarproductos()
eliminarproductos()
eliminar2()

consulta = prompt("Desea agregar otro producto? (si/no)").toLowerCase();
}


