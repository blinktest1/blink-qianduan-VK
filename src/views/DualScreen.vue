<template>
  <section class="screen s-dual">

    <div class="dual-header">
      <div class="page-tag" style="color:rgba(155,109,255,0.8);">{{ t('dual.pageTag') }}</div>
      <h2 class="page-title" style="font-size:32px;margin-bottom:0;">{{ t('dual.pageTitle1') }}<br>{{ t('dual.pageTitle2') }}</h2>
    </div>

    <div class="dual-input-wrap">
      <div class="dual-section-lbl a">{{ t('dual.personA') }}</div>
      <div class="code-input-group">
        <input
          id="codeA"
          class="code-input"
          :class="{ prefilled: store.compatCodeA && store.compatCodeA === store.blinkCode }"
          type="text" maxlength="13"
          placeholder="BLINK-XXXXXX"
          v-model="codeA"
          @input="onInput('a')"
        />
        <span class="fill-mine-tag" @click="fillMine">{{ t('dual.useMine') }}</span>
      </div>
      <div v-if="errorA" class="code-error-msg">{{ errorA }}</div>
    </div>

    <div class="dual-input-wrap" style="padding-top:0;">
      <div class="dual-divider-row">
        <div class="dual-divider-line"></div>
        <button class="dual-swap-btn" @click="swap">⇅</button>
        <div class="dual-divider-line"></div>
      </div>
    </div>

    <div class="dual-input-wrap" style="padding-top:0;">
      <div class="dual-section-lbl b">{{ t('dual.personB') }}</div>
      <div class="code-input-group">
        <input
          id="codeB"
          class="code-input b-inp"
          type="text" maxlength="13"
          placeholder="BLINK-XXXXXX"
          v-model="codeB"
          @input="onInput('b')"
        />
      </div>
      <div v-if="errorB" class="code-error-msg">{{ errorB }}</div>
    </div>

    <div class="dual-input-wrap" style="padding-top:0;">
      <div class="qm-toggle" @click="qmOpen = !qmOpen">
        <span class="qm-toggle-text">{{ t('dual.quickMatchToggle') }}</span>
        <span class="qm-toggle-arrow" :class="{ open: qmOpen }">▼</span>
      </div>
      <div class="qm-panel" :class="{ open: qmOpen }">
        <div class="qm-inner">
          <div class="qm-field">
            <div class="qm-field-label"><span class="qm-req">* </span>{{ t('dual.qmRelationship') }}</div>
            <select class="qm-select" v-model="qmRelation">
              <option value="">{{ t('dual.qmSelectRelation') }}</option>
              <option value="friends">{{ t('dual.qmFriends') }}</option>
              <option value="flirting">{{ t('dual.qmFlirting') }}</option>
              <option value="dating">{{ t('dual.qmDating') }}</option>
              <option value="ex">{{ t('dual.qmEx') }}</option>
            </select>
          </div>
          <div class="qm-field">
            <div class="qm-field-label">{{ t('dual.qmMbti') }}</div>
            <select class="qm-select" v-model="qmMbti">
              <option value="">{{ t('dual.qmSelectMbti') }}</option>
              <option v-for="type in mbtiTypes" :key="type" :value="type">{{ type }}</option>
              <option value="unknown">{{ t('dual.qmDontKnow') }}</option>
            </select>
          </div>
          <div class="qm-row">
            <div class="qm-field" style="flex:1;">
              <div class="qm-field-label">{{ t('dual.qmAge') }}</div>
              <select class="qm-select" v-model="qmAge">
                <option value="">{{ t('dual.qmSelectAge') }}</option>
                <option v-for="age in ageRanges" :key="age" :value="age">{{ age }}</option>
              </select>
            </div>
            <div class="qm-field" style="flex:1;">
              <div class="qm-field-label">{{ t('dual.qmZodiac') }}</div>
              <select class="qm-select" v-model="qmZodiac">
                <option value="">{{ t('dual.qmSelectZodiac') }}</option>
                <option v-for="z in zodiacSigns" :key="z.value" :value="z.value">{{ z.sym }} {{ z.name }}</option>
              </select>
            </div>
          </div>
          <div class="qm-field">
            <div class="qm-field-label">{{ t('dual.qmDescribe') }}</div>
            <textarea class="qm-textarea" v-model="qmDesc" :maxlength="qmCharLimit" :placeholder="t('dual.qmDescPlaceholder')" rows="3"></textarea>
            <div class="qm-char-count">{{ qmDesc.length }} / {{ qmCharLimit }}</div>
          </div>
          <button class="btn-primary" :disabled="!qmCanSubmit || qmLoading" @click="submitQuickMatch">
            {{ qmLoading ? '...' : t('dual.qmSubmit') }}
          </button>
          <div class="qm-hint">{{ t('dual.qmHint') }}</div>
        </div>
      </div>
    </div>

    <div v-if="payError" class="dual-pay-error" style="margin:0 20px 12px;font-size:13px;color:rgba(214,100,100,0.8);font-family:var(--f-sans);">{{ payError }}</div>

    <div class="dual-cta-wrap">
      <div v-if="store.freeCompatCredits > 0" class="free-compat-badge">
        {{ store.freeCompatCredits }} {{ store.freeCompatCredits > 1 ? t('dual.freeReadsAvailablePlural') : t('dual.freeReadsAvailable') }}
      </div>
      <button id="compatBtn" class="btn-primary dual-cta" :disabled="!canCheck" @click="check">{{ store.freeCompatCredits > 0 ? t('dual.useFreeRead') : t('dual.checkCompat') }}</button>
    </div>

    <div class="history-section">
      <div class="history-label">{{ t('dual.pastReadings') }}</div>
      <div class="history-list">
        <div v-if="!store.historyData.length" class="history-empty">{{ t('dual.noReadings') }}</div>
        <div v-for="item in store.historyData" :key="item.report_id" class="history-item" @click="store.openHistoryReport(item.report_id)">
          <div class="history-codes">
            <span class="code-a">{{ item.code_a || '—' }}</span>
            <span class="sep">×</span>
            <span class="code-b">{{ item.code_b || '—' }}</span>
          </div>
          <div class="history-score">{{ item.compat_score || '—' }}%</div>
        </div>
      </div>
    </div>

  </section>

  <CompatModal v-model="modalOpen" :poetic-a="poeticA" :poetic-b="poeticB" @close="modalOpen = false" @done="onCompatDone" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore, apiCall } from '@/stores/useAppStore'
