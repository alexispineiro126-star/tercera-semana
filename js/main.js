const panaderia = []

function agregarproducto() {
    let producto = (prompt("agregue el nombre del productos que desea comprar: \n1.pan \n2.galletitas \n3.facturas \n4.chipitas "))
    panaderia.push(producto)
}
function agregarproducto2() {
    let producto = (prompt("agregue otro producto: \n1.pan \n2.galletitas \n3.facturas \n4.chipitas"))
    panaderia.push(producto)
}

const mostrarproductos = function(){
    let mensaje = "agregaste estos productos:\n"
    for (const mostrar of panaderia) {
        mensaje += mostrar + "\n"
        alert(mensaje)
    }
}
function eliminarproductos(){
    let eliminar = prompt("eliminar algún producto:")
    let posicion = panaderia.indexOf(eliminar)
    if (posicion !== -1){
        panaderia.splice(posicion,1)
    alert("producto eliminado")
    }else{
        alert("ese prodcuto no existe")
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


