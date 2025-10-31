async function getSettings() {
  return new Promise((res) => chrome.storage.sync.get(
    { useCloud: false, geminiApiKey: "", modelId: "gemini-1.5-flash" },
    (o)=>res(o)
  ));
}

function hasLocalAI() {
  const a = globalThis.ai;
  return !!(a && (a.assistant?.create || a.languageModel?.create || a.translator?.create));
}

async function localAnalyze({ systemPrompt, userText, temperature=0.2 }) {
  const a = globalThis.ai;
  if (a?.assistant?.create) {
    const session = await a.assistant.create({ systemPrompt, temperature });
    const out = await session.prompt(buildAnalyzePrompt(systemPrompt, userText));
    return out?.outputText || String(out || "");
  }
  if (a?.languageModel?.create) {
    const model = await a.languageModel.create({ temperature });
    const out = await model.generateText(buildAnalyzePrompt(systemPrompt, userText));
    return out?.outputText || String(out || "");
  }
  throw new Error("Local AI 'assistant' not available");
}

async function localTranslate({ targetLang="en", userText }) {
  const a = globalThis.ai;
  if (a?.translator?.create) {
    const t = await a.translator.create({ targetLanguage: targetLang });
    return await t.translate(userText);
  }
  const prompt = `You are a translator. Translate to ${targetLang}. Return only the translation:\n\n${userText}`;
  return await localAnalyze({ systemPrompt: "Translate only.", userText: prompt });
}
async function localRewrite({ userText }) {
  const prompt = `Rewrite the text to be clearer and more concise. Return only the rewritten text:\n\n${userText}`;
  return await localAnalyze({ systemPrompt: "Rewrite only.", userText: prompt });
}
async function localProofread({ userText }) {
  const prompt = `Correct grammar/punctuation. Return only the corrected text:\n\n${userText}`;
  return await localAnalyze({ systemPrompt: "Proofread only.", userText: prompt });
}

function buildAnalyzePrompt(systemPrompt, pageText) {
  return `${systemPrompt}

USER_PAGE_TEXT:
${String(pageText).slice(0, 20000)}
`;
}

/* --------------- Cloud (Gemini Web) ---------------- */

const API_BASE = "https://generativelanguage.googleapis.com/v1";

async function cloudFetch(path, apiKey, init) {
  const resp = await fetch(`${API_BASE}${path}?key=${encodeURIComponent(apiKey)}`, init);
  const text = await resp.text();
  return { ok: resp.ok, status: resp.status, text };
}

async function listModels(apiKey) {
  const { ok, status, text } = await cloudFetch(`/models`, apiKey, { method: "GET" });
  if (!ok) throw new Error(`ListModels error ${status}: ${text.slice(0,300)}`);
  const data = JSON.parse(text);
  return (data.models || []).map(m => ({
    name: m.name, // e.g. "models/gemini-1.5-flash"
    supports: m.supportedGenerationMethods || []
  }));
}

