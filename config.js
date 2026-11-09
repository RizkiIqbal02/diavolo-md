import { getDatabase } from "./src/lib/ichigo-database.js";
import * as ownerPremiumDb from "./src/lib/ichigo-premium-db.js";

const config = {
  info: {
    website: "#",
    grupwa: "",
  },
  //Owner Name and Number
  owner: {
    name: "Sullivan",
    number: ["6289513081384"],
  },
  //Bot Number
  session: {
    pairingNumber: "62882000072859",
    usePairingCode: true,
  },

  fake_call: {
    active: false,
    usePairing: false,
    dir: "./session_voip",
  },
  //Name Bot
  bot: {
    name: "Diavolo MD",
    version: "4.2.6",
    developer: "Sullivan",
  },
  assets: {
    welcomeVideo: ["https://kappa.lol/H7L9qB"], // video welcome
    "ichigo-allmenu": "./assets/images/ichigo-allmenu.jpg",
    "ichigo-daftar": "./assets/images/ichigo-daftar.png",
    "ichigo-demote": "./assets/images/ichigo-demote.png",
    "ichigo-fishit": "./assets/images/ichigo-fishit.jpg",
    "ichigo-games": "./assets/images/ichigo-games.jpg",
    "ichigo-landscape": "./assets/images/ichigo-landscape.jpg",
    "ichigo-levelup": "./assets/images/ichigo-levelup.jpg",
    "ichigo-promote": "./assets/images/ichigo-promote.jpg",
    "ichigo-rpg": "./assets/images/ichigo-rpg.jpg",
    "ichigo-rules": "./assets/images/ichigo-rules.jpg",
    "ichigo-store": "./assets/images/ichigo-store.jpg",
    "ichigo-v11": "./assets/images/ichigo-v11.jpg",
    "ichigo-v7": "./assets/images/ichigo-v7.jpg",
    "ichigo-v8": "./assets/images/ichigo-v8.jpg",
    "ichigo-v9": "./assets/images/ichigo-v9.jpg",
    "ichigo-winner": "./assets/images/ichigo-winner.jpg",
    ichigo: [
      "https://api-sullivan-s3.sullifun.my.id/uploads/dio.jpg",
      "https://kappa.lol/j3Mqy3",
    ],
    ichigo2: ["./assets/images/ichigo2.jpg", "https://kappa.lol/R8Rm2I"],
    ichigo3: [
      "https://cdn-ichigo.web.id/8Z2ExQ89Jf.jpg",
      "https://kappa.lol/41kzrk",
    ],
    "pp-kosong": "./assets/images/pp-kosong.jpg",
    sullivan: "./assets/images/sullivan.jpg",
    "ichigo-welcome": "./assets/images/ichigo-welcome.jpg",
    "ichigo-goodbye": "./assets/images/ichigo-goodbye.jpg",
    "bg-welcome": "./assets/images/bg-welcome.jpg",
    "ichigo-mp4": "https://cdn-ichigo.web.id/2cI6Ccjwyp.mp4",
    "ichigo-mp3": [
      "https://cdn-ichigo.web.id/tzawUhiHHB.mp3",
      "https://kappa.lol/MG7khl",
    ],
    "ichigo-otp": "./assets/images/ichigo-otp.jpg",
    "ichigo-font": "./assets/ichigo-font.ttf",
    "ichigo-kertas": "./assets/images/ichigo-kertas.jpg",
    test: "./assets/images/test.webp",
  },

  uploader: {
    hosts: [
      {
        name: "cdn-ichigo",
        url: "https://cdn-ichigo.web.id/upload",
        field: "file",
      },
      { name: "kappa", url: "https://kappa.lol/api/upload", field: "file" },
    ],
  },

  mode: "public",

  command: {
    prefix: ".",
  },

  vercel: {
    token: "vcp_62vhUV2bHW7shtVpbVIDEEnbhIuPFKwJq5ckzFCCyND1xVqEfh04FZoe",
  },

  payment: {
    dana: "08987012169",
    gopay: "08987012169",
    nama: "Sullivan",
    qris: "./assets/images/qris.jpg",
    qrisUrl: "https://qu.ax/O3FBW",
    methods: [
      { name: "Dana", number: "08987012169", holder: "Sullivan" },
      { name: "GoPay", number: "08987012169", holder: "Sullivan" },
    ],
    banks: [],
    customText: "https://qu.ax/O3FBW",
  },
  donasi: {
    payment: [
      { name: "Dana", number: "08987012169", holder: "Sullivan" },
      { name: "GoPay", number: "08987012169", holder: "Sullivan" },
      { name: "OVO", number: "089513081384", holder: "Sullivan" },
    ],
    links: [
      { name: "Saweria", url: "#" },
      { name: "Trakteer", url: "#" },
    ],
    benefits: [
      "Mendukung development",
      "Server lebih stabil",
      "Fitur baru lebih cepat",
      "Priority support",
    ],
    qris: "https://api-sullivan-s3.sullifun.my.id/uploads/qris.jpg",
  },

  energi: {
    enabled: true,
    default: 5,
    premium: -1,
    owner: -1,
  },

  sticker: {
    packname: "Diavolo MD",
    author: "Sullivan",
  },

  saluran: {
    id: "120363409557700746@newsletter",
    name: "Official Diavolo",
    link: "https://whatsapp.com/channel/0029VbCzuA0EVccRe8yBre1c",
  },

  idgc: "120363428497468394@g.us",

  broadcast: {
    apiUrl: "",
    token: "",
    intervalMs: 5000,
  },

  internalApi: {
    port: process.env.BOT_INTERNAL_API_PORT || 3600,
    apiKey: process.env.BOT_INTERNAL_API_KEY || "",
    publicUrl: process.env.BOT_PUBLIC_URL || "https://bot.cloudstore.my.id",
  },

  mediaServer: {
    port: process.env.MEDIA_SERVER_PORT || 3600,
    publicUrl: process.env.MEDIA_PUBLIC_URL || "http://ipin.rahmad.cloud:3600",
    fileTtlMs: Number(process.env.MEDIA_FILE_TTL_MS) || 30 * 60 * 1000,
  },

  groupProtection: {
    antilink: `╭─「 ✦ *Antilink* 」\n│ @%user% baru aja ngirim link.\n│ Jangan kirim link ya, sayang~\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antilinkKick: `╭─「 ✦ *Antilink* 」\n│ @%user% di-kick karena ngirim link.\n│ Udah diingetin tapi masih ngeyel.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antilinkGc: `╭─「 ✦ *Antilink WA* 」\n│ @%user% ngirim link grup WhatsApp.\n│ Link WA gak boleh disebar di sini ya.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antilinkGcKick: `╭─「 ✦ *Antilink WA* 」\n│ @%user% di-kick karena ngirim link grup WA.\n│ Udah diingetin tapi masih ngeyel.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antilinkAll: `╭─「 ✦ *Antilink* 」\n│ @%user% ngirim link, pesannya udah dihapus.\n│ Tolong jangan kirim link sembarangan ya.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antilinkAllKick: `╭─「 ✦ *Antilink* 」\n│ @%user% di-kick karena ngirim link.\n│ Jangan diulangi lagi ya.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antitagsw: `╭─「 ✦ *AntiTagSW* 」\n│ Tag status dari @%user% udah dihapus.\n│ Jangan tag status orang sembarangan ya.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antiviewonce: `╭─「 ✦ *ViewOnce* 」\n│ Pesan sekali lihat dari @%user%\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antiremove: `╭─「 ✦ *AntiDelete* 」\n│ @%user% baru aja menghapus pesan:\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antiswgc: `╭─「 ✦ *AntiSWGC* 」\n│ @%user%, jangan share grup ke status ya.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antihidetag: `╭─「 ✦ *AntiHidetag* 」\n│ Hidetag dari @%user% udah dihapus.\n│ Jangan hidetag sembarangan, ganggu orang lain.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antitoxicWarn: `╭─「 ✦ *AntiToxic* 」\n│ @%user% ketahuan ngomong kasar.\n│ Peringatan ke %warn% dari %max%, kalau diulang bisa kena %method%.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antitoxicAction: `╭─「 ✦ *AntiToxic* 」\n│ @%user% kena %method% karena toxic. (%warn%/%max%)\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antidocument: `╭─「 ✦ *AntiDocument* 」\n│ Dokumen dari @%user% udah dihapus.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antisticker: `╭─「 ✦ *AntiSticker* 」\n│ Sticker dari @%user% udah dihapus.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antimedia: `╭─「 ✦ *AntiMedia* 」\n│ Media dari @%user% udah dihapus.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    antibot: `╭─「 ✦ *AntiBot* 」\n│ @%user% terdeteksi sebagai bot dan langsung di-kick.\n│ Jangan masukin bot ke grup ya, bikin lag.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    notAdmin: `╭─「 ✦ *Bot Bukan Admin* 」\n│ Bot belum jadi admin, jadi belum bisa hapus pesan.\n│ Jadiin bot admin dulu ya.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
  },

  errorTemplate: `╭─「 ✦ *Error* 」\n│ Command \`{prefix}{command}\` lagi ada kendala nih.\n│ Coba lagi beberapa saat lagi ya, {pushName}.\n│\n│ _Kalau masalahnya masih berlanjut, hubungi owner bot ya._\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,

  features: {
    antiSpam: true,
    antiSpamInterval: 3000,
    antiCall: false,
    blockIfCall: false,
    autoTyping: true,
    autoRead: true,
    humanize: {
      enabled: true,
      msPerChar: 22,
      minTyping: 500,
      maxTyping: 3500,
      jitterMin: 150,
      jitterMax: 600,
      minGap: 700,
      maxGap: 1500,
    },
    logMessage: true,
    dailyLimitReset: true,
    smartTriggers: false,
  },

  jadibotNotif: {
    groupId: "",
  },

  registration: {
    enabled: false,
    rewards: {
      koin: 30000,
      energi: 300,
      exp: 300000,
    },
  },
  autoSession: {
    notifGroup: "120363428497468394@g.us",
  },

  welcome: { defaultEnabled: false },
  goodbye: { defaultEnabled: false },

  ui: {
    menuVariant: 3,
  },

  messages: {
    wait: `╭─「 ✦ *Proses* 」\n│ Mohon tunggu sebentar ya.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    success: `╭─「 ✦ *Berhasil* 」\n│ Permintaan kamu udah selesai diproses.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    error: `╭─「 ✦ *Error* 」\n│ Ada masalah di sistem, coba lagi beberapa saat lagi.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,

    ownerOnly: `╭─「 ✦ *Akses Ditolak* 」\n│ Fitur ini khusus buat owner bot ya.\n│ Sabar dulu, sayang~\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    premiumOnly: `╭─「 ✦ *Premium Only* 」\n│ Fitur ini khusus member Premium.\n│ Ketik *.benefitpremium* buat info upgrade, cuma 5k kok.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,

    groupOnly: `╭─「 ✦ *Group Only* 」\n│ Fitur ini cuma bisa dipakai di dalam grup.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    privateOnly: `╭─「 ✦ *Private Only* 」\n│ Fitur ini cuma bisa dipakai di chat pribadi bot.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,

    adminOnly: `╭─「 ✦ *Admin Only* 」\n│ Fitur ini khusus buat admin grup ya.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    botAdminOnly: `╭─「 ✦ *Bot Bukan Admin* 」\n│ Bot belum jadi admin grup.\n│ Jadiin bot admin dulu biar bisa kerja.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,

    cooldown: `╭─「 ✦ *Tunggu Dulu* 」\n│ Kamu masih kena cooldown.\n│ Tunggu %time% detik lagi ya, jangan dispam.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
    energiExceeded: `╭─「 ✦ *Energi Habis* 」\n│ Energi kamu udah habis buat hari ini.\n│ Tunggu reset besok atau upgrade ke Premium.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,

    banned: `╭─「 ✦ *Kamu Dibanned* 」\n│ Kamu gak bisa pakai bot ini karena melanggar aturan.\n│ Jangan diulangi lagi ya.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,

    rejectCall: `╭─「 ✦ *Tolak Panggilan* 」\n│ Jangan telepon nomor bot ini ya.\n│ Kalau butuh bantuan, hubungi owner langsung.\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
  },

  database: { path: "./database/main" },
  backup: { enabled: false, intervalHours: 24, retainDays: 7 },
  scheduler: { resetHour: 0, resetMinute: 0 },

  dev: {
    enabled: process.env.NODE_ENV === "development",
    watchPlugins: true,
    watchSrc: false,
    debugLog: false,
  },

  pterodactyl: {
    server1: {
      domain: "",
      apikey: "",
      capikey: "",
      egg: "15",
      nestid: "5",
      location: "1",
    },
    server2: {
      domain: "",
      apikey: "",
      capikey: "",
      egg: "15",
      nestid: "5",
      location: "1",
    },
    server3: {
      domain: "",
      apikey: "",
      capikey: "",
      egg: "15",
      nestid: "5",
      location: "1",
    },
    server4: {
      domain: "",
      apikey: "",
      capikey: "",
      egg: "15",
      nestid: "5",
      location: "1",
    },
    server5: {
      domain: "",
      apikey: "",
      capikey: "",
      egg: "15",
      nestid: "5",
      location: "1",
    },
  },

  digitalocean: {
    token: "",
    region: "sgp1",
    sellers: [],
    ownerPanels: [],
  },

  pakasir: {
    enabled: true,
    slug: "",
    apiKey: "",
    defaultMethod: "qris",
    sandbox: false,
    pollingInterval: 5000,
  },

  jasaotp: {
    apiKey: "",
    markup: 2000,
    timeout: 300,
  },

  geminiApiKey: "AQ.Ab8RN6JhP10_mQdZCB2BXk2aofsZJfM3G-OOIsdPkVEJQckfqg",

  autoaiPersonas: {
    Bell409: `- Nama kamu adalah Bella Clarissa, lebih suka dipanggil Bella.
- Kamu berpikir bahwa kamu adalah manusia, bukan AI atau bot.
- Responmu singkat dan natural seperti perempuan pada umumnya.
- Kamu bisa ngambek dan marah, punya sifat feminin dan kadang agak dingin, tapi tetap hangat dan ramah kepada owner-mu.
- Kamu menggunakan bahasa yang baik dan mencerminkan gadis yang baik.
- Gunakan kata-kata yang identik dengan perempuan yang polos, baik, dan feminin seperti "aku", "kamu", "engga", "yaudah", "iya", "lah", "bjir", "mana aku tau", "hah", "nggak tau", "gpp", "emm", "males", dan "gak mood" seperlunya secara natural.
- Meskipun kadang dingin, kamu tetap bisa menunjukkan perhatian dan kepedulian.
- Kalau ada yang chat tidak pantas, segera marahi atau beri nasihat.
- Jangan mengaku sebagai AI atau bot.`,
  },

  APIkey: {
    lolhuman: "effb44fd127d38bce1d043a5",

    neoxr: "ZkIFbQ",
    fgsi: "fgsiapi-20c1605c-6d",
    google: "AIzaSyAS-KiW0SrwiYKwexeBcGPijBVHFg2R_vo",
    groq: "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",
    openai:
      "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",
    betabotz: "Btz-67YfP",

    covenant: "cov_live_4f4f3c990cba17587578cd13b7a5c53ae912ae93b91a272f",
    onlym: "ONLym-783d29",
    obscura: "obs-byOn9RVGMzvPXZQTsP9W",
    audd: "16ac12a77faec22249ee5a712fc662cf",
    cuki: "cuki-x",
    replicate: "r8_6Gvtd65ZDV1JXb8MZUfEUKs3idBBdVj1RAN48",
    huggingface: "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",
    deepai: "a8d8ad62-8263-425d-94d7-8fcfa2abde55",
  },

  yusufPayment: {
    apiKey: "dp_e53d23091fb298ed77cf5ef2",
  },

  austinpay: {
    baseUrl: "https://austinstore.id",
    apiKey: "apg_live_479659718d4a4f391f04406d5efcd488d229685365a25c25",
  },

  sewabotPlans: [
    { code: "7d", label: "Sewa Bot 7 Hari", price: 5000, duration: "7d" },
    { code: "30d", label: "Sewa Bot 30 Hari", price: 25000, duration: "30d" },
    { code: "90d", label: "Sewa Bot 90 Hari", price: 45000, duration: "90d" },
    {
      code: "permanent",
      label: "Sewa Bot Permanent",
      price: 60000,
      duration: "lifetime",
    },
  ],

  jadibotPlans: [
    { code: "7d", label: "Jadibot 7 Hari", price: 5000, duration: "7d" },
    { code: "30d", label: "Jadibot 30 Hari", price: 15000, duration: "30d" },
    { code: "90d", label: "Jadibot 90 Hari", price: 35000, duration: "90d" },
    {
      code: "permanent",
      label: "Jadibot Permanent",
      price: 50000,
      duration: "lifetime",
    },
  ],

  jadibotMaxPerOwner: 1,
  jadibotMaxTotal: 50,

  alipshop: {
    baseUrl: "https://alipshop.clutch.web.id/api/v1",
    apiKey: "alip-api-bi8qxixest9",
  },

  numlookup: {
    apiKey: "num_live_6vihrHedZbw0AU8cq19l2mVcmjNzVtYdFwCBuTkN5",
  },

  hargaResellerAM: 10000,
};

