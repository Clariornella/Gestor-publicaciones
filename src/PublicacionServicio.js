import Publicacion from "./Publicacion.js";

export class PublicacionServicio extends Publicacion {
  constructor(titulo, descripcion, autor, modalidad, duracionMinutos, cliente) {
    super(autor, titulo, descripcion);
    this.modalidad = modalidad;
    this.duracionMinutos = duracionMinutos;
    this.cliente = cliente;
  }

  mostrarResumen() {
    const base = super.mostrarResumen();
    const clienteInfo = this.cliente ? `, Cliente: ${this.cliente}` : "";
    return `${base} (${this.modalidad}, ${this.duracionMinutos}min)`;
  }
}

export default PublicacionServicio;
