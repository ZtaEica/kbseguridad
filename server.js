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

async function load() {
  if (KV) {
    const r = await (await fetch(`${KV}/get/kb_content`, { headers: { Authorization: `Bearer ${TOKEN}` } })).json();
    if (r.result) return JSON.parse(r.result);
  } else if (LOCAL && fs.existsSync(LOCAL)) {
    return JSON.parse(fs.readFileSync(LOCAL, 'utf8'));
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

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

module.exports = app;
if (require.main === module) app.listen(process.env.PORT || 3000, () => console.log('http://localhost:3000'));
