/* Código compartido: home (app.js) y páginas de servicio (service.js) */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const DEMO = true; // pon false cuando el formulario envíe de verdad
let C;

const wa = (t = 'Hola, quisiera información sobre sus servicios de seguridad.') =>
  `https://wa.me/${C.info.whatsapp}?text=${encodeURIComponent(t)}`;
const fdate = d => { const x = new Date(d + 'T12:00:00'); return isNaN(x) ? '' : x.toLocaleDateString('es-PA', { day: 'numeric', month: 'long', year: 'numeric' }); };
const paras = t => esc(t).split('\n').filter(Boolean).map(p => `<p style="margin:10px 0">${p}</p>`).join('');
const list = v => Array.isArray(v) ? v : String(v || '').split('\n').map(x => x.trim()).filter(Boolean);

// Cada servicio tiene su propia página: /servicios/<slug>
const slugify = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const slugOf = s => s.slug || slugify(s.title);
const svcUrl = s => `/servicios/${slugOf(s)}`;

async function loadContent() {
  C = await (await fetch('/api/content')).json();
  return C;
}

/* Formulario de cotización. `sel` = slug del servicio que debe venir seleccionado */
function quoteForm(sel = '') {
  return `<form class="qf rv" id="qf">
    <div><label for="q-nombre">Nombre</label><input id="q-nombre" name="nombre" required autocomplete="name"></div>
    <div><label for="q-tel">Teléfono / WhatsApp</label><input id="q-tel" name="tel" type="tel" required autocomplete="tel"></div>
    <div><label for="q-correo">Correo (opcional)</label><input id="q-correo" name="correo" type="email" autocomplete="email"></div>
    <div><label for="q-servicio">Servicio de interés</label><select id="q-servicio" name="servicio">${C.services.map(s => `<option value="${esc(s.title)}"${slugOf(s) === sel ? ' selected' : ''}>${esc(s.title)}</option>`).join('')}</select></div>
    <div class="f"><label for="q-detalle">Detalles</label><textarea id="q-detalle" name="detalle" rows="4" placeholder="Tipo de propiedad, ubicación, necesidades…"></textarea></div>
    <div class="f"><button class="btn" style="width:100%"><i data-lucide="send"></i>Solicitar cotización</button></div>
    ${DEMO ? '<p class="note f">Modo demostración: por ahora los datos no se envían.</p>' : ''}
  </form>`;
}

function bindQuote() {
  $('#qf').onsubmit = async e => {
    e.preventDefault();
    const f = e.target, d = Object.fromEntries(new FormData(f)), b = f.querySelector('button');
    b.disabled = true; b.textContent = 'Enviando…';
    // TODO envío real: await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
    await new Promise(r => setTimeout(r, 900));
    const msg = `Hola, soy ${d.nombre}. Quiero cotizar: ${d.servicio}. ${d.detalle || ''} Mi teléfono: ${d.tel}`;
    f.innerHTML = `<div class="ok f"><div class="ic"><i data-lucide="check"></i></div><h3>¡Gracias, ${esc(d.nombre)}!</h3><p style="color:var(--mut);margin:6px 0 16px">Recibimos tu solicitud. Un asesor te contactará pronto.</p><a class="btn" target="_blank" rel="noopener" href="${wa(msg)}"><i data-lucide="message-circle"></i>Agilizar por WhatsApp</a>${DEMO ? '<p class="note" style="margin-top:12px">Modo demostración: los datos no se enviaron.</p>' : ''}</div>`;
    lucide.createIcons();
  };
}

/* Barra, pie, tema, chat y animaciones. Se llama después de pintar el contenido de la página. */
function shell() {
  const i = C.info;
  $('#brand').textContent = i.name;
  $('#ft').textContent = `© ${new Date().getFullYear()} ${i.name}. Todos los derechos reservados.`;

  // "Cotizar" lleva al formulario de la página actual, o al de la home si no hay uno aquí
  const to = $('#cotizar') ? '#cotizar' : '/#cotizar';
  document.querySelectorAll('[data-cotizar]').forEach(a => a.href = to);

  $('#burger').onclick = () => $('#menu').classList.toggle('open');
  $('#menu').onclick = () => $('#menu').classList.remove('open');

  const tg = $('#tg'), root = document.documentElement;
  const paint = () => { tg.innerHTML = `<i data-lucide="${root.dataset.theme == 'dark' ? 'sun' : 'moon'}"></i>`; lucide.createIcons(); };
  tg.onclick = () => { const n = root.dataset.theme == 'dark' ? 'light' : 'dark'; root.dataset.theme = n; localStorage.kbTheme = n; paint(); };
  paint();

  lucide.createIcons();
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .12 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
  chat();

  // El contenido se pinta después de cargar, así que el navegador no salta solo al #ancla
  if (location.hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView());
}

function chat() {
  const ms = $('#ms');
  const add = (h, c) => { const d = document.createElement('div'); d.className = 'm ' + c; d.innerHTML = h; ms.append(d); ms.scrollTop = 1e5; lucide.createIcons(); };
  const link = t => `<br><a class="btn" target="_blank" rel="noopener" href="${wa(t)}"><i data-lucide="message-circle"></i>Hablar por WhatsApp</a>`;
  const reply = t => {
    const s = t.toLowerCase();
    const f = C.faq.find(f => f.q.split(',').some(k => k.trim() && s.includes(k.trim().toLowerCase())));
    setTimeout(() => add((f ? esc(f.a) : 'Con gusto te ayudo. Un asesor puede darte una respuesta exacta y una cotización sin compromiso.') + link(t), 'b'), 450);
  };
  const send = t => { if (!t.trim()) return; add(esc(t), 'u'); reply(t); };
  add('¡Hola! 👋 Soy el asistente de ' + esc(C.info.name) + '. ¿En qué te puedo ayudar?', 'b');
  $('#qk').innerHTML = ['Servicios', 'Cotizar', 'Horarios', 'Ubicación'].map(q => `<button>${q}</button>`).join('');
  $('#qk').onclick = e => e.target.tagName === 'BUTTON' && send(e.target.textContent);
  $('#cf').onsubmit = e => { e.preventDefault(); send($('#ci').value); $('#ci').value = ''; };
  $('#cb').onclick = () => $('#cw').classList.toggle('on');
}
