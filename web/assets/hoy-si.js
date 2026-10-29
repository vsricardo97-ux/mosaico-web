/* Landing «hoy sí»: test de 6 preguntas, plan según lo que te frena y plan de 4 semanas en «gracias».
   Sin cookies ni librerías. El resultado se guarda solo en sessionStorage (este navegador) para enseñarlo en «gracias»:
   al servidor solo llegan el correo, el código postal, la ciudad, las respuestas y el anuncio por el que viniste. */
(function () {
  'use strict';
  var KEY = 'hoy-si-test', URL_WEB = 'https://mosaicolab.app/hoy-si/';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function guardar(o) { try { sessionStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function leer() { try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }

  // Cada pregunta con campo (f) viaja con el correo al Worker avisame (valores cerrados, ver servicios/avisame).
  var PREGUNTAS = [
    { id: 'e', f: 's_e', t: '¿Entrenas ahora?', op: [
      ['nunca', 'No, nunca he entrenado en serio'],
      ['probe', 'Lo he intentado y lo he dejado'],
      ['voy', 'Sí, ya entreno']] },
    { id: 'barrera', f: 's_b', t: '¿Qué es lo que más te frena?', op: [
      ['constancia', 'Empiezo con ganas y a las dos semanas lo dejo'],
      ['corte', 'Me da corte: todos parecen saber lo que hacen'],
      ['forma', 'Estoy demasiado fuera de forma para empezar'],
      ['tiempo', 'No encuentro el momento'],
      ['solo', 'No tengo con quién ir'],
      ['lesion', 'Me da miedo hacerme daño'],
      ['dinero', 'No sé si me lo puedo permitir']] },
    { id: 'd', f: 's_d', t: '¿Qué te apetecería probar?', op: [
      ['clases', 'Clases en grupo con monitor'],
      ['gimnasio', 'Gimnasio a mi aire'],
      ['crossfit', 'CrossFit o entreno funcional'],
      ['hyrox', 'Algo híbrido: fuerza y correr (tipo Hyrox)'],
      ['correr', 'Correr'],
      ['nose', 'Aún no lo sé']] },
    { id: 'v', f: 's_v', t: 'Si antes de ir vieses un vídeo de cómo es la primera clase en un sitio cerca de casa, ¿irías más tranquilo?', op: [
      ['mucho', 'Sí, mucho más'],
      ['algo', 'Algo más'],
      ['igual', 'Me daría igual'],
      ['no', 'No']] },
    { id: 'g', f: 's_g', t: '¿Te animarías antes si la primera clase fuese gratis?', op: [
      ['si', 'Sí'],
      ['quiza', 'Quizá'],
      ['no', 'No, no es el dinero']] },
    { id: 'trae', f: 'trae', t: '¿Con quién irías?', op: [
      ['pareja', 'Con mi pareja'],
      ['amigo', 'Con un amigo o amiga'],
      ['familia', 'Con alguien de mi familia'],
      ['nadie', 'Iría por mi cuenta']] }
  ];

  var PERFILES = {
    constancia: { n: 'Te sobran ganas. Te <mark>falta plan</mark>.', lead: 'No es fuerza de voluntad: empiezas a lo grande, te machacas y a la segunda semana lo dejas. La gente que sigue empieza pequeño y con día fijo.',
      pasos: ['Elige dos días y una hora fijos, no «cuando pueda».', 'Las dos primeras semanas, ve aunque sea a hacer la mitad. Contar que has ido vale más que lo que hagas.', 'Busca clases en grupo: si te esperan, cuesta más fallar.'] },
    corte: { n: 'Nadie te va a <mark>mirar</mark>.', lead: 'Da corte entrar donde todos parecen saber lo que hacen. Pero a quien empieza no lo mira nadie: todos se acuerdan de su primer día.',
      pasos: ['Pide una clase de prueba y di al llegar que es tu primera vez. El monitor está para eso.', 'Llega 10 minutos antes: con la sala vacía impone mucho menos.', 'Haz tu versión de cada ejercicio y no mires a los demás: cada uno está con lo suyo.'] },
    forma: { n: 'No hay que estar en forma <mark>para empezar</mark>.', lead: 'Piensas que tienes que ponerte en forma antes de ir. Es al revés: la clase se adapta a ti, y hacerlo más fácil es lo normal.',
      pasos: ['Empieza con dos sesiones la primera semana. Las agujetas son normales y se pasan.', 'Pide la versión fácil de cada ejercicio: menos peso, menos repeticiones u otra variante.', 'Compárate con tu primer día, no con los demás.'] },
    tiempo: { n: 'Con <mark>dos horas</mark> a la semana basta.', lead: 'No necesitas una hora al día. Dos sesiones a la semana a la misma hora ya cambian cómo duermes y cómo te sientes.',
      pasos: ['Mira tu semana y elige los dos huecos que menos se mueven.', 'Apúntalos en el calendario como una cita: no se negocian.', 'Busca un sitio a menos de 15 minutos de casa o del trabajo. La distancia es lo que más hace abandonar.'] },
    solo: { n: 'Ir con alguien lo <mark>cambia todo</mark>.', lead: 'Sin nadie que te lleve cuesta más entrar. Se puede ir por tu cuenta, y hay formas de hacerlo más fácil.',
      pasos: ['Busca clases de iniciación: ahí todos empezáis de cero a la vez.', 'Las clases en grupo y por parejas son las mejores para conocer gente.', 'Y si alguien de tu entorno tiene curiosidad, pásale esta página.'] },
    lesion: { n: 'Primero la <mark>técnica</mark>, luego lo demás.', lead: 'Te da miedo hacerte daño. Es sensato: con poco peso y un buen monitor empezar es seguro.',
      pasos: ['Cuenta al monitor tus molestias o lesiones antes de empezar. Si tienes alguna, consúltalo antes con tu médico.', 'El primer mes, poco peso y mucha técnica.', 'Si algo duele de mala manera, para. Siempre hay otra versión del ejercicio.'] },
    dinero: { n: 'Prueba antes de <mark>pagar</mark>.', lead: 'No hace falta comprometerse a nada para empezar. Muchos sitios tienen clase de prueba gratis o un primer mes más barato.',
      pasos: ['Pregunta por la clase de prueba gratis antes de apuntarte.', 'Prueba dos o tres sitios antes de elegir.', 'Mira bonos de pocas clases antes que una cuota larga.'] }
  };
  var TRAE = { pareja: 'Irías con tu pareja: empezar los dos a la vez hace mucho más fácil no dejarlo.', amigo: 'Irías con un amigo: ir acompañado ayuda a no rendirse la primera semana.', familia: 'Irías con alguien de tu familia: ya tenéis plan.', nadie: 'Irías por tu cuenta, y se puede: pregunta por la clase de iniciación.' };
  var SEMANAS = ['<b>Semana 1.</b> Dos sesiones de prueba. Solo ir y volver, sin más objetivo.', '<b>Semana 2.</b> Los mismos días y a la misma hora. Que se convierta en costumbre.', '<b>Semana 3.</b> Si te apetece, una tercera sesión. Si no, con dos va bien.', '<b>Semana 4.</b> Elige tu sitio y apúntate. Ya has hecho lo difícil.'];

  function planHTML(r, completo) {
    var p = PERFILES[r.barrera] || PERFILES.constancia;
    var h = '<p class="etiqueta">Tu resultado</p><p class="perfil">' + p.n + '</p>' +
      '<p>' + esc(p.lead) + '</p>' +
      '<h3>Tu primera clase en 3 pasos</h3><ol class="pasos">' + p.pasos.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>';
    if (completo && TRAE[r.trae]) h += '<p class="suave">' + esc(TRAE[r.trae]) + '</p>';
    if (!completo) h += '<h3>Tus primeras 4 semanas</h3><ul class="semanas">' + SEMANAS.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
    return h;
  }

  function test() {
    var host = $('#test-caja'); if (!host) return;
    var form = $('#registro');
    var estado = { barrera: 'constancia', trae: '', r: {} };
    var paso = 0;
    if (form) form.classList.add('oculto');
    function pintar() {
      var q = PREGUNTAS[paso];
      host.innerHTML = '<div class="progreso" aria-hidden="true"><span>' + (paso + 1) + ' / ' + PREGUNTAS.length + '</span><span class="pista-barra"><i style="width:' + (paso / PREGUNTAS.length * 100) + '%"></i></span></div>' +
        '<div class="pregunta"><h3 id="q-t" tabindex="-1">' + esc(q.t) + '</h3><div class="opciones" role="group" aria-labelledby="q-t">' +
        q.op.map(function (o, i) { return '<button type="button" class="opcion" data-v="' + o[0] + '"><span class="letra">' + 'ABCDEFG'[i] + '</span><span>' + esc(o[1]) + '</span></button>'; }).join('') +
        '</div>' + (paso > 0 ? '<button type="button" class="atras" id="q-atras">← Volver</button>' : '') + '</div>';
      var t = $('#q-t'); if (t && paso > 0) t.focus({ preventScroll: true });
      $$('.opcion', host).forEach(function (b) { b.addEventListener('click', function () { elegir(b); }); });
      var at = $('#q-atras'); if (at) at.addEventListener('click', function () { paso--; pintar(); });
    }
    function elegir(b) {
      var q = PREGUNTAS[paso], v = b.getAttribute('data-v');
      if (paso === 0) marca('ini');
      if (q.id === 'barrera') estado.barrera = v;
      if (q.id === 'trae') estado.trae = v;
      estado.r[q.f] = v;
      $$('.opcion', host).forEach(function (x) { x.disabled = true; });
      setTimeout(function () { if (paso < PREGUNTAS.length - 1) { paso++; pintar(); } else resultado(); }, 200);
    }
    function resultado() {
      guardar(estado); marca('fin');
      host.innerHTML = '<div class="resultado" tabindex="-1" id="res">' + planHTML(estado, true) + '</div><button type="button" class="atras" id="q-repetir">Repetir el test</button>';
      Object.keys(estado.r).forEach(function (k) { var i = $('input[name=' + k + ']', form); if (i) i.value = estado.r[k]; });
      if (form) form.classList.remove('oculto');
      var res = $('#res'); if (res) { res.focus({ preventScroll: true }); res.scrollIntoView({ block: 'start' }); }
      $('#q-repetir').addEventListener('click', function () {
        paso = 0; estado = { barrera: 'constancia', trae: '', r: {} };
        if (form) form.classList.add('oculto'); pintar(); $('#test').scrollIntoView({ block: 'start' });
      });
    }
    pintar();
    var ir = $('#ir-test'); if (ir) ir.addEventListener('click', function (e) { e.preventDefault(); $('#test').scrollIntoView({ block: 'start' }); });
  }

  function gracias() {
    var host = $('#mi-plan'); if (!host) return;
    var r = leer();
    if (r && PERFILES[r.barrera]) host.innerHTML = '<div class="tarjeta resultado">' + planHTML(r, false) + '</div>';
    else host.innerHTML = '<div class="tarjeta"><h3>Tus primeras 4 semanas</h3><ul class="semanas">' + SEMANAS.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
    var c = $('#compartir');
    if (c) c.addEventListener('click', function () {
      var txt = '¿Te lo has planteado mil veces y no lo logras? Test de 1 minuto para empezar sin miedo:';
      if (navigator.share) { navigator.share({ title: 'hoy sí', text: txt, url: URL_WEB }).catch(function () {}); return; }
      var done = function () { c.textContent = 'Enlace copiado ✓'; };
      if (navigator.clipboard) navigator.clipboard.writeText(URL_WEB).then(done, function () { c.textContent = URL_WEB; }); else c.textContent = URL_WEB;
    });
  }

  /* Embudo: cuenta una vez por carga quién empieza y quién acaba el test, como visita con anuncio «ini_…»/«fin_…». */
  var marcado = {};
  function marca(etapa) {
    if (marcado[etapa]) return; marcado[etapa] = 1;
    var c = (new URLSearchParams(location.search).get('utm_content') || 'directo').replace(/[^a-z0-9_-]/gi, '').slice(0, 30);
    new Image().src = 'https://avisame.vsricardo97.workers.dev/v/hoy-si.gif?c=' + etapa + '_' + c;
  }

  function visita() {
    var c = (new URLSearchParams(location.search).get('utm_content') || '').replace(/[^a-z0-9_-]/gi, '').slice(0, 40);
    var i = $('input[name=anuncio]'); if (i) i.value = c;
    var el = $('[data-visita]');
    if (el) new Image().src = 'https://avisame.vsricardo97.workers.dev/v/' + el.getAttribute('data-visita') + '.gif' + (c ? '?c=' + c : '');
  }

  function buscador() {
    var q = $('#buscar'); if (!q) return;
    var ents = $$('.ent'), secs = $$('.seccion-dic'), nada = $('#nada');
    function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
    var textos = ents.map(function (e) { return norm(e.textContent); });
    q.addEventListener('input', function () {
      var v = norm(q.value.trim()), total = 0;
      ents.forEach(function (e, i) { var ok = !v || textos[i].indexOf(v) > -1; e.classList.toggle('oculto', !ok); if (ok) total++; });
      secs.forEach(function (s) { s.classList.toggle('oculto', !!v && !$$('.ent:not(.oculto)', s).length); });
      if (nada) nada.classList.toggle('oculto', total > 0);
    });
  }

  visita(); test(); gracias(); buscador();
})();
