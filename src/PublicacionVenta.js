import Publicacion from "./Publicacion.js";

export class PublicacionVenta extends Publicacion {
  constructor(
    idOTitulo,
    autorODescripcion,
    tituloOAutor,
    descripcionOPrecio,
    categoriaOPrecio,
    precioConId,
  ) {
    const usaId = arguments.length >= 6;
    const id = usaId ? idOTitulo : undefined;
    const autor = usaId ? autorODescripcion : tituloOAutor;
    const titulo = usaId ? tituloOAutor : idOTitulo;
    const descripcion = usaId ? descripcionOPrecio : autorODescripcion;
    const categoria = usaId ? categoriaOPrecio : "general";
    const precio = usaId ? precioConId : descripcionOPrecio;

    if (usaId) {
      super(id, autor, titulo, descripcion, categoria);
    } else {
      super(autor, titulo, descripcion, categoria);
    }
    this.precio = precio;
    this.stock = 1;
  }

  mostrarResumen() {
    const base = super.mostrarResumen();
    return `${base} -$${this.precio}`;
  }
}

export default PublicacionVenta;
