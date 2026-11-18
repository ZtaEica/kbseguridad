/* Home. Helpers compartidos en core.js */
async function init() {
  await loadContent();
  const i = C.info;
  document.title = `${i.name} | Seguridad en Panamá`;
  const pre = new URLSearchParams(location.search).get('servicio') || ''; // /?servicio=slug#cotizar

  $('#app').innerHTML = `
  <section class="hero"><div class="wrap">
    <div class="rv">
      <span class="tag"><i data-lucide="map-pin" style="width:16px"></i>${esc(i.tagline)}</span>
      <h1>${esc(i.heroTitle)}</h1>
      <p class="lead">${esc(i.heroText)}</p>
      <div class="row">
        <a class="btn" href="#cotizar"><i data-lucide="clipboard-list"></i>Cotizar gratis</a>
        <a class="btn o" href="#servicios">Ver servicios<i data-lucide="arrow-right"></i></a>
      </div>
    </div>
    <div class="vis rv">
      ${i.heroImage ? `<img src="${esc(i.heroImage)}" alt="Guardia de seguridad de ${esc(i.name)} en un pasillo">` : `<i data-lucide="shield-check" class="shield"></i>`}
      <div class="chip c1"><i data-lucide="eye"></i>Monitoreo 24/7</div>
      <div class="chip c2"><i data-lucide="badge-check"></i>Personal certificado</div>
      <div class="chip c3"><i data-lucide="zap"></i>Respuesta rápida</div>
    </div>
  </div></section>

  <div class="wrap"><div class="stats rv">${C.stats.map(s => `<div class="stat"><b>${esc(s.n)}</b><span>${esc(s.l)}</span></div>`).join('')}</div></div>

  <section id="servicios"><div class="wrap">
    <div class="head rv"><span class="tag">Servicios</span><h2>Soluciones completas de seguridad</h2><p>Adaptamos cada servicio a lo que realmente necesitas proteger.</p></div>
    <div class="grid">${C.services.map(s => `<a class="card svc rv" href="${svcUrl(s)}">
      ${s.image ? `<img class="bg" src="${esc(s.image)}" alt="" loading="lazy">` : ''}
      <div class="ic"><i data-lucide="${esc(s.icon)}"></i></div>
      <div class="tx"><h3>${esc(s.title)}</h3><div class="dx"><div><p>${esc(s.desc)}</p><span class="more">Ver detalles<i data-lucide="arrow-right"></i></span></div></div></div>
    </a>`).join('')}</div>
  </div></section>

  <section id="nosotros"><div class="wrap about">
    <div class="rv">${i.aboutImage ? `<img src="${esc(i.aboutImage)}" alt="Guardia de ${esc(i.name)} con tableta en un pasillo" loading="lazy">` : `<div class="ph"><i data-lucide="users" style="width:80px;height:80px"></i></div>`}</div>
    <div class="rv"><span class="tag">Nosotros</span><h2 style="margin-top:14px">Seguridad en la que puedes confiar</h2><p class="lead">${esc(i.about)}</p></div>
  </div></section>

  ${C.posts.length ? `<section id="blog"><div class="wrap">
    <div class="head rv"><span class="tag">Blog</span><h2>Consejos y novedades</h2></div>
    <div class="grid">${C.posts.map(p => `<div class="card post rv" data-id="${esc(p.id)}">${p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy">` : ''}<div><small>${fdate(p.date)}</small><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p></div></div>`).join('')}</div>
  </div></section>` : ''}

  <section id="cotizar"><div class="wrap">
    <div class="head rv"><span class="tag">Cotización</span><h2>Solicita tu cotización gratis</h2><p>Cuéntanos qué necesitas y un asesor te contactará.</p></div>
    ${quoteForm(pre)}
  </div></section>

  <section id="contacto"><div class="wrap"><div class="contact rv">
    <div><h2>Hablemos de tu seguridad</h2><p class="lead">Cuéntanos qué necesitas y te respondemos hoy mismo.</p>
      <div class="row"><a class="btn" href="${wa()}" target="_blank" rel="noopener"><i data-lucide="message-circle"></i>Escribir por WhatsApp</a></div></div>
    <ul>
      <li><i data-lucide="phone"></i>${esc(i.phone)}</li>
      <li><i data-lucide="mail"></i>${esc(i.email)}</li>
      <li><i data-lucide="map-pin"></i>${esc(i.address)}</li>
    </ul>
  </div></div></section>`;

  $('#app').addEventListener('click', e => {
    const p = e.target.closest('.post'); if (!p) return;
    const x = C.posts.find(a => a.id === p.dataset.id);
    $('#dg').innerHTML = (x.image ? `<img src="${esc(x.image)}" alt="">` : '') +
      `<div class="in"><button class="x" aria-label="Cerrar">✕</button><small style="color:var(--t);font-weight:700">${fdate(x.date)}</small><h2>${esc(x.title)}</h2>${paras(x.body)}<div class="row"><a class="btn" href="${wa('Hola, leí su artículo: ' + x.title)}" target="_blank" rel="noopener"><i data-lucide="message-circle"></i>Consultar por WhatsApp</a></div></div>`;
    lucide.createIcons(); $('#dg').showModal();
  });
  $('#dg').addEventListener('click', e => { if (e.target.id === 'dg' || e.target.closest('.x')) $('#dg').close(); });

  bindQuote();
  shell();
}
init();
