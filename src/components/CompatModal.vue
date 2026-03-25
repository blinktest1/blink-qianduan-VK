<template>
  <Teleport to="body">
    <div class="compat-modal-overlay" :class="{ open: modelValue }" @click.self="$emit('close')">
      <div class="compat-modal">
        <div class="compat-modal-handle"></div>

        <!-- Phase 1: Confirm -->
        <div v-if="phase === 'confirm'" class="cm-phase" id="cmConfirm">
          <div class="cm-title">{{ t('compat.checkCompat') }}</div>
          <div class="cm-pair-row">
            <div class="compat-badge a">{{ codeAShort }}</div>
            <div class="cm-heart">💗</div>
            <div class="compat-badge b">{{ codeBShort }}</div>
          </div>
          <div v-if="poeticA && poeticB" class="cm-poetic-names">
            <span class="cm-poetic-a">{{ poeticA }}</span>
            <span class="cm-sep">×</span>
            <span class="cm-poetic-b">{{ poeticB }}</span>
          </div>
          <p class="cm-desc">{{ t('compat.desc') }}</p>
          <div class="cm-price-row">
            <div class="cm-price-left">
              <div class="cm-price-label">{{ t('compat.readingPrice') }}</div>
              <div class="cm-price-val">{{ t('compat.priceVal') }}</div>
            </div>
            <div class="cm-price-note">{{ t('compat.priceNote') }}</div>
          </div>
          <button class="btn-primary" :disabled="paying" @click="startPayment">
            {{ paying ? '...' : t('compat.unlockBtn') }}
          </button>
          <button class="cm-cancel-btn" @click="$emit('close')">{{ t('compat.maybeLater') }}</button>
        </div>

        <!-- Phase 2: Loading -->
        <div v-if="phase === 'loading'" class="cm-phase cm-loading" id="cmLoading">
          <div class="cm-loading-geo">
            <svg viewBox="0 0 120 120" fill="none" width="80" height="80">
              <g class="spin-cw"  style="--dur:10s;"><circle cx="60" cy="60" r="54" stroke="rgba(139,92,246,0.3)" stroke-width="1" stroke-dasharray="3 6"/></g>
              <g class="spin-ccw" style="--dur:7s;">
                <polygon points="60,10 102,80 18,80" stroke="rgba(180,80,130,0.35)" stroke-width="1" fill="none"/>
                <polygon points="60,110 18,40 102,40" stroke="rgba(180,80,130,0.35)" stroke-width="1" fill="none"/>
              </g>
              <circle cx="60" cy="60" r="6" fill="rgba(139,92,246,0.8)" class="pulse-el" style="--d:2s;--lo:.4;--hi:.9;--dl:0s;"/>
              <circle cx="60" cy="60" r="2.5" fill="rgba(212,255,0,1)"/>
            </svg>
          </div>
          <div class="cm-phase-text">{{ loadPhase }}</div>
          <div class="cm-bar-wrap">
            <div class="cm-bar-track"><div class="cm-bar-fill" :style="{ width: loadPct + '%' }"></div></div>
            <div class="cm-pct">{{ Math.round(loadPct) }}%</div>
          </div>
          <div class="cm-steps">
            <div v-for="(s, i) in cmSteps" :key="i" class="cm-step" :class="stepClass(i)">{{ s }}</div>
          </div>
        </div>

        <!-- Phase 3: Error / Retry -->
        <div v-if="phase === 'retry'" class="cm-phase cm-retry" id="cmRetry">
          <div class="cm-retry-icon">⚠️</div>
          <p class="cm-retry-msg">{{ retryMsg }}</p>
          <button class="btn-primary" @click="retryAnalysis">{{ t('compat.retryBtn') }}</button>
          <button class="cm-cancel-btn" @click="$emit('close')">{{ t('compat.close') }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useAppStore, apiCall } from '@/stores/useAppStore'
import { useVK } from '@/composables/useVK'
import { useI18n } from '@/composables/useI18n'

const props = defineProps({
  modelValue: Boolean,
  poeticA: { type: String, default: '' },
  poeticB: { type: String, default: '' },
})
const emit  = defineEmits(['update:modelValue', 'close', 'done'])

const store = useAppStore()
const { showOrderBox } = useVK()
const { t } = useI18n()

const phase     = ref('confirm')
const loadPct   = ref(0)
const loadPhase = ref('')
const doneStep  = ref(0)
const retryMsg  = ref('')
const paying    = ref(false)
let stopPoll    = null

