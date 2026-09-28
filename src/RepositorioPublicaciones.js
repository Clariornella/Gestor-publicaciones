import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import Usuario from "./Usuario.js";
import PublicacionVenta from "./PublicacionVenta.js";
import { Publicacion } from "./Publicacion.js";

export class RepositorioPublicaciones {
  constructor(ruta) {
    this.ruta = ruta;
    this.publicaciones = [];
    this.proximoId = 1;
  }

  async cargar() {
    try {
      const texto = await readFile(this.ruta, "utf8");
      const datos = JSON.parse(texto);

      this.publicaciones = datos.map((item) => {
        const publicacion = new Publicacion(
          item.id,
          item.autor,
          item.titulo,
          item.descripcion,
          item.categoria,
        );

        if (item.activa === false) publicacion.darDeBaja();
        publicacion.etiquetas = [...(item.etiquetas || [])];
        publicacion.estado = item.estado || publicacion.estado;
        return publicacion;
      });

      const ids = this.publicaciones.map((publicacion) => publicacion.id);
      this.proximoId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;

      this.publicaciones = [];
      this.proximoId = 1;
      await this.guardar();
    }
  }

  async guardar() {
    if (!this.ruta) return;

    await mkdir(dirname(this.ruta), { recursive: true });
    await writeFile(
      this.ruta,
      JSON.stringify(this.publicaciones, null, 2),
      "utf8",
    );
  }

  async agregar(autor, titulo, descripcion, categoria) {
    if (arguments.length === 1 && typeof autor === "object") {
      this.publicaciones.push(autor);
      await this.guardar();
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
    await this.guardar();
    return publicacion;
  }

  listar() {
    return [...this.publicaciones];
  }

  buscarPorId(id) {
    return this.publicaciones.find((pub) => pub.id === id);
  }

  async actualizar(id, cambios) {
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

    await this.guardar();
    return actualizada;
  }

  async eliminar(id) {
    const publicacion = this.buscarPorId(id);
    if (!publicacion) return false;

    this.publicaciones.splice(this.publicaciones.indexOf(publicacion), 1);
    await this.guardar();
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
