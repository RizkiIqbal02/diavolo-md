/*
 * menu2 — menu bot versi HTML (AIRich): profil + level, grid kategori, daftar fitur + pencarian, statistik
 * Semua data (jumlah fitur, kategori, perintah) DIBACA OTOMATIS dari folder plugins/, jadi selalu up-to-date.
 *
 * Pakai:   .menu2   (alias: .fitur, .menuhd, .statistik)
 * Taruh di: plugins/main/menu2.js
 *
 * Mau gantikan menu lama? Ganti `name: 'menu2'` jadi `name: 'menu'` (dan matikan plugin menu lama).
 * Bagian yang boleh kamu edit ada di blok "PENGATURAN" di bawah.
 */

import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { sharp } from '../../src/lib/ichigo-lazy.js';
import config from '../../config.js';

const pluginConfig = {
  name: 'menu2',
  alias: ['fitur', 'menuhd', 'statistik'],
  category: 'main',
  description: 'Menu HTML: profil, kategori, daftar fitur & statistik',
  usage: '.menu2',
  example: '.menu2',
  cooldown: 8,
  isEnabled: true
};

/* ───────────── PENGATURAN (boleh diedit) ───────────── */
const BOT_JID = '867051314767696@bot';
const CACHE_MS = 5 * 60 * 1000;                 // daftar plugin di-cache 5 menit
const HOT = 2;                                  // 🔥 untuk N kategori terbanyak
const HIDE_CATEGORIES = [];                     // contoh: ['private', 'test']
const xpNeeded = (level) => 1000 * (level + 1); // target XP menuju level berikutnya (sesuaikan dgn sistem levelmu)
const FOOTER = () => `By ${config.bot?.developer || config.owner?.name || 'owner'}`;

// ikon + label + warna per kategori (kategori yang tidak terdaftar pakai bawaan 📦)
const CAT = {
  main: ['🏠', 'MAIN'], info: ['ℹ️', 'INFO'], group: ['👥', 'GRUP'], sticker: ['🎨', 'STIKER'], stiker: ['🎨', 'STIKER'],
  downloader: ['📥', 'DOWNLOADER'], game: ['🎮', 'GAME'], fun: ['🎉', 'FUN'], tools: ['🧰', 'TOOLS'],
  saluran: ['📢', 'SALURAN'], channel: ['📢', 'SALURAN'], owner: ['👑', 'OWNER'], audio: ['🎧', 'AUDIO'],
  document: ['📄', 'DOKUMEN'], dokumen: ['📄', 'DOKUMEN'], image: ['🖼️', 'GAMBAR'], gambar: ['🖼️', 'GAMBAR'],
  islam: ['🕌', 'ISLAM'], premium: ['📂', 'PREMIUM'], video: ['🎬', 'VIDEO'], ai: ['🤖', 'AI'], search: ['🔍', 'CARI'],
  anime: ['🌸', 'ANIME'], music: ['🎵', 'MUSIK'], religi: ['🕌', 'RELIGI'], economy: ['💰', 'EKONOMI'], rpg: ['⚔️', 'RPG'],
  convert: ['🔄', 'KONVERSI'], maker: ['✨', 'MAKER'], random: ['🎲', 'RANDOM'], text: ['🔤', 'TEKS'], store: ['🛒', 'STORE'],
  jpm: ['📣', 'JPM'], panel: ['🖥️', 'PANEL'], user: ['🙋', 'USER']
};
const COLORS = ['#38bdf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa', '#fb7185', '#2dd4bf', '#60a5fa', '#f59e0b', '#c084fc'];
/* ───────────────────────────────────────────────────── */

const __dir = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = path.resolve(__dir, '..');

const escapeHtml = (t = '') => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

/* ───────────── baca daftar plugin ───────────── */
let cache = { at: 0, data: null };

function readHead(file, bytes = 7000) {
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(bytes);
    const n = fs.readSync(fd, buf, 0, bytes, 0);
    return buf.toString('utf8', 0, n);
  } catch { return ''; } finally { if (fd !== undefined) try { fs.closeSync(fd); } catch {} }
}

