# NexgenFlows IngenierÃ­a - Sitio Web Corporativo

Sitio web corporativo moderno para captar contactos, mostrar servicios y vender productos de NexgenFlows IngenierÃ­a.

## Estructura

- `index.html`: contenido y secciones del sitio.
- `styles.css`: diseÃ±o responsive, look visual y animaciones.
- `script.js`: navegaciÃ³n mÃ³vil, formulario, efectos de scroll y microinteracciones.
- `assets/logo-nexgenflows-transparent.png`: logo principal para cabecera.
- `assets/favicon.svg`: Ã­cono del sitio.
- `assets/og-image.svg`: imagen social para compartir.
- `robots.txt`, `sitemap.xml`, `site.webmanifest`: SEO tÃ©cnico bÃ¡sico.
- `vercel.json`: headers de seguridad y cachÃ© para despliegue en Vercel.
- `404.html`: pÃ¡gina personalizada de error para rutas inexistentes.

## PersonalizaciÃ³n rÃ¡pida (importante)

Antes de publicar, actualiza los datos reales de contacto en `script.js`:

```js
const CONTACT = {
  email: "contacto@nexgenflows.cl",
  whatsapp: "56936619216",
  whatsappVisible: "+56 9 3661 9216"
};
```

TambiÃ©n puedes ajustar textos de servicios y productos en `index.html`.

## Probar en local

### OpciÃ³n 1: con Node

```bash
npx serve .
```

Luego abre: `http://localhost:3000`

### OpciÃ³n 2: servidor simple de VS Code u otro servidor estÃ¡tico

AsegÃºrate de abrir la carpeta `C:\Users\user1\Documents\New project` como raÃ­z.

## Publicar en Vercel

1. Crea un repositorio en GitHub y sube estos archivos.
2. Entra a [Vercel](https://vercel.com), inicia sesiÃ³n y conecta tu cuenta de GitHub.
3. Click en **Add New... > Project**.
4. Importa el repositorio `nexgenflows`.
5. Vercel detectarÃ¡ un proyecto estÃ¡tico automÃ¡ticamente.
6. Click en **Deploy**.
7. Espera el despliegue y valida que la URL temporal de Vercel abra correctamente.

## Conectar dominio `nexgenflows.cl` desde GoDaddy

1. En Vercel: ve a **Project > Settings > Domains**.
2. Agrega:
   - `nexgenflows.cl`
   - `www.nexgenflows.cl`
3. Vercel te mostrarÃ¡ registros DNS. En la mayorÃ­a de casos:
   - Tipo `A` para `@` apuntando a `76.76.21.21`
   - Tipo `CNAME` para `www` apuntando a `cname.vercel-dns.com`
4. En GoDaddy: abre **DNS Management** de `nexgenflows.cl` y crea/edita esos registros.
5. Espera propagaciÃ³n DNS (puede tardar minutos u horas).
6. Vuelve a Vercel y confirma estado **Valid Configuration**.

## Checklist final antes de producciÃ³n

- [ ] Correo y WhatsApp reales configurados en `script.js`
- [ ] Revisados textos finales de servicios/productos
- [ ] Probado formulario en mÃ³vil y escritorio
- [ ] Probado menÃº mÃ³vil y enlaces de navegaciÃ³n
- [ ] Dominio principal en Vercel: `nexgenflows.cl`
- [ ] HTTPS activo (Vercel lo habilita automÃ¡ticamente)
- [ ] Google Search Console y Google Analytics configurados

## PrÃ³xima mejora recomendada

Integrar un backend o servicio de formularios (por ejemplo, Resend + API) para registrar cotizaciones en una bandeja central sin depender del cliente de correo del visitante.