const loadPhases = computed(() => [
  t('compat.loadPhase1'),
  t('compat.loadPhase2'),
  t('compat.loadPhase3'),
  t('compat.loadPhase4'),
])
const cmSteps = computed(() => [
  t('compat.step1'),
  t('compat.step2'),
  t('compat.step3'),
  t('compat.step4'),
])

const codeAShort = computed(() => store.compatCodeA.slice(6) || '——')
const codeBShort = computed(() => store.compatCodeB.slice(6) || '——')

let loadTimer  = null
let phaseTimer = null
let phaseIdx   = 0

function stepClass(i) {
  if (i < doneStep.value - 1) return 'done'
  if (i === doneStep.value - 1) return 'active'
  return ''
}

watch(() => props.modelValue, (open) => {
  if (!open) return
  phase.value = 'confirm'
})

function startLoadingAnim() {
  phase.value   = 'loading'
  loadPct.value = 0
  doneStep.value = 0
  phaseIdx = 0
  loadPhase.value = loadPhases.value[0]

  phaseTimer = setInterval(() => {
    phaseIdx = (phaseIdx + 1) % loadPhases.value.length
    loadPhase.value = loadPhases.value[phaseIdx]
  }, 2000)

  loadTimer = setInterval(() => {
    // Calibrated for ~25-35s compat generation
    // Fast start (0-35%: first 5s), slow middle (35-70%: next 15s), crawl (70-92%: rest)
    if (loadPct.value < 35) loadPct.value += Math.random() * 2.2 + 1.0
    else if (loadPct.value < 70) loadPct.value += Math.random() * 0.5 + 0.12
    else if (loadPct.value < 92) loadPct.value += Math.random() * 0.12 + 0.02
    loadPct.value = Math.min(96, loadPct.value)
    doneStep.value = Math.floor(loadPct.value / 26)
  }, 80)
}

function stopLoadingAnim() {
  clearInterval(loadTimer)
  clearInterval(phaseTimer)
  loadPct.value = 100
  doneStep.value = 4
}

async function startPayment() {
  if (paying.value) return
  paying.value = true
  try {
    const { report_id, item_name, free_credit_used, already_exists, status } = await store.createCompatInvoice()
    store.compatReportId = report_id

    // Existing report path: recover immediately instead of charging again
    if (already_exists && report_id) {
      startLoadingAnim()
      if (status === 'done') {
        try {
          await store.openHistoryReport(report_id)
          onDone()
          return
        } catch {}
      }
      stopPoll = store.pollCompatReport(onDone, onError)
      return
    }

    // Referral reward path: start generation immediately, no payment UI
    if (free_credit_used) {
      startLoadingAnim()
      stopPoll = store.pollCompatReport(onDone, onError)
      return
    }

    // VK Votes payment via OrderBox (await-based, not callback-based)
    const payResult = await showOrderBox(item_name || 'blink_compat')

    if (payResult && payResult.status) {
      // Payment succeeded — confirm with backend
      try {
        await apiCall('POST', '/api/user/confirm-vk-payment', {
          order_id: payResult.order_id,
          type: 'compat',
        })
      } catch {
        // VK server callback will handle it even if confirm fails
      }
      startLoadingAnim()
      stopPoll?.()
      stopPoll = store.pollCompatReport(onDone, onError)
    } else if (payResult?.cancelled) {
      // User cancelled
      paying.value = false
      emit('close')
    } else {
      // Error — check if report was already started
      try {
        if (store.compatReportId) {
          const recovered = await store.tryRecoverCompatReport(store.compatReportId)
          if (recovered) {
            onDone()
            return
          }
        }
      } catch {}
      onError(t('compat.paymentFailed'))
    }
  } catch {
    onError(t('compat.invoiceError'))
  } finally {
    // Keep the button disabled only until invoice flow hands off or error renders.
    setTimeout(() => { paying.value = false }, 1500)
  }
}

function onDone() {
  stopLoadingAnim()
  setTimeout(() => {
    emit('close')
    emit('done')
  }, 500)
}

function onError(msg) {
  stopLoadingAnim()
  retryMsg.value = msg
  phase.value = 'retry'
}

async function retryAnalysis() {
  try {
    await store.retryCompat()
    startLoadingAnim()
    stopPoll?.()
    stopPoll = store.pollCompatReport(onDone, onError)
  } catch {
    onError(t('compat.retryFailed'))
  }
}

