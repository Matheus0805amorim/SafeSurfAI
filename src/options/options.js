const $ = (id)=>document.getElementById(id);

function load() {
  chrome.storage.sync.get({ useCloud:false, geminiApiKey:"", modelId:"gemini-1.5-flash-latest" }, (o)=>{
    $('useCloud').checked = !!o.useCloud;
    $('apiKey').value = o.geminiApiKey || "";
    $('modelId').value = o.modelId || "gemini-1.5-flash-latest";
  });
}
$('save').addEventListener('click', ()=>{
  const useCloud = $('useCloud').checked;
  const geminiApiKey = $('apiKey').value.trim();
  const modelId = $('modelId').value;
  chrome.storage.sync.set({ useCloud, geminiApiKey, modelId }, ()=>{
    $('status').textContent = "Saved.";
    setTimeout(()=> $('status').textContent="", 1500);
  });
});
load();
