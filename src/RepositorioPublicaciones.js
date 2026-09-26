import Usuario from "../public/js/Usuario.js";
import PublicacionVenta from "./PublicacionVenta.js";
import { Publicacion } from "./Publicacion.js";

export class RepositorioPublicaciones {
  constructor() {
    this.publicaciones = [];
  }

  agregar(publicacion) {
    this.publicaciones.push(publicacion);
  }

  buscarPorUsuario(nombre) {
    return this.publicaciones.filter((pub) => pub.autor.nombre === nombre);
  }

  filtrarActivas() {
    return this.publicaciones.filter((pub) => pub.activa === true);
  }

  cantidadTotal() {
    return this.publicaciones.length;
  }

  listarResumenes() {
    return this.publicaciones.map((pub) => pub.mostrarResumen());
  }

  filtrarPorTipo(claseConstructor) {
    return this.publicaciones.filter((pub) => pub instanceof claseConstructor);
  }

  cargarDesde(datos) {
    this.publicaciones = datos.map((item) => {
      const usuario = new Usuario(
        item.autor || item.usuario?.nombre,
        item.email || item.usuario?.email,
      );

      if (item.tipo === "venta") {
        const venta = new PublicacionVenta(
          item.titulo,
          item.descripcion,
          usuario,
          item.precio,
        );
        if (item.activa === false) venta.darDeBaja();
        if (item.destacado) venta.destacar();
        return venta;
      } else {
        const servicio = new PublicacionServicio(
          item.titulo,
          item.descripcion,
          usuario,
          item.modalidad,
          item.duracion,
        );
        if (item.activa === false) servicio.darDeBaja();
        if (item.destacado) servicio.destacar();
        return servicio;
      }
    });
  }

  buscarPorEtiqueta(etiqueta) {
    return this.publicaciones.filter(
      (publicacion) =>
        publicacion.activa && publicacion.tieneEtiqueta(etiqueta),
    );
  }
}
