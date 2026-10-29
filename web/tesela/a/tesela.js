// Tesela · web. Entradas al hacer scroll y un Camino real para jugar en la portada. Sin cookies ni almacenamiento.
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

  // Camino. Códigos del modo libre de la app (apps/reto/src/packs/libre/camino.json, n.º 1, 6 y 8), con el mismo
  // formato que decodeCamino (packages/puzzles/src/types/camino/codec.ts): lado:números:muros:solución.
  var CODIGOS = [
    '5:8m4:1r8rarcrcd:ulddluulddddrurdrruluruu',
    '6:e7c0495:frkd:uldluurrrrdlddlllddrurdrurdruuluruu',
    '7:8sAGuMqEco6:er:ulddddrdldrruurddrrruuulddluuurrulllddlluruurrrr'
  ];
  var ALFABETO = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
  // Paleta de día de la app (apps/reto/src/skin/palette.ts): rampa r5 del camino, bizcocho, junta y medallón
  var RAMPA = ['#E8991F', '#EA6A09', '#DD3A36', '#B52961', '#8C3465', '#124B5C'];
  var POS = [0, 0.174, 0.348, 0.538, 0.674, 1];
  var C = { bizcocho: '#EDE4D4', junta: '#827462', tinta: '#1E2230', aro: '#5C5448', medallon: '#FBF8F2', encendido: '#F4EEE2' };

  function decodificar(code) {
    var p = code.split(':'), n = +p[0], N = n * n, numeros = [], muros = {};
    for (var i = 0; i < N; i++) numeros.push(0);
    for (var k = 0; k < p[1].length; k++) numeros[ALFABETO.indexOf(p[1][k])] = k + 1;
    for (var m = 0; m < p[2].length; m += 2) {
      var x = ALFABETO.indexOf(p[2][m]);
      var y = p[2][m + 1] === 'r' ? x + 1 : x + n;
      muros[x + '-' + y] = muros[y + '-' + x] = true;
    }
    return { n: n, numeros: numeros, muros: muros, K: p[1].length };
  }

  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function tono(t) {
    var j = 0;
    while (j < POS.length - 2 && t > POS[j + 1]) j++;
    var f = (t - POS[j]) / (POS[j + 1] - POS[j]), a = hex(RAMPA[j]), b = hex(RAMPA[j + 1]);
    return 'rgb(' + a.map(function (v, q) { return Math.round(v + (b[q] - v) * f); }).join(',') + ')';
  }
  function oscuro(rgb, k) {
    return rgb.replace(/\d+/g, function (v) { return Math.round(v * k); });
  }

  var svg = document.getElementById('camino');
  if (!svg) return;
  var estado = document.getElementById('estado');
  var NS = 'http://www.w3.org/2000/svg';
  var P, camino, arrastrando, hecho;
  var PASO = 10, PIEZA = 8.4, M = (PASO - PIEZA) / 2;

  function el(tag, at, padre) {
    var e = document.createElementNS(NS, tag);
    for (var a in at) e.setAttribute(a, at[a]);
    (padre || svg).appendChild(e);
    return e;
  }

  function decir(t) { estado.textContent = t; }

  function siguiente() {
    var visto = 0;
    camino.forEach(function (i) { if (P.numeros[i]) visto = Math.max(visto, P.numeros[i]); });
    return visto + 1;
  }

  function pintar() {
    var n = P.n, N = n * n, lado = n * PASO;
    svg.setAttribute('viewBox', (-1) + ' ' + (-1) + ' ' + (lado + 2) + ' ' + (lado + 2));
    svg.innerHTML = '';
    el('rect', { x: -1, y: -1, width: lado + 2, height: lado + 2, rx: 2.4, fill: C.junta });
    var orden = {};
    camino.forEach(function (i, k) { orden[i] = k; });
    // Unión entre piezas consecutivas: la cinta cruza la junta
    for (var k = 1; k < camino.length; k++) {
      var a = camino[k - 1], b = camino[k], ra = Math.floor(a / n), ca = a % n, rb = Math.floor(b / n), cb = b % n;
      var x = Math.min(ca, cb) * PASO + M + PIEZA * 0.22, y = Math.min(ra, rb) * PASO + M + PIEZA * 0.22;
      var w = ca === cb ? PIEZA * 0.56 : PASO + PIEZA * 0.56, h = ra === rb ? PIEZA * 0.56 : PASO + PIEZA * 0.56;
      el('rect', { x: x, y: y, width: w, height: h, rx: 1, fill: tono((k - 0.5) / (N - 1)) });
    }
    for (var i = 0; i < N; i++) {
      var r = Math.floor(i / n), c = i % n, px = c * PASO + M, py = r * PASO + M;
      if (i in orden) {
        var t = tono(orden[i] / (N - 1));
        el('rect', { x: px, y: py, width: PIEZA, height: PIEZA, rx: PIEZA * 0.14, fill: oscuro(t, 0.62) });
        el('rect', { x: px, y: py, width: PIEZA, height: PIEZA * 0.925, rx: PIEZA * 0.14, fill: t });
        // Brillo en media luna, arriba a la izquierda (guía de Carmen §5.1)
        el('path', { d: 'M' + (px + PIEZA * 0.16) + ' ' + (py + PIEZA * 0.4) + ' A' + PIEZA * 0.3 + ' ' + PIEZA * 0.3 + ' 0 0 1 ' + (px + PIEZA * 0.4) + ' ' + (py + PIEZA * 0.16), stroke: 'rgba(255,253,248,.55)', 'stroke-width': PIEZA * 0.07, fill: 'none', 'stroke-linecap': 'round' });
      } else {
        el('rect', { x: px, y: py, width: PIEZA, height: PIEZA, rx: PIEZA * 0.1, fill: C.bizcocho });
      }
      if (P.numeros[i]) {
        var cx = px + PIEZA / 2, cy = py + PIEZA / 2, on = i in orden;
        el('circle', { cx: cx, cy: cy, r: PIEZA * 0.3, fill: on ? C.encendido : C.medallon, stroke: C.aro, 'stroke-width': 0.45 });
        var tx = el('text', { x: cx, y: cy + PIEZA * 0.115, 'text-anchor': 'middle', 'font-size': PIEZA * 0.34, 'font-weight': 800, fill: C.tinta });
        tx.textContent = P.numeros[i];
      }
    }
    // Muros: barra de tinta sobre la junta
    Object.keys(P.muros).forEach(function (key) {
      var ab = key.split('-').map(Number);
      if (ab[0] > ab[1]) return;
      var a = ab[0], b = ab[1], r = Math.floor(a / n), c = a % n;
      if (b === a + 1) el('rect', { x: (c + 1) * PASO - 0.7, y: r * PASO + 0.4, width: 1.4, height: PASO - 0.8, rx: 0.7, fill: C.tinta });
      else el('rect', { x: c * PASO + 0.4, y: (r + 1) * PASO - 0.7, width: PASO - 0.8, height: 1.4, rx: 0.7, fill: C.tinta });
    });
    svg.classList.toggle('resuelto', hecho);
  }

  function casilla(ev) {
    var caja = svg.getBoundingClientRect(), n = P.n, lado = n * PASO + 2;
    var x = (ev.clientX - caja.left) / caja.width * lado - 1, y = (ev.clientY - caja.top) / caja.height * lado - 1;
    var c = Math.floor(x / PASO), r = Math.floor(y / PASO);
    if (r < 0 || c < 0 || r >= n || c >= n) return -1;
    // Solo cuenta si el dedo está bien dentro de la pieza: así las diagonales no saltan casillas
    var fx = x / PASO - c, fy = y / PASO - r;
    if (fx < 0.12 || fx > 0.88 || fy < 0.12 || fy > 0.88) return -2;
    return r * n + c;
  }

  function avanzar(i) {
    var n = P.n, ult = camino[camino.length - 1];
    if (camino.length > 1 && i === camino[camino.length - 2]) { camino.pop(); return true; }
    if (camino.indexOf(i) >= 0) return false;
    var dr = Math.abs(Math.floor(i / n) - Math.floor(ult / n)), dc = Math.abs(i % n - ult % n);
    if (dr + dc !== 1 || P.muros[ult + '-' + i]) return false;
    if (P.numeros[ult] === P.K) return false;
    if (P.numeros[i] && P.numeros[i] !== siguiente()) { decir('Primero el ' + siguiente() + '. Los números van en orden.'); return false; }
    camino.push(i);
    return true;
  }

  function contar() {
    var N = P.n * P.n;
    if (camino.length === N && P.numeros[camino[N - 1]] === P.K) {
      hecho = true;
      decir('¡Resuelto! En la app, esta tesela iría a tu mosaico.');
    } else if (camino.length && P.numeros[camino[camino.length - 1]] === P.K) {
      decir('El ' + P.K + ' cierra el camino, pero faltan ' + (N - camino.length) + ' casillas.');
    } else if (camino.length) {
      decir(camino.length + ' de ' + N + ' casillas. Siguiente número: el ' + siguiente() + '.');
    } else decir('Empieza en el 1 y arrastra.');
  }

  svg.addEventListener('pointerdown', function (ev) {
    if (hecho) return;
    var i = casilla(ev);
    if (i < 0) return;
    var k = camino.indexOf(i);
    if (k >= 0) camino = camino.slice(0, k + 1);
    else if (P.numeros[i] === 1) camino = [i];
    else if (!camino.length || !avanzar(i)) { if (!camino.length) decir('El camino empieza en el 1.'); return; }
    arrastrando = true;
    svg.setPointerCapture(ev.pointerId);
    ev.preventDefault();
    contar(); pintar();
  });
  svg.addEventListener('pointermove', function (ev) {
    if (!arrastrando || hecho) return;
    var i = casilla(ev);
    if (i < 0 || i === camino[camino.length - 1]) return;
    if (avanzar(i)) { contar(); pintar(); }
  });
  function soltar() { arrastrando = false; }
  svg.addEventListener('pointerup', soltar);
  svg.addEventListener('pointercancel', soltar);

  function montar(k) {
    P = decodificar(CODIGOS[k]);
    camino = []; hecho = false;
    contar(); pintar();
  }

  var chips = document.querySelectorAll('.niveles .chip[data-nivel]');
  var elegido = 0;
  chips.forEach(function (ch) {
    ch.addEventListener('click', function () {
      elegido = +ch.dataset.nivel;
      chips.forEach(function (o) { o.setAttribute('aria-pressed', o === ch ? 'true' : 'false'); });
      montar(elegido);
    });
  });
  document.getElementById('borrar').addEventListener('click', function () { montar(elegido); });
  if (calma) svg.classList.add('quieto');
  montar(0);
})();
