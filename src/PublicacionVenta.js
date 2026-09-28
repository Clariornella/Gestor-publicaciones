import Publicacion from "./Publicacion.js";

export class PublicacionVenta extends Publicacion {
  constructor(titulo, descripcion, autor, precio) {
    super(autor, titulo, descripcion);
    this.precio = precio;
    this.stock = 1;
  }

  mostrarResumen() {
    const base = super.mostrarResumen();
    return `${base} -$${this.precio}`;
  }
}

export default PublicacionVenta;
