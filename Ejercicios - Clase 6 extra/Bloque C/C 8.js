// Dado un array mixto de Pedido, PedidoDelivery y PedidoLocal, escriban un único forEach que imprima el total de cada uno, sin usar ningún if ni instanceof.

// const pedidos = [
// new Pedido("Chocolate", 1200, 2),
// new PedidoDelivery("Limón", 1100, 1, "Alsina 1253"),
// new PedidoLocal("Frutilla", 1000, 3, "Martín"),
// ];

const pedidos = [
  new Pedido("Chocolate", 1200, 2),
  new PedidoDelivery("LimÃ³n", 1100, 1, "Alsina 1253"),
  new PedidoLocal("Frutilla", 1000, 3, "Martin"),
];

pedidos.forEach((p) => {
  console.log(`${p.sabor}: $${p.calcularTotal()}`);
});