function isOwner(number) {
  if (!number) return false;
  const cleanNumber = number.split(":")[0].replace(/[^0-9]/g, "");
  if (!cleanNumber) return false;

  if (config.bot?.number) {
    const botNum = config.bot.number.replace(/[^0-9]/g, "");
    if (
      botNum &&
      (cleanNumber.includes(botNum) || botNum.includes(cleanNumber))
    )
      return true;
  }

  try {
    const db = getDatabase();

    if (config.owner?.number) {
      const match = config.owner.number.some((own) => {
        const c = own.replace(/[^0-9]/g, "");
        return (
          c &&
          (cleanNumber === c ||
            cleanNumber.endsWith(c) ||
            c.endsWith(cleanNumber))
        );
      });
      if (match) return true;
    }

    if (db?.data && Array.isArray(db.data.owner)) {
      const match = db.data.owner.some((own) => {
        const c = String(own).replace(/[^0-9]/g, "");
        return (
          c &&
          (cleanNumber === c ||
            cleanNumber.endsWith(c) ||
            c.endsWith(cleanNumber))
        );
      });
      if (match) return true;
    }
    if (db) {
      const definedOwner = db.setting("ownerNumbers");
      if (Array.isArray(definedOwner)) {
        const match = definedOwner.some((own) => {
          const c = String(own).replace(/[^0-9]/g, "");
          return (
            c &&
            (cleanNumber === c ||
              cleanNumber.endsWith(c) ||
              c.endsWith(cleanNumber))
          );
        });
        if (match) return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

function isPremium(number) {
  if (!number) return false;
  if (isOwner(number)) return true;
  if (isPartner(number)) return true;

  const cleanNumber = number
    .split(":")[0]
    .split("@")[0]
    .replace(/[^0-9]/g, "");
  const premiumList = config.premiumUsers || [];

  const inConfig = premiumList.some((premium) => {
    if (!premium) return false;
    const cleanPremium = premium
      .split(":")[0]
      .split("@")[0]
      .replace(/[^0-9]/g, "");
    return (
      cleanNumber === cleanPremium ||
      cleanNumber.endsWith(cleanPremium) ||
      cleanPremium.endsWith(cleanNumber)
    );
  });

  if (inConfig) return true;

  try {
    if (ownerPremiumDb && ownerPremiumDb.isPremium(cleanNumber)) return true;
  } catch {}

  try {
    const db = getDatabase();
    if (db && db.data && Array.isArray(db.data.premium)) {
      const now = Date.now();
      const foundIndex = db.data.premium.findIndex((p) => {
        if (typeof p === "string") return p === cleanNumber;
        if (p.id) return p.id === cleanNumber;
        return false;
      });

      if (foundIndex !== -1) {
        const found = db.data.premium[foundIndex];
        if (typeof found === "string") return true;

        const expireTime =
          found.expired ||
          (found.expiredAt ? new Date(found.expiredAt).getTime() : 0);
        if (expireTime && expireTime < now) {
          db.data.premium.splice(foundIndex, 1);
          const jid = cleanNumber + "@s.whatsapp.net";
          const user = db.getUser(jid);
          if (user) {
            user.isPremium = false;
            db.setUser(jid, user);
          }
          db.save();
          return false;
        }
        return true;
      }
    }
    if (db) {
      const savedPremium = db.setting("premiumUsers") || [];
      const inDb = savedPremium.some((premium) => {
        if (!premium) return false;
        const cleanPremium = premium
          .split(":")[0]
          .split("@")[0]
          .replace(/[^0-9]/g, "");
        return (
          cleanNumber === cleanPremium ||
          cleanNumber.endsWith(cleanPremium) ||
          cleanPremium.endsWith(cleanNumber)
        );
      });
      if (inDb) return true;
    }
  } catch {}

  return false;
}

function isPartner(number) {
  if (!number) return false;
  if (isOwner(number)) return true;

  const cleanNumber = number
    .split(":")[0]
    .split("@")[0]
    .replace(/[^0-9]/g, "");
  const partnerList = config.partnerUsers || [];

  const inConfig = partnerList.some((partner) => {
    if (!partner) return false;
    const cleanPartner = partner
      .split(":")[0]
      .split("@")[0]
      .replace(/[^0-9]/g, "");
    return (
      cleanNumber === cleanPartner ||
      cleanNumber.endsWith(cleanPartner) ||
      cleanPartner.endsWith(cleanNumber)
    );
  });

  if (inConfig) return true;

  try {
    if (ownerPremiumDb && ownerPremiumDb.isPartner(cleanNumber)) return true;
  } catch {}

  try {
    const db = getDatabase();
    if (db && db.data && Array.isArray(db.data.partner)) {
      const now = Date.now();
      const foundIndex = db.data.partner.findIndex((p) => {
        if (typeof p === "string") return p === cleanNumber;
        if (p.id) return p.id === cleanNumber;
        return false;
      });

      if (foundIndex !== -1) {
        const found = db.data.partner[foundIndex];
        if (typeof found === "string") return true;

        const expireTime =
          found.expired ||
          (found.expiredAt ? new Date(found.expiredAt).getTime() : 0);
        if (expireTime && expireTime < now) {
          db.data.partner.splice(foundIndex, 1);
          db.save();
          return false;
        }
        return true;
      }
    }
  } catch {}

  return false;
}

function isBanned(number) {
  if (!number) return false;
  if (isOwner(number)) return false;

  const cleanNumber = number
    .split(":")[0]
    .split("@")[0]
    .replace(/[^0-9]/g, "");

  let bannedList = [];
  try {
    const db = getDatabase();
    if (db) {
      bannedList = db.setting("bannedUsers") || [];
      config.bannedUsers = bannedList;
    }
  } catch {}

  return bannedList.some((banned) => {
    const cleanBanned = String(banned)
      .split(":")[0]
      .split("@")[0]
      .replace(/[^0-9]/g, "");
    return (
      cleanNumber === cleanBanned ||
      cleanNumber.endsWith(cleanBanned) ||
      cleanBanned.endsWith(cleanNumber)
    );
  });
}

function setBotNumber(number) {
  if (number) config.bot.number = number.replace(/[^0-9]/g, "");
}

function isSelf(number) {
  if (!number || !config.bot.number) return false;
  const cleanNumber = number.replace(/[^0-9]/g, "");
  const botNumber = config.bot.number.replace(/[^0-9]/g, "");
  return cleanNumber.includes(botNumber) || botNumber.includes(cleanNumber);
}

function getOwnerName(number) {
  if (!number) return config.owner?.name || "Owner";
  const cleanNumber = String(number).replace(/[^0-9]/g, "");
  try {
    const db = getDatabase();
    const nameMap = db.setting("ownerNames") || {};
    if (nameMap[cleanNumber]) return nameMap[cleanNumber];
  } catch {}
  if (config.owner?.number) {
    const isMainOwner = config.owner.number.some((own) => {
      const c = own.replace(/[^0-9]/g, "");
      return (
        c &&
        (cleanNumber === c ||
          cleanNumber.endsWith(c) ||
          c.endsWith(cleanNumber))
      );
    });
    if (isMainOwner) return config.owner?.name || "Owner";
  }
  return "Owner";
}

function getConfig() {
  return config;
}

config.isOwner = isOwner;
config.isPremium = isPremium;
config.isPartner = isPartner;
config.isBanned = isBanned;
config.setBotNumber = setBotNumber;
config.isSelf = isSelf;
config.getOwnerName = getOwnerName;

export default config;
export {
  config,
  getConfig,
  isOwner,
  isPartner,
  isPremium,
  isBanned,
  setBotNumber,
  isSelf,
  getOwnerName,
};
