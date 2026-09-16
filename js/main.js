const panaderia = []

function agregarproducto() {
    let producto = (prompt("Agregue el nombre del productos que desea comprar: \n1.Pan \n2.Galletitas \n3.Facturas \n4.Chipitas \n5Torta "))
    panaderia.push(producto)
}
function agregarproducto2() {
    let producto = (prompt("Agregue otro producto: \n1.Pan \n2.Galletitas \n3.Facturas \n4.Chipitas \n5Torta"))
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
    let eliminar = prompt("Eliminar algún producto:")
    if (panaderia.includes(eliminar)){
        let  posicion =  panaderia.indexOf(eliminar)
        panaderia.splice(posicion,1)
    alert("Producto eliminado")
    }else{
        alert("Ese prodcuto no existe")
    }
}
let consulta = "si"
while (consulta === "si") {
agregarproducto()
agregarproducto2()
mostrarproductos()
eliminarproductos()

consulta = prompt("¿Desea agregar otro producto? (si/no)").toLowerCase();
}


