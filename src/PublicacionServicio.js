import Publicacion from "./Publicacion.js";

export class PublicacionServicio extends Publicacion {
  constructor(
    idOTitulo,
    tituloODescripcion,
    descripcionOAutor,
    autorOModalidad,
    modalidadODuracion,
    duracionConId,
    cliente,
  ) {
    const usaId = arguments.length >= 7;
    const id = usaId ? idOTitulo : undefined;
    const titulo = usaId ? tituloODescripcion : idOTitulo;
    const descripcion = usaId ? descripcionOAutor : tituloODescripcion;
    const autor = usaId ? autorOModalidad : descripcionOAutor;
    const modalidad = usaId ? modalidadODuracion : autorOModalidad;
    const duracionMinutos = usaId ? duracionConId : modalidadODuracion;

    if (usaId) {
      super(id, autor, titulo, descripcion);
    } else {
      super(autor, titulo, descripcion);
    }
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
