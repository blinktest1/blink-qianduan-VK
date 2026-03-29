import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useVK } from '@/composables/useVK'

export const API_BASE =
  import.meta.env.VITE_API_BASE || 'https://blink-vk-backend-production.up.railway.app'
export const VK_APP_URL = 'https://vk.com/app{YOUR_APP_ID}'

let _authHeader = {}
function _sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

export async function apiCall(method, path, body = null, { retries = 1 } = {}) {
  const opts = { method, headers: { ..._authHeader } }
  if (body !== null) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  let lastErr
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetch(`${API_BASE}${path}`, opts)
    } catch (e) {
      lastErr = e
      if (attempt < retries) await _sleep(600 * (attempt + 1))
    }
  }
  throw lastErr
}

export const useAppStore = defineStore('app', () => {
  const { userId, detectedLang, authHeader, refUserId, haptic, shareUrl: vkShare, openPayForm, showOrderBox } = useVK()
  _authHeader = authHeader

  const currentScreen = ref('s-landing')
  const screenHistory = ref(['s-landing'])
  const ROOT_SCREENS  = new Set(['s-landing', 's-result', 's-dual', 's-trace'])

  function go(id) {
    currentScreen.value = id
    if (!ROOT_SCREENS.has(id)) screenHistory.value.push(id)
    else screenHistory.value = [id]
    window.scrollTo(0, 0)
  }
  function goBack() {
    const hist = screenHistory.value
    if (hist.length > 1) { hist.pop(); currentScreen.value = hist[hist.length - 1] }
  }
  const navVisible = computed(() => {
    const hidden = new Set(['s-landing', 's-info', 's-emotion', 's-quiz', 's-loading'])
    return !hidden.has(currentScreen.value)
  })
  const activeNav = computed(() => {
    const s = currentScreen.value
    if (s === 's-result' || s === 's-detail') return 'me'
    if (s === 's-dual' || s === 's-report' || s === 's-qm-result') return 'dual'
    if (s === 's-trace') return 'trace'
    return null
  })

  const user = ref({ vkUserId: userId, lang: detectedLang })
  function setLang(l) {
    if (!['en', 'ru', 'zh', 'id'].includes(l)) return
    user.value.lang = l
    try { localStorage.setItem('blink_lang', l) } catch {}
    apiCall('POST', '/api/user/set-lang', { lang: l }).catch(() => {})
  }
  try {
    const saved = localStorage.getItem('blink_lang')
    if (['en','ru','zh','id'].includes(saved)) user.value.lang = saved
  } catch {}

  const profile = ref({ gender: null, birthYear: 2000, zodiac: null, relHistory: 0, currentStatus: null, emotion: null, quizAnswers: [], quizIdx: 0 })
  const result = ref({ mbti: null, attachment: null, poeticName: null, lovePersona: null, lovePersonaSub: null, archetype: null, monologue: null, blinkCode: null, profileData: null, freeSubmitsUsed: 0, freeCompatCredits: 0 })
  const compat = ref({ codeA: '', codeB: '', reportId: null, report: null })
  const quickMatchReport = ref(null)
  const trace = ref({ today: null, recent: [], streakDays: 0, patternHint: '' })
  const history = ref({ data: [] })

  const lang = computed(() => user.value.lang)
  const gender = computed({ get: () => profile.value.gender, set: v => { profile.value.gender = v } })
  const birthYear = computed({ get: () => profile.value.birthYear, set: v => { profile.value.birthYear = v } })
  const zodiac = computed({ get: () => profile.value.zodiac, set: v => { profile.value.zodiac = v } })
  const relHistory = computed({ get: () => profile.value.relHistory, set: v => { profile.value.relHistory = v } })
  const currentStatus = computed({ get: () => profile.value.currentStatus, set: v => { profile.value.currentStatus = v } })
  const emotion = computed({ get: () => profile.value.emotion, set: v => { profile.value.emotion = v } })
  const quizAnswers = computed({ get: () => profile.value.quizAnswers, set: v => { profile.value.quizAnswers = v } })
  const quizIdx = computed({ get: () => profile.value.quizIdx, set: v => { profile.value.quizIdx = v } })
  const mbti = computed(() => result.value.mbti)
  const attachment = computed(() => result.value.attachment)
  const poeticName = computed(() => result.value.poeticName)
  const lovePersona = computed(() => result.value.lovePersona)
  const lovePersonaSub = computed(() => result.value.lovePersonaSub)
  const archetype = computed(() => result.value.archetype)
  const blinkCode = computed(() => result.value.blinkCode)
  const monologue = computed(() => result.value.monologue)
  const profileData = computed(() => result.value.profileData)
  const freeSubmitsUsed = computed(() => result.value.freeSubmitsUsed)
  const freeCompatCredits = computed(() => result.value.freeCompatCredits)
  const compatCodeA = computed({ get: () => compat.value.codeA, set: v => { compat.value.codeA = v } })
  const compatCodeB = computed({ get: () => compat.value.codeB, set: v => { compat.value.codeB = v } })
  const compatReportId = computed({ get: () => compat.value.reportId, set: v => { compat.value.reportId = v } })
  const compatReport = computed(() => compat.value.report)
  const traceToday = computed(() => trace.value.today)
  const traceRecent = computed(() => trace.value.recent)
  const traceStreakDays = computed(() => trace.value.streakDays)
  const tracePatternHint = computed(() => trace.value.patternHint)
  const historyData = computed(() => history.value.data)
  const pendingReportBanner = ref(false)

  function _applyInitPayload(d) {
    if (d.lang && ['en','ru','zh','id'].includes(d.lang)) { user.value.lang = d.lang; try { localStorage.setItem('blink_lang', d.lang) } catch {} }
    if (!d.blink_code) return false
    result.value.blinkCode = d.blink_code; result.value.mbti = d.mbti; result.value.attachment = (d.attachment||'').toLowerCase(); result.value.poeticName = d.poetic_name
    result.value.lovePersona = d.love_persona||null; result.value.lovePersonaSub = d.love_persona_sub||null; result.value.archetype = d.archetype||null; result.value.monologue = d.monologue
    result.value.profileData = d.profile; result.value.freeSubmitsUsed = d.free_submits_used??0; result.value.freeCompatCredits = d.free_compat_credits??0
    profile.value.gender = d.gender; profile.value.currentStatus = d.current_status
    if (d.pending_report_id) { compat.value.reportId = d.pending_report_id; compat.value.codeA = d.pending_code_a||''; compat.value.codeB = d.pending_code_b||''; pendingReportBanner.value = true }
    return true
  }
  async function refreshLatestProfile() { const res = await apiCall('POST','/api/user/init',{ref:refUserId,lang:user.value.lang}); if(!res.ok) throw new Error('refresh failed'); const d = await res.json(); _applyInitPayload(d); return d }
  async function initAppState() { try { const d = await refreshLatestProfile(); if(d.blink_code){ if(consumePendingDual()){go('s-dual');return}; go('s-result'); return } } catch(e){ console.warn('[Blink VK] initAppState failed:',e.message) }; go('s-landing') }

  let _submitting = false; const profileJobId = ref(null); const profileJobStatus = ref(null); const pendingSubmitPayload = ref(null); const paidRetestGraceUntil = ref(0)
  async function submitQuizResult(po=null){ if(_submitting)return; _submitting=true; try{return await _doSubmitAsync(po)}finally{_submitting=false} }
  async function _doSubmitAsync(po=null){
    const payload=po||{gender:profile.value.gender,birth_year:profile.value.birthYear,zodiac:profile.value.zodiac,rel_history:profile.value.relHistory,current_status:profile.value.currentStatus,emotion:profile.value.emotion,quiz_answers:profile.value.quizAnswers.slice(0,16),lang:user.value.lang}
    if(!payload.gender||!payload.zodiac||!payload.emotion||!payload.current_status){go('s-info');return}
    if(payload.quiz_answers){for(let i=0;i<16;i++){if(payload.quiz_answers[i]==null)payload.quiz_answers[i]=3};payload.quiz_answers=payload.quiz_answers.slice(0,16)}
    if(!payload.quiz_answers||payload.quiz_answers.length<16){go('s-quiz');return}
    try{
      pendingSubmitPayload.value=payload; let res=await apiCall('POST','/api/user/submit-async',payload); let rr=res; let rt=0; const mx=paidRetestGraceUntil.value>0?18:2
      while((rr.status===402||rr.status===429)&&rt<mx){if(rr.status===402){if(!(paidRetestGraceUntil.value>0&&pendingSubmitPayload.value))break;await _sleep(3000);rr=await apiCall('POST','/api/user/submit-async',payload);rt++;continue};if(rr.status===429){await _sleep(3000);rr=await apiCall('POST','/api/user/submit-async',payload);rt++;continue};break}
      if(rr.status===402){try{const ir=await apiCall('POST','/api/user/init',{lang:user.value.lang});if(ir.ok){const id=await ir.json();if(id.has_result&&id.blink_code){_applyInitPayload(id);go('s-result');pendingSubmitPayload.value=null;paidRetestGraceUntil.value=0;return}}}catch{};const e=await rr.json().catch(()=>({}));result.value.freeSubmitsUsed=e.free_submits_used??1;paidRetestGraceUntil.value=0;go('s-paywall');return}
      if(rr.status===429)return; res=rr; if(!res.ok)throw new Error('submit failed '+res.status); const d=await res.json(); profileJobId.value=d.job_id; profileJobStatus.value='pending'; _pollProfileJob()
    }catch(e){console.error('[Blink VK] submit-async failed:',e.message);await _doSubmitSync()}
  }
  let _pollTimer=null,_pollAttempts=0
  function _pollProfileJob(){_pollAttempts=0;_pollTimer=setInterval(async()=>{if(++_pollAttempts>60){clearInterval(_pollTimer);profileJobStatus.value='failed';go('s-info');return};try{const res=await apiCall('GET',`/api/user/job-status?job_id=${profileJobId.value}`);if(!res.ok)return;const d=await res.json();profileJobStatus.value=d.status;if(d.status==='completed'&&d.result){clearInterval(_pollTimer);pendingSubmitPayload.value=null;paidRetestGraceUntil.value=0;result.value.blinkCode=d.result.blink_code||'';result.value.mbti=d.result.mbti||'';result.value.attachment=(d.result.attachment||'').toLowerCase();result.value.poeticName=d.result.poetic_name||'';result.value.lovePersona=d.result.love_persona||null;result.value.lovePersonaSub=d.result.love_persona_sub||null;result.value.archetype=null;result.value.monologue=d.result.monologue||'';result.value.profileData=d.result.profile||null;if(!consumePendingDual()){setTimeout(()=>{if(currentScreen.value==='s-loading')go('s-result')},1000)}else{go('s-dual')}}else if(d.status==='failed'){clearInterval(_pollTimer);go('s-info')}}catch(e){console.warn('[Blink VK] Poll error:',e.message)}},3000)}
  async function _doSubmitSync(){const p={gender:profile.value.gender,birth_year:profile.value.birthYear,zodiac:profile.value.zodiac,rel_history:profile.value.relHistory,current_status:profile.value.currentStatus,emotion:profile.value.emotion,quiz_answers:profile.value.quizAnswers.slice(0,16),lang:user.value.lang};if(p.quiz_answers){for(let i=0;i<16;i++){if(p.quiz_answers[i]==null)p.quiz_answers[i]=3};p.quiz_answers=p.quiz_answers.slice(0,16)};if(!p.gender||!p.zodiac||!p.emotion||!p.current_status||!p.quiz_answers||p.quiz_answers.length<16){go('s-info');return};try{const res=await apiCall('POST','/api/user/submit',p);if(res.status===402){const e=await res.json().catch(()=>({}));result.value.freeSubmitsUsed=e.free_submits_used??2;go('s-paywall');return};if(!res.ok)throw new Error('fail');const d=await res.json();result.value.blinkCode=d.blink_code;result.value.mbti=d.mbti;result.value.attachment=(d.attachment||'').toLowerCase();result.value.poeticName=d.poetic_name;result.value.lovePersona=d.love_persona||null;result.value.lovePersonaSub=d.love_persona_sub||null;result.value.archetype=d.archetype||null;result.value.monologue=d.monologue;result.value.profileData=d.profile}catch(e){go('s-info');return};if(consumePendingDual()){go('s-dual');return};setTimeout(()=>go('s-result'),600)}

  async function loadHistory(){if(history.value.data?.length)return;try{const r=await apiCall('GET','/api/compat/history');if(!r.ok)return;history.value.data=(await r.json()).history||[]}catch{}}
  async function openHistoryReport(id){try{const r=await apiCall('GET',`/api/compat/status/${id}`);const d=await r.json();if(d.report){compat.value.report=d.report;go('s-report')}}catch{}}
  async function createCompatInvoice(){const r=await apiCall('POST','/api/compat/invoice',{code_a:compat.value.codeA,code_b:compat.value.codeB});if(!r.ok)throw new Error('invoice error');const d=await r.json();if(typeof d.credits_remaining==='number')result.value.freeCompatCredits=d.credits_remaining;return d}
  async function retryCompat(){const r=await apiCall('POST','/api/compat/retry',{report_id:compat.value.reportId});if(!r.ok)throw new Error('retry failed')}
  async function tryRecoverCompatReport(rid){const r=await apiCall('GET',`/api/compat/status/${rid}`);if(!r.ok)return false;const d=await r.json();if(d.status==='done'&&d.report){compat.value.report=d.report;return true};if(d.status==='generating'||d.status==='pending')return true;return false}
  function pollCompatReport(onDone,onError){let att=0,rdy=false,rd=null;const st=Date.now(),MW=8000;const tm=setInterval(async()=>{if(++att>40){stp();onError('Taking longer than expected.');return};if(rdy){if(Date.now()-st>=MW){stp();compat.value.report=rd;onDone()};return};try{const r=await apiCall('GET',`/api/compat/status/${compat.value.reportId}`);if(!r.ok)return;const d=await r.json();if(d.status==='done'){rdy=true;rd=d.report;if(Date.now()-st>=MW){stp();compat.value.report=d.report;onDone()}}else if(d.status==='failed'){stp();onError('Analysis failed. Tap retry.')}}catch(e){console.warn('[Blink VK] poll:',e.message)}},3000);const sf=setTimeout(async()=>{if(rdy)return;try{const r=await apiCall('GET',`/api/compat/status/${compat.value.reportId}`);if(!r.ok)return;const d=await r.json();if(d.status==='done'&&d.report){stp();compat.value.report=d.report;onDone()}}catch{}},60000);function stp(){clearInterval(tm);clearTimeout(sf)};return stp}
  async function lookupCode(code){const r=await apiCall('GET',`/api/user/lookup?code=${code}`);return{ok:r.ok,status:r.status,data:r.ok?await r.json():null}}
  async function loadTrace(){const r=await apiCall('GET','/api/user/trace');if(!r.ok)throw new Error('trace load failed');const d=await r.json();trace.value.today=d.today||null;trace.value.recent=d.recent||[];trace.value.streakDays=d.streak_days||0;trace.value.patternHint=d.pattern_hint||'';return d}
  async function saveTraceEntry(p){const r=await apiCall('POST','/api/user/trace',p);if(!r.ok)throw new Error('trace save failed');const e=await r.json();await loadTrace();return e}
  async function retestInvoice(){const r=await apiCall('POST','/api/user/retest-invoice',{});if(!r.ok)throw new Error('invoice error');return r.json()}
  async function resumePaidRetest(){if(!pendingSubmitPayload.value)throw new Error('no pending payload');go('s-loading');paidRetestGraceUntil.value=Date.now()+90000;await _sleep(4000);return submitQuizResult(pendingSubmitPayload.value)}
  function resetQuizState(){profile.value.quizAnswers=[];profile.value.quizIdx=0;profile.value.gender=null;profile.value.birthYear=2000;profile.value.zodiac=null;profile.value.relHistory=0;profile.value.currentStatus=null;profile.value.emotion=null;try{localStorage.removeItem('blink_quiz')}catch{};profileJobId.value=null;profileJobStatus.value=null;_submitting=false;if(_pollTimer){clearInterval(_pollTimer);_pollTimer=null}}
  const PENDING_KEY='pending_dual';function setPendingDual(){try{localStorage.setItem(PENDING_KEY,'true')}catch{}};function consumePendingDual(){try{if(localStorage.getItem(PENDING_KEY)!=='true')return false;localStorage.removeItem(PENDING_KEY);return true}catch{return false}}

  // Expose shareUrl as a wrapper around VK share
  function shareUrl(url, text) { vkShare(url, text) }

  return {
    currentScreen,screenHistory,go,goBack,navVisible,activeNav,
    user,profile,result,compat,history,quickMatchReport,
    lang,setLang,gender,birthYear,zodiac,relHistory,currentStatus,emotion,quizAnswers,quizIdx,userId,
    mbti,attachment,poeticName,lovePersona,lovePersonaSub,archetype,blinkCode,monologue,profileData,freeSubmitsUsed,freeCompatCredits,
    compatCodeA,compatCodeB,compatReportId,compatReport,historyData,pendingReportBanner,profileJobId,profileJobStatus,
    initAppState,refreshLatestProfile,submitQuizResult,resumePaidRetest,
    loadHistory,openHistoryReport,createCompatInvoice,retryCompat,tryRecoverCompatReport,pollCompatReport,
    lookupCode,loadTrace,saveTraceEntry,retestInvoice,setPendingDual,resetQuizState,
    traceToday,traceRecent,traceStreakDays,tracePatternHint,
    openPayForm,showOrderBox,shareUrl,
  }
})
