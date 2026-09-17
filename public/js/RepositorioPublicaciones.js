export default class RepositorioPublicaciones {
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
}
