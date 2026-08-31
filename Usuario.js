export default class Usuario {
  constructor(nombre, email) {
    this.nombre = nombre;
    this.email = email;
    this.fechaRegistro = new Date();
  }

  mostrarPerfil() {
    return `Nombre: ${this.nombre}, Email: ${this.email}`;
  }
}
