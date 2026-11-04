/* Enlaces a Google Play con origen medible, sin cookies ni almacenamiento.
   Añade a cada enlace de Play el parámetro referrer (utm_*), que Google Play
   entrega a la app en la primera instalación (AppsFlyer / Play Console).
   Origen: utm_* de la dirección de la página; si no hay, el sitio que enlazó. */
(function () {
  function limpia(v, n) { return String(v || '').toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, n || 40); }
  var q = new URLSearchParams(location.search);
  var ref = '';
  try { ref = new URL(document.referrer).hostname.replace(/^(www|m|l|lm|vm)\./, ''); } catch (e) {}
  var origen = limpia(q.get('utm_source')) ||
    (/tiktok/.test(ref) ? 'tiktok' : /instagram|facebook|fb\./.test(ref) ? 'meta' : /google/.test(ref) ? 'google' : '') ||
    'web';
  var pagina = limpia(location.pathname.replace(/^\/|\/$/g, '').replace(/\//g, '-'), 40) || 'portada';
  var utm = {
    utm_source: origen,
    utm_medium: limpia(q.get('utm_medium')) || 'web',
    utm_campaign: limpia(q.get('utm_campaign')) || ('web-' + pagina),
    utm_content: limpia(q.get('utm_content')) || 'boton'
  };
  var term = limpia(q.get('utm_term'));
  if (term) utm.utm_term = term;
  var partes = [];
  for (var k in utm) partes.push(k + '=' + utm[k]);
  var referrer = encodeURIComponent(partes.join('&'));
  var enlaces = document.querySelectorAll('a[href^="https://play.google.com/store/apps/details?id="]');
  for (var i = 0; i < enlaces.length; i++) {
    var a = enlaces[i];
    if (a.href.indexOf('referrer=') === -1) a.href += '&referrer=' + referrer;
  }
})();
