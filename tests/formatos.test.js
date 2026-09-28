// =============================================================================
// SUITE DE PRUEBAS UNITARIAS: SERIALIZACIÓN Y FORMATOS (JSON Y XML)
// -----------------------------------------------------------------------------
// [TP: Día 15 · Clase Teórica 18: JSON, XML y persistencia en archivo - Parte 6: Testing adicional]
// EXPLICACIÓN GENERAL:
// Verifica que la transformación bidireccional de datos entre las instancias
// del dominio y los formatos de intercambio estructurados (JSON y XML) sea
// confiable, conserve el contrato público de datos y respete las reglas sintácticas.
// =============================================================================

import {
  convertirAJSON,
  convertirAXML,
  convertirDesdeJSON,
  paraExponer,
} from "../src/formatos.js";
import { Publicacion } from "../src/Publicacion.js";

describe("Formatos de publicaciones", () => {
  // ===========================================================================
  // TEST 1: IDA Y VUELTA (ROUND-TRIP) EN FORMATO JSON
  // ---------------------------------------------------------------------------
  // [TP: Día 15 · Clase Teórica 18 - Parte 6: Testing adicional - Caso 1]
  // EXPLICACIÓN:
  // - Crea una instancia de Publicacion con datos válidos, agrega etiquetas y
  //   modifica su estado llamando a darDeBaja().
  // - Serializa a texto JSON con convertirAJSON() y luego lo vuelve a parsear
  //   a memoria con convertirDesdeJSON().
  // - Comprueba mediante toEqual que la información recuperada sea exactamente
  //   equivalente a la proyección definida en paraExponer().
  // - Demuestra que convertirAJSON y convertirDesdeJSON son funciones inversas
  //   entre sí para el contrato de datos pactado.
  // ===========================================================================
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

  // ===========================================================================
  // TEST 2: CASO LÍMITE - COLECCIÓN VACÍA
  // ---------------------------------------------------------------------------
  // [TP: Día 15 · Clase Teórica 18 - Parte 6: Testing adicional - Caso 2]
  // EXPLICACIÓN:
  // - Verifica el comportamiento de los conversores cuando no hay publicaciones ([]).
  // - En JSON: debe producir exactamente la representación de un arreglo vacío ("[]").
  // - En XML: debe generar un documento válido con el elemento raíz envolvente
  //   <publicaciones></publicaciones> (o con espacios en blanco intermedios),
  //   pero garantizando con not.toContain("<publicacion ") que no existan
  //   elementos hijos espurios ni etiquetas mal cerradas.
  // ===========================================================================
  test("una colección vacía se convierte a JSON y XML sin publicaciones hijas", () => {
    expect(convertirAJSON([])).toBe("[]");

    const xml = convertirAXML([]);
    expect(xml).toMatch(/<publicaciones>\s*<\/publicaciones>/);
    expect(xml).not.toContain("<publicacion ");
  });

  // ===========================================================================
  // TEST 3: ESCAPADO DE CARACTERES RESERVADOS EN XML
  // ---------------------------------------------------------------------------
  // [TP: Día 15 · Clase Teórica 18 - Parte 3A y Parte 6: Testing adicional - Caso 3]
  // EXPLICACIÓN:
  // - Prueba que los caracteres especiales de sintaxis XML (&, <, >, ") presentes
  //   en el valor de una propiedad (por ejemplo, en el nombre del autor: 'Ana & <equipo> "Redes"')
  //   sean correctamente sustituidos por sus entidades correspondientes:
  //   &amp;, &lt;, &gt; y &quot;.
  // - Confirma mediante toContain que el nodo <autor> incluya las entidades escapadas,
  //   y con not.toContain asegura que los caracteres literales no viajen en crudo,
  //   evitando que el analizador sintáctico del cliente o del navegador considere
  //   el documento XML como corrupto o mal formado.
  // ===========================================================================
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
