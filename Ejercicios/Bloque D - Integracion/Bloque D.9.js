import Usuario from "../../Usuario.js";

class Publicacion {
  constructor(titulo, descripcion, autor) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.autor = autor;
    this.fechaPublicacion = new Date();
    this.activa = true;
    this.reseñas = []; //Array interno para almacenar multiples reseñas
  }
  agregarReseña(reseña) {
    this.reseñas.push(reseña);
  }

  promedioPuntaje() {
    if (this.reseñas.length === 0) {
      return 0;
    }

    let sumaTotal = 0;
    this.reseñas.forEach((reseña) => {
      sumaTotal += reseña.puntaje;
    });

    return sumaTotal / this.reseñas.length;
  }

  enviarResumenPorEmail() {
    const resumen = this.mostrarResumen();
    console.log(`Enviando resumen de la publicación por email: ${resumen}`);
  }

  mostrarResumen() {
    return `${this.titulo} - ${this.autor.nombre} - (${this.autor.email})`;
  }

  estaActiva() {
    return this.activa;
  }
}

class Reseña {
  constructor(texto, puntaje, autor) {
    this.texto = texto;
    this.puntaje = puntaje;
    this.autor = autor;
  }

  mostrarReseña() {
    return `${this.texto} - Puntaje: ${this.puntaje} - Autor: ${this.autor.nombre}`;
  }
}

const autor = new Usuario('Carlos Gómez', 'carlos@mail.com');
const lector1 = new Usuario('María López', 'maria@mail.com');
const lector2 = new Usuario('Lucía Fernández', 'lucia@mail.com');

// 2. Instanciar publicación
const post = new Publicacion('POO en JavaScript', 'Guía completa', autor);

// 3. Crear y agregar reseñas
post.agregarReseña(new Reseña('Muy claro', 5, lector1));
post.agregarReseña(new Reseña('Buen contenido', 4, lector2));

// 4. Calcular promedio
console.log(`Promedio de puntaje: ${post.promedioPuntaje()}`); // Output: 4.5

// 5. Simular servicio de email (Dependencia)
const fakeEmailService = {
  enviar: (destinatario, cuerpo) => {
    console.log(`[Email enviado a ${destinatario}]: ${cuerpo}`);
  }
};

post.enviarResumenPorEmail(fakeEmailService);

// ¿Publicacion “tiene muchas” Reseña (asociación) o cada reseña se pasa suelta sin guardarse? -->
// Publicacin "tiene muchas" Reseña (asociación), ya que cada publicación puede tener múltiples reseñas asociadas a ella, y estas se almacenan en un array interno dentro de la clase Publicacion.


// Vinculo con servicioDeEmail -- > 
// Es Dependencia, ya que la clase Publicacion depende de un servicio externo para enviar correos electrónicos, pero no lo posee ni lo administra directamente.