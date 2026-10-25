# Mosaico Lab · web

Web estática de [mosaicolab.app](https://mosaicolab.app): portada, y páginas de privacidad y soporte de las apps de Mosaico Lab. Se publica con GitHub Pages desde la carpeta `web/`.

Sin cookies, sin trackers y sin JavaScript. SEO: cada página lleva canonical y Open Graph; la portada y Primera Línea, datos estructurados (JSON-LD). La medición, si se activa, es Cloudflare Web Analytics (sin cookies).

**Excepción:** `web/tenminutemind/` es la versión web de la app Ten Minute Mind (export de Expo de `apps/tenminutemind` en mosaico-games, con `baseUrl` `/tenminutemind`), para que el enlace del reto de la familia se pueda jugar sin instalar nada. Lleva JavaScript, pero sigue sin cookies ni trackers: solo guarda el progreso en el propio navegador. Se regenera con `pnpm --filter @mosaico/tenminutemind build:web` y se copia `dist/` aquí (sin `metadata.json`).

`web/.well-known/apple-app-site-association` abre esos enlaces en la app de iOS cuando está instalada.