onUnmounted(() => {
  clearInterval(loadTimer)
  clearInterval(phaseTimer)
  stopPoll?.()
})
</script>

<style scoped>
.compat-modal-overlay {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(5,4,12,0.75); backdrop-filter: blur(12px);
  display: flex; align-items: flex-end; justify-content: center;
  opacity: 0; pointer-events: none; transition: opacity .3s;
}
.compat-modal-overlay.open { opacity: 1; pointer-events: all; }
.compat-modal {
  width: 100%; max-width: 430px; background: #12102A;
  border-radius: 28px 28px 0 0; border: 1px solid rgba(255,255,255,0.07);
  padding: 20px 20px calc(28px + env(safe-area-inset-bottom));
  transform: translateY(40px); transition: transform .35s cubic-bezier(.16,1,.3,1);
  display: flex; flex-direction: column; gap: 16px;
}
.compat-modal-overlay.open .compat-modal { transform: translateY(0); }
.compat-modal-handle {
  width: 36px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.12);
  margin: 0 auto 4px;
}
.cm-phase { display: flex; flex-direction: column; gap: 14px; }
.cm-title { font-family: var(--f-sans); font-size: 20px; font-weight: 800; letter-spacing: -0.02em; text-align: center; }
.cm-pair-row { display: flex; align-items: center; justify-content: center; gap: 12px; }
.compat-badge {
  font-family: var(--f-mono); font-size: 13px; font-weight: 700; letter-spacing: .1em;
  padding: 8px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
}
.compat-badge.a { color: var(--c-enfj-light); border-color: rgba(155,109,255,0.25); background: rgba(120,80,220,0.05); }
.compat-badge.b { color: #E8A8C8; border-color: rgba(175,80,125,0.24); }
.cm-heart { font-size: 22px; }
.cm-poetic-names { text-align: center; font-family: var(--f-serif); font-style: italic; font-size: 13px; color: rgba(255,255,255,0.4); }
.cm-sep { margin: 0 6px; color: rgba(255,255,255,0.2); }
.cm-desc { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.6; font-family: var(--f-sans); text-align: center; }
.cm-price-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; }
.cm-price-label { font-family: var(--f-mono); font-size: 9px; color: rgba(255,255,255,0.35); letter-spacing: .15em; text-transform: uppercase; }
.cm-price-val { font-family: var(--f-mono); font-size: 18px; font-weight: 700; color: var(--accent); }
.cm-price-note { font-size: 11px; color: rgba(255,255,255,0.35); font-family: var(--f-sans); }
.cm-cancel-btn { background: none; border: none; color: rgba(255,255,255,0.3); font-size: 13px; font-family: var(--f-sans); cursor: pointer; text-align: center; padding: 8px; }
/* Loading */
.cm-loading { align-items: center; }
.cm-loading-geo { margin-bottom: 8px; }
.cm-phase-text { font-size: 13px; color: rgba(255,255,255,0.5); font-family: var(--f-sans); text-align: center; }
.cm-bar-wrap { width: 100%; display: flex; align-items: center; gap: 10px; }
.cm-bar-track { flex: 1; height: 3px; background: rgba(255,255,255,0.06); border-radius: 999px; overflow: hidden; }
.cm-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg,#5B21B6,#9B6DFF,#D4FF00); transition: width .3s ease; }
.cm-pct { font-family: var(--f-mono); font-size: 11px; color: rgba(155,109,255,0.6); width: 30px; flex-shrink: 0; }
.cm-steps { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
.cm-step { font-family: var(--f-mono); font-size: 10px; color: rgba(255,255,255,0.2); letter-spacing: .06em; padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.06); transition: all .4s; }
.cm-step.done   { color: rgba(155,109,255,0.7); border-color: rgba(155,109,255,0.25); background: rgba(155,109,255,0.08); }
.cm-step.active { color: var(--accent); border-color: rgba(212,255,0,0.3); background: rgba(212,255,0,0.06); }
/* Retry */
.cm-retry { align-items: center; text-align: center; }
.cm-retry-icon { font-size: 32px; }
.cm-retry-msg { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.6; font-family: var(--f-sans); }
/* SVG anims */
.spin-cw  { animation: spinCW  var(--dur,20s) linear infinite; transform-origin: 50% 50%; }
.spin-ccw { animation: spinCCW var(--dur,15s) linear infinite; transform-origin: 50% 50%; }
.pulse-el { animation: breathe var(--d,3s) ease-in-out infinite var(--dl,0s); }
</style>
