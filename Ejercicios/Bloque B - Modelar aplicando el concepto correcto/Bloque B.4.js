class Cliente {
  constructor(nombre, telefono) {
    this.nombre = nombre;
    this.telefono = telefono;
  }
}

class Pedido { //Multiplicidad 1 a 1 con Cliente. Cada pedido tiene un cliente y cada cliente puede tener varios pedidos.
  constructor(sabor, precio, cantidad, cliente) {
    this.sabor = sabor;
    this.precio = precio;
    this.cantidad = cantidad;
    this.cliente = cliente;
  }

  calcularTotal() {
    return this.precio * this.cantidad;
  }
}

class LocalDeHelados { //Multiplicidad 1 a muchos con Pedido. Cada local puede tener varios pedidos, pero cada pedido pertenece a un solo local.
  constructor() {
    this.pedidos = []; //Array interno porque cada local puede tener varios pedidos
  }

  registrarPedido(pedido) {
    this.pedidos.push(pedido);
  }

  pedidosDe(nombreCliente) {
    return this.pedidos.filter((pedido) => pedido.cliente.nombre === nombreCliente);
  }
}

// ¿Qué tipo de vínculo es LocalDeHelados con Pedido? -->
// Asociacion. LocalDeHelados tiene un array de pedidos, pero no es dueño de ellos. Los pedidos pueden existir independientemente del local y pueden ser compartidos con otros locales si se quisiera.

// ¿Y Pedido con Cliente? -->
// Asociacion. Pedido tiene un atributo cliente, pero el cliente puede existir sin el pedido y puede tener varios pedidos asociados a él.

const local = new LocalDeHelados();

const cliente1 = new Cliente("Juan", "123456789");
const cliente2 = new Cliente("Maria", "987654321");
const cliente3 = new Cliente("Pedro", "456789123");

const pedido1 = new Pedido("Chocolate", 1200, 2, cliente1);
const pedido2 = new Pedido("Frutilla", 1500, 1, cliente2);
const pedido3 = new Pedido("Vainilla", 1000, 3, cliente1);
const pedido4 = new Pedido("Dulce de leche", 1300, 2, cliente3);

local.registrarPedido(pedido1);
local.registrarPedido(pedido2);
local.registrarPedido(pedido3);
local.registrarPedido(pedido4);

const nombreABuscar = "Juan";
const pedidosDeJuan = local.pedidosDe(nombreABuscar);


console.log(`Pedidos encontrados para ${nombreABuscar}: ${pedidosDeJuan.length}`);
pedidosDeJuan.forEach((p, i) => {
  console.log(`- Pedido #${i + 1}: ${p.sabor} x${p.cantidad} (Total: $${p.calcularTotal()})`);
});
