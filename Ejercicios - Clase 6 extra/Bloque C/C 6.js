class PedidoDelivery extends Pedido {
  constructor(sabor, precio, cantidad, direccion) {
    super(sabor, precio, cantidad);
    this.direccion = direccion;
  }
 
  calcularTotal() {
    const base = super.calcularTotal();
    return base + 500;
  }
}

//super.calcularTotal() ejecuta la version de Pedido (precio × cantidad); no hace falta reescribir esa cuenta.
//PedidoLocal sigue usando calcularTotal() heredado sin cambios: no todas las subclases tienen que sobreescribir todo.
//Vinculacion dinamica: si p es un PedidoDelivery, p.calcularTotal() ejecuta la version de PedidoDelivery aunque en el codigo se lo trate como un Pedido generico.