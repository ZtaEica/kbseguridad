const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '4mb' }));

const SEED = path.join(__dirname, 'data', 'content.json');
const LOCAL = process.env.VERCEL ? null : path.join(__dirname, 'data', 'content.local.json');
const { KV_REST_API_URL: KV, KV_REST_API_TOKEN: TOKEN } = process.env;
const PASS = process.env.ADMIN_PASSWORD || '1234';
const SECRET = process.env.SESSION_SECRET || 'cambia-esto';
const sign = () => crypto.createHmac('sha256', SECRET).update(PASS).digest('hex');
const seed = () => JSON.parse(fs.readFileSync(SEED, 'utf8'));

// Si el contenido guardado (Upstash / local) es anterior a las páginas de servicio,
// completa los campos que le faltan (slug, imagen, detalle…) con los del content.json.
const slugify = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
function withDefaults(d) {
  const base = seed();
  (d.services || []).forEach((s, i) => {
    const b = base.services.find(x => x.slug === s.slug) || base.services.find(x => slugify(x.title) === slugify(s.title)) || base.services[i];
    if (b) for (const k of Object.keys(b)) if (s[k] === undefined) s[k] = b[k];
  });
  d.info = d.info || {};
  ['heroImage', 'aboutImage'].forEach(k => { if (!d.info[k]) d.info[k] = base.info[k]; });
  return d;
}

async function load() {
  if (KV) {
    const r = await (await fetch(`${KV}/get/kb_content`, { headers: { Authorization: `Bearer ${TOKEN}` } })).json();
    if (r.result) return withDefaults(JSON.parse(r.result));
  } else if (LOCAL && fs.existsSync(LOCAL)) {
    return withDefaults(JSON.parse(fs.readFileSync(LOCAL, 'utf8')));
  }
  return seed();
}

async function save(data) {
  const s = JSON.stringify(data);
  if (KV) {
    const r = await fetch(`${KV}/set/kb_content`, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` }, body: s });
    if (!r.ok) throw new Error('No se pudo guardar en Upstash');
  } else if (LOCAL) fs.writeFileSync(LOCAL, s);
  else throw new Error('Falta conectar Upstash Redis (KV_REST_API_URL) en Vercel');
}

const auth = (req, res, next) => (req.get('x-token') === sign() ? next() : res.status(401).json({ error: 'No autorizado' }));

app.get('/api/content', async (_, res) => {
  try { res.json(await load()); } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/login', (req, res) =>
  req.body.password === PASS ? res.json({ token: sign() }) : res.status(401).json({ error: 'Contraseña incorrecta' }));
app.post('/api/content', auth, async (req, res) => {
  try { await save(req.body); res.json({ ok: true }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Cada servicio tiene su página: /servicios/<slug> (la plantilla lee el slug de la URL)
const SERVICIO = path.join(__dirname, 'public', 'servicio.html');
app.get('/servicios/:slug', (_, res) => res.type('html').send(fs.readFileSync(SERVICIO, 'utf8')));
app.get('/servicios', (_, res) => res.redirect('/#servicios'));

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

module.exports = app;
if (require.main === module) app.listen(process.env.PORT || 3000, () => console.log('http://localhost:3000'));
