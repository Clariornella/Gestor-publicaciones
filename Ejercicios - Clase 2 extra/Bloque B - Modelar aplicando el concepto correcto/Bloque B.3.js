class Pedido {
  constructor(sabor, precio, cantidad) {
    this.sabor = sabor;
    this.precio = precio;
    this.cantidad = cantidad;
  }

  calcularTotal() {
    return this.precio * this.cantidad;
  }

  aplicarCupon(cupon) {
    const total = this.calcularTotal();
    const descuento = cupon.calcularDescuento(total);
    return total - descuento;
  }
}

class Cupon {
  constructor(codigo, porcentajeDescuento) {
    this.codigo = codigo;
    this.porcentajeDescuento = porcentajeDescuento;
  }

  calcularDescuento(monto) {
    return monto * (this.porcentajeDescuento / 100);
  }
}


// ¿Pedido debería guardar el cupón como atributo (this.cupon = cupon) o recibirlo solo como parámetro del método? Elijan una opción y justifiquen con el criterio de persistencia del vínculo --> 
// Solo recibirlo como parametro del motodo --> aplicarCupon(cupon). El cupón se utiliza únicamente para calcular una operación puntual (el total descontado) en el momento de la llamada.

//////////////////////////////////////////////////////////////////////////////////////////
// Prueben aplicarCupon() con dos pedidos distintos y el mismo objeto Cupón. ¿Que pasa?//
////////////////////////////////////////////////////////////////////////////////////////

// Instancia única de Cupon (20% de descuento)
const cupon20 = new Cupon("VERANO20", 20);

// Dos instancias distintas de Pedido
const pedido1 = new Pedido("Chocolate", 1200, 2); // Total base: $2400
const pedido2 = new Pedido("Frutilla", 1500, 1);  // Total base: $1500

// Aplicar el mismo cupón a ambos pedidos
const totalPedido1 = pedido1.aplicarCupon(cupon20);
const totalPedido2 = pedido2.aplicarCupon(cupon20);

console.log(`Pedido 1 con descuento: $${totalPedido1}`);
console.log(`Pedido 2 con descuento: $${totalPedido2}`); 

// El mismo cupón sirve para cualquier pedido sin necesidad de duplicarlo. Cada pedido le pasa su propio monto, el cupón hace el cálculo correspondiente y le devuelve a cada uno su descuento sin interferir con el otro.