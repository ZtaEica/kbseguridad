/* Página de detalle de un servicio: /servicios/<slug> */
async function init() {
  await loadContent();
  const i = C.info;
  const slug = decodeURIComponent(location.pathname.split('/').filter(Boolean).pop() || '');
  const s = C.services.find(x => slugOf(x) === slug);

  if (!s) {
    document.title = `Servicio no encontrado | ${i.name}`;
    $('#app').innerHTML = `<section><div class="wrap"><div class="head"><h2>No encontramos ese servicio</h2><p>Puede que el enlace haya cambiado. Mira todos nuestros servicios o escríbenos.</p><div class="row" style="justify-content:center"><a class="btn" href="/#servicios">Ver servicios</a><a class="btn o" href="${wa()}" target="_blank" rel="noopener"><i data-lucide="message-circle"></i>WhatsApp</a></div></div></div></section>`;
    return shell();
  }

  document.title = `${s.title} | ${i.name}`;
  const md = document.querySelector('meta[name=description]'); if (md) md.content = s.intro || s.desc;

  const details = list(s.details), feats = list(s.features), ideal = list(s.idealFor), steps = list(s.steps), gal = list(s.gallery);
  const others = C.services.filter(x => x !== s);

  $('#app').innerHTML = `
  <section class="sp-hero"><div class="wrap">
    <nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a><i data-lucide="chevron-right"></i><a href="/#servicios">Servicios</a><i data-lucide="chevron-right"></i><span>${esc(s.title)}</span></nav>
    <div class="sp-grid">
      <div class="rv">
        <span class="tag"><i data-lucide="${esc(s.icon)}" style="width:16px"></i>Servicio</span>
        <h1>${esc(s.title)}</h1>
        <p class="lead">${esc(s.intro || s.desc)}</p>
        <div class="row">
          <a class="btn" href="#cotizar"><i data-lucide="clipboard-list"></i>Cotizar este servicio</a>
          <a class="btn o" href="${wa('Hola, quisiera información sobre: ' + s.title)}" target="_blank" rel="noopener"><i data-lucide="message-circle"></i>Preguntar por WhatsApp</a>
        </div>
      </div>
      <div class="rv">${s.image ? `<img class="sp-img" src="${esc(s.image)}" alt="${esc(s.title)}">` : `<div class="ph sp-img"><i data-lucide="${esc(s.icon)}" style="width:80px;height:80px"></i></div>`}</div>
    </div>
  </div></section>

  ${details.length ? `<section class="alt"><div class="wrap narrow rv"><h2>En qué consiste</h2><div class="prose">${details.map(p => `<p>${esc(p)}</p>`).join('')}</div></div></section>` : ''}

  ${feats.length ? `<section><div class="wrap">
    <div class="head rv"><h2>Qué incluye</h2></div>
    <ul class="feats">${feats.map(f => `<li class="rv"><span><i data-lucide="check"></i></span>${esc(f)}</li>`).join('')}</ul>
  </div></section>` : ''}

  ${ideal.length ? `<section class="alt"><div class="wrap">
    <div class="head rv"><h2>Ideal para</h2></div>
    <div class="chips rv">${ideal.map(f => `<span>${esc(f)}</span>`).join('')}</div>
  </div></section>` : ''}

  ${steps.length ? `<section><div class="wrap">
    <div class="head rv"><h2>Cómo trabajamos</h2><p>Un proceso simple, de la primera conversación al servicio funcionando.</p></div>
    <ol class="steps">${steps.map(t => { const k = t.indexOf(':'); const h = k > 0 ? t.slice(0, k) : t, b = k > 0 ? t.slice(k + 1).trim() : ''; return `<li class="card rv"><h3>${esc(h)}</h3>${b ? `<p>${esc(b)}</p>` : ''}</li>`; }).join('')}</ol>
  </div></section>` : ''}

  ${gal.length ? `<section class="alt"><div class="wrap"><div class="gal">${gal.map(g => `<img class="rv" src="${esc(g)}" alt="Imagen de referencia: ${esc(s.title)}" loading="lazy">`).join('')}</div></div></section>` : ''}

  <section id="cotizar"><div class="wrap">
    <div class="head rv"><span class="tag">Cotización</span><h2>Cotiza ${esc(s.title.toLowerCase())}</h2><p>Cuéntanos qué necesitas y un asesor te contactará. Sin compromiso.</p></div>
    ${quoteForm(slugOf(s))}
  </div></section>

  ${others.length ? `<section class="alt"><div class="wrap">
    <div class="head rv"><h2>Otros servicios</h2></div>
    <div class="others">${others.map(o => `<a class="rv" href="${svcUrl(o)}"><i data-lucide="${esc(o.icon)}"></i><span>${esc(o.title)}</span><i data-lucide="arrow-right"></i></a>`).join('')}</div>
  </div></section>` : ''}`;

  bindQuote();
  shell();
}
init();
