// Caso A
class PublicacionServicio extends Publicacion { /* ... */ }

// Tipo: Herencia. PublicacionServicio extiende a Publicacion mediante la palabra "extends". ("Es una")


// Caso B
class Pedido {
 constructor(cliente) {
 this.cliente = cliente;
 }
}

// Tipo: Asociacion. recibe una instancia de Cliente y la almacena permanentemente como un atributo propio en this.cliente, haciendo que el vínculo persista a lo largo de su ciclo de vida.

// Caso C
function aplicarDescuento(pedido, cupon) {
 return pedido.total - cupon.calcularDescuento(pedido.total);
}

// Tipo: Dependencia. La función recibe pedido y cupon únicamente como parámetros transitorios para calcular un descuento puntual y luego descartarlos, sin guardarlos como estado persistente en ningún objeto.