function parsePlugin(src, folder) {
  const open = src.search(/(?:const|let|var)\s+(?:pluginConfig|config)\s*=\s*\{/);
  if (open < 0) return null;
  const blk = src.slice(open, open + 2600);
  if (/isEnabled\s*:\s*false/.test(blk)) return null;
  const name = blk.match(/\bname\s*:\s*['"`]([^'"`]+)['"`]/)?.[1];
  if (!name) return null;
  const aliasRaw = blk.match(/\balias(?:es)?\s*:\s*\[([^\]]*)\]/)?.[1] || '';
  const alias = [...aliasRaw.matchAll(/['"`]([^'"`]+)['"`]/g)].map((x) => x[1]);
  const category = (blk.match(/\bcategory\s*:\s*['"`]([^'"`]+)['"`]/)?.[1] || folder).toLowerCase();
  const desc = blk.match(/\bdescription\s*:\s*(?:'([^'\n]*)'|"([^"\n]*)"|`([^`\n]*)`)/);
  const description = (desc?.[1] ?? desc?.[2] ?? desc?.[3] ?? '').trim();
  return { name, alias, category, description };
}

function scanPlugins() {
  if (cache.data && Date.now() - cache.at < CACHE_MS) return cache.data;
  const byCat = new Map();
  let folders = [];
  try { folders = fs.readdirSync(PLUGIN_ROOT, { withFileTypes: true }).filter((d) => d.isDirectory() && !/^[._]/.test(d.name)); } catch {}
  for (const f of folders) {
    let files = [];
    try { files = fs.readdirSync(path.join(PLUGIN_ROOT, f.name)).filter((x) => x.endsWith('.js') && !x.startsWith('_')); } catch {}
    for (const file of files) {
      const p = parsePlugin(readHead(path.join(PLUGIN_ROOT, f.name, file)), f.name);
      if (!p || HIDE_CATEGORIES.includes(p.category)) continue;
      if (!byCat.has(p.category)) byCat.set(p.category, []);
      byCat.get(p.category).push(p);
    }
  }
  const cats = [...byCat.entries()].map(([k, list]) => {
    list.sort((a, b) => a.name.localeCompare(b.name));
    const [icon, label] = CAT[k] || ['📦', k.toUpperCase()];
    return { k, icon, label, n: list.length, list };
  }).sort((a, b) => b.n - a.n || a.label.localeCompare(b.label));
  cats.forEach((c, i) => { c.color = COLORS[i % COLORS.length]; c.hot = i < HOT && c.n > 0; });
  const data = { cats, total: cats.reduce((s, c) => s + c.n, 0) };
  cache = { at: Date.now(), data };
  return data;
}

/* ───────────── data pengguna ───────────── */
function fmtUp(sec) {
  sec = Math.max(0, Math.floor(sec));
  const d = Math.floor(sec / 86400), h = Math.floor((sec % 86400) / 3600), mi = Math.floor((sec % 3600) / 60), s = sec % 60;
  return (d ? `${d}d ` : '') + (h || d ? `${h}h ` : '') + `${mi}m ${s}s`;
}

function greeting(date = new Date()) {
  const h = Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).format(date)) % 24;
  if (h >= 4 && h < 11) return 'Selamat Pagi 🌤️';
  if (h >= 11 && h < 15) return 'Selamat Siang ☀️';
  if (h >= 15 && h < 18) return 'Selamat Sore 🌇';
  return 'Selamat Malam 🌙';
}

const numOf = (jid = '') => String(jid).split('@')[0].split(':')[0].replace(/\D/g, '');

function userInfo(m, ctx) {
  const jid = m.sender || m.key?.participant || '';
  let rec = ctx.user || m.user || null;
  try { rec = rec || global.db?.data?.users?.[jid] || global.db?.users?.[jid] || null; } catch {}
  const level = Math.max(0, Number(rec?.level ?? 0) || 0);
  const xp = Math.max(0, Number(rec?.exp ?? rec?.xp ?? 0) || 0);
  const need = Math.max(1, xpNeeded(level));
  const owners = (global.owner || []).map((o) => numOf(Array.isArray(o) ? o[0] : o));
  const isOwner = ctx.isOwner ?? owners.includes(numOf(jid));
  const isPrem = ctx.isPremium ?? ctx.isPrem ?? rec?.premium ?? false;
  return {
    jid,
    name: m.pushName || rec?.name || numOf(jid) || 'Pengguna',
    role: isOwner ? '👑 Owner' : isPrem ? '💎 Premium' : '🙋 Member',
    where: m.isGroup ? 'Grup' : 'Private',
    level, xp, need, pct: Math.min(100, Math.floor((xp / need) * 100))
  };
}

async function avatarOf(conn, jid) {
  try {
    const url = await Promise.race([conn.profilePictureUrl(jid, 'image'), new Promise((r) => setTimeout(() => r(''), 3500))]);
    if (!url) return '';
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return '';
    const img = await sharp(Buffer.from(await res.arrayBuffer())).resize(160, 160, { fit: 'cover' }).jpeg({ quality: 70 }).toBuffer();
    return `data:image/jpeg;base64,${img.toString('base64')}`;
  } catch { return ''; }
}

/* ───────────── HTML ───────────── */
function createMenuHtml(d) {
  const e = escapeHtml;
  const tiles = d.cats.map((c, i) => `
      <button class="tile rise" data-k="${e(c.k)}" style="--c:${c.color};--i:${Math.min(i, 14)}">
        <span class="ti">${c.icon}</span>
        <b>${e(c.label)}${c.hot ? ' 🔥' : ''}</b>
        <small>${c.n} fitur</small>
      </button>`).join('');

  const max = Math.max(1, ...d.cats.map((c) => c.n));
  const bars = d.cats.map((c, i) => `
      <div class="bar rise" style="--c:${c.color};--i:${Math.min(i, 14)}" data-k="${e(c.k)}">
        <div class="bt"><span>${c.icon} ${e(c.label)}</span><b>${c.n}</b></div>
        <div class="bg"><i style="--w:${Math.max(3, Math.round((c.n / max) * 100))}%"></i></div>
      </div>`).join('');

  const data = JSON.stringify({
    p: d.prefix,
    c: d.cats.map((c) => ({ k: c.k, l: c.label, i: c.icon, o: c.color, m: c.list.map((p) => [p.name, p.description.slice(0, 70), p.alias.slice(0, 3).join(' ')]) }))
  }).replace(/</g, '\\u003c').replace(/[\u2028\u2029]/g, '');

  const avatar = d.avatar ? `<img src="${d.avatar}" alt="">` : `<b>${e(d.name.charAt(0).toUpperCase())}</b>`;
  const top = d.cats[0];

  return `<style>
  :root{--bg:#070910;--card:#0d1019;--line:rgba(255,255,255,.08);--ink:#f1f3fa;--mute:#8e97ad;--a:#7c8cff;--a2:#38e1c6}
  *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;outline:none;user-select:none}
  html,body{background:transparent;color:var(--ink);width:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif}
  .wrap{display:flex;justify-content:center;padding:10px}
  .card{position:relative;width:100%;max-width:350px;border-radius:26px;overflow:hidden;background:linear-gradient(180deg,#11141f 0%,#080a10 100%);border:1px solid var(--line);box-shadow:0 22px 46px rgba(0,0,0,.55);padding:12px 12px 14px;animation:enter .55s cubic-bezier(.2,.8,.2,1) both}
  @keyframes enter{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:none}}
  .aura{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 12% -4%,rgba(124,140,255,.28),transparent 46%),radial-gradient(circle at 100% 30%,rgba(56,225,198,.13),transparent 42%)}
  .rise{opacity:0;transform:translateY(10px);animation:rise .5s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(var(--i,0) * 45ms + 120ms)}
  @keyframes rise{to{opacity:1;transform:none}}

  .tabs{position:relative;display:flex;gap:4px;padding:4px;margin-bottom:10px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid var(--line)}
  .tabs button{flex:1;padding:8px 0;border:0;border-radius:10px;background:transparent;color:var(--mute);font:700 12px inherit;font-family:inherit;transition:.25s}
  .tabs button.on{background:linear-gradient(135deg,var(--a),#5b6df0);color:#fff;box-shadow:0 6px 16px rgba(124,140,255,.35)}
  .view{position:relative;display:none}.view.on{display:block}

  .me{position:relative;display:flex;gap:12px;align-items:center;padding:14px;border-radius:20px;background:linear-gradient(135deg,rgba(124,140,255,.16),rgba(56,225,198,.06));border:1px solid rgba(124,140,255,.35);box-shadow:inset 0 0 24px rgba(124,140,255,.07)}
  .av{position:relative;width:62px;height:62px;flex:none;border-radius:50%;padding:3px;background:conic-gradient(from 0deg,var(--a),var(--a2),#f472b6,var(--a));animation:spin 7s linear infinite;will-change:transform}
  @keyframes spin{to{transform:rotate(360deg)}}
  .av>div{width:100%;height:100%;border-radius:50%;background:#141824;overflow:hidden;display:flex;align-items:center;justify-content:center;animation:spin 7s linear infinite reverse}
  .av img{width:100%;height:100%;object-fit:cover}
  .av b{font-size:24px;font-weight:800;color:var(--a2)}
  .mi{min-width:0;flex:1}
  .gr{font-size:11.5px;color:var(--mute);font-weight:600}
  .un{font-size:21px;line-height:1.1;font-weight:800;letter-spacing:-.6px;margin-top:2px;word-break:break-word}
  .rl{margin-top:5px;font-size:11px;color:#ffd166;font-weight:700}
  .rl em{font-style:normal;color:var(--mute);font-weight:600}
  .lv{position:relative;margin-top:10px;padding:0 4px}
  .lt{display:flex;justify-content:space-between;font-size:11.5px;color:var(--mute);font-weight:600}
  .lt b{color:var(--ink)}
  .lb{height:6px;margin-top:6px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden}
  .lb i{display:block;height:100%;width:var(--p);min-width:3px;border-radius:99px;background:linear-gradient(90deg,var(--a),var(--a2));transform-origin:left;animation:grow 1s cubic-bezier(.2,.8,.2,1) .3s both}
  @keyframes grow{from{transform:scaleX(0)}to{transform:none}}

  .chips{position:relative;display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}
  .ch{display:inline-flex;align-items:center;gap:6px;padding:7px 11px;border-radius:99px;font-size:11.5px;font-weight:700;background:rgba(255,255,255,.05);border:1px solid var(--line);font-variant-numeric:tabular-nums}
  .ch i{width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 8px #34d399;animation:pulse 1.8s ease-in-out infinite}
  @keyframes pulse{50%{opacity:.35}}

  .grid{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .tile{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;padding:12px 4px 10px;border-radius:16px;border:1.5px solid color-mix(in srgb,var(--c) 70%,transparent);background:linear-gradient(180deg,color-mix(in srgb,var(--c) 14%,#0d1019),#0b0e16);color:var(--ink);font-family:inherit;box-shadow:0 0 14px color-mix(in srgb,var(--c) 22%,transparent),inset 0 0 16px color-mix(in srgb,var(--c) 8%,transparent);transition:transform .18s}
  .tile:active{transform:scale(.94)}
  .ti{font-size:26px;line-height:1.1;filter:drop-shadow(0 3px 6px rgba(0,0,0,.5))}
  .tile b{font-size:10.5px;font-weight:800;letter-spacing:.2px;margin-top:3px}
  .tile small{font-size:10px;color:var(--mute);font-weight:600}

  .foot{position:relative;margin-top:12px;text-align:center;font-size:10px;letter-spacing:1.6px;color:var(--mute);font-weight:700}

  .sum{position:relative;display:flex;gap:8px;margin-bottom:10px}
  .sb{flex:1;padding:12px;border-radius:16px;background:rgba(255,255,255,.05);border:1px solid var(--line)}
  .sb span{display:block;font-size:10.5px;color:var(--mute);font-weight:600}
  .sb b{display:block;margin-top:3px;font-size:24px;font-weight:800;letter-spacing:-.8px;font-variant-numeric:tabular-nums}
  .top{position:relative;margin-bottom:10px;padding:10px 12px;border-radius:14px;font-size:11.5px;color:var(--mute);background:rgba(124,140,255,.1);border:1px solid rgba(124,140,255,.25)}
  .top b{color:var(--ink)}
  .bars{position:relative;display:flex;flex-direction:column;gap:9px;padding:12px;border-radius:18px;background:rgba(255,255,255,.04);border:1px solid var(--line)}
  .bt{display:flex;justify-content:space-between;font-size:11.5px;font-weight:700}
  .bt b{font-variant-numeric:tabular-nums;color:var(--c)}
  .bg{height:7px;margin-top:5px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden}
  .bg i{display:block;height:100%;width:var(--w);border-radius:99px;background:linear-gradient(90deg,color-mix(in srgb,var(--c) 55%,#000),var(--c));box-shadow:0 0 10px color-mix(in srgb,var(--c) 60%,transparent);transform-origin:left;animation:grow .9s cubic-bezier(.2,.8,.2,1) .25s both}

  .dh{position:relative;display:flex;align-items:center;gap:10px;margin-bottom:10px}
  .back{width:36px;height:36px;flex:none;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.06);color:var(--ink);font-size:16px;font-family:inherit}
  .back:active{transform:scale(.92)}
  .dt{font-size:16px;font-weight:800;letter-spacing:-.3px}
  .dt small{display:block;margin-top:1px;font-size:10.5px;font-weight:600;color:var(--mute);letter-spacing:0}
  .sr{position:relative;width:100%;padding:11px 14px;margin-bottom:8px;border-radius:13px;border:1px solid var(--line);background:rgba(255,255,255,.06);color:var(--ink);font:600 13px inherit;font-family:inherit;user-select:text}
  .sr::placeholder{color:var(--mute)}
  .sr:focus{border-color:var(--oc,var(--a))}
  .list{position:relative;max-height:400px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none;display:flex;flex-direction:column;gap:6px}
  .list::-webkit-scrollbar{display:none}
  .cm{display:block;width:100%;text-align:left;padding:9px 12px;border-radius:12px;border:1px solid var(--line);border-left:3px solid var(--oc,var(--a));background:rgba(255,255,255,.045);color:var(--ink);font-family:inherit;transition:background .15s,transform .15s}
  .cm:active{transform:scale(.98);background:rgba(255,255,255,.09)}
  .cm b{font-size:12.5px;font-weight:800;color:var(--ink)}
  .cm em{font-style:normal;font-size:10px;color:var(--mute);margin-left:6px}
  .cm span{display:block;margin-top:2px;font-size:11px;color:var(--mute);line-height:1.35}
  .more{padding:10px;border-radius:12px;border:1px dashed var(--line);background:transparent;color:var(--mute);font:700 12px inherit;font-family:inherit}
  .empty{padding:22px 0;text-align:center;font-size:12px;color:var(--mute)}
  .toast{position:absolute;left:50%;bottom:12px;transform:translate(-50%,20px);padding:8px 14px;border-radius:99px;background:#fff;color:#0a0c11;font-size:11.5px;font-weight:800;opacity:0;pointer-events:none;transition:.25s;white-space:nowrap;z-index:5}
  .toast.on{opacity:1;transform:translate(-50%,0)}
  @media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-delay:0s!important}}
  </style>

  <div class="wrap"><div class="card" id="card"><div class="aura"></div>
    <div class="tabs" id="tabs"><button class="on" data-v="vMenu">Menu</button><button data-v="vStat">Statistik</button></div>

    <section class="view on" id="vMenu">
      <div class="me rise" style="--i:0">
        <div class="av"><div>${avatar}</div></div>
        <div class="mi">
          <div class="gr">${e(d.greeting)}</div>
          <div class="un">${e(d.name)}</div>
          <div class="rl">${e(d.role)} <em>· ${e(d.where)} · ${e(d.botName)}</em></div>
        </div>
      </div>
      <div class="lv rise" style="--i:1;--p:${d.pct}%">
        <div class="lt"><span>Level <b>${d.level}</b></span><span><b>${d.pct}%</b> · ${d.xp.toLocaleString('id-ID')} / ${d.need.toLocaleString('id-ID')}</span></div>
        <div class="lb"><i></i></div>
      </div>
      <div class="chips rise" style="--i:2">
        <span class="ch"><i></i><span id="up" data-s="${d.upSec}">${e(d.up)}</span></span>
        <span class="ch">🕒 <span id="clk">${e(d.clock)}</span> WIB</span>
        <span class="ch">🧩 ${d.total} fitur</span>
      </div>
      <div class="grid">${tiles}</div>
      <div class="foot">${e(d.footer)}</div>
    </section>

    <section class="view" id="vStat">
      <div class="sum rise" style="--i:0"><div class="sb"><span>Total perintah</span><b>${d.total}</b></div><div class="sb"><span>Kategori</span><b>${d.cats.length}</b></div></div>
      ${top ? `<div class="top rise" style="--i:1">Terbanyak: <b>${top.icon} ${e(top.label)}</b> dengan <b>${top.n}</b> fitur (${Math.round((top.n / Math.max(1, d.total)) * 100)}%)</div>` : ''}
      <div class="bars">${bars}</div>
      <div class="foot">${e(d.footer)}</div>
    </section>

    <section class="view" id="vCat">
      <div class="dh"><button class="back" id="back">‹</button><div class="dt" id="dt"></div></div>
      <input class="sr" id="sr" type="text" placeholder="Cari fitur…" autocomplete="off">
      <div class="list" id="list"></div>
    </section>

    <div class="toast" id="toast"></div>
  </div></div>

  <script>
  (function(){
    var D = ${data};
    function $(i){ return document.getElementById(i); }
    var views = ['vMenu','vStat','vCat'], tabs = $('tabs').children, last = 'vMenu';
    function show(id){
      views.forEach(function(v){ $(v).classList.toggle('on', v === id); });
      for(var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('on', tabs[i].getAttribute('data-v') === id);
      if(id !== 'vCat') last = id;
    }
    for(var t = 0; t < tabs.length; t++) tabs[t].onclick = (function(b){ return function(){ show(b.getAttribute('data-v')); }; })(tabs[t]);

    var cur = null, shown = 0, q = '', STEP = 50, list = $('list');
    function match(it){ if(!q) return true; return (it[0] + ' ' + it[1] + ' ' + it[2]).toLowerCase().indexOf(q) > -1; }
    function render(reset){
      var items = cur.m.filter(match);
      if(reset){ shown = 0; list.innerHTML = ''; list.scrollTop = 0; }
      var old = list.querySelector('.more'); if(old) old.remove();
      var end = Math.min(items.length, shown + STEP), frag = document.createDocumentFragment();
      for(var i = shown; i < end; i++){
        var it = items[i], b = document.createElement('button');
        b.className = 'cm'; b.setAttribute('data-c', D.p + it[0]);
        var n = document.createElement('b'); n.textContent = D.p + it[0]; b.appendChild(n);
        if(it[2]){ var a = document.createElement('em'); a.textContent = it[2]; b.appendChild(a); }
        if(it[1]){ var s = document.createElement('span'); s.textContent = it[1]; b.appendChild(s); }
        frag.appendChild(b);
      }
      shown = end; list.appendChild(frag);
      if(!items.length){ list.innerHTML = '<div class="empty">Tidak ada fitur yang cocok</div>'; }
      else if(shown < items.length){
        var mb = document.createElement('button'); mb.className = 'more'; mb.textContent = 'Muat lagi (' + (items.length - shown) + ')';
        list.appendChild(mb);
      }
      $('dt').innerHTML = '';
      var tt = document.createElement('span'); tt.textContent = cur.i + ' ' + cur.l; $('dt').appendChild(tt);
      var sm = document.createElement('small'); sm.textContent = items.length + ' fitur' + (q ? ' ditemukan' : ''); $('dt').appendChild(sm);
    }
    function open(k){
      for(var i = 0; i < D.c.length; i++) if(D.c[i].k === k) cur = D.c[i];
      if(!cur) return;
      q = ''; $('sr').value = '';
      $('vCat').style.setProperty('--oc', cur.o);
      show('vCat'); render(true);
      $('card').scrollIntoView && $('card').scrollIntoView({ block: 'nearest' });
    }
    document.querySelectorAll('.tile,.bar').forEach(function(el){ el.onclick = function(){ open(el.getAttribute('data-k')); }; });
    $('back').onclick = function(){ show(last); };
    $('sr').oninput = function(){ q = this.value.trim().toLowerCase(); render(true); };

    var tm;
    function toast(s){ var el = $('toast'); el.textContent = s; el.classList.add('on'); clearTimeout(tm); tm = setTimeout(function(){ el.classList.remove('on'); }, 1500); }
    list.onclick = function(ev){
      var more = ev.target.closest('.more'); if(more){ render(false); return; }
      var cm = ev.target.closest('.cm'); if(!cm) return;
      var c = cm.getAttribute('data-c');
      try { navigator.clipboard.writeText(c).then(function(){ toast('Disalin: ' + c); }, function(){ toast(c); }); } catch(e){ toast(c); }
    };

    var t0 = Date.now(), base = parseInt($('up').getAttribute('data-s'), 10) || 0;
    function f2(n){ return n < 10 ? '0' + n : '' + n; }
    function tick(){
      var s = base + Math.floor((Date.now() - t0) / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
      $('up').textContent = (d ? d + 'd ' : '') + (h || d ? h + 'h ' : '') + m + 'm ' + (s % 60) + 's';
      try {
        $('clk').textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).format(new Date());
      } catch(e){}
    }
    tick(); setInterval(tick, 1000);
  })()
  </script>`;
}

/* ───────────── pengiriman (placeholder → edit, anti-lag) ───────────── */
function richSection(html) {
  return {
    view_model: {
      __typename: 'GenAISingleLayoutViewModel',
      primitive: { __typename: 'GenAIaeacdsnwHtmlPrimitive', trusted_sources: [], payload: html }
    }
  };
}

async function relayRich(conn, jid, html, title) {
  const messageId = randomUUID();
  const unifiedData = JSON.stringify({ response_id: messageId, sections: [richSection(html)] });
  const content = {
    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2, botMetadata: { messageDisclaimerText: '', botResponseId: messageId } },
    botForwardedMessage: {
      message: {
        richResponseMessage: {
          messageType: 1,
          submessages: [{ messageType: 2, messageText: title }],
          unifiedResponse: { data: Buffer.from(unifiedData).toString('base64') },
          contextInfo: { forwardingScore: 1, isForwarded: true, forwardedAiBotMessageInfo: { botJid: BOT_JID }, forwardOrigin: 4 }
        }
      }
    }
  };
  await conn.relayMessage(jid, content, { messageId });
  await conn.relayMessage(jid, {
    protocolMessage: { key: { remoteJid: jid, fromMe: true, id: messageId }, type: 14, editedMessage: content, timestampMs: Date.now() }
  }, { additionalAttributes: { edit: '1' } });
}

/** Placeholder kecil langsung terkirim (bypassDownload), lalu di-EDIT jadi menu penuh. */
function openPlaceholder(conn, m) {
  return Promise.resolve()
    .then(() => conn.sendAIRich(m.chat, (r) => r.addText('🧭 Menyiapkan menu…'), { quoted: m, bypassDownload: true }))
    .then((sent) => (sent?.key?.id ? sent : null))
    .catch(() => null);
}

async function dropPlaceholder(conn, m, sent) {
  if (sent?.key) await conn.sendMessage(m.chat, { delete: sent.key }).catch(() => {});
}

async function deliver(conn, m, html, title, sent) {
  if (sent?.key?.id) {
    try {
      const rich = new conn.builders.AIRich(conn);
      rich.setTitle(title);
      rich.addSection(richSection(html));
      await rich.sendEdit(m.chat, sent.key.id);
      return;
    } catch (e) {
      console.error('[MENU2] edit placeholder gagal, kirim langsung:', e?.message || e);
      await dropPlaceholder(conn, m, sent);
    }
  }
  try {
    await conn.sendAIRich(m.chat, (r) => { r.setTitle(title); r.addSection(richSection(html)); }, { quoted: m });
  } catch (e) {
    console.error('[MENU2] sendAIRich gagal, pakai relay:', e?.message || e);
    await relayRich(conn, m.chat, html, title);
  }
}

async function handler(m, ctx = {}) {
  const conn = ctx.sock || m.conn;
  const react = (e) => Promise.resolve().then(() => m.react(e)).catch(() => {});
  react('🧭');
  const pending = openPlaceholder(conn, m);

  try {
    const u = userInfo(m, ctx);
    const [avatar, data] = await Promise.all([avatarOf(conn, u.jid), Promise.resolve().then(scanPlugins)]);
    const upSec = process.uptime();
    const html = createMenuHtml({
      ...u,
      avatar,
      cats: data.cats,
      total: data.total,
      prefix: ctx.prefix || m.prefix || config.prefix || '.',
      greeting: greeting(),
      botName: config.bot?.name || 'Diavolo MD',
      up: fmtUp(upSec),
      upSec: Math.floor(upSec),
      clock: new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).format(new Date()),
      footer: FOOTER()
    });
    await deliver(conn, m, html, `🧭 Menu · ${data.total} fitur`, await pending);
    await react('✅');
  } catch (e) {
    console.error('[MENU2 Error]', e);
    await dropPlaceholder(conn, m, await pending);
    await react('❌');
    m.reply(`❌ ${e.message}`);
  }
}

export { pluginConfig as config, handler };