/* Landing «novato»: pizarra interactiva, test de 5 preguntas, plan personalizado y buscador del diccionario.
   Sin cookies ni librerías. El resultado se guarda solo en sessionStorage (este navegador) para enseñarlo en «gracias»:
   al servidor solo llegan el correo, a quién traerías y el anuncio por el que viniste. */
(function () {
  'use strict';
  var KEY = 'novato-test';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function guardar(o) { try { sessionStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function leer() { try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }

  /* ---------- Pizarra de ejemplo (todo sale del diccionario de /novato/pizarra/) ---------- */
  var LINEAS = [
    { t: "AMRAP 12'", e: "AMRAP", d: "Todas las rondas que te salgan en 12 minutos. Nadie «termina» un AMRAP: se acaba el tiempo.", tu: "Tu ritmo manda. Parar a respirar es parte del juego." },
    { t: "5 T2B", e: "Toes-to-bar", d: "Colgado de la barra, llevar los pies a tocarla.", tu: "Tu versión: rodillas al pecho." },
    { t: "10 DB SN", e: "Dumbbell snatch", d: "Arrancada con mancuerna: del suelo a por encima de la cabeza, cambiando de mano.", tu: "Tu versión: una mancuerna más ligera." },
    { t: "15 BJO", e: "Box jump over", d: "Saltar al cajón y bajar por el otro lado.", tu: "Tu versión: subir y bajar andando." }
  ];
  function pizarra() {
    var cont = $('#pizarra-lineas'); if (!cont) return; cont.innerHTML = '';
    var tr = $('#traduce');
    LINEAS.forEach(function (l, i) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'linea'; b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', 'traduce');
      b.textContent = l.t;
      b.addEventListener('click', function () {
        $$('button.linea', cont).forEach(function (x) { x.setAttribute('aria-expanded', x === b ? 'true' : 'false'); });
        tr.innerHTML = '<b>' + esc(l.e) + '</b>' + esc(l.d) + '<span class="tu">' + esc(l.tu) + '</span>';
      });
      li.appendChild(b); cont.appendChild(li);
    });
  }

  /* ---------- Test ---------- */
  var PREGUNTAS = [
    { id: 'barrera', t: '¿Qué es lo que más te frena para ir?', op: [
      ['corte', 'Me da corte: todos parecerán saber lo que hacen'],
      ['forma', 'Creo que estoy demasiado fuera de forma'],
      ['pizarra', 'No entiendo ni una sigla de la pizarra'],
      ['lesion', 'Me da miedo lesionarme'],
      ['solo', 'No tengo con quién ir']] },
    { id: 'nivel', t: '¿Cómo te mueves ahora mismo?', op: [
      ['sofa', 'Casi nada: llevo tiempo sin hacer deporte'],
      ['gym', 'Voy al gimnasio o hago algo de ejercicio'],
      ['depo', 'Corro, nado o juego a algo con regularidad']] },
    { id: 'amrap', t: 'En la pizarra pone «AMRAP 10\'». ¿Qué te toca hacer?', ctx: "AMRAP 10'\n10 sentadillas\n5 flexiones", ok: 1, op: [
      ['a', 'Hacer 10 rondas lo más rápido posible'],
      ['b', 'Todas las rondas que pueda en 10 minutos'],
      ['c', 'Terminar el entreno en menos de 10 minutos']],
      ex: 'AMRAP = as many rounds as possible: todas las rondas que te salgan en 10 minutos. Nadie «termina»: se acaba el tiempo.' },
    { id: 'escalar', t: 'El coach te dice: «escala la dominada». ¿Qué significa?', ok: 0, op: [
      ['a', 'Que la hagas más fácil (menos peso, goma, otra variante)'],
      ['b', 'Que la hagas en una barra más alta'],
      ['c', 'Que la hagas más rápido']],
      ex: 'Escalar es adaptar el ejercicio a tu nivel. Es lo normal el primer año y, muchos días, para casi todos.' },
    { id: 'trae', t: '¿A quién traerías a tu primera clase?', op: [
      ['pareja', 'A mi pareja'],
      ['amigo', 'A un amigo o amiga'],
      ['familia', 'A alguien de mi familia'],
      ['nadie', 'Iría yo solo o sola']] }
  ];

  var PERFILES = {
    corte: { n: 'El valiente con <mark>corte</mark>', lead: 'Te da corte entrar sin saber qué hacer. Es de las barreras más comunes, y se pasa en la primera clase: los coaches cuentan con que llegas sin saber nada.',
      pasos: ['Pregunta en tu box por una clase de prueba o de introducción: muchos la ofrecen.', 'Llega 10 minutos antes y dile al coach que es tu primera vez. Te explicará los movimientos y qué escalar.', 'Haz tu versión y no mires a los demás: cada uno trabaja con lo suyo.'],
      tu: '«Thruster 40 kg» en la pizarra → tu versión es la barra vacía. Y está perfecto.' },
    forma: { n: 'El que empieza de <mark>cero</mark>', lead: 'Piensas que tienes que ponerte en forma antes de ir. Es al revés: el entreno se adapta a ti, y escalar (hacerlo más fácil) es lo normal.',
      pasos: ['Empieza con 2 clases la primera semana. Las agujetas son normales.', 'Pide tu versión de cada movimiento: menos peso, menos repeticiones o una variante más fácil.', 'Compárate con tu primera clase, no con la pizarra ni con los demás.'],
      tu: '«Pull-up» en la pizarra → tu versión puede ser dominada con goma o remo en anillas.' },
    pizarra: { n: 'El que aún no lee la <mark>pizarra</mark>', lead: 'Lo que frena no es el ejercicio, es el idioma: AMRAP, EMOM, RX, T2B… Son pocas siglas y se aprenden en una semana.',
      pasos: ['Echa un ojo al diccionario antes de ir: empieza por las 20 siglas.', 'Aprende primero AMRAP, For time, EMOM y Sc: con eso entiendes la mayoría de entrenos.', 'Pregunta al coach lo que no sepas. Para eso está.'],
      tu: '«21-15-9» son tres rondas: 21 repeticiones de cada ejercicio, luego 15, luego 9.' },
    lesion: { n: 'El <mark>precavido</mark>', lead: 'Te da miedo hacerte daño. Es sensato: la técnica va antes que el peso, y un buen coach te lo pone fácil al empezar.',
      pasos: ['Cuéntale al coach tus molestias o lesiones antes de empezar. Si tienes alguna, consúltalo antes con tu médico.', 'El primer mes: barra vacía o poco peso, y técnica.', 'Si algo duele de mala manera, para. Siempre puedes cambiar el movimiento.'],
      tu: '«Snatch» en la pizarra → tu versión es con un palo de PVC o la barra vacía.' },
    solo: { n: 'El que busca <mark>compañero</mark>', lead: 'Te falta alguien con quien ir, y sin ese amigo que te lleve entrar solo cuesta. Se puede, y hay trucos.',
      pasos: ['Pregunta si hay clase de iniciación: ahí todos empezáis de cero.', 'Los entrenos por parejas (partner WOD) son los mejores para empezar: os repartís el trabajo.', 'Y si conoces a alguien con curiosidad, invítalo: «Ven conmigo» es justo lo que estamos preparando.'],
      tu: '«Partner WOD» → trabajáis por turnos. Es el mejor día para empezar.' }
  };
  var NIVEL = { sofa: 'Punto de partida: desde cero', gym: 'Punto de partida: ya te mueves', depo: 'Punto de partida: deportista' };
  var TRAE = { pareja: 'Traerías a tu pareja: dos novatos a la vez, y los partner WOD os van a ir de perlas.', amigo: 'Traerías a un amigo: ir acompañado ayuda a no rendirse la primera semana.', familia: 'Traerías a alguien de tu familia: ya tenéis plan.', nadie: 'Irás por tu cuenta, y se puede: pregunta por la clase de iniciación.' };

  function planHTML(r, completo) {
    var p = PERFILES[r.barrera] || PERFILES.corte;
    var h = '<p class="etiqueta">Tu resultado</p><p class="perfil">' + p.n + '</p><div class="chips">' +
      '<span class="chip">Siglas: <b>' + r.aciertos + ' de 2</b></span>' +
      '<span class="chip">' + esc(NIVEL[r.nivel] || NIVEL.sofa) + '</span></div>' +
      '<p>' + esc(p.lead) + '</p>' +
      '<h3>Tu primera clase en 3 pasos</h3><ol class="pasos">' + p.pasos.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
      '<p class="tu-version"><b>Un ejemplo de «tu versión»:</b> ' + esc(p.tu) + '</p>';
    if (completo && TRAE[r.trae]) h += '<p class="suave">' + esc(TRAE[r.trae]) + '</p>';
    return h;
  }

  function test() {
    var host = $('#test-caja'); if (!host) return;
    var form = $('#registro');
    var estado = { barrera: 'corte', nivel: 'sofa', aciertos: 0, trae: '' };
    var paso = 0, respuestas = [];
    if (form) form.classList.add('oculto');
    function cabecera(i) {
      return '<div class="progreso" aria-hidden="true"><span>' + (i + 1) + ' / ' + PREGUNTAS.length + '</span><span class="pista-barra"><i style="width:' + ((i) / PREGUNTAS.length * 100) + '%"></i></span></div>';
    }
    function pintar() {
      var q = PREGUNTAS[paso];
      var h = cabecera(paso) + '<div class="pregunta"><h3 id="q-t" tabindex="-1">' + esc(q.t) + '</h3>';
      if (q.ctx) h += '<pre class="ctx">' + esc(q.ctx) + '</pre>';
      h += '<div class="opciones" role="group" aria-labelledby="q-t">' + q.op.map(function (o, i) {
        return '<button type="button" class="opcion" data-v="' + o[0] + '" data-i="' + i + '"><span class="letra">' + 'ABCDE'[i] + '</span><span>' + esc(o[1]) + '</span></button>';
      }).join('') + '</div><div id="q-r" aria-live="polite"></div>' +
        (paso > 0 ? '<button type="button" class="atras" id="q-atras">← Volver</button>' : '') + '</div>';
      host.innerHTML = h;
      var t = $('#q-t'); if (t && paso > 0) t.focus({ preventScroll: true });
      $$('.opcion', host).forEach(function (b) { b.addEventListener('click', function () { elegir(b); }); });
      var at = $('#q-atras'); if (at) at.addEventListener('click', function () { paso--; respuestas.pop(); pintar(); });
    }
    function elegir(b) {
      var q = PREGUNTAS[paso], v = b.getAttribute('data-v'), i = +b.getAttribute('data-i');
      if (q.id === 'barrera') estado.barrera = v;
      if (q.id === 'nivel') estado.nivel = v;
      if (q.id === 'trae') estado.trae = v;
      if (q.ex) {
        var bien = i === q.ok;
        if (bien) estado.aciertos++;
        $$('.opcion', host).forEach(function (x) {
          x.disabled = true;
          if (+x.getAttribute('data-i') === q.ok) x.classList.add('ok'); else if (x === b) x.classList.add('mal');
        });
        $('#q-r').innerHTML = '<div class="respuesta"><strong>' + (bien ? '¡Exacto!' : 'Casi.') + '</strong> ' + esc(q.ex) +
          '<button type="button" class="boton" id="q-sig">Siguiente</button></div>';
        var s = $('#q-sig'); s.focus(); s.addEventListener('click', siguiente);
      } else {
        $$('.opcion', host).forEach(function (x) { x.disabled = true; });
        setTimeout(siguiente, 220);
      }
    }
    function siguiente() {
      respuestas.push(1);
      if (paso < PREGUNTAS.length - 1) { paso++; pintar(); return; }
      resultado();
    }
    function resultado() {
      guardar(estado);
      host.innerHTML = '<div class="resultado" tabindex="-1" id="res">' + planHTML(estado, true) + '</div>' +
        '<button type="button" class="atras" id="q-repetir">Repetir el test</button>';
      host.setAttribute('data-hecho', '1');
      var ti = $('input[name=trae]', form); if (ti) ti.value = estado.trae;
      if (form) form.classList.remove('oculto');
      var res = $('#res'); if (res) { res.focus({ preventScroll: true }); res.scrollIntoView({ block: 'start' }); }
      $('#q-repetir').addEventListener('click', function () {
        paso = 0; respuestas = []; estado = { barrera: 'corte', nivel: 'sofa', aciertos: 0, trae: '' };
        if (form) form.classList.add('oculto'); host.removeAttribute('data-hecho'); pintar();
        $('#test').scrollIntoView({ block: 'start' });
      });
    }
    pintar();
    var ir = $('#ir-test'); if (ir) ir.addEventListener('click', function (e) { e.preventDefault(); $('#test').scrollIntoView({ block: 'start' }); });
  }

  /* ---------- Gracias ---------- */
  function gracias() {
    var host = $('#mi-plan'); if (!host) return;
    var r = leer();
    if (r && PERFILES[r.barrera]) host.innerHTML = '<div class="tarjeta">' + planHTML(r, false) + '</div>';
    else host.innerHTML = '<a class="boton sec" href="/novato/#test" id="g-test">Haz el test y te preparo tu plan</a>';
    var c = $('#compartir');
    if (c) c.addEventListener('click', function () {
      var url = 'https://mosaicolab.app/novato/', txt = 'La pizarra del box explicada y tu primera clase de CrossFit, sin miedo:';
      if (navigator.share) { navigator.share({ title: 'Tu primera clase, sin miedo', text: txt, url: url }).catch(function () {}); return; }
      var done = function () { c.textContent = 'Enlace copiado ✓'; };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { c.textContent = url; }); else c.textContent = url;
    });
  }

  /* ---------- Diccionario: buscador ---------- */
  function buscador() {
    var q = $('#buscar'); if (!q) return;
    var ents = $$('.ent'), secs = $$('.seccion-dic'), nada = $('#nada');
    function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    var textos = ents.map(function (e) { return norm(e.textContent); });
    q.addEventListener('input', function () {
      var v = norm(q.value.trim()), total = 0;
      ents.forEach(function (e, i) { var ok = !v || textos[i].indexOf(v) > -1; e.classList.toggle('oculto', !ok); if (ok) total++; });
      secs.forEach(function (s) { s.classList.toggle('oculto', !$$('.ent:not(.oculto)', s).length); });
      if (nada) nada.classList.toggle('oculto', total > 0);
    });
  }

  /* ---------- Visita y utm (sin cookies) ---------- */
  function visita() {
    var c = (new URLSearchParams(location.search).get('utm_content') || '').replace(/[^a-z0-9_-]/gi, '').slice(0, 40);
    var i = $('input[name=anuncio]'); if (i) i.value = c;
    var el = $('[data-visita]');
    if (el && !window.__NOVATO_PREVIEW) new Image().src = 'https://avisame.vsricardo97.workers.dev/v/' + el.getAttribute('data-visita') + '.gif' + (c ? '?c=' + c : '');
  }

  window.novatoInit = function () { visita(); pizarra(); test(); gracias(); buscador(); };
  if (!window.__NOVATO_PREVIEW) novatoInit();
})();
