// ¿Dónde cae? · web. Una ronda de práctica de 8 provincias sobre el mapa de la app y entradas al hacer scroll.
// Las reglas y los textos son los de apps/dondecae/src/juego.ts. Sin cookies ni almacenamiento.
(function () {
  var raiz = document.documentElement;
  raiz.classList.add('js');
  var calma = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  var D = window.DONDECAE;
  var svg = document.getElementById('mapa');
  if (!D || !svg) return;

  // Colores de apps/dondecae/src/tema.ts
  var C = { mar: '#123A78', escalon: '#1A4689', papel: '#F6ECD4', linde: '#BFA77C', tinta: '#1B2433', tenue: '#B3C7EA', azafran: '#F2AE36' };
  var PINTURAS = ['#E2502F', '#D24B8A', '#1FA6A0', '#4FA35B', '#EBD03C', '#8D6BD6'];
  var TACHI = { bola: '#E2502F', brillo: '#FF8B6B', sombra: '#B23A22', aguja: '#C9D2DE', lengua: '#F27C7C', gota: '#9ED3F5', blanco: '#FFFFFF' };
  var RONDAS = 8;
  var FUERA = { ceuta: 1, melilla: 1 };
  var RUMBOS = ['este', 'noreste', 'norte', 'noroeste', 'oeste', 'suroeste', 'sur', 'sureste'];
  var NS = 'http://www.w3.org/2000/svg';

  var P = {}, LISTA = [];
  D.provincias.forEach(function (f) {
    var p = { id: f[0], nombre: f[1], comunidad: f[2], enComunidad: f[3], vecinas: f[4], d: f[5], cx: f[6], cy: f[7], lat: f[8], lon: f[9] };
    P[p.id] = p; LISTA.push(p);
  });

  // Un color por provincia sin que dos vecinas lo compartan (asignarPinturas de coleccion.ts)
  var COLOR = (function () {
    var vec = {};
    LISTA.forEach(function (p) { vec[p.id] = {}; p.vecinas.forEach(function (v) { vec[p.id][v] = 1; }); });
    LISTA.forEach(function (p) { p.vecinas.forEach(function (v) { if (vec[v]) vec[v][p.id] = 1; }); });
    var orden = LISTA.slice().sort(function (a, b) {
      return Object.keys(vec[b.id]).length - Object.keys(vec[a.id]).length || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    });
    var color = {}, giro = 0;
    orden.forEach(function (p) {
      var usados = {};
      Object.keys(vec[p.id]).forEach(function (v) { if (color[v]) usados[color[v]] = 1; });
      var libre = null;
      for (var i = 0; i < PINTURAS.length; i++) { var c = PINTURAS[(i + giro) % PINTURAS.length]; if (!usados[c]) { libre = c; break; } }
      color[p.id] = libre || PINTURAS[giro % PINTURAS.length];
      giro += 3;
    });
    return color;
  })();

  function km(a, b) {
    var r = function (g) { return g * Math.PI / 180; };
    var dLat = r(b.lat - a.lat), dLon = r(b.lon - a.lon);
    var h = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.pow(Math.sin(dLon / 2), 2);
    return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)));
  }
  function miles(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function rumbo(a, b) {
    var dx = (b.lon - a.lon) * Math.cos((a.lat + b.lat) / 2 * Math.PI / 180), dy = b.lat - a.lat;
    var ang = Math.atan2(dy, dx) * 180 / Math.PI;
    return RUMBOS[(Math.round(ang / 45) + 8) % 8];
  }
  function enCanarias(p) { return p.comunidad === 'Canarias'; }
  function dondeEsta(b, t) {
    if (enCanarias(b)) return enCanarias(t) ? b.nombre + ' es la otra mitad de Canarias.' : b.nombre + ' está en Canarias, en el recuadro de abajo.';
    if (b.id === 'baleares') return 'Baleares son las islas de la derecha, en el Mediterráneo.';
    var comunidad = LISTA.filter(function (x) { return x.comunidad === b.comunidad; }).length > 1 ? ', en ' + b.enComunidad : '';
    if (enCanarias(t)) return b.nombre + ' está en la península' + comunidad + '.';
    var hacia = rumbo(t, b);
    if (b.vecinas.indexOf(t.id) >= 0) return b.nombre + ' está justo al lado, al ' + hacia + '.';
    return b.nombre + ' queda al ' + hacia + ' de ' + t.nombre + comunidad + '.';
  }
  function veredicto(aciertos) {
    if (aciertos >= RONDAS) return 'Eres el GPS.';
    if (aciertos >= 6) return 'Muy fino. Se nota que has hecho kilómetros.';
    if (aciertos >= 4) return 'Ni tan mal. Te falta algo de AVE.';
    if (aciertos >= 2) return 'Tu GPS necesita vacaciones.';
    return 'Hoy ha ganado el mapa. Mañana, revancha.';
  }

  function el(tag, at, padre) {
    var e = document.createElementNS(NS, tag);
    for (var a in at) e.setAttribute(a, at[a]);
    (padre || svg).appendChild(e);
    return e;
  }

  // Tachi, la chincheta (apps/dondecae/src/ui/Tachi.tsx): la punta de la aguja está en (60, 140)
  function tachi(gesto) {
    var t = C.tinta, tr = 'stroke="' + t + '" fill="none" stroke-linecap="round"';
    var ojo = function (x, y, px, py) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="9" ry="11.5" fill="#fff" stroke="' + t + '" stroke-width="3"/><circle cx="' + (x + px) + '" cy="' + (y + py) + '" r="4.6" fill="' + t + '"/>'; };
    var espiral = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="11" fill="#fff" stroke="' + t + '" stroke-width="3"/><path d="M' + x + ' ' + y + ' m-1 0 a2 2 0 1 1 3 1 a4.5 4.5 0 1 1 -6 -3 a7 7 0 1 1 9 7" ' + tr + ' stroke-width="2.4"/>'; };
    var brazos = {
      feliz: '<path d="M19 66 Q8 60 6 48" ' + tr + ' stroke-width="4"/><circle cx="6" cy="46" r="4.5" fill="' + t + '"/>',
      euforia: '<path d="M20 56 Q8 38 12 20" ' + tr + ' stroke-width="4"/><circle cx="12" cy="18" r="5" fill="' + t + '"/><path d="M100 56 Q112 38 108 20" ' + tr + ' stroke-width="4"/><circle cx="108" cy="18" r="5" fill="' + t + '"/>',
      mareo: '<path d="M100 60 Q112 52 106 40" ' + tr + ' stroke-width="4"/><circle cx="105" cy="38" r="4.5" fill="' + t + '"/>',
      orgullo: '<path d="M100 66 Q116 60 120 46" ' + tr + ' stroke-width="4"/><circle cx="121" cy="44" r="4.5" fill="' + t + '"/><path d="M20 70 Q12 76 18 84" ' + tr + ' stroke-width="4"/>'
    };
    var cara = {
      feliz: ojo(47, 54, 2, -2) + ojo(73, 54, 2, -2) + '<path d="M44 40 Q49 35 55 39" ' + tr + ' stroke-width="3.5"/><path d="M66 39 Q72 35 77 40" ' + tr + ' stroke-width="3.5"/><path d="M48 73 Q61 84 74 72" ' + tr + ' stroke-width="4"/>',
      euforia: '<path d="M38 55 Q46 45 54 55" ' + tr + ' stroke-width="4.5"/><path d="M66 55 Q74 45 82 55" ' + tr + ' stroke-width="4.5"/><path d="M44 66 Q60 66 77 65 Q74 88 60 88 Q46 88 44 66Z" fill="' + t + '"/><path d="M50 80 Q60 74 70 80 Q66 87 60 87 Q53 87 50 80Z" fill="' + TACHI.lengua + '"/><path d="M2 6 L-8 -4 M116 4 L128 -6 M60 -6 L60 -18" stroke="' + C.azafran + '" stroke-width="4" stroke-linecap="round"/>',
      mareo: espiral(47, 54) + espiral(73, 54) + '<path d="M46 77 Q51 72 56 77 Q61 82 66 77 Q71 72 75 77" ' + tr + ' stroke-width="3.6"/><path d="M90 20 Q97 30 93 36 Q86 38 85 31 Q85 26 90 20Z" fill="' + TACHI.gota + '" stroke="' + t + '" stroke-width="2.5"/><ellipse cx="60" cy="8" rx="34" ry="7" fill="none" stroke="' + C.tenue + '" stroke-width="3" stroke-dasharray="7 8"/><circle cx="30" cy="9" r="4" fill="' + C.azafran + '"/><circle cx="88" cy="6" r="3.4" fill="' + C.azafran + '"/>',
      orgullo: ojo(47, 54, 1, 1) + '<path d="M65 56 Q73 50 81 56" ' + tr + ' stroke-width="4.5"/><path d="M42 40 Q48 36 55 40" ' + tr + ' stroke-width="3.5"/><path d="M47 72 Q62 80 76 68" ' + tr + ' stroke-width="4"/>'
    };
    var giro = { feliz: 0, euforia: 6, mareo: -14, orgullo: 0 }[gesto];
    return '<g transform="rotate(' + giro + ' 60 130)">' +
      '<path d="M60 98 L60 140" stroke="' + t + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M60 98 L60 139" stroke="' + TACHI.aguja + '" stroke-width="3.2" stroke-linecap="round"/>' +
      '<ellipse cx="60" cy="100" rx="20" ry="6.5" fill="' + TACHI.sombra + '" stroke="' + t + '" stroke-width="3.5"/>' +
      brazos[gesto] +
      '<circle cx="60" cy="56" r="42" fill="' + TACHI.bola + '" stroke="' + t + '" stroke-width="5.5"/>' +
      '<path d="M28 44 Q34 22 56 18 Q40 26 36 46 Z" fill="' + TACHI.brillo + '"/>' +
      '<path d="M94 60 Q92 86 66 95 Q86 82 88 60Z" fill="' + TACHI.sombra + '"/>' +
      cara[gesto] + '</g>';
  }

  // Mapa
  var defs = el('defs', {});
  defs.innerHTML = '<pattern id="raya" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="14" fill="#C8553D"/><rect width="5" height="14" fill="#A8412C"/></pattern>';
  el('rect', { x: 624, y: 676, width: 350, height: 190, fill: C.escalon });
  var rotulo = el('text', { x: 636, y: 716, fill: C.tenue, 'font-size': 38, 'class': 'serif' });
  rotulo.textContent = 'Canarias';
  var capa = el('g', {});
  var trazos = {};
  LISTA.forEach(function (p) {
    var path = el('path', { d: p.d, fill: C.papel, stroke: C.linde, 'stroke-width': 1.6, 'stroke-linejoin': 'round', 'class': 'prov' }, capa);
    path.dataset.id = p.id;
    trazos[p.id] = path;
  });
  var encima = el('g', { 'class': 'encima' });

  var $ = function (id) { return document.getElementById(id); };
  var ronda, paso, jugadas, pintadas, esperando;

  function barajar() {
    var ids = LISTA.filter(function (p) { return !FUERA[p.id]; }).map(function (p) { return p.id; });
    for (var i = ids.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = ids[i]; ids[i] = ids[j]; ids[j] = x; }
    return ids.slice(0, RONDAS);
  }

  function casillas(ol) {
    ol.innerHTML = '';
    for (var i = 0; i < RONDAS; i++) {
      var li = document.createElement('li'), j = jugadas[i];
      li.className = j ? j.tipo : (i === paso && ol.id === 'casillas' ? 'ahora' : '');
      li.setAttribute('aria-label', j ? (j.tipo === 'acierto' ? 'Acierto' : j.tipo === 'cerca' ? 'Cerca' : 'Lejos') : 'Por jugar');
      ol.appendChild(li);
    }
  }

  function limpiarMarcas() {
    encima.innerHTML = '';
    LISTA.forEach(function (p) {
      var t = trazos[p.id];
      if (pintadas[p.id]) { t.setAttribute('fill', COLOR[p.id]); t.setAttribute('stroke', C.tinta); t.setAttribute('stroke-width', 2.4); }
      else { t.setAttribute('fill', C.papel); t.setAttribute('stroke', C.linde); t.setAttribute('stroke-width', 1.6); }
      t.classList.remove('pinta');
    });
  }

  function clavar(p, gesto) {
    var s = 1.12;
    var g = el('g', { transform: 'translate(' + (p.cx - 60 * s) + ' ' + (p.cy - 140 * s) + ') scale(' + s + ')', 'class': 'tachi' }, encima);
    var dentro = el('g', { 'class': 'tachi-' + gesto }, g);
    dentro.innerHTML = tachi(gesto);
  }

  function preguntar() {
    var p = P[ronda[paso]];
    $('cuenta-ronda').textContent = 'Ronda de práctica · ' + (paso + 1) + ' de ' + RONDAS;
    $('buscada').textContent = p.nombre;
    $('respuesta').innerHTML = '';
    $('siguiente').hidden = true;
    casillas($('casillas'));
    esperando = true;
    svg.classList.add('jugando');
  }

  function empezar() {
    ronda = barajar(); paso = 0; jugadas = []; pintadas = {};
    $('final').hidden = true;
    $('pregunta').hidden = false;
    limpiarMarcas();
    preguntar();
  }

  function linea(texto, clase) {
    var p = document.createElement('p');
    if (clase) p.className = clase;
    p.textContent = texto;
    $('respuesta').appendChild(p);
  }

  svg.addEventListener('click', function (ev) {
    if (!esperando) return;
    var t = ev.target.closest('.prov');
    if (!t) return;
    esperando = false;
    svg.classList.remove('jugando');
    var b = P[ronda[paso]], toc = P[t.dataset.id];
    var d = b.id === toc.id ? 0 : km(toc, b);
    var tipo = d === 0 ? 'acierto' : (b.vecinas.indexOf(toc.id) >= 0 || d <= 150 ? 'cerca' : 'lejos');
    jugadas.push({ tipo: tipo, km: d });
    if (d === 0) {
      var ya = pintadas[b.id];
      pintadas[b.id] = 1;
      t.setAttribute('fill', COLOR[b.id]); t.setAttribute('stroke', C.tinta); t.setAttribute('stroke-width', 2.4);
      if (!calma) { capa.appendChild(t); t.classList.add('pinta'); }
      linea('¡Clavada! A la primera.', 'bien');
      linea(b.nombre + ', ' + (ya ? 'repintada' : 'pintada') + ' en tu mapa.');
      clavar(b, 'euforia');
    } else {
      if (!pintadas[toc.id]) t.setAttribute('fill', 'url(#raya)');
      var tb = trazos[b.id];
      tb.setAttribute('fill', C.azafran); tb.setAttribute('stroke', C.tinta); tb.setAttribute('stroke-width', 2.4);
      var dest = el('g', { 'class': 'destello' }, encima);
      [26, 40, 54].forEach(function (r) { el('circle', { cx: b.cx, cy: b.cy, r: r, fill: 'none', stroke: C.azafran, 'stroke-width': 3 }, dest); });
      var nom = el('text', { x: b.cx, y: b.cy - 30, 'text-anchor': 'middle', 'font-size': 34, fill: C.tinta, stroke: C.azafran, 'stroke-width': 7, 'paint-order': 'stroke', 'stroke-linejoin': 'round', 'class': 'serif' }, encima);
      nom.textContent = b.nombre;
      linea('Eso es ' + toc.nombre + '. ' + miles(d) + ' km de excursión.', 'mal');
      linea(dondeEsta(b, toc));
      clavar(toc, 'mareo');
    }
    if (D.datos[b.id]) linea(D.datos[b.id], 'dato');
    casillas($('casillas'));
    var boton = $('siguiente');
    boton.textContent = paso === RONDAS - 1 ? 'Ver resultado' : 'Siguiente';
    boton.hidden = false;
  });

  $('siguiente').addEventListener('click', function () {
    paso++;
    limpiarMarcas();
    if (paso < RONDAS) { preguntar(); return; }
    var aciertos = jugadas.filter(function (j) { return j.tipo === 'acierto'; }).length;
    var total = jugadas.reduce(function (s, j) { return s + j.km; }, 0);
    $('pregunta').hidden = true;
    $('respuesta').innerHTML = '';
    $('siguiente').hidden = true;
    casillas($('casillas'));
    $('nota-num').textContent = aciertos;
    $('veredicto').textContent = veredicto(aciertos);
    $('km-total').textContent = miles(total) + ' km';
    $('pintadas').textContent = '+' + Object.keys(pintadas).length;
    $('final').hidden = false;
    var ultima = null;
    for (var i = ronda.length - 1; i >= 0; i--) if (jugadas[i].tipo === 'acierto') { ultima = P[ronda[i]]; break; }
    if (ultima) clavar(ultima, 'orgullo');
  });
  $('otra').addEventListener('click', empezar);

  empezar();
})();
