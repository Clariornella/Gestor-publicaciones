import {
  convertirAJSON,
  convertirAXML,
  convertirDesdeJSON,
  paraExponer,
} from "../src/formatos.js";
import { Publicacion } from "../src/Publicacion.js";

describe("Formatos de publicaciones", () => {
  test("JSON conserva la representación pública en la ida y vuelta", () => {
    const publicacion = new Publicacion(
      7,
      "Ana",
      "Apuntes de Redes",
      "Descripción válida con más de veinte caracteres.",
      "general",
    );
    publicacion.agregarEtiqueta("redes");
    publicacion.darDeBaja();

    const publicaciones = [publicacion];
    const idaYVuelta = convertirDesdeJSON(convertirAJSON(publicaciones));

    expect(idaYVuelta).toEqual(publicaciones.map(paraExponer));
  });

  test("una colección vacía se convierte a JSON y XML sin publicaciones hijas", () => {
    expect(convertirAJSON([])).toBe("[]");

    const xml = convertirAXML([]);
    expect(xml).toMatch(/<publicaciones>\s*<\/publicaciones>/);
    expect(xml).not.toContain("<publicacion ");
  });

  test("escapa caracteres reservados del autor en XML", () => {
    const publicacion = new Publicacion(
      1,
      'Ana & <equipo> "Redes"',
      "Título válido",
      "Descripción válida con más de veinte caracteres.",
      "general",
    );

    const xml = convertirAXML([publicacion]);

    expect(xml).toContain(
      "<autor>Ana &amp; &lt;equipo&gt; &quot;Redes&quot;</autor>",
    );
    expect(xml).not.toContain("<autor>Ana & <equipo>");
  });
});