function pickBestModel(models) {
  // pega apenas os que suportam generateContent
  const usable = models.filter(m => m.supports.includes("generateContent"));
  const names = usable.map(m => m.name.replace(/^models\//, ""));
  // preferências
  const prefs = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.0-pro",
    "gemini-pro",
    "gemini-1.5-flash-8b"
  ];
  for (const p of prefs) if (names.includes(p)) return p;
  // se nada da preferência existir, devolve o primeiro disponível
  return names[0];
}

async function cloudGenerate({ model, apiKey, contents }) {
  const body = JSON.stringify({ contents, generationConfig: { temperature: 0.2 } });
  const { ok, status, text } = await cloudFetch(`/models/${encodeURIComponent(model)}:generateContent`, apiKey, {
    method: "POST",
    headers: { "content-type":"application/json" },
    body
  });
  if (!ok) throw new Error(`Cloud error ${status}: ${text.slice(0,500)}`);
  try {
    const data = JSON.parse(text);
    return (data?.candidates?.[0]?.content?.parts?.map(p=>p.text).join("")) || "";
  } catch { return text; }
}

async function cloudAnalyze({ systemPrompt, userText, apiKey, model }) {
  return await cloudGenerate({
    apiKey, model,
    contents: [{ role:"user", parts:[{text: buildAnalyzePrompt(systemPrompt, userText)}] }]
  });
}
async function cloudTask({ apiKey, model, prompt }) {
  return await cloudGenerate({
    apiKey, model,
    contents: [{ role:"user", parts:[{text: prompt}]} ]
  });
}

/* --------------- API exportada ---------------- */
export async function askAI({ kind, systemPrompt, userText, temperature = 0.2, targetLang }) {
  // 1) Local
  if (hasLocalAI()) {
    if (kind === 'analyze')  return normalizeAnalyze(await localAnalyze({ systemPrompt, userText, temperature }));
    if (kind === 'translate')return await localTranslate({ targetLang, userText });
    if (kind === 'rewrite')  return await localRewrite({ userText });
    if (kind === 'proofread')return await localProofread({ userText });
  }

  // 2) Cloud
  const { useCloud, geminiApiKey, modelId } = await getSettings();
  if (useCloud && geminiApiKey) {
    // tenta com o modelo selecionado; se 404, faz ListModels e tenta o melhor disponível
    try {
      if (kind === 'analyze')  return normalizeAnalyze(await cloudAnalyze({ systemPrompt, userText, apiKey: geminiApiKey, model: modelId }));
      if (kind === 'translate')return await cloudTask({ apiKey: geminiApiKey, model: modelId, prompt: `Translate to ${targetLang||'en'}:\n\n${userText}` });
      if (kind === 'rewrite')  return await cloudTask({ apiKey: geminiApiKey, model: modelId, prompt: `Rewrite clearer/concise:\n\n${userText}` });
      if (kind === 'proofread')return await cloudTask({ apiKey: geminiApiKey, model: modelId, prompt: `Correct grammar/punctuation:\n\n${userText}` });
    } catch (e) {
      const msg = String(e.message || e);
      if (msg.includes("Cloud error 404")) {
        const models = await listModels(geminiApiKey);
        const suggested = pickBestModel(models);
        if (!suggested) throw new Error(`No cloud models with generateContent for this key.\nModels: ${models.map(m=>m.name).join(", ")}`);
        // retry com o sugerido
        if (kind === 'analyze')  return normalizeAnalyze(await cloudAnalyze({ systemPrompt, userText, apiKey: geminiApiKey, model: suggested }));
        if (kind === 'translate')return await cloudTask({ apiKey: geminiApiKey, model: suggested, prompt: `Translate to ${targetLang||'en'}:\n\n${userText}` });
        if (kind === 'rewrite')  return await cloudTask({ apiKey: geminiApiKey, model: suggested, prompt: `Rewrite clearer/concise:\n\n${userText}` });
        if (kind === 'proofread')return await cloudTask({ apiKey: geminiApiKey, model: suggested, prompt: `Correct grammar/punctuation:\n\n${userText}` });
      }
      // erro diferente de 404 → repassa
      throw e;
    }
  }

  // 3) Sem local e sem cloud
  throw new Error("Chrome AI (Gemini Nano) not available and cloud fallback disabled.");
}

/* --------------- Normalize Analyze ---------------- */
function normalizeAnalyze(raw) {
  try { const obj = JSON.parse(raw); return JSON.stringify(obj); }
  catch {
    const m = String(raw).match(/\{[\s\S]*\}/);
    if (m) { try { JSON.parse(m[0]); return m[0]; } catch {} }
    return JSON.stringify({
      summary: String(raw).split(/\n+/).slice(0,5),
      risk: { level: "LOW", signals: ["Heuristic only","No JSON from model","Fallback structure"] },
      entities: [],
      actions: ["translate","rewrite","proofread"]
    });
  }
}
