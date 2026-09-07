import Publicacion from "./Publicacion.js";

export default class PublicacionServicio extends Publicacion {
  constructor(titulo, descripcion, autor, modalidad, duracionMinutos) {
    super(titulo, descripcion, autor); //Super antes del This SIEMPRE
    this.modalidad = modalidad;
    this.duracionMinutos = duracionMinutos;
  }
}
