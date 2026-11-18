/* Interacciones de propuesta: sin correo, POST, base de datos ni almacenamiento de datos personales. */
window.KBDemo = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icons = () => window.lucide?.createIcons();
  const details = {
    'shield-check': {audience:'Residencias, comercios, edificios y eventos.', points:['Definición de puestos y horarios de cobertura.','Control de entradas, salidas y rondas de vigilancia.','Registro de novedades y coordinación de incidencias.']},
    cctv: {audience:'Hogares, locales comerciales, oficinas y bodegas.', points:['Revisión de accesos y zonas que requieren visibilidad.','Propuesta de cámaras y puntos de instalación.','Orientación sobre grabación, acceso remoto y mantenimiento.']},
    'bell-ring': {audience:'Propiedades que necesitan detección y seguimiento de alertas.', points:['Identificación de zonas y posibles puntos de intrusión.','Propuesta de sensores y dispositivos de alerta.','Definición del protocolo de notificación y respuesta.']},
    'lock-keyhole': {audience:'Edificios, oficinas, residenciales y áreas restringidas.', points:['Evaluación de accesos peatonales y vehiculares.','Propuesta de tarjetas, biometría o registro de visitantes.','Definición de perfiles y horarios de acceso.']},
    car: {audience:'Personas y organizaciones con necesidades de acompañamiento.', points:['Revisión del recorrido, horarios y contexto del traslado.','Definición del acompañamiento y coordinación operativa.','Plan de comunicación para el servicio solicitado.']},
    'building-2': {audience:'Empresas y propiedades que desean revisar su protección.', points:['Identificación de riesgos y puntos vulnerables.','Recomendaciones de medidas físicas y electrónicas.','Propuesta de prioridades para implementar mejoras.']}
  };
  const quoteMarkup = services => `
  <section id="cotizacion" aria-labelledby="quote-title"><div class="wrap quote-layout">
    <div class="quote-intro rv">
      <span class="tag">Cotización a tu medida</span>
      <h2 id="quote-title">El primer paso para estar más tranquilo</h2>
      <p class="lead">Cuéntanos qué quieres proteger. Diseñemos una solución que se ajuste a tu espacio y a tus necesidades.</p>
      <ol class="quote-steps">
        <li><span>01</span><div><h3>Cuéntanos tu necesidad</h3><p>Selecciona un servicio y describe tu propiedad.</p></div></li>
        <li><span>02</span><div><h3>Revisamos los detalles</h3><p>El alcance se define según el lugar y la cobertura.</p></div></li>
        <li><span>03</span><div><h3>Una propuesta para ti</h3><p>Conoce cómo sería una atención personalizada.</p></div></li>
      </ol>
      <div class="demo-note"><i data-lucide="info" aria-hidden="true"></i><p><strong>Vista de demostración.</strong> Puedes probar el formulario con datos de ejemplo. No se enviará ninguna solicitud.</p></div>
    </div>
    <div class="quote-panel rv">
      <form id="quote-form" class="site-form" aria-describedby="quote-note">
        <h3>Solicita tu cotización</h3><p id="quote-note" class="form-note">Los campos con * son obligatorios.</p>
        <div class="form-grid">
          <div class="field"><label for="quote-name">Nombre completo *</label><input id="quote-name" name="name" autocomplete="name" maxlength="100" required placeholder="Ej. María González"></div>
          <div class="field"><label for="quote-company">Empresa <span>(opcional)</span></label><input id="quote-company" name="company" autocomplete="organization" maxlength="100" placeholder="Nombre de tu empresa"></div>
          <div class="field"><label for="quote-email">Correo electrónico *</label><input id="quote-email" name="email" type="email" autocomplete="email" maxlength="150" required placeholder="nombre@ejemplo.com"></div>
          <div class="field"><label for="quote-phone">Teléfono *</label><input id="quote-phone" name="phone" type="tel" autocomplete="tel" maxlength="25" required placeholder="Ej. +507 6000-0000"></div>
          <div class="field"><label for="quote-service">Servicio de interés *</label><select id="quote-service" name="service" required><option value="">Selecciona un servicio</option>${services.map((s,i)=>`<option value="${i}">${esc(s.title)}</option>`).join('')}<option value="advice">Necesito orientación</option></select></div>
          <div class="field"><label for="quote-property">Tipo de propiedad *</label><select id="quote-property" name="property" required><option value="">Selecciona una opción</option><option>Hogar</option><option>Empresa u oficina</option><option>Comercio</option><option>Residencial o PH</option><option>Evento</option><option>Otro</option></select></div>
          <div class="field"><label for="quote-location">Zona o ubicación *</label><input id="quote-location" name="location" maxlength="150" required placeholder="Ej. Chanis, Ciudad de Panamá"></div>
          <div class="field"><label for="quote-timing">¿Cuándo lo necesitas?</label><select id="quote-timing" name="timing"><option>Estoy evaluando opciones</option><option>Lo antes posible</option><option>Este mes</option><option>En los próximos meses</option></select></div>
          <div class="field full"><label for="quote-message">¿Qué necesitas proteger? *</label><textarea id="quote-message" name="message" rows="4" maxlength="1500" required placeholder="Cuéntanos el tamaño del lugar, horarios o cualquier detalle que nos ayude."></textarea></div>
        </div>
        <button class="btn quote-submit" type="submit"><i data-lucide="clipboard-check"></i>Simular solicitud</button>
        <p class="form-note">Esta demostración no envía correos ni guarda tus datos.</p>
      </form>
      <div id="quote-result" class="quote-result" hidden tabindex="-1" aria-labelledby="quote-result-title">
        <div class="result-icon"><i data-lucide="check"></i></div><span class="tag">Demostración</span>
        <h3 id="quote-result-title">Así se vería tu solicitud</h3>
        <p>Simulación completada. No se ha enviado una cotización ni un correo.</p>
        <dl id="quote-summary"></dl>
        <div class="row"><button class="btn" type="button" id="quote-edit">Editar datos</button><button class="btn o" type="button" id="quote-new">Nueva simulación</button></div>
      </div>
    </div>
  </div></section>`;

  function init(content) {
    const form = $('#quote-form'), result = $('#quote-result');
    const serviceDialog = $('#service-dialog'), blogDialog = $('#dg');
    const activity = new Map(); // Solo durante esta carga de página; cada artículo tiene su estado.
    let articleId = null;
    function state(id) {
      if (!activity.has(id)) activity.set(id, {reaction:null, comments:[]});
      return activity.get(id);
    }
    function show(dialog, html) {
      dialog.innerHTML = html;
      icons();
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('modal-open');
    }
    for (const dialog of [serviceDialog, blogDialog]) {
      dialog.addEventListener('click', e => {
        if (e.target.closest('[data-close]')) dialog.close();
        if (e.target === dialog) {
          const r = dialog.getBoundingClientRect();
          if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
        }
      });
      dialog.addEventListener('close', () => {
        if (!serviceDialog.open && !blogDialog.open) document.body.classList.remove('modal-open');
      });
    }
    function openService(index) {
      const service = content.services[index];
      if (!service) return;
      const detail = details[service.icon] || {audience:'Clientes que necesitan una solución de seguridad personalizada.',points:['Revisión de necesidades.','Definición del alcance del servicio.','Propuesta adaptada al lugar y horarios.']};
      show(serviceDialog, `<div class="modal-bar"><span>Conoce el servicio</span><button class="x" type="button" data-close aria-label="Cerrar detalles">✕</button></div><div class="in service-detail">
        <div class="ic"><i data-lucide="${esc(service.icon)}"></i></div><h2 id="service-title">${esc(service.title)}</h2><p class="lead">${esc(service.desc)}</p>
        <h3>¿Para quién es?</h3><p>${esc(detail.audience)}</p><h3>Propuesta de alcance</h3><ul class="detail-list">${detail.points.map(x=>`<li><i data-lucide="check"></i><span>${esc(x)}</span></li>`).join('')}</ul>
        <p class="form-note">Alcance ilustrativo para esta propuesta; los detalles se definirían con el cliente.</p>
        <button class="btn" type="button" data-quote-service="${index}"><i data-lucide="clipboard-list"></i>Cotizar este servicio</button>
      </div>`);
    }
    function chooseService(index) {
      const select = $('#quote-service');
      select.value = String(index);
      serviceDialog.close();
      form.hidden = false; result.hidden = true;
      $('#cotizacion').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      select.focus({preventScroll:true});
    }
    serviceDialog.addEventListener('click', e => {
      const button = e.target.closest('[data-quote-service]');
      if (button) chooseService(Number(button.dataset.quoteService));
    });

    const reactions = [{id:'useful',label:'Me sirvió',icon:'thumbs-up',base:12},{id:'love',label:'Me encanta',icon:'heart',base:4},{id:'interesting',label:'Interesante',icon:'lightbulb',base:7}];
    function renderActivity() {
      const current = state(articleId);
      $('#reaction-buttons').innerHTML = reactions.map(r=>`<button class="reaction" type="button" data-reaction="${r.id}" aria-pressed="${current.reaction===r.id}"><i data-lucide="${r.icon}"></i>${r.label}<span>${r.base+(current.reaction===r.id?1:0)}</span></button>`).join('');
      $('#comment-count').textContent = String(current.comments.length + 1);
      const list = $('#comment-list');
      list.innerHTML = `<article class="comment sample-comment"><div class="comment-avatar" aria-hidden="true">E</div><div><h4>Lector de ejemplo <span>Ejemplo</span></h4><p>Información útil para conocer mejor las opciones de seguridad.</p></div></article>` + current.comments.map(c=>`<article class="comment"><div class="comment-avatar" aria-hidden="true">${esc(Array.from(c.name)[0].toUpperCase())}</div><div><h4>${esc(c.name)} <span>Solo en esta demo</span></h4><p>${esc(c.text)}</p></div></article>`).join('');
      icons();
    }
    function openArticle(id) {
      const article = content.posts.find(p => String(p.id) === id);
      if (!article) return;
      articleId = id;
      const date = new Date(article.date+'T12:00:00');
      const dateText = isNaN(date) ? '' : date.toLocaleDateString('es-PA',{day:'numeric',month:'long',year:'numeric'});
      show(blogDialog, `<div class="modal-bar"><span>Consejos de seguridad</span><button class="x" type="button" data-close aria-label="Cerrar artículo">✕</button></div>${article.image?`<img src="${esc(article.image)}" alt="">`:''}<div class="in article-detail">
        <small class="article-date">${esc(dateText)}</small><h2 id="article-title">${esc(article.title)}</h2>
        <div class="article-body">${String(article.body||'').split('\n').filter(Boolean).map(p=>`<p>${esc(p)}</p>`).join('')}</div>
        <div class="article-community"><h3>¿Qué te pareció este artículo?</h3><p class="form-note">Actividad de ejemplo. Tus reacciones y comentarios solo se muestran en esta pestaña y se borran al recargar.</p>
        <div id="reaction-buttons" class="reactions" role="group" aria-label="Reaccionar al artículo"></div><p id="reaction-status" class="sr-only" role="status"></p>
        <h3>Comentarios <span class="count-badge" id="comment-count"></span></h3><div id="comment-list" class="comment-list"></div>
        <form id="comment-form" class="site-form"><h3>Participa en la conversación</h3><p class="form-note">Prueba con un nombre y un comentario de ejemplo. No se publican en internet.</p>
          <div class="field"><label for="comment-name">Nombre *</label><input id="comment-name" name="name" maxlength="60" required placeholder="Tu nombre de ejemplo" autocomplete="off"></div>
          <div class="field"><label for="comment-text">Comentario *</label><textarea id="comment-text" name="comment" rows="3" maxlength="600" required placeholder="Comparte tu opinión sobre el artículo…"></textarea></div>
          <button class="btn" type="submit"><i data-lucide="message-square"></i>Agregar comentario de prueba</button><p id="comment-status" class="form-note" role="status"></p>
        </form></div></div>`);
      renderActivity();
    }
    $('#app').addEventListener('click', e => {
      const service = e.target.closest('[data-service]');
      const post = e.target.closest('[data-post]');
      if (service) openService(Number(service.dataset.service));
      if (post) openArticle(post.dataset.post);
    });
    blogDialog.addEventListener('click', e => {
      const button = e.target.closest('[data-reaction]');
      if (!button) return;
      const id = button.dataset.reaction, current = state(articleId);
      if (!reactions.some(r=>r.id===id)) return;
      current.reaction = current.reaction === id ? null : id;
      renderActivity();
      $(`[data-reaction="${id}"]`,blogDialog).focus({preventScroll:true});
      $('#reaction-status').textContent = current.reaction ? 'Reacción añadida a la demostración.' : 'Reacción retirada.';
    });
    function validate(form) {
      for (const field of form.querySelectorAll('input, textarea')) {
        field.setCustomValidity(field.required && !field.value.trim() ? 'Completa este campo.' : '');
      }
      return form.reportValidity();
    }
    // Borra el error de espacios en blanco al editar, antes de la validación nativa.
    document.addEventListener('input', e => {
      if (e.target.matches('#quote-form input, #quote-form textarea, #comment-form input, #comment-form textarea')) e.target.setCustomValidity('');
    });
    blogDialog.addEventListener('submit', e => {
      if (e.target.id !== 'comment-form') return;
      e.preventDefault();
      if (!validate(e.target)) return;
      const current = state(articleId);
      if (current.comments.length >= 20) { $('#comment-status').textContent = 'Esta demo permite hasta 20 comentarios por artículo.'; return; }
      current.comments.push({name:$('#comment-name').value.trim(),text:$('#comment-text').value.trim()});
      renderActivity();
      e.target.reset();
      $('#comment-status').textContent = 'Comentario agregado a esta demostración. Se borrará al recargar.';
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(form)) return;
      const values = new FormData(form);
      const fields = [['Nombre',values.get('name')],['Correo',values.get('email')],['Teléfono',values.get('phone')],['Servicio',$('#quote-service').selectedOptions[0].textContent],['Propiedad',values.get('property')],['Ubicación',values.get('location')],['Plazo',values.get('timing')],['Detalles',values.get('message')]];
      if (String(values.get('company')).trim()) fields.splice(1,0,['Empresa',values.get('company')]);
      $('#quote-summary').innerHTML = fields.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(String(value).trim())}</dd></div>`).join('');
      form.hidden = true; result.hidden = false; result.focus();
      icons();
    });
    $('#quote-edit').addEventListener('click', () => {result.hidden=true;form.hidden=false;$('#quote-name').focus();});
    $('#quote-new').addEventListener('click', () => {form.reset();$('#quote-summary').replaceChildren();result.hidden=true;form.hidden=false;$('#quote-name').focus();});
  }
  return {quoteMarkup,init};
})();
