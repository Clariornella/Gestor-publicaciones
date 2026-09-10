// Este código tiene dos errores típicos de herencia/polimorfismo. Encuéntrenlos y corríjanlos.
//
// class PublicacionVenta extends Publicacion {
//  constructor(titulo, descripcion, autor, precio) {
//  this.precio = precio; // <-- error 1
//  super(titulo, descripcion, autor);
//  }
//  mostrarResumen() {
//  return `${this.titulo} - $${this.precio}`; // <-- error 2
//  }
// }

//Error 1: this.precio = precio esta antes de super(...). En JavaScript no se puede usar this en el constructor de una subclase hasta que se llamÃ³ a super(); el programa tira un ReferenceError.

//Error 2: mostrarResumen() reescribe titulo a mano en vez de reutilizar super.mostrarResumen(). Funciona hoy, pero si Publicacion cambia mañana como arma su resumen (por ejemplo, agrega la fecha), PublicacionVenta queda desactualizada porque duplica la logica en vez de reusarla.


class PublicacionVenta extends Publicacion {
  constructor(titulo, descripcion, autor, precio) {
    super(titulo, descripcion, autor); // super() primero
    this.precio = precio;
  }
 
  mostrarResumen() {
    const base = super.mostrarResumen(); // reutiliza la logica del padre
    return `${base} - $${this.precio}`;
  }
}
