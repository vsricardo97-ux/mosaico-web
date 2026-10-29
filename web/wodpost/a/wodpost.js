// Wodpost · web. Entradas al hacer scroll y la tarjeta que se puede probar. Sin cookies ni almacenamiento.
(function () {
  var raiz = document.documentElement;
  raiz.classList.add('js');

  // Entradas: cada bloque aparece una vez, escalonado dentro de su sección
  var bloques = document.querySelectorAll('.aparece');
  document.querySelectorAll('section').forEach(function (s) {
    s.querySelectorAll('.aparece').forEach(function (el, i) { el.style.setProperty('--i', i); });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    bloques.forEach(function (el) { io.observe(el); });
  } else {
    bloques.forEach(function (el) { el.classList.add('visto'); });
  }

  // La barra de lectura recorre la tarjeta de la portada entera
  var lectura = document.querySelector('.lectura');
  if (lectura) lectura.style.setProperty('--alto', lectura.offsetHeight + 'px');

  // Pruébalo
  var WODS = {
    fran:  { nombre: 'Fran', formato: 'For time · 21-15-9 · TC 10', movs: ['Thruster · 43 kg', 'Pull-up'], tipo: 'tiempo', valor: '3:58' },
    grace: { nombre: 'Grace', formato: 'For time · 30 reps · TC 8', movs: ['Clean & jerk · 61 kg'], tipo: 'tiempo', valor: '2:47' },
    cindy: { nombre: 'Cindy', formato: 'AMRAP 20 min', movs: ['5 pull-up', '10 push-up', '15 air squat'], tipo: 'rondas', valor: '17+8' },
    squat: { nombre: 'Strength', formato: 'Back squat · 5-5-3', movs: ['100 / 110 / 115 kg'], tipo: 'kg', valor: '115' }
  };
  var AYUDA = {
    tiempo: ['Tu tiempo', 'Por ejemplo, 3:58'],
    rondas: ['Tus rondas', 'Rondas + reps, por ejemplo 17+8'],
    kg: ['Tu mejor serie', 'En kilos, por ejemplo 115']
  };

  var form = document.getElementById('mandos');
  var tarjeta = document.getElementById('tarjeta');
  var campo = document.getElementById('resultado');
  if (!form || !tarjeta || !campo) return;

  var hueco = function (sel) { return tarjeta.querySelector(sel); };
  var actual = 'fran';

  function limpiar(v, tipo) {
    v = (v || '').trim();
    if (tipo === 'tiempo') v = v.replace(/[^0-9:]/g, '');
    if (tipo === 'rondas') v = v.replace(/[^0-9+ ]/g, '').replace(/\s*\+\s*/g, ' + ');
    if (tipo === 'kg') v = v.replace(/[^0-9.,]/g, '');
    return v;
  }

  function pintar(animar) {
    var w = WODS[actual];
    var estilo = form.querySelector('input[name=estilo]:checked').value;
    var v = limpiar(campo.value, w.tipo) || limpiar(w.valor, w.tipo);
    if (w.tipo === 'kg') v = v + ' kg';
    tarjeta.className = 'tarjeta tarjeta-' + estilo;
    hueco('.t-nombre').textContent = w.nombre;
    hueco('.t-formato').textContent = w.formato;
    hueco('.t-cifra').textContent = v;
    hueco('.t-movs').innerHTML = '';
    w.movs.forEach(function (m) {
      var li = document.createElement('li'); li.textContent = m; hueco('.t-movs').appendChild(li);
    });
    if (animar && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      void tarjeta.offsetWidth; tarjeta.classList.add('cambia');
    }
  }

  form.addEventListener('change', function (e) {
    if (e.target.name === 'wod') {
      actual = e.target.value;
      var w = WODS[actual];
      campo.value = w.valor.replace('+', ' + ');
      campo.setAttribute('inputmode', w.tipo === 'kg' ? 'decimal' : (w.tipo === 'rondas' ? 'text' : 'numeric'));
      document.getElementById('resultado-etiqueta').textContent = AYUDA[w.tipo][0];
      document.getElementById('resultado-ayuda').textContent = AYUDA[w.tipo][1];
    }
    pintar(true);
  });
  campo.addEventListener('input', function () { pintar(false); });
})();

// El anuncio de «Cómo va»: se reproduce en silencio solo mientras se ve (y nunca solo si se piden menos animaciones).
(function () {
  var video = document.getElementById('anuncio');
  var boton = document.getElementById('sonido');
  if (!video || !boton) return;
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (quieto) video.controls = true;
  else if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { var p = video.play(); if (p && p.catch) p.catch(function () { video.controls = true; }); }
        else video.pause();
      });
    }, { threshold: 0.4 }).observe(video);
  }
  boton.addEventListener('click', function () {
    video.muted = !video.muted;
    boton.setAttribute('aria-pressed', String(!video.muted));
    boton.textContent = video.muted ? 'Activar sonido' : 'Quitar sonido';
    if (!video.muted) { video.currentTime = 0; var p = video.play(); if (p && p.catch) p.catch(function () {}); }
  });
})();
