import Publicacion from "./Publicacion.js";

export default class PublicacionServicio extends Publicacion {
  constructor(titulo, descripcion, autor, modalidad, duracionMinutos, cliente) {
    super(titulo, descripcion, autor); //Super antes del This SIEMPRE
    this.modalidad = modalidad;
    this.duracionMinutos = duracionMinutos;
    this.cliente = cliente;
  }

  mostrarResumen() {
    const base = super.mostrarResumen();
    const clienteInfo = this.cliente ? `, Cliente: ${this.cliente}` : '';
    return `${base} (${this.modalidad}, ${this.duracionMinutos}min)`;
  }
}