import { useI18n } from '@/composables/useI18n'
import CompatModal from '@/components/CompatModal.vue'

const store = useAppStore()
const { t } = useI18n()

const codeA = ref(store.compatCodeA)
const codeB = ref(store.compatCodeB)
const errorA = ref('')
const errorB = ref('')
const payError = ref('')
const modalOpen = ref(false)
const poeticA = ref('')
const poeticB = ref('')

const qmOpen = ref(false)
const qmRelation = ref('')
const qmMbti = ref('')
const qmAge = ref('')
const qmZodiac = ref('')
const qmDesc = ref('')
const qmLoading = ref(false)

const mbtiTypes = ['ENFJ','ENFP','ENTJ','ENTP','ESFJ','ESFP','ESTJ','ESTP','INFJ','INFP','INTJ','INTP','ISFJ','ISFP','ISTJ','ISTP']
const ageRanges = ['15 - 17','18 - 20','21 - 24','25 - 28','29 - 32','33 - 36','37 - 40','41 - 45','46 - 50','50+']
const ZODIAC_NAMES = {
  aries: { en:'Aries', ru:'Овен', zh:'白羊座', id:'Aries' }, taurus:{ en:'Taurus', ru:'Телец', zh:'金牛座', id:'Taurus' },
  gemini:{ en:'Gemini', ru:'Близнецы', zh:'双子座', id:'Gemini' }, cancer:{ en:'Cancer', ru:'Рак', zh:'巨蟹座', id:'Cancer' },
  leo:{ en:'Leo', ru:'Лев', zh:'狮子座', id:'Leo' }, virgo:{ en:'Virgo', ru:'Дева', zh:'处女座', id:'Virgo' },
  libra:{ en:'Libra', ru:'Весы', zh:'天秤座', id:'Libra' }, scorpio:{ en:'Scorpio', ru:'Скорпион', zh:'天蝎座', id:'Scorpio' },
  sagittarius:{ en:'Sagitt.', ru:'Стрелец', zh:'射手座', id:'Sagittarius' }, capricorn:{ en:'Capric.', ru:'Козерог', zh:'摩羯座', id:'Capricorn' },
  aquarius:{ en:'Aquarius', ru:'Водолей', zh:'水瓶座', id:'Aquarius' }, pisces:{ en:'Pisces', ru:'Рыбы', zh:'双鱼座', id:'Pisces' },
}
const zodiacSigns = computed(() => Object.entries(ZODIAC_NAMES).map(([value, names]) => ({
  value,
  sym: { aries:'♈',taurus:'♉',gemini:'♊',cancer:'♋',leo:'♌',virgo:'♍',libra:'♎',scorpio:'♏',sagittarius:'♐',capricorn:'♑',aquarius:'♒',pisces:'♓' }[value],
  name: names[store.lang] || names.en,
})))
const qmCharLimit = computed(() => store.lang === 'zh' ? 50 : store.lang === 'ru' ? 150 : 100)
const qmCanSubmit = computed(() => !!qmRelation.value)

