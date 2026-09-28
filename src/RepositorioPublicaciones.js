import Usuario from "./Usuario.js";
import PublicacionVenta from "./PublicacionVenta.js";
import { Publicacion } from "./Publicacion.js";

export class RepositorioPublicaciones {
  constructor() {
    this.publicaciones = [];
    this.proximoId = 1;
  }

  agregar(autor, titulo, descripcion, categoria) {
    if (arguments.length === 1 && typeof autor === "object") {
      this.publicaciones.push(autor);
      return autor;
    }

    const publicacion = new Publicacion(
      this.proximoId++,
      autor,
      titulo,
      descripcion,
      categoria,
    );

    this.publicaciones.push(publicacion);
    return publicacion;
  }

  listar() {
    return [...this.publicaciones];
  }

  buscarPorId(id) {
    return this.publicaciones.find((pub) => pub.id === id);
  }

  actualizar(id, cambios) {
    const anterior = this.buscarPorId(id);
    if (!anterior) throw new Error("Publicación inexistente");

    // Reconstruimos a través del constructor para revalidar reglas de negocio
    const actualizada = new Publicacion(
      anterior.id,
      cambios.autor ?? anterior.autor,
      cambios.titulo ?? anterior.titulo,
      cambios.descripcion ?? anterior.descripcion,
      cambios.categoria ?? anterior.categoria,
    );

    // PASO 3: Decisión de diseño sobre estado, reportes, etiquetas y activa:
    // Se conservan para no perder el historial de moderación ni alterar
    // el ciclo de vida del recurso ante una simple edición de contenido.
    if (anterior.reportes !== undefined)
      actualizada.reportes = anterior.reportes;
    if (anterior.activa !== undefined) actualizada.activa = anterior.activa;
    if (anterior.estado !== undefined) actualizada.estado = anterior.estado;
    if (anterior.etiquetas !== undefined)
      actualizada.etiquetas = [...anterior.etiquetas];

    // Reemplazamos la instancia en la misma posición de la colección
    this.publicaciones[this.publicaciones.indexOf(anterior)] = actualizada;

    return actualizada;
  }

  eliminar(id) {
    const publicacion = this.buscarPorId(id);
    if (!publicacion) return false;

    this.publicaciones.splice(this.publicaciones.indexOf(publicacion), 1);
    return true;
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
  pendientesDeRevision() {
    return this.publicaciones.filter(
      (publicacion) => publicacion.activa && publicacion.requiereRevision(),
    );
  }

  obtenerEstado() {
    const activas = this.publicaciones.filter((p) => p.activa).length;
    return `Publicaciones activas: ${activas}`;
  }
}
