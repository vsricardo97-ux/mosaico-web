// Top Dog · web. Entradas al hacer scroll y un sobre de verdad: cinco perros de la serie de la casa, al menos uno raro, el mejor al final.
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

  var serie = window.TOPDOG_SERIE;
  var abrir = document.getElementById('abrir');
  var cartas = document.getElementById('cartas');
  var otro = document.getElementById('otro');
  if (!serie || !abrir || !cartas) return;

  var ORDEN = { comun: 0, rara: 1, epica: 2, legendaria: 3, unica: 4 };
  var NOMBRE_RAREZA = { comun: 'Común', rara: 'Rara', epica: 'Épica', legendaria: 'Legendaria', unica: 'Única' };
  var STATS = ['Velocidad', 'Babas', 'Pillería', 'Mimos', 'Ladrido'];
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function alAzar(lista) { return lista[Math.floor(Math.random() * lista.length)]; }

  // Como el sobre del juego: cuatro al azar y uno garantizado de rara para arriba, sin repetir.
  function sacarSobre() {
    var buenos = serie.filter(function (p) { return ORDEN[p[3]] >= 1; });
    var sobre = [alAzar(buenos)];
    while (sobre.length < 5) {
      var p = alAzar(serie);
      if (sobre.indexOf(p) < 0) sobre.push(p);
    }
    return sobre.sort(function (a, b) { return ORDEN[a[3]] - ORDEN[b[3]]; });
  }

  function texto(etiqueta, clase, contenido) {
    var el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (contenido != null) el.textContent = contenido;
    return el;
  }

  function hacerCarta(p) {
    var li = texto('li', 'carta r-' + p[3]);
    var dentro = texto('div', 'carta-dentro');
    var cara = texto('article', 'cara');
    cara.setAttribute('aria-label', p[1] + ', ' + p[2] + ', ' + NOMBRE_RAREZA[p[3]]);

    var arriba = texto('div', 'cara-arriba');
    arriba.appendChild(texto('span', 'chapa', 'Top Dog'));
    arriba.appendChild(texto('span', 'chapa chapa-rareza', NOMBRE_RAREZA[p[3]]));
    cara.appendChild(arriba);

    var img = document.createElement('img');
    img.src = '/topdog/a/perros/' + p[0] + '.webp';
    img.width = 320; img.height = 320; img.alt = '';
    cara.appendChild(img);
    cara.appendChild(texto('h3', null, p[1]));
    cara.appendChild(texto('span', 'raza', p[2]));

    var stats = texto('ul', 'stats');
    p[4].forEach(function (v, i) {
      var s = document.createElement('li');
      s.appendChild(texto('small', null, STATS[i]));
      s.appendChild(texto('b', null, String(v)));
      var barra = texto('i');
      barra.style.setProperty('--v', v + '%');
      s.appendChild(barra);
      stats.appendChild(s);
    });
    cara.appendChild(stats);
    cara.appendChild(texto('p', 'frase', p[5]));

    dentro.appendChild(cara);
    dentro.appendChild(texto('div', 'dorso'));
    li.appendChild(dentro);
    return li;
  }

  function repartir() {
    cartas.textContent = '';
    var sobre = sacarSobre();
    sobre.forEach(function (p) { cartas.appendChild(hacerCarta(p)); });
    // Se dan la vuelta de una en una; la mejor, la última y con un respiro antes.
    var lista = cartas.children;
    Array.prototype.forEach.call(lista, function (li, i) {
      var espera = quieto ? 0 : 250 + i * 330 + (i === lista.length - 1 ? 300 : 0);
      setTimeout(function () { li.classList.add('vuelta'); }, espera);
    });
    setTimeout(function () { otro.hidden = false; }, quieto ? 0 : 250 + lista.length * 330 + 500);
  }

  abrir.addEventListener('click', function () {
    if (abrir.classList.contains('abriendo')) return;
    abrir.classList.add('abriendo');
    setTimeout(function () {
      abrir.hidden = true;
      repartir();
    }, quieto ? 0 : 700);
  });

  otro.addEventListener('click', function () {
    otro.hidden = true;
    repartir();
  });
})();
