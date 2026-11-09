# AGENTS.md

Indonesian WhatsApp bot (**Diavolo MD**, Baileys fork `ichigo`, ESM, Node >= 22). Rebrand of Ichigo Kurosaki MD, fork of Ourin MD — preserve attribution in `CREDITS.md`.

## Run

- Install: `npm install` (native deps: `better-sqlite3`, `sharp`, `@napi-rs/canvas`, ffmpeg installer; reinstall per platform/Node major if they fail).
- Prod: `npm start` (adds `--expose-gc --optimize-for-size --max-old-space-size=384`).
- Dev with plugin hot-reload: `$env:NODE_ENV="development"; npm run dev`. Plain `npm run dev` is not dev mode.
- No lint/typecheck/test suite. `npm test` intentionally fails; `test-tc.mjs` is a one-off API probe, not a test.
- Always run from repo root: `config`, `plugins`, `database`, `session`, `assets`, `temp` are all `process.cwd()`-relative.
- There is no `.env`/dotenv. Only real process env is read (`NODE_ENV`, `PLUGIN_LAZY`, `PLUGIN_WATCHER`, `MEMORY_*`, `BOT_*`, `MEDIA_*`, `SHARP_*`, `YT*`).
- Not a git repository — no version-control safety net.

## Architecture

- `index.js` boots: logger/anti-crash → DB (`initDatabase`) → assets → plugins → schedulers → `startConnection` (`src/connection.js`).
- `src/handler.js` is the message pipeline: dedupe/antispam, group protection, `case/ichigo.js` legacy commands → plugin lookup → `checkPermission` → cooldown → energi → `plugin.handler(m, ctx)`.
- `case/ichigo.js` is a hardcoded switch (`cping`, `listallcase`, `listallplugin`) that runs before plugins. New commands belong in `plugins/`, not here.
- `src/lib/ichigo-*.js` = shared internals; `src/scraper/` = external API wrappers; `plugins/<category>/` = commands (1140+ files).
- `config.js` is the central config and also implements `isOwner`/`isPremium`/`isPartner`/`isBanned`. It contains live API keys and payment credentials — never echo, log, or expose them.
- DB: `src/lib/ichigo-database.js` wraps JSON files + SQLite `database/main/ichigo.db`. Use `getDatabase()` (`getUser`, `setUser`, `setting`, `setSetting`, `save`); writes flush every 5s and on SIGINT/SIGTERM.
- `session/` holds WhatsApp auth via `useMultiFileAuthState`. Deleting or editing it logs the bot out — leave it alone.
- `src/lib/ichigo-serialize.js` is minified/obfuscated and builds `m`. Avoid editing it; use `m.reply/replyWithMentions/replyImage/replyVideo/replyAudio/replySticker/replyDocument/download/react/delete/copy`.

## Plugin conventions (most edits)

- Export shape: `export { pluginConfig as config, handler }`. Files use ~4-space indent and no semicolons; `src/` uses 2-space. Match the file.
- Loader scans exactly one level: `plugins/<category>/*.js`; leading-`_` files are skipped; top-level `plugins/*.js` load as `uncategorized`. No recursion.
- `category` defaults to the folder name. Fields: `name` (string or array), `alias`, `description`, `usage`, `example`, `isOwner`, `isPremium`, `isGroup`, `isPrivate`, `isAdmin`, `isBotAdmin`, `cooldown` (seconds, default 3), `energi` (cost, default 0), `skipRegistration`, `isEnabled`. `limit` in `defaultConfig` is unused — use `energi`.
- Handler: `handler(m, { sock, conn, client, m, args, text, command, prefix, config, db, uptime, plugins, jadibotId, isJadibot })`. Import Baileys APIs from `"ichigo"`, never `@whiskeysockets/baileys`.
- Command/alias collisions silently override (later plugin wins). Check before adding: `rg "name:\s*['\"](<cmd>)" plugins`.
- Lazy loading is on by default: modules with top-level side effects (`setInterval`, `cron.schedule`, `process.on`, `fs.watch`, `*.on(`) are eagerly imported; clean config+handler modules load on first use. Keep new plugins side-effect-free unless intentional. Disable with `PLUGIN_LAZY=false`.
- Load errors are caught, logged, and the plugin is skipped (never fatal). Metadata cache: `database/plugin-meta-cache.json` (safe to delete).
- Dev hot-reload watches only `plugins/`. Edits under `src/` are logged but not applied — restart the bot for those.
- `energi` is deducted before the handler and refunded if it throws or reacts/replies with a failure emoji. Set `m.energiFailed = true/false` to force success/refund. Cooldown is skipped for owner/partner.

## Gotchas

- User-facing text is Indonesian; keep the existing tone and box-drawing formatting.
- Full startup requires valid WhatsApp session/pairing (`config.session.pairingNumber`), so end-to-end verification is not possible offline.
- Owner-only destructive commands exist (`exec`, `run`, `eval`, `ban`, plugin enable/disable, VPS/panel, JPM/broadcast). Do not invoke them during verification.
