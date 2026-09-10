class Pedido {
  constructor(sabor, precio, cantidad) {
    this.sabor = sabor;
    this.precio = precio;
    this.cantidad = cantidad;
  }
 
  calcularTotal() {
    return this.precio * this.cantidad;
  }
}
 
class PedidoDelivery extends Pedido {
  constructor(sabor, precio, cantidad, direccion) {
    super(sabor, precio, cantidad);
    this.direccion = direccion;
  }
}
 
class PedidoLocal extends Pedido {
  constructor(sabor, precio, cantidad, nombreRetira) {
    super(sabor, precio, cantidad);
    this.nombreRetira = nombreRetira;
  }
}
