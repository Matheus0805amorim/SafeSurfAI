const $ = (id)=>document.getElementById(id);
const btnAnalyze = $('btnAnalyze'), task = $('task'), lang = $('lang'), txt = $('userText');
const secRes = $('results'), pre = $('raw');
const secSum = $('summarySec'), listSum = $('summaryList');
const secRisk = $('riskSec'), riskLevel = $('riskLevel'), riskSignals = $('riskSignals');
const secEnt = $('entitiesSec'), entList = $('entitiesList');

function resetViews(){
  secRes.classList.add('hidden'); secSum.classList.add('hidden');
  secRisk.classList.add('hidden'); secEnt.classList.add('hidden');
  pre.textContent = ''; listSum.innerHTML = '';
  riskLevel.textContent=''; riskLevel.dataset.level='';
  riskSignals.innerHTML=''; entList.innerHTML='';
}

async function activeTab(){ const [tab]=await chrome.tabs.query({active:true,currentWindow:true}); return tab; }
function okUrl(u=""){ return /^https?:\/\//i.test(u); }

$('ping').addEventListener('click', async (e)=>{
  e.preventDefault();
  try{ const r = await chrome.runtime.sendMessage({type:'PING_BG'});
       pre.textContent = 'PING_BG: ' + (r?.ok?'OK':'ERR'); secRes.classList.remove('hidden'); }
  catch(err){ pre.textContent = 'Ping error: ' + err.message; secRes.classList.remove('hidden'); }
});

// >>> Ajuste: este botão SEMPRE roda análise de página
btnAnalyze.addEventListener('click', async ()=>{
  await runAnalyze();
});

async function runAnalyze(){
  resetViews();
  try{
    const tab = await activeTab();
    if(!tab || !okUrl(tab.url)){
      pre.textContent='Abra uma página HTTP/HTTPS e recarregue (chrome:// e Web Store não funcionam).';
      secRes.classList.remove('hidden'); return;
    }
    const res = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_TEXT' });
    if(!res?.ok) throw new Error(res?.error || 'Cannot read page text');

    const ai = await chrome.runtime.sendMessage({ type:'SAFESURF_TASK', kind:'analyze', payload:{ text: res.text }});
    if(!ai?.ok) throw new Error(ai?.error || 'AI error');

    let parsed=null; try{ parsed = JSON.parse(ai.raw); }catch{}
    if(!parsed){ pre.textContent = ai.raw; secRes.classList.remove('hidden'); return; }

    (parsed.summary||[]).forEach(b=>{ const li=document.createElement('li'); li.textContent=b; listSum.appendChild(li); });
    secSum.classList.remove('hidden');

    riskLevel.textContent = parsed?.risk?.level || 'UNKNOWN';
    riskLevel.dataset.level = parsed?.risk?.level || '';
    (parsed?.risk?.signals||[]).forEach(s=>{ const li=document.createElement('li'); li.textContent=s; riskSignals.appendChild(li); });
    secRisk.classList.remove('hidden');

    (parsed.entities||[]).forEach(e=>{ const li=document.createElement('li'); li.textContent=e; entList.appendChild(li); });
    secEnt.classList.remove('hidden');
  }catch(err){
    pre.textContent = 'Analyze error: ' + err.message; secRes.classList.remove('hidden');
  }
}

// Tarefas de texto: use Ctrl+Enter no campo
txt.addEventListener('keydown', (ev)=>{
  if(ev.key==='Enter' && (ev.ctrlKey||ev.metaKey)){ runSimple(task.value); }
});

async function runSimple(kind){
  resetViews();
  try{
    let text = txt.value.trim();
    if(!text){
      const tab = await activeTab();
      if(tab && okUrl(tab.url)){
        const sel = await chrome.tabs.sendMessage(tab.id, { type: 'GET_SELECTED_TEXT' });
        if(sel?.ok && sel.text) text = sel.text.trim();
      }
    }
    if(!text) throw new Error('Provide text in the box (ou selecione um texto na página).');

    const payload = { text };
    if(kind==='translate') payload.targetLang = (lang.value.trim() || 'en');
    const ai = await chrome.runtime.sendMessage({ type:'SAFESURF_TASK', kind, payload });
    if(!ai?.ok) throw new Error(ai?.error || 'AI error');
    pre.textContent = ai.raw; secRes.classList.remove('hidden');
  }catch(err){
    pre.textContent = 'Task error: ' + err.message; secRes.classList.remove('hidden');
  }
}
