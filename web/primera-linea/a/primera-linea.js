// Primera Línea · web. Entradas al hacer scroll y un nivel real del juego para jugar aquí. Sin cookies ni almacenamiento.
(function () {
  var raiz = document.documentElement;
  raiz.classList.add('js');
  var calma = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Entradas: cada bloque aparece una vez, escalonado dentro de su sección
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

  // Niveles copiados de apps/sombrillas/src/levels/packs (beach-01 n2 y n5, beach-02 n31).
  // regions: una cifra por casilla, fila a fila. La solución no hace falta: cualquier reparto válido es el único.
  var NIVELES = [
    { size: 5, regions: '3310033000340224422244422' },
    { size: 6, regions: '333333433333445533045132041111000001' },
    { size: 7, regions: '6655000666660066600031664403161144411144441114422' }
  ];
  // Colores de las parcelas del juego (apps/sombrillas/src/ui/theme.ts, regionColors)
  var COLORES = ['#F6D8A8', '#9ED9E6', '#F5A9A0', '#B8E0A0', '#F3E08A', '#C9B6E8', '#F2B880', '#8FC7C0', '#E8B4CE'];
  var A = '/primera-linea/a/';
  var GENTE = {
    paco: ['Paco', A + 'paco-avatar.svg'],
    manolo: ['Manolo', A + 'manolo-avatar.svg'],
    rocio: ['Rocío', A + 'rocio-avatar.svg']
  };
  // Frases del juego (apps/sombrillas/src/i18n/es.ts y src/content/characters.ts)
  var DICE = {
    empieza: ['paco', 'Este tablero tiene más truco que mi bote de crema. Y ese no hay quien lo abra.'],
    primera: ['paco', 'Yo me pongo aquí con el periódico. Tú encárgate del tablero, que yo no doy para tanto.'],
    casi: ['paco', 'Ya casi. Y yo, casi con la crema puesta. Vamos a la par.'],
    quita: ['paco', 'Cambio de sitio. Yo tardé tres veranos en ir a la sombra.'],
    row: ['rocio', 'Ahí no: ya hay una sombrilla en esta fila.'],
    col: ['rocio', 'Ahí no: ya hay una sombrilla en esta columna.'],
    region: ['rocio', 'Ahí no: ya hay una sombrilla en esta parcela.'],
    touch: ['rocio', 'Ahí no: se tocarían. ¡Que corra el aire!'],
    gana: ['manolo', '¡Nivel superado! Voy calentando las brasas para el espeto de la victoria.']
  };

  var tablero = document.getElementById('tablero');
  if (!tablero) return;
  var cuenta = document.getElementById('cuenta');
  var quien = document.getElementById('quien');
  var quienImg = document.getElementById('quien-img');
  var dice = document.getElementById('dice');
  var bocadillo = document.querySelector('.bocadillo-juego');

  var nivel, n, celdas, estado, ganado;

  function habla(clave) {
    var d = DICE[clave], g = GENTE[d[0]];
    quien.textContent = g[0];
    if (quienImg.getAttribute('src') !== g[1]) quienImg.setAttribute('src', g[1]);
    dice.textContent = d[1];
    if (!calma) { bocadillo.classList.remove('salta'); void bocadillo.offsetWidth; bocadillo.classList.add('salta'); }
  }

  function region(i) { return nivel.regions.charCodeAt(i) - 48; }

  // Por qué no cabe una sombrilla en i (o null si cabe)
  function choque(i) {
    var r = Math.floor(i / n), c = i % n;
    for (var j = 0; j < n * n; j++) {
      if (j === i || estado[j] !== 2) continue;
      var rj = Math.floor(j / n), cj = j % n;
      if (rj === r) return 'row';
      if (cj === c) return 'col';
      if (region(j) === region(i)) return 'region';
      if (Math.abs(rj - r) <= 1 && Math.abs(cj - c) <= 1) return 'touch';
    }
    return null;
  }

  function montar(k) {
    nivel = NIVELES[k]; n = nivel.size; estado = []; ganado = false;
    tablero.innerHTML = '';
    tablero.style.setProperty('--n', n);
    tablero.classList.remove('ganado');
    celdas = [];
    for (var i = 0; i < n * n; i++) {
      var r = Math.floor(i / n), c = i % n, g = region(i);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'casilla';
      b.setAttribute('role', 'gridcell');
      b.style.setProperty('--fondo', COLORES[g % COLORES.length]);
      if (r === 0 || region(i - n) !== g) b.classList.add('b-arr');
      if (r === n - 1 || region(i + n) !== g) b.classList.add('b-aba');
      if (c === 0 || region(i - 1) !== g) b.classList.add('b-izq');
      if (c === n - 1 || region(i + 1) !== g) b.classList.add('b-der');
      b.dataset.i = i;
      tablero.appendChild(b);
      celdas.push(b);
      estado.push(0);
    }
    habla('empieza');
    pintar();
  }

  function pintar() {
    var puestas = 0;
    for (var i = 0; i < n * n; i++) if (estado[i] === 2) puestas++;
    for (var j = 0; j < n * n; j++) {
      var b = celdas[j], e = estado[j];
      var marcada = e === 0 && puestas > 0 && choque(j) !== null;
      b.classList.toggle('x', e === 1);
      b.classList.toggle('auto', marcada);
      b.classList.toggle('sombrilla', e === 2);
      var r = Math.floor(j / n) + 1, c = j % n + 1;
      b.setAttribute('aria-label', 'Fila ' + r + ', columna ' + c + ': ' + (e === 2 ? 'sombrilla' : (e === 1 || marcada ? 'marcada' : 'vacía')));
      b.innerHTML = e === 2 ? '<img src="' + A + 'sombrilla-01-rayas-clasicas.svg" alt="">' : '';
    }
    cuenta.textContent = puestas + ' de ' + n + ' sombrillas';
    return puestas;
  }

  tablero.addEventListener('click', function (ev) {
    var b = ev.target.closest('.casilla');
    if (!b || ganado) return;
    var i = +b.dataset.i;
    var antes = estado[i];
    if (antes === 0) estado[i] = 1;
    else if (antes === 1) {
      var por = choque(i);
      if (por) {
        estado[i] = 0;
        habla(por);
        if (!calma) { b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); }
        pintar();
        return;
      }
      estado[i] = 2;
    } else estado[i] = 0;
    var puestas = pintar();
    if (estado[i] === 2) {
      if (!calma) { b.classList.remove('planta'); void b.offsetWidth; b.classList.add('planta'); }
      if (puestas === n) {
        ganado = true;
        tablero.classList.add('ganado');
        habla('gana');
      } else if (puestas === n - 1) habla('casi');
      else if (puestas === 1) habla('primera');
    } else if (antes === 2) habla('quita');
  });

  var chips = document.querySelectorAll('.niveles .chip');
  var elegido = 0;
  chips.forEach(function (ch) {
    ch.addEventListener('click', function () {
      elegido = +ch.dataset.nivel;
      chips.forEach(function (o) { o.setAttribute('aria-pressed', o === ch ? 'true' : 'false'); });
      montar(elegido);
    });
  });
  document.getElementById('otra-vez').addEventListener('click', function () { montar(elegido); });

  montar(0);
})();
