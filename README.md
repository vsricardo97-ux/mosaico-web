# Mosaico Lab · web

Web estática de [mosaicolab.app](https://mosaicolab.app): portada, y páginas de privacidad y soporte de las apps de Mosaico Lab. Se publica con GitHub Pages desde la carpeta `web/`.

Sin cookies ni datos personales. La medición es Cloudflare Web Analytics (beacon con el token en cada página; sin cookies), más un GIF propio en las landings de idea. SEO: cada página lleva canonical y Open Graph; la portada y Primera Línea, datos estructurados (JSON-LD). La medición, si se activa, es Cloudflare Web Analytics (sin cookies).

**Excepción:** `web/tenminutemind/` es la versión web de la app Ten Minute Mind (export de Expo de `apps/tenminutemind` en mosaico-games, con `baseUrl` `/tenminutemind`), para que el enlace del reto de la familia se pueda jugar sin instalar nada. Lleva JavaScript, pero sigue sin cookies ni trackers: solo guarda el progreso en el propio navegador. Se regenera con `pnpm --filter @mosaico/tenminutemind build:web` y se copia `dist/` aquí (sin `metadata.json`).

`web/.well-known/apple-app-site-association` abre esos enlaces en la app de iOS cuando está instalada.

**Landings de prueba de idea:** `web/menu-del-domingo/`, `rey-del-pueblo/`, `santo-y-refran/`, `turnos-de-mama/` y `puppy-100/` (en inglés) son páginas estáticas `noindex` para medir interés real antes de construir una app. Dicen claramente que la app todavía no existe; el «Avísame» es un formulario que envía al Worker `servicios/avisame` (mosaico-games), que también cuenta visitas con un GIF de 1×1. Sin cookies; cuenta visitas de forma anónima. Si una idea no despega, se borra su carpeta.
