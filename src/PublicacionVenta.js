import Publicacion from "./Publicacion.js";

export class PublicacionVenta extends Publicacion {
  constructor(titulo, descripcion, autor, precio) {
    super(titulo, descripcion, autor); //Super antes del This SIEMPRE
    this.precio = precio;
    this.stock = 1;
  }

  mostrarResumen() {
    const base = super.mostrarResumen();
    return `${base} -$${this.precio}`;
  }
}

export default PublicacionVenta;  