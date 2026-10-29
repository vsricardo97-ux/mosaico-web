// Ten Minute Mind · web. Entradas al hacer scroll y, en pantallas anchas, la app de verdad dentro del móvil de la portada.
(function () {
  var raiz = document.documentElement;
  raiz.classList.add('js');

  var bloques = document.querySelectorAll('.aparece');
  document.querySelectorAll('section').forEach(function (s) {
    s.querySelectorAll('.aparece').forEach(function (el, i) { el.style.setProperty('--i', Math.min(i, 8)); });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
    bloques.forEach(function (el) { io.observe(el); });
  } else {
    bloques.forEach(function (el) { el.classList.add('visto'); });
  }

  // En el ordenador, el móvil de la portada lleva la app jugable (/tenminutemind/jugar/). En el móvil se queda la
  // captura y el botón abre la app a pantalla completa, que es como mejor se juega.
  var movil = document.getElementById('movil');
  if (movil && window.matchMedia('(min-width: 900px)').matches) {
    var marco = document.createElement('iframe');
    marco.src = '/tenminutemind/jugar/';
    marco.title = 'Ten Minute Mind, jugable';
    marco.className = 'movil-app';
    marco.setAttribute('loading', 'lazy');
    marco.addEventListener('load', function () { movil.classList.add('en-marcha'); });
    movil.appendChild(marco);
  }
})();
