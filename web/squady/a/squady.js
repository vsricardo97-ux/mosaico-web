// Squady · web. Entradas al hacer scroll y «Saca una carta» con cartas reales de la app. Sin cookies ni almacenamiento.
(function () {
  document.documentElement.classList.add('js');

  var bloques = document.querySelectorAll('.aparece');
  document.querySelectorAll('section').forEach(function (s) {
    s.querySelectorAll('.aparece').forEach(function (el, i) { el.style.setProperty('--i', i); });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    bloques.forEach(function (el) { io.observe(el); });
  } else {
    bloques.forEach(function (el) { el.classList.add('visto'); });
  }

  // Cartas de la app (servicios/cuadrilla/publico/palabras.js, mosaico-games): una muestra de cada baraja.
  var CARTAS = {"probable":["se suba al tren equivocado con total seguridad","pida cinco minutos más durante una hora","se quede hablando en la puerta media hora al despedirse","sea el primero en irse de la oficina en cuanto da la hora","haga una foto a cada plato de cada restaurante","se coma la última croqueta delante de todos","mande un “jaja” cuando en realidad no ha entendido el chiste","compre un regalo y luego se lo quede para él","se suscriba a un servicio de streaming y olvide darse de baja","se líe a hablar con un desconocido en el tren","deje un táper sin devolver durante años","llore viendo un anuncio","se queme las tostadas todas las mañanas","se aprenda una coreografía entera de TikTok","pague con tarjeta hasta un chicle","use un cupón caducado con toda la confianza del mundo","se pase de picante y lo niegue con lágrimas en los ojos","hierva agua y se queme igualmente","llame al técnico por un cable desenchufado","tenga más tazas de empresa que platos en casa","envíe un mensaje romántico a la persona equivocada","gane un concurso de la tele","duerma durante todo el trayecto del autobús","vaya al súper a por pan y salga con el carro lleno"],"yonunca":["Yo nunca he dicho «te veo luego» a alguien que no pensaba ver","Yo nunca he hecho una foto de la comida antes de empezar a comer","Yo nunca me he colado en una fiesta","Yo nunca he fingido que me gustaba un regalo que no me gustaba nada","Yo nunca he roto algo en casa ajena y no lo he dicho","Yo nunca he fingido entender a alguien en otro idioma con un «yes, yes»","Yo nunca he hecho un baile de TikTok","Yo nunca he dicho que sí a todo en una cena por no complicarme","Yo nunca he tenido un mote que odiara","Yo nunca he leído un mensaje y he olvidado contestarlo durante una semana","Yo nunca he tenido que buscar el coche en un aparcamiento durante más de diez minutos","Yo nunca he cocinado algo y lo he tirado a la basura por incomible","Yo nunca he fingido una llamada para huir de una conversación","Yo nunca he entrado a una tienda solo para no cruzarme con alguien","Yo nunca he buscado mi propio nombre en Google","Yo nunca he escuchado a escondidas una conversación ajena en el bus","Yo nunca he comprado algo caro y me he arrepentido al llegar a casa","Yo nunca he dormido en el aeropuerto esperando un vuelo","Yo nunca he dicho «no pasa nada» cuando sí pasaba","Yo nunca he sido el primero en irme de una fiesta sin despedirme","Yo nunca he salido de un grupo de WhatsApp sin despedirme","Yo nunca he llorado con una película de Disney","Yo nunca he tenido más de veinte pestañas abiertas sin saber por qué","Yo nunca he mirado el precio de algo y lo he dejado en otro estante"],"ganaria":[["Un lobo marino","Una orca, junto a la costa"],["Un caimán negro","Un jaguar"],["Un monstruo de Gila","Una serpiente de cascabel"],["Un león","Un oso grizzly"],["Un lince ibérico","Un gato montés"],["Un leopardo","Un jaguar"],["Una cobra real","Una anaconda verde"],["Una tortuga caimán","Una nutria gigante"],["Un lagarto basilisco","Un camaleón gigante"],["Una morsa","Un oso polar, en el hielo"],["Un águila calva","Un cóndor andino"],["Una mangosta","Una cobra"],["Un oso pardo","Un lobo"],["Un hipopótamo","Un rinoceronte negro, en el río"],["Un cisne","Un águila pescadora, junto al lago"],["Un canguro","Un avestruz"],["Un pigargo","Un pelícano"],["Un mandril","Un chimpancé"],["Una hiena manchada","Un leopardo"],["Un varano de Komodo","Un cocodrilo pequeño"],["Un halcón","Un cuervo grande"],["Un delfín","Un tiburón mako"],["Un hipopótamo","Un rinoceronte"],["Un águila arpía","Un lobo gris"]],"diez":[{"n":9,"t":"responde a tus mensajes con una nota de voz de un minuto"},{"n":3,"t":"en tu boda pidió el micro y cantó diez canciones"},{"n":9,"t":"echa la leche antes que los cereales"},{"n":7,"t":"se come la última porción sin preguntar nunca"},{"n":7,"t":"pone la lavadora a las once de la noche"},{"n":2,"t":"le grita al camarero porque el café está frío"},{"n":6,"t":"contesta llamadas en el cine"},{"n":7,"t":"ve vídeos sin auriculares en el autobús"},{"n":8,"t":"siempre pide «lo mismo de siempre» en cualquier sitio"},{"n":2,"t":"te lee los mensajes cuando vas al baño"},{"n":9,"t":"deja siempre un cuarto del café en la taza"},{"n":6,"t":"pone el aire acondicionado a dieciséis grados"},{"n":6,"t":"llega veinte minutos tarde a todo, siempre"},{"n":7,"t":"se come tus patatas «solo una» hasta acabarlas"},{"n":8,"t":"tiene 4.000 correos sin leer"},{"n":5,"t":"lame el cuchillo y lo vuelve a meter en el bote de crema de cacao"},{"n":9,"t":"llora con los anuncios de la lotería"},{"n":6,"t":"se queda con tu sitio en el sofá y lo defiende"},{"n":7,"t":"se lleva el cargador de todos los enchufes"},{"n":8,"t":"hace fotos a la comida antes de dejarte probarla"},{"n":1,"t":"vendió tu consola sin preguntarte"},{"n":5,"t":"te corta cuando cuentas algo para contar lo suyo"},{"n":4,"t":"se corta las uñas de los pies en el sofá"},{"n":6,"t":"deja el pan sin bolsa y duro como una piedra"}],"ruleta":["{a} y {b} dicen a la vez un color. Si coinciden, ganáis los dos. Si no, repetid hasta que coincidáis; el que más tarde en decirlo, pierde.","{a}, adivina la edad de {b} en meses. Si te pasas por más de 12…","{a}, reparte dos castigos como quieras entre los de la mesa.","Todos los que hayan mandado un audio de más de 3 minutos esta semana.","A la de tres, todos señalan a quien sería el peor jugador del Trivial.","{a}, di el nombre completo de {b}. Si fallas…","{a} reparte el castigo entre quien quiera.","{a}, di tres cosas que tengas en la nevera ahora mismo. Si dudas, castigo.","A la de tres, todos señalan a quien llegaría tarde a su propia boda.","{a} y {b}: piedra, papel o tijera. El perdedor cuenta un chiste y el otro puntúa del 1 al 10.","{a}, haz una mímica del trabajo de {b} sin hablar hasta que alguien lo adivine.","A la de tres, todos señalan a quien más tiempo se ha pasado hoy mirando el móvil.","{a} pregunta algo a {b}, y {b} tiene que responder con total sinceridad.","Categoría: nombres de películas de Disney. Empieza {a}. Quien repita, pierde.","Categoría: cosas que hay en una playa. Empieza {a}. Quien repita, pierde.","Todos los que hayan hablado con una mascota como si fuera una persona hoy.","{a}, cuenta un secreto pequeño o llévate el castigo.","{a}, di lo primero que se te venga a la cabeza cuando oyes la palabra «lunes».","Categoría: oficios. Empieza {a}. Quien tarde más de cinco segundos, pierde.","Ronda de aplausos para {a}, que hoy es el alma de la fiesta.","{a}, elige a alguien de la mesa y dile tu mejor cumplido gracioso.","Todos cuentan en una frase qué estaban haciendo hace una hora.","Quien haya llegado más tarde hoy.","{a} y {b} cuentan el chiste más malo que sepan. El que menos risa saque, pierde."],"impostor":[{"nombre":"Comida de aquí","palabras":["Tortilla de patatas","Torrijas","Croquetas","Huevos rotos","Fabada","Caña","Callos","Salmorejo"]},{"nombre":"Famosos","palabras":["Penélope Cruz","Belén Esteban","Chiquito de la Calzada","Aitana","Antonio Banderas","Raphael","Rafa Nadal","Pedro Almodóvar"]},{"nombre":"Fútbol","palabras":["Banquillo","Bufanda","Mundial 2010","Fichaje","El Clásico","Tanda de penaltis","Prórroga","VAR"]},{"nombre":"Planes y fiestas","palabras":["Fallas","San Fermín","Cumpleaños sorpresa","Karaoke","Puente de diciembre","Fiestas del pueblo","Pregón","Carnaval de Cádiz"]},{"nombre":"Lugares","palabras":["Peluquería","Chiringuito","Benidorm","Bar de la esquina","Camping","Ibiza","Teide","Mercado"]},{"nombre":"Cosas de casa","palabras":["Siesta","Botijo","La zapatilla","Tendedero","Calendario del chino","Butano","Táper","Mesa camilla"]}]};
  var COLOR = { impostor: 'coral', diez: 'lima', ruleta: 'mostaza', probable: 'menta', yonunca: 'chicle', ganaria: 'cielo' };

  var carta = document.getElementById('carta-viva');
  var boton = document.getElementById('otra');
  var nombresCampo = document.getElementById('nombres');
  if (!carta || !boton) return;
  var juego = 'ruleta';
  var usadas = {};

  function azar(lista, clave) {
    usadas[clave] = usadas[clave] || [];
    if (usadas[clave].length >= lista.length) usadas[clave] = [];
    var i;
    do { i = Math.floor(Math.random() * lista.length); } while (usadas[clave].indexOf(i) !== -1);
    usadas[clave].push(i);
    return lista[i];
  }
  function nombres() {
    var n = (nombresCampo.value || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    return n.length >= 2 ? n : ['Lucía', 'Marcos', 'Óscar', 'Ana'];
  }
  function dos() {
    var n = nombres().slice();
    var a = n.splice(Math.floor(Math.random() * n.length), 1)[0];
    var b = n[Math.floor(Math.random() * n.length)];
    return [a, b];
  }
  function el(tag, clase, texto) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto != null) e.textContent = texto;
    return e;
  }
  function dibujo(id) {
    var ns = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(ns, 'svg'); s.setAttribute('class', 'dibujo'); s.setAttribute('aria-hidden', 'true');
    var u = document.createElementNS(ns, 'use'); u.setAttribute('href', '#d-' + id); s.appendChild(u);
    return s;
  }

  function sacar(animar) {
    carta.className = 'carta carta-grande t-' + COLOR[juego];
    carta.innerHTML = '';
    carta.appendChild(dibujo(juego));
    if (juego === 'ruleta') {
      var t = azar(CARTAS.ruleta, 'ruleta'), p = dos();
      var texto = t.replace(/\{a\}/g, p[0]).replace(/\{b\}/g, p[1]);
      carta.appendChild(el('p', 'carta-etiqueta', /\{b\}/.test(t) ? 'Duelo' : (/señal|Todos/.test(t) ? 'Votación' : 'Reto')));
      carta.appendChild(el('p', 'carta-texto', texto));
    } else if (juego === 'probable') {
      carta.appendChild(el('p', 'carta-etiqueta', '¿Quién es más probable que…'));
      carta.appendChild(el('p', 'carta-texto', azar(CARTAS.probable, 'probable') + '?'));
      carta.appendChild(el('p', 'carta-caja', 'A la de tres, señalad'));
    } else if (juego === 'yonunca') {
      carta.appendChild(el('p', 'carta-etiqueta', 'Yo nunca'));
      carta.appendChild(el('p', 'carta-texto', azar(CARTAS.yonunca, 'yonunca').replace(/^Yo nunca /, '…')));
      carta.appendChild(el('p', 'carta-caja', 'Quien lo haya hecho, mano arriba'));
    } else if (juego === 'ganaria') {
      var v = azar(CARTAS.ganaria, 'ganaria');
      carta.appendChild(el('p', 'carta-etiqueta', '¿Quién ganaría?'));
      var vs = el('div', 'vs');
      vs.appendChild(el('p', 'carta-texto', v[0]));
      vs.appendChild(el('span', '', 'contra'));
      vs.appendChild(el('p', 'carta-texto', v[1]));
      carta.appendChild(vs);
    } else if (juego === 'diez') {
      var d = azar(CARTAS.diez, 'diez');
      carta.appendChild(el('p', 'carta-etiqueta', 'Es un 10, pero…'));
      carta.appendChild(el('p', 'carta-texto', d.t));
      carta.appendChild(el('p', 'carta-caja', '¿En qué número se queda? Con los dedos, a la de tres. Era un ' + d.n + '.'));
    } else if (juego === 'impostor') {
      var pack = azar(CARTAS.impostor, 'packs');
      var impostor = Math.random() < 0.34;
      if (impostor) {
        carta.appendChild(el('p', 'carta-titulo', 'Te toca ser impostor'));
        carta.appendChild(el('p', 'carta-ayuda', 'Escucha y disimula. Que no te pillen.'));
        carta.appendChild(el('p', 'carta-caja', 'Pista: ' + pack.nombre));
      } else {
        carta.appendChild(el('p', 'carta-etiqueta', 'Tu palabra'));
        carta.appendChild(el('p', 'carta-titulo', azar(pack.palabras, pack.nombre)));
        carta.appendChild(el('p', 'carta-ayuda', 'Uno de vosotros no la tiene. Descubridlo.'));
      }
    }
    boton.className = 'boton boton-carta t-' + COLOR[juego];
    if (animar && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) { void carta.offsetWidth; carta.classList.add('reparte'); }
  }

  document.getElementById('chips').addEventListener('change', function (e) { juego = e.target.value; sacar(true); });
  boton.addEventListener('click', function () { sacar(true); });
  nombresCampo.addEventListener('change', function () { if (juego === 'ruleta') sacar(true); });
})();