onMounted(() => { store.loadHistory() })

const isValid = (code) => /^BLINK-[A-Z0-9]{6}$/.test(code)
const canCheck = computed(() => isValid(codeA.value) && isValid(codeB.value))

function onInput(side) {
  if (side === 'a') {
    codeA.value = codeA.value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
    store.compatCodeA = codeA.value
    errorA.value = ''
  } else {
    codeB.value = codeB.value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
    store.compatCodeB = codeB.value
    errorB.value = ''
  }
}

function fillMine() {
  if (!store.blinkCode) {
    store.setPendingDual()
    store.go('s-info')
    return
  }
  codeA.value = store.blinkCode
  store.compatCodeA = store.blinkCode
  errorA.value = ''
}

function swap() {
  ;[codeA.value, codeB.value] = [codeB.value, codeA.value]
  store.compatCodeA = codeA.value
  store.compatCodeB = codeB.value
  errorA.value = ''
  errorB.value = ''
}

async function submitQuickMatch() {
  if (!qmCanSubmit.value || qmLoading.value) return
  qmLoading.value = true
  payError.value = ''
  try {
    const payload = {
      relation: qmRelation.value,
      target_mbti: qmMbti.value || null,
      target_age: qmAge.value || null,
      target_zodiac: qmZodiac.value || null,
      description: qmDesc.value || null,
      lang: store.lang,
    }
    const res = await apiCall('POST', '/api/compat/quick-match', payload)
    if (!res.ok) throw new Error('Quick match failed: ' + res.status)
    const data = await res.json()
    store.quickMatchReport = data.report
    store.go('s-qm-result')
  } catch (e) {
    console.error('[Blink] Quick match error:', e.message)
    payError.value = 'Quick match failed, please try again.'
  } finally {
    qmLoading.value = false
  }
}

async function check() {
  payError.value = ''
  if (!isValid(codeA.value)) { errorA.value = t('dual.errorInvalidCode'); return }
  if (!isValid(codeB.value)) { errorB.value = t('dual.errorInvalidCode'); return }
  if (codeA.value === codeB.value) { errorB.value = t('dual.errorSameCode'); return }

  const [resA, resB] = await Promise.all([store.lookupCode(codeA.value), store.lookupCode(codeB.value)])
  if (resA.status === 404) { errorA.value = t('dual.errorNotFound'); return }
  if (resB.status === 404) { errorB.value = t('dual.errorNotFound'); return }
  if (!resA.ok) { errorA.value = t('dual.errorNetwork'); return }
  if (!resB.ok) { errorB.value = t('dual.errorNetwork'); return }

  poeticA.value = resA.data?.poetic_name || ''
  poeticB.value = resB.data?.poetic_name || ''
  modalOpen.value = true
}

