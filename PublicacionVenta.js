import Publicacion from "./Publicacion.js";

export default class PublicacionVenta extends Publicacion {
  constructor(titulo, descripcion, autor, precio) {
    super(titulo, descripcion, autor); //Super antes del This SIEMPRE
    this.precio = precio;
    this.stock = 1;
  }
}
