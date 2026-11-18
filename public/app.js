const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let C;
const wa = (t = 'Hola, quisiera información sobre sus servicios de seguridad.') =>
  `https://wa.me/${C.info.whatsapp}?text=${encodeURIComponent(t)}`;
const fdate = d => { const x = new Date(d + 'T12:00:00'); return isNaN(x) ? '' : x.toLocaleDateString('es-PA', { day: 'numeric', month: 'long', year: 'numeric' }); };
const paras = t => esc(t).split('\n').filter(Boolean).map(p => `<p style="margin:10px 0">${p}</p>`).join('');

async function init() {
  C = await (await fetch('/api/content')).json();
  const i = C.info;
  document.title = `${i.name} | Seguridad en Panamá`;
  $('#brand').textContent = i.name;
  $('#cta').href = '#cotizacion';
  $('#app').innerHTML = `
  <section class="hero"><div class="wrap">
    <div class="rv">
      <span class="tag"><i data-lucide="map-pin" style="width:16px"></i>${esc(i.tagline)}</span>
      <h1>${esc(i.heroTitle)}</h1>
      <p class="lead">${esc(i.heroText)}</p>
      <div class="row">
        <a class="btn" href="#cotizacion"><i data-lucide="clipboard-list"></i>Solicitar cotización</a>
        <a class="btn o" href="#servicios">Ver servicios<i data-lucide="arrow-right"></i></a>
      </div>
    </div>
    <div class="vis rv">
      ${i.heroImage ? `<img src="${esc(i.heroImage)}" alt="">` : `<i data-lucide="shield-check" class="shield"></i>`}
      <div class="chip c1"><i data-lucide="eye"></i>Monitoreo 24/7</div>
      <div class="chip c2"><i data-lucide="badge-check"></i>Personal certificado</div>
      <div class="chip c3"><i data-lucide="zap"></i>Respuesta rápida</div>
    </div>
  </div></section>

  <div class="wrap"><div class="stats rv">${C.stats.map(s => `<div class="stat"><b>${esc(s.n)}</b><span>${esc(s.l)}</span></div>`).join('')}</div></div>

  <section id="servicios"><div class="wrap">
    <div class="head rv"><span class="tag">Servicios</span><h2>Soluciones completas de seguridad</h2><p>Adaptamos cada servicio a lo que realmente necesitas proteger.</p></div>
    <div class="grid">${C.services.map((s, index) => `<article class="card service-card rv"><div class="ic"><i data-lucide="${esc(s.icon)}"></i></div><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p><button class="text-button" type="button" data-service="${index}" aria-haspopup="dialog" aria-label="Ver detalles de ${esc(s.title)}">Ver detalles <i data-lucide="arrow-up-right"></i></button></article>`).join('')}</div>
  </div></section>

  <section id="nosotros"><div class="wrap about">
    <div class="rv">${i.aboutImage ? `<img src="${esc(i.aboutImage)}" alt="">` : `<div class="ph"><i data-lucide="users" style="width:80px;height:80px"></i></div>`}</div>
    <div class="rv"><span class="tag">Nosotros</span><h2 style="margin-top:14px">Seguridad en la que puedes confiar</h2><p class="lead">${esc(i.about)}</p></div>
  </div></section>

  ${C.posts.length ? `<section id="blog"><div class="wrap">
    <div class="head rv"><span class="tag">Blog</span><h2>Consejos y novedades</h2></div>
    <div class="grid">${C.posts.map(p => `<article class="card post rv">${p.image ? `<img src="${esc(p.image)}" alt="">` : ''}<div><small>${fdate(p.date)}</small><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><button type="button" class="text-button" data-post="${esc(p.id)}" aria-haspopup="dialog" aria-label="Leer ${esc(p.title)}">Leer artículo <i data-lucide="arrow-right"></i></button></div></article>`).join('')}</div>
  </div></section>` : ''}

  ${KBDemo.quoteMarkup(C.services)}

  <section id="contacto"><div class="wrap"><div class="contact rv">
    <div><h2>Hablemos de tu seguridad</h2><p class="lead">Cuéntanos qué necesitas y te respondemos hoy mismo.</p>
      <div class="row"><a class="btn" href="${wa()}" target="_blank" rel="noopener"><i data-lucide="message-circle"></i>Escribir por WhatsApp</a></div></div>
    <ul>
      <li><i data-lucide="phone"></i>${esc(i.phone)}</li>
      <li><i data-lucide="mail"></i>${esc(i.email)}</li>
      <li><i data-lucide="map-pin"></i>${esc(i.address)}</li>
    </ul>
  </div></div></section>`;
  $('#ft').textContent = `© ${new Date().getFullYear()} ${i.name}. Todos los derechos reservados.`;

  $('#burger').onclick = () => $('#menu').classList.toggle('open');
  $('#menu').onclick = () => $('#menu').classList.remove('open');
  KBDemo.init(C);

  window.lucide?.createIcons();
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .12 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
  chat();
}

function chat() {
  const ms = $('#ms');
  const add = (h, c) => { const d = document.createElement('div'); d.className = 'm ' + c; d.innerHTML = h; ms.append(d); ms.scrollTop = 1e5; window.lucide?.createIcons(); };
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
init();
