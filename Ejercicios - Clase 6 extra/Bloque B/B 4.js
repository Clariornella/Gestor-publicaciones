import Publicacion from "./Publicacion.js";
 
class PublicacionDonacion extends Publicacion {
  constructor(titulo, descripcion, autor, motivo) {
    super(titulo, descripcion, autor);
    this.motivo = motivo;
  }
}
 
export default PublicacionDonacion;

//new PublicacionDonacion(...) instanceof Publicacion debe dar true: es la verificacion minima de que la herencia quedó bien armada.