import axios from "axios";
import config from "../../config.js";

// ===== Utama: api-cloud =====
const CLOUD_URL = "https://api-cloud.my.id/ai/gemini";
const CLOUD_MODEL = "auto";
const CLOUD_TIMEOUT_MS = 30000;
// Endpoint hanya menerima GET (POST = 404), jadi prompt dipangkas agar URL tidak kepanjangan
const MAX_GET_LENGTH = 6000;

// ===== Cadangan: Google Gemini langsung =====
const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_API_KEY = config?.geminiApiKey || config?.APIkey?.google || "AQ.Ab8RN6IGYuwOGSFSwUAYzSnnMXwF1d3yREosXLG9lVlqM8CKRg";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const FETCH_TIMEOUT_MS = 20000;

const encLen = (t) => encodeURIComponent(t).length;

function joinPrompt(message, instruction) {
  if (!instruction) return message;
  return `[INSTRUKSI]\n${instruction}\n[/INSTRUKSI]\n\n${message}`;
}

// Pangkas supaya hasil encode URL <= MAX_GET_LENGTH.
// Bagian awal instruksi (persona) dipertahankan, ekor (daftar aksi/rich message) dipotong duluan.
function buildCloudPrompt(message, instruction) {
  let msg = String(message || "");
  let ins = String(instruction || "");

  let prompt = joinPrompt(msg, ins);
  if (encLen(prompt) <= MAX_GET_LENGTH) return prompt;

  while (ins.length > 0 && encLen(joinPrompt(msg, ins)) > MAX_GET_LENGTH) {
    ins = ins.length > 400 ? ins.slice(0, Math.floor(ins.length * 0.85)) : "";
  }
  while (msg.length > 200 && encLen(joinPrompt(msg, ins)) > MAX_GET_LENGTH) {
    msg = msg.slice(Math.floor(msg.length * 0.15));
  }
  return joinPrompt(msg, ins);
}

function extractCloudText(data) {
  if (!data) return "";
  if (typeof data === "string") return data.trim();
  const r = data.result;
  if (typeof r === "string") return r.trim();
  return String(r?.text || r?.response || r?.message || "").trim();
}

// Setara: curl -s "https://api-cloud.my.id/ai/gemini?message=hai&model=auto"
async function geminiCloud({ message, instruction = "" }) {
  const prompt = buildCloudPrompt(message, instruction);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLOUD_TIMEOUT_MS);

  try {
    const res = await axios.get(CLOUD_URL, {
      params: { message: prompt, model: CLOUD_MODEL },
      signal: controller.signal,
    });

    const data = res.data;
    if (data?.status === false) {
      throw new Error(data?.message || data?.error || "API api-cloud mengembalikan status false.");
    }

    const text = extractCloudText(data);
    if (!text) throw new Error("API api-cloud tidak mengembalikan teks.");

    return { text, sessionId: null };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function geminiGoogle({ message, instruction = "" }) {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "Gemini API key belum diisi. Cek config.APIkey.google / config.geminiApiKey.",
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],

      generationConfig: {
        temperature: 1.0,
        topP: 0.95,

        thinkingConfig: {
          thinkingLevel: "low",
        },
      },
    };

    if (instruction) {
      body.systemInstruction = {
        parts: [{ text: instruction }],
      };
    }

    const { data } = await axios.post(GEMINI_URL, body, {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      signal: controller.signal,
    });

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      const finishReason = data?.candidates?.[0]?.finishReason;
      throw new Error(
        `Gemini API tidak mengembalikan teks${finishReason ? ` (finishReason: ${finishReason})` : ""}.`,
      );
    }

    return {
      text: text.trim(),
      sessionId: null,
    };
  } catch (error) {
    if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
      throw new Error(`Timeout memanggil Gemini API (>${FETCH_TIMEOUT_MS}ms)`);
    }
    if (error?.response?.data) {
      const apiMessage =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data?.error?.message || error.response.data?.message;
      if (apiMessage) {
        error.message = apiMessage;
      }
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function gemini(input = {}) {
  const payload = typeof input === "string" ? { message: input } : input || {};
  const { message, instruction = "" } = payload;

  if (!message) throw new Error("Message is required.");

  try {
    return await geminiCloud({ message, instruction });
  } catch (cloudError) {
    console.error("[Gemini] api-cloud gagal, pakai Google Gemini:", cloudError.message);
    return await geminiGoogle({ message, instruction });
  }
}

export { gemini as chat, geminiCloud, geminiGoogle };
export default gemini;