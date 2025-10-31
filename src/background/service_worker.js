import { askAI } from './aiClient.js';
import { SYSTEM_ANALYZE, SYSTEM_TRANSLATE, SYSTEM_REWRITE, SYSTEM_PROOFREAD } from '../shared/prompts.js';

console.log("[SafeSurf] SW loaded");

const MAP = {
  analyze:   SYSTEM_ANALYZE,
  translate: SYSTEM_TRANSLATE,
  rewrite:   SYSTEM_REWRITE,
  proofread: SYSTEM_PROOFREAD,
};

chrome.runtime.onInstalled.addListener(() => {
  console.log("[SafeSurf] installed");
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg?.type === 'PING_BG') { sendResponse({ ok: true }); return; }

    if (msg?.type === 'SAFESURF_TASK') {
      // 👇 O bug estava aqui: antes lia kind do payload; agora lê do topo da msg
      const { kind } = msg;
      const { text, targetLang } = msg.payload || {};
      console.log("[SafeSurf] task:", kind);

      const systemPrompt = MAP[kind];
      if (!systemPrompt) {
        sendResponse({ ok: false, error: `Unknown kind: ${kind}` });
        return;
      }

      try {
        const userText = (kind === 'translate')
          ? `Target: ${targetLang}\n\n${text}`
          : text;

        const res = await askAI({ kind, systemPrompt, userText });
        sendResponse({ ok: true, raw: res });
      } catch (e) {
        sendResponse({ ok: false, error: e.message });
      }
      return;
    }
  })();

  return true; // keep channel open (async)
});
