// Hacer la Clase Restaurante, hace que Restaurante sea un objeto y no un string, y que la clase Reserva tenga una relación de asociación con Restaurante.
class Restaurante {
  constructor(nombre, direccion) {
    this.nombre = nombre;
    this.direccion = direccion;
  }
}

class Reserva {
  constructor(fecha, cantidadPersonas, restaurante) {
    this.fecha = fecha;
    this.cantidadPersonas = cantidadPersonas;
    this.restaurante = restaurante; //Ahora es un objeto de la clase Restaurante, no un string.
  }

  mostrarResumen() {
    // Ponemos this.restaurante.nombre para acceder al nombre del restaurante a través del objeto Restaurante.
    return `Reserva en ${this.restaurante.nombre} para ${this.cantidadPersonas}`;
  }
}

const restaurante1 = new Restaurante("La Buena Mesa", "Calle Falsa 123");
const reserva1 = new Reserva("2024-06-15", 4, restaurante1);

console.log(reserva1.mostrarResumen()); // Muestra: "Reserva en La Buena Mesa para 4"
console.log(
  `Restaurante de la reserva: ${reserva1.restaurante.nombre}, Dirección: ${reserva1.restaurante.direccion}`,
); // Muestra: "Restaurante de la reserva: La Buena Mesa, Dirección: Calle Falsa 123"

//JUSTIFICACIÓN (Siguiendo el ejemplo de "Rocío" en la teoría):

//Al guardar el restaurante como un simple string (ej: "La Parrilla"):

// 1. Pérdida de atributos complementarios: Se pierde información clave de la entidad, como la dirección (o un teléfono/contacto), ya que un texto plano no puede encapsular más datos descriptivos.

// 2. Pérdida de identidad y redundancia: Si varias reservas apuntan al mismo restaurante, el nombre queda duplicado como texto plano y no existe una referencia real en memoria hacia la misma entidad.

// 3. Problemas de actualización: Si el restaurante cambia su nombre o dirección, habría que modificar cada reserva de forma manual en lugar de actualizar una única instancia compartida.
