# KB Seguridad — Temas amarillo y negro

La web incluye un tema claro (predeterminado) y otro oscuro. El botón de la
cabecera permite alternarlos y recuerda la preferencia en este navegador.
El panel de administración usa el mismo tema y dispone de su propio selector.
En celulares, el selector se muestra como un icono de luna o sol.

## Ejecutar el proyecto

Desde la carpeta `kbSeguridad`, con Node.js 18 o posterior:

```sh
npm install
npm start
```

Abre http://localhost:3000 para ver la web y http://localhost:3000/admin para
el panel. El proyecto necesita su servidor; no se abre haciendo doble clic
en `public/index.html`.

## Ajustar el amarillo de la marca

El amarillo elegido es `#F5C400`. Para usar el tono exacto del logo, cambia
`--brand` y `--brand-hover` al inicio de `public/style.css`. Los colores del
tema oscuro están en `:root[data-theme="dark"]`.

En el tema claro se usa un tono más oscuro para textos e iconos pequeños,
con el fin de mantenerlos legibles sobre blanco. Los botones amarillos
siempre llevan texto negro. Ambos temas abarcan tarjetas, menú móvil,
chat, artículos y controles del panel.

Se conservan los textos y datos de la propuesta. El ZIP original no incluía
el archivo del logo; se mantiene el escudo de la plantilla con los nuevos colores.

Archivos modificados: `public/style.css`, `public/index.html`,
`public/admin.html`. Archivo nuevo: `public/theme.js`.

## Nueva demostración: cotizaciones, servicios y blog

- El botón «Cotizar» de la cabecera y el botón principal llevan al formulario.
- Los servicios tienen «Ver detalles», con una ventana propia y el botón
  «Cotizar este servicio», que selecciona la opción correspondiente.
- El formulario valida los campos obligatorios y el formato de correo.
  «Simular solicitud» muestra un resumen, permite editarlo o empezar otra prueba.
  No envía correos, solicitudes HTTP ni datos al servidor.
- Cada artículo conserva su ventana de lectura y añade tres reacciones y
  comentarios. Los contadores iniciales y el comentario inicial son ejemplos.
  Se puede seleccionar una reacción, cambiarla o retirarla. Los comentarios
  se muestran únicamente durante la carga actual de la página (máximo 20 por
  artículo). Cerrar y abrir el artículo conserva la prueba; recargar la borra.
- No se guardan cotizaciones ni comentarios en localStorage, archivos o base de
  datos. El localStorage del tema sigue funcionando como antes.
- Los detalles de servicios son textos ilustrativos en `public/demo.js`.
  No son compromisos comerciales confirmados. Los textos originales del sitio,
  las opciones de edición y los enlaces existentes de WhatsApp se conservan.

Esta etapa usa ventanas modales para mantener una navegación breve. Para una
versión pública con enlaces compartibles y posicionamiento individual, se
recomienda migrar servicios y artículos a páginas propias. Un blog real con
comentarios necesitará persistencia y moderación; el formulario necesitará
un destino de envío y validación del servidor.

Archivos de esta ampliación: `public/demo.js` (nuevo), `public/app.js`,
`public/index.html`, `public/style.css` y este documento.
