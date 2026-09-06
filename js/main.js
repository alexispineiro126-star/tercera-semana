let consulta = "si";

while (consulta === "si") {

let precio = parseInt(prompt("Ingrese el precio del producto:"));
let cantidad = parseInt(prompt("Ingrese la cantidad del producto:"));
let descuento = parseInt(prompt("Ingrese el porcentaje de descuento:"));

function calculartotal(precio, cantidad) {
return precio * cantidad;
}

const aplicardescuento = function(total, descuento) {
return total - (total * descuento / 100);
}

const total = (total) => {
alert("El total a pagar es: $" + total);
}

let totalSinDescuento = calculartotal(precio, cantidad);
let totalConDescuento = aplicardescuento(totalSinDescuento, descuento);
total(totalConDescuento);

consulta = prompt("¿Desea realizar otra compra? (si/no)").toLowerCase();
}
