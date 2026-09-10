class Publicacion {
  // ...atributos y constructor existentes...
 
  diasPublicada() {
    const ms = new Date() - this.fechaPublicacion;
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }
}
 
class PublicacionVenta extends Publicacion { /* diasPublicada() ya no se repite aca */ }
class PublicacionServicio extends Publicacion { /* tampoco acá */ }

// versión con duplicación

// class PublicacionVenta extends Publicacion {
//  diasPublicada() {
//  const ms = new Date() - this.fechaPublicacion;
//  return Math.floor(ms / (1000 * 60 * 60 * 24));
//  }
// }
// class PublicacionServicio extends Publicacion {
//  diasPublicada() {
//  const ms = new Date() - this.fechaPublicacion;
//  return Math.floor(ms / (1000 * 60 * 60 * 24));
//  }
// }
