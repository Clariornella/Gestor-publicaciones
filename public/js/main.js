import Usuario from "./Usuario.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
import RepositorioPublicaciones from "./RepositorioPublicaciones.js";

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

// Instancia del repositorio
const repositorio = new RepositorioPublicaciones();

// Vista previa
function actualizarVistaPrevia() {
  const nombre = autor.value || "Autor";
  const texto = titulo.value || "Sin título";
  vistaPrevia.textContent = `${texto} — ${nombre} (${tipo.value})`;
}

titulo.addEventListener("input", actualizarVistaPrevia);
autor.addEventListener("input", actualizarVistaPrevia);
tipo.addEventListener("change", actualizarVistaPrevia);
actualizarVistaPrevia();

// Campos específicos según tipo
function actualizarCamposEspecificos() {
  if (tipo.value === "venta") {
    camposEspecificos.innerHTML = `
      <div>
        <label for="precio">Precio:</label>
        <input id="precio" type="number" placeholder="Precio" required>
      </div>
    `;
  } else {
    camposEspecificos.innerHTML = `
      <div>
        <label for="modalidad">Modalidad:</label>
        <select id="modalidad">
          <option value="presencial">Presencial</option>
          <option value="remoto">Remoto</option>
        </select>
      </div>
      <br>
      <div>
        <label for="duracion">Duración (minutos):</label>
        <input id="duracion" type="number" placeholder="Duración" required>
      </div>
    `;
  }
}
tipo.addEventListener("change", actualizarCamposEspecificos);
actualizarCamposEspecificos();

// Ayuda email
email.addEventListener("focus", () => {
  ayudaEmail.textContent = "Usá un email válido del autor";
});
email.addEventListener("blur", () => {
  ayudaEmail.textContent = "";
});

// Creación del objeto de dominio
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

// Parte 2: Renderizar publicaciones con data-id y data-accion
function renderizarPublicaciones() {
  listaPublicaciones.innerHTML = "";

  repositorio.publicaciones.forEach((pub, index) => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta");
    tarjeta.dataset.id = index; // data-id en la tarjeta

    const parrafoResumen = document.createElement("p");
    parrafoResumen.textContent = pub.mostrarResumen();

    const parrafoEstado = document.createElement("p");
    parrafoEstado.innerHTML = `<strong>Estado:</strong> <span class="estado">${pub.estaActiva() ? "Activa" : "Inactiva"}</span>`;

    const parrafoDestacado = document.createElement("p");
    parrafoDestacado.innerHTML = `<strong>Destacado:</strong> <span class="destacado">${pub.destacado ? "Sí" : "No"}</span>`;

    // Botón Destacar con data-accion="destacar"
    const botonDestacar = document.createElement("button");
    botonDestacar.type = "button";
    botonDestacar.textContent = "Destacar";
    botonDestacar.dataset.accion = "destacar";

    // Botón Dar de baja con data-accion="baja"
    const botonBaja = document.createElement("button");
    botonBaja.type = "button";
    botonBaja.textContent = "Dar de baja";
    botonBaja.dataset.accion = "baja";

    tarjeta.appendChild(parrafoResumen);
    tarjeta.appendChild(parrafoEstado);
    tarjeta.appendChild(parrafoDestacado);
    tarjeta.appendChild(botonDestacar);
    tarjeta.appendChild(botonBaja);

    listaPublicaciones.appendChild(tarjeta);
  });
}

// Manejo del formulario
function manejarEnvio(evento) {
  evento.preventDefault(); // Evita la acción nativa de recargar/navegar

  const publicacion = crearPublicacionDesdeFormulario();
  repositorio.agregar(publicacion); // Agrega al repositorio de dominio

  formulario.reset();
  actualizarCamposEspecificos();
  actualizarVistaPrevia();
  renderizarPublicaciones(); // Redibuja la lista con los atributos data-*
}

formulario.addEventListener("submit", manejarEnvio);

function manejarAccion(evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton || !listaPublicaciones.contains(boton)) return;

  const tarjeta = boton.closest("[data-id]");
  const id = Number(tarjeta.dataset.id);

  const accion = boton.dataset.accion;

  const publicacion = repositorio.publicaciones[id];
  if (!publicacion) return;

  if (accion === "baja") publicacion.darDeBaja();
  if (accion === "destacar") publicacion.destacar();

  renderizarPublicaciones();
}
listaPublicaciones.addEventListener("click", manejarAccion);
