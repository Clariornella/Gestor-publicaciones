import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import Usuario from "./Usuario.js";
import PublicacionVenta from "./PublicacionVenta.js";
import { Publicacion } from "./Publicacion.js";

export class RepositorioPublicaciones {
  // ===========================================================================
  // CONSTRUCTOR DEL REPOSITORIO CON PERSISTENCIA
  // ---------------------------------------------------------------------------
  // Recibe la ruta del archivo de persistencia en disco, inicializa un arreglo
  // vacío para las publicaciones y establece el contador de identidad en 1.
  // ===========================================================================
  constructor(ruta) {
    this.ruta = ruta;
    this.publicaciones = [];
    this.proximoId = 1;
  }

  // ===========================================================================
  // CARGA ASÍNCRONA DESDE EL ARCHIVO DE DISCO
  // ---------------------------------------------------------------------------
  // Lee el archivo JSON con readFile, parsea el contenido y reconstruye cada
  // elemento como una instancia real de Publicacion, restaurando su estado,
  // etiquetas y datos de moderación.
  // Si el archivo no existe (error ENOENT), inicializa una colección vacía y
  // genera el archivo inicial con guardar().
  // ===========================================================================
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

  // ===========================================================================
  // GUARDADO ASÍNCRONO EN DISCO
  // ---------------------------------------------------------------------------
  // Crea los directorios necesarios de forma recursiva con mkdir y serializa
  // la colección completa a una cadena JSON formateada usando writeFile.
  // ===========================================================================
  async guardar() {
    if (!this.ruta) return;

    await mkdir(dirname(this.ruta), { recursive: true });
    await writeFile(
      this.ruta,
      JSON.stringify(this.publicaciones, null, 2),
      "utf8",
    );
  }

  // ===========================================================================
  // CREAR / AGREGAR PUBLICACIÓN (CREATE)
  // ---------------------------------------------------------------------------
  // Asigna un identificador incremental automático (this.proximoId++), construye
  // la instancia, la añade a la colección interna, persiste los cambios en disco
  // mediante await this.guardar() y devuelve la publicación creada.
  // ===========================================================================
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

  // ===========================================================================
  // LEER / LISTAR COLECCIÓN (READ)
  // ---------------------------------------------------------------------------
  // Devuelve una copia superficial del arreglo interno ([...this.publicaciones])
  // para proteger la colección de modificaciones externas directas.
  // ===========================================================================
  listar() {
    return [...this.publicaciones];
  }

  // ===========================================================================
  // BUSCAR POR IDENTIFICADOR
  // ---------------------------------------------------------------------------
  // Utiliza Number(id) para asegurar la compatibilidad cuando el identificador
  // llega en formato de cadena de texto (string) desde parámetros HTTP.
  // ===========================================================================
  buscarPorId(id) {
    return this.publicaciones.find((pub) => pub.id === Number(id));
  }

  // ===========================================================================
  // ACTUALIZAR PUBLICACIÓN (UPDATE)
  // ---------------------------------------------------------------------------
  // Localiza el registro previo, lo reconstruye a través del constructor de
  // Publicacion para aplicar nuevamente las reglas de validación de negocio,
  // preserva el historial de moderación (reportes, etiquetas, estado, activa) y
  // persiste los cambios en el archivo de disco.
  // ===========================================================================
  async actualizar(id, cambios) {
    const anterior = this.buscarPorId(id);
    if (!anterior) throw new Error("Publicación inexistente");

    const actualizada = new Publicacion(
      anterior.id,
      cambios.autor ?? anterior.autor,
      cambios.titulo ?? anterior.titulo,
      cambios.descripcion ?? anterior.descripcion,
      cambios.categoria ?? anterior.categoria,
    );

    if (anterior.reportes !== undefined)
      actualizada.reportes = anterior.reportes;
    if (anterior.activa !== undefined) actualizada.activa = anterior.activa;
    if (anterior.estado !== undefined) actualizada.estado = anterior.estado;
    if (anterior.etiquetas !== undefined)
      actualizada.etiquetas = [...anterior.etiquetas];

    this.publicaciones[this.publicaciones.indexOf(anterior)] = actualizada;

    await this.guardar();
    return actualizada;
  }

  // ===========================================================================
  // ELIMINAR PUBLICACIÓN (DELETE)
  // ---------------------------------------------------------------------------
  // Ubica la posición exacta de la publicación, la extrae con splice, persiste
  // la colección actualizada en disco y devuelve true o false explícitamente.
  // ===========================================================================
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