function onCompatDone() { store.go('s-report') }
</script>

<style scoped>
.s-dual { display:flex; flex-direction:column; min-height:var(--vk-viewport-height,100vh); padding:0; overflow-y:auto; padding-bottom:calc(80px + env(safe-area-inset-bottom)); animation:screenIn .3s cubic-bezier(.16,1,.3,1); }
.dual-header { padding:32px 20px 24px; }
.dual-input-wrap { padding:0 20px; display:flex; flex-direction:column; gap:6px; margin-bottom:20px; }
.dual-section-lbl { font-size:11px; font-weight:700; color:rgba(255,255,255,0.55); letter-spacing:.1em; text-transform:uppercase; font-family:var(--f-sans); display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.dual-section-lbl::before { content:''; width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.dual-section-lbl.a::before { background:rgba(155,109,255,0.9); box-shadow:0 0 8px rgba(120,80,220,0.7); }
.dual-section-lbl.b::before { background:rgba(214,116,168,0.9); box-shadow:0 0 8px rgba(175,80,125,0.7); }
.dual-divider-row { display:flex; align-items:center; gap:12px; padding:4px 0; }
.dual-divider-line { flex:1; height:1px; background:rgba(255,255,255,0.07); }
.dual-swap-btn { width:32px; height:32px; border-radius:50%; border:1px solid rgba(255,255,255,0.10); background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.55); display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:all .2s; }
.dual-swap-btn:hover { border-color:rgba(255,255,255,0.25); color:rgba(255,255,255,0.85); }
.code-input-group { position:relative; }
.code-input { width:100%; padding:15px 20px; border-radius:16px; border:1px solid rgba(255,255,255,0.14); background:rgba(255,255,255,0.07); color:var(--accent); font-family:var(--f-mono); font-size:16px; font-weight:700; letter-spacing:.12em; outline:none; transition:border-color .2s, box-shadow .2s; }
.code-input::placeholder { color:rgba(212,255,0,.28); }
.code-input:focus { border-color:rgba(212,255,0,.45); box-shadow:0 0 16px rgba(212,255,0,.10); }
.code-input.prefilled { border-color:rgba(212,255,0,.3); background:rgba(212,255,0,.04); }
.code-input.b-inp { color:#E8A8C8; }
.code-input.b-inp::placeholder { color:rgba(214,116,168,0.28); }
.code-input.b-inp:focus { border-color:rgba(214,116,168,0.42); box-shadow:0 0 16px rgba(214,116,168,0.08); }
.fill-mine-tag { position:absolute; right:14px; top:50%; transform:translateY(-50%); font-size:10px; font-weight:700; color:rgba(155,109,255,0.75); font-family:var(--f-sans); background:rgba(120,80,220,0.1); border:1px solid rgba(110,70,210,0.35); padding:3px 10px; border-radius:999px; cursor:pointer; white-space:nowrap; transition:all .2s; }
.fill-mine-tag:hover { color:rgba(196,168,255,0.95); border-color:rgba(155,109,255,0.55); }
.code-error-msg { font-size:12px; color:rgba(220,100,100,0.8); font-family:var(--f-sans); padding-left:4px; }
.dual-cta-wrap { padding:0 20px 40px; }
.free-compat-badge { margin-bottom:12px; padding:10px 14px; border-radius:14px; background:rgba(212,255,0,0.08); border:1px solid rgba(212,255,0,0.25); color:rgba(240,255,180,0.9); font-size:12px; font-weight:600; font-family:var(--f-sans); text-align:center; }
.dual-cta { width:100%; transition:opacity .2s; }
.history-section { padding:0 20px 100px; margin-top:20px; }
.history-label { font-family:var(--f-mono); font-size:10px; font-weight:700; color:rgba(255,255,255,0.45); letter-spacing:.14em; text-transform:uppercase; margin-bottom:12px; display:flex; align-items:center; gap:10px; }
.history-label::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.08); }
.history-list { display:flex; flex-direction:column; gap:8px; }
.history-item { display:flex; align-items:center; justify-content:space-between; padding:13px 16px; border-radius:14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); cursor:pointer; transition:all .18s; gap:10px; }
.history-item:hover { background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.15); }
.history-codes { font-family:var(--f-mono); font-size:12px; color:rgba(255,255,255,0.6); letter-spacing:.04em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; min-width:0; }
.history-codes .code-a { color:rgba(196,176,255,0.9); }
.history-codes .sep { color:rgba(255,255,255,0.3); margin:0 5px; }
.history-codes .code-b { color:rgba(232,168,200,0.9); }
.history-score { font-family:var(--f-mono); font-size:13px; font-weight:700; color:rgba(212,255,0,0.9); flex-shrink:0; background:rgba(212,255,0,0.08); border:1px solid rgba(212,255,0,0.22); padding:4px 10px; border-radius:8px; }
.history-empty { font-size:13px; color:rgba(255,255,255,0.35); text-align:center; padding:24px 0; font-family:var(--f-sans); font-style:italic; line-height:1.5; }
.qm-toggle { display:flex; align-items:center; justify-content:center; gap:8px; padding:14px; border-radius:16px; border:1px dashed rgba(212,255,0,0.22); background:rgba(212,255,0,0.03); cursor:pointer; transition:all .2s; }
.qm-toggle:hover { border-color:rgba(212,255,0,0.4); background:rgba(212,255,0,0.06); }
.qm-toggle-text { font-size:13px; color:rgba(212,255,0,0.7); font-weight:600; font-family:var(--f-sans); }
.qm-toggle-arrow { font-size:11px; color:rgba(212,255,0,0.5); transition:transform .25s; }
.qm-toggle-arrow.open { transform:rotate(180deg); }
.qm-panel { max-height:0; overflow:hidden; transition:max-height .35s ease, opacity .25s ease; opacity:0; }
.qm-panel.open { max-height:800px; opacity:1; }
.qm-inner { padding:16px 0 0; }
.qm-field { margin-bottom:12px; }
.qm-field-label { font-family:var(--f-mono); font-size:9px; font-weight:700; color:rgba(255,255,255,0.35); letter-spacing:.12em; text-transform:uppercase; margin-bottom:6px; }
.qm-req { color:rgba(212,255,0,0.5); }
.qm-select { width:100%; padding:12px 36px 12px 14px; border-radius:14px; border:1px solid rgba(255,255,255,0.10); background:rgba(255,255,255,0.07); color:#F4F2FF; font-family:var(--f-sans); font-size:13px; -webkit-appearance:none; appearance:none; cursor:pointer; outline:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.3)'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; transition:border-color .2s; }
.qm-select option { background:#1E1B35; color:#F4F2FF; }
.qm-select:focus { border-color:rgba(155,109,255,0.4); }
.qm-row { display:flex; gap:8px; }
.qm-textarea { width:100%; padding:11px 14px; border-radius:14px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.04); color:#F4F2FF; font-family:var(--f-sans); font-size:13px; resize:none; outline:none; transition:border-color .2s; }
.qm-textarea::placeholder { color:rgba(255,255,255,0.2); }
.qm-textarea:focus { border-color:rgba(155,109,255,0.4); }
.qm-char-count { font-family:var(--f-mono); font-size:10px; color:rgba(255,255,255,0.2); text-align:right; margin-top:4px; }
.qm-hint { font-size:10px; color:rgba(255,255,255,0.22); text-align:center; margin-top:6px; font-family:var(--f-mono); }
</style>
