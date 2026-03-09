# NexgenFlows Ingeniería - Sitio Web Corporativo

Sitio web corporativo de `nexgenflows.cl` con:

- presentación de servicios y productos
- formulario de cotización
- envío por WhatsApp
- guardado de leads en Supabase vía API de Vercel

## Estructura principal

- `index.html`: contenido y secciones
- `styles.css`: diseño responsive y estilos
- `script.js`: interacción de UI y envío del formulario
- `api/leads.js`: endpoint serverless para guardar contactos
- `supabase/schema.sql`: SQL para crear la tabla `leads`
- `.env.example`: variables de entorno requeridas
- `robots.txt`, `sitemap.xml`, `site.webmanifest`: SEO técnico
- `vercel.json`: headers de seguridad/cache

## Formulario: cómo funciona ahora

1. El botón `Enviar solicitud` envía los datos a `POST /api/leads`.
2. La API valida campos, filtra bots (honeypot) y guarda en Supabase.
3. Si falla la API, el sitio abre `mailto:` como respaldo para no perder la cotización.
4. El botón `Enviar por WhatsApp` abre WhatsApp y también intenta guardar el lead.

## Configuración de Supabase (una vez)

1. Crea un proyecto en [Supabase](https://supabase.com/).
2. Ve a **SQL Editor** y ejecuta el archivo `supabase/schema.sql`.
3. En **Project Settings > API** copia:
   - `Project URL`
   - `service_role` key

## Variables de entorno en Vercel

En tu proyecto de Vercel, crea estas variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Opcionales para notificación por correo (por ejemplo, a Gmail):

- `LEADS_NOTIFY_EMAIL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

Referencia: usa `.env.example` como plantilla (sin subir secretos a GitHub).

## Despliegue

El proyecto está conectado a Vercel y GitHub.

Flujo recomendado:

1. haces cambios locales
2. `git add .`
3. `git commit -m "mensaje"`
4. `git push`
5. Vercel despliega automáticamente

## Ver leads guardados

En Supabase:

1. **Table Editor**
2. tabla `public.leads`
3. revisa `created_at`, `status`, `tipo`, `mensaje`, etc.

## Dominio y SEO

- Dominio activo: `https://www.nexgenflows.cl/`
- Sitemap: `https://www.nexgenflows.cl/sitemap.xml`
- Robots: `https://www.nexgenflows.cl/robots.txt`
- Search Console: propiedad verificada y sitemap enviado
