function pageText() {
  try {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const parts = [];
    let n; while ((n = walker.nextNode())) {
      const t = (n.textContent || "").trim();
      if (t.length > 1) parts.push(t);
    }
    return parts.join("\n").slice(0, 20000);
  } catch { return (document.body?.innerText || "").slice(0,20000); }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === 'GET_PAGE_TEXT') {
    try { sendResponse({ ok: true, text: pageText() }); }
    catch(e){ sendResponse({ ok: false, error: e.message }); }
  }
  if (msg?.type === 'GET_PAGE_TEXT_MIN') {
    try { sendResponse({ ok: true, sample: (document.body?.innerText || "").slice(0,200) }); }
    catch(e){ sendResponse({ ok: false, error: e.message }); }
  }
  return true;
});
