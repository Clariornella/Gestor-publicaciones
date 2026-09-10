class RepositorioPublicaciones {
  constructor() {
    this.publicaciones = [];
  }

  agregar(publicacion) {
    this.publicaciones.push(publicacion);
  }

  listarResumenes() {
    return this.publicaciones.map((p) => p.mostrarResumen());
  }

  filtrarPorTipo(claseConstructor) {
    return this.publicaciones.filter((p) => p instanceof claseConstructor);
  }
}
