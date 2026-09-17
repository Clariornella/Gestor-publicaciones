import Usuario from "./Usuario.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";

const titulo = document.querySelector("#titulo");
const autor = document.querySelector("#autor");
const tipo = document.querySelector("#tipo");
const vistaPrevia = document.querySelector("#vista-previa");
const camposEspecificos = document.querySelector("#campos-especificos");
const email = document.querySelector("#email");
const ayudaEmail = document.querySelector("#ayuda-email");
const formulario = document.querySelector("#form-publicacion");
const descripcion = document.querySelector("#descripcion");
const listaPublicaciones = document.querySelector("#lista-publicaciones");

// punto 2: muestra en consola los eventos input y change de los campos título y tipo.
function observarEvento(evento) {
  console.table({
    type: evento.type,
    target: evento.target.id,
    currentTarget: evento.currentTarget.id,
    timeStamp: Math.round(evento.timeStamp),
  });
}

titulo.addEventListener("input", observarEvento);
tipo.addEventListener("change", observarEvento);

// punto 3: muestra en la sección de vista previa el título, autor y tipo de publicación.
function actualizarVistaPrevia() {
  const nombre = autor.value || "Autor";
  const texto = titulo.value || "Sin título";
  vistaPrevia.textContent = `${texto} — ${nombre} (${tipo.value})`;
}

titulo.addEventListener("input", actualizarVistaPrevia);
autor.addEventListener("input", actualizarVistaPrevia);
tipo.addEventListener("change", actualizarVistaPrevia);

actualizarVistaPrevia();

// punto 4: muestra los campos específicos según el tipo de publicación.
function actualizarCamposEspecificos() {
  if (tipo.value === "venta") {
    camposEspecificos.innerHTML = `
 <input id="precio" type="number" placeholder="Precio">
 <input id="stock" type="number" value="1">`;
  } else {
    camposEspecificos.innerHTML = `
 <select id="modalidad">
 <option>presencial</option><option>virtual</option>
 </select>
 <input id="duracion" type="number" placeholder="Minutos">`;
  }
}
tipo.addEventListener("change", actualizarCamposEspecificos);
actualizarCamposEspecificos();

// punto 5: muestra un mensaje de ayuda cuando el campo email está enfocado y lo oculta cuando pierde el foco.
function mostrarAyudaEmail() {
  ayudaEmail.textContent = "Usá un email válido del autor";
}
function ocultarAyudaEmail() {
  ayudaEmail.textContent = "";
}
email.addEventListener("focus", mostrarAyudaEmail);
email.addEventListener("blur", ocultarAyudaEmail);

// punto 6: al enviar el formulario, crea una publicación y la agrega a un array de publicaciones.
const publicaciones = [];

function crearPublicacionDesdeFormulario() {
  const usuario = new Usuario(autor.value, email.value);
  if (tipo.value === "venta") {
    return new PublicacionVenta(
      titulo.value,
      descripcion.value,
      usuario,
      Number(document.querySelector("#precio").value),
    );
  }
  return new PublicacionServicio(
    titulo.value,
    descripcion.value,
    usuario,
    document.querySelector("#modalidad").value,
    Number(document.querySelector("#duracion").value),
  );
}
function agregarTarjeta(publicacion) {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta");

  const parrafoResumen = document.createElement("p");
  // Polimorfismo: muestra el resumen según si es Venta o Servicio
  parrafoResumen.textContent = publicacion.mostrarResumen();

  const parrafoEstado = document.createElement("p");
  parrafoEstado.innerHTML = `<strong>Estado:</strong> <span class="estado">${publicacion.estaActiva() ? "Activa" : "Inactiva"}</span>`;

  const botonBaja = document.createElement("button");
  botonBaja.type = "button";
  botonBaja.textContent = "Dar de baja";

  function manejarBaja(evento) {
    console.log(evento.type, evento.target);
    publicacion.darDeBaja(); // Lógica en el modelo
    parrafoEstado.querySelector(".estado").textContent = "Inactiva";
    botonBaja.disabled = true; // Deshabilita para evitar múltiples clics
  }

  botonBaja.addEventListener("click", manejarBaja);

  tarjeta.appendChild(parrafoResumen);
  tarjeta.appendChild(parrafoEstado);
  tarjeta.appendChild(botonBaja);

  listaPublicaciones.appendChild(tarjeta);
}

function manejarEnvio(evento) {
  evento.preventDefault();
  const publicacion = crearPublicacionDesdeFormulario();
  publicaciones.push(publicacion);
  agregarTarjeta(publicacion);
  formulario.reset();
  actualizarCamposEspecificos();
  actualizarVistaPrevia();
}
formulario.addEventListener("submit", manejarEnvio);


