<template>
  <section class="screen s-loading">
    <div class="pulse-ring" v-for="i in 3" :key="i"></div>

    <div class="loading-geo">
      <svg viewBox="0 0 180 180" fill="none">
        <g class="spin-cw"  style="--dur:18s;"><circle cx="90" cy="90" r="82" stroke="rgba(139,92,246,0.3)" stroke-width="1" stroke-dasharray="3 6"/></g>
        <g class="spin-ccw" style="--dur:12s;">
          <polygon points="90,14 152,122 28,122" stroke="rgba(180,80,130,0.30)" stroke-width="1.5" fill="none"/>
          <polygon points="90,166 28,58 152,58"  stroke="rgba(180,80,130,0.30)" stroke-width="1.5" fill="none"/>
        </g>
        <g class="spin-cw"  style="--dur:7s;"><circle cx="90" cy="90" r="30" stroke="rgba(212,255,0,0.5)" stroke-width="1.5" fill="none"/></g>
        <circle cx="90" cy="90" r="8" fill="rgba(139,92,246,0.7)" class="pulse-el" style="--d:2s;--lo:.4;--hi:.9;--dl:0s;"/>
        <circle cx="90" cy="90" r="3" fill="rgba(212,255,0,1)"/>
      </svg>
    </div>

    <div class="loading-phase">{{ phase }}</div>

    <div class="loading-bar-wrap">
      <div class="loading-bar-track">
        <div class="loading-bar-fill" :style="{ width: pct + '%' }"></div>
      </div>
      <div class="loading-pct">{{ Math.round(pct) }}%</div>
    </div>

    <div class="load-steps-row">
      <div
        v-for="(step, i) in steps" :key="i"
        class="load-step" :class="{ done: i < doneStep }"
      >{{ step }}</div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useI18n } from '@/composables/useI18n'

const store = useAppStore()
const { t } = useI18n()

const phases = computed(() => [
  t('loading.phase1'),
  t('loading.phase2'),
  t('loading.phase3'),
  t('loading.phase4'),
])
const steps = computed(() => [
  t('loading.step1'),
  t('loading.step2'),
  t('loading.step3'),
  t('loading.step4'),
])

const phase    = ref('')
const pct      = ref(0)
const doneStep = ref(0)

let loadTimer  = null
let phaseTimer = null
let phaseIdx   = 0
let navigated  = false

function navigateToResult() {
  if (navigated) return
  navigated = true
  clearInterval(loadTimer)
  clearInterval(phaseTimer)
  // Small delay for visual smoothness
  pct.value = 100
  setTimeout(() => store.go('s-result'), 400)
}

// Watch for job completion — primary navigation trigger
watch(() => store.profileJobStatus, (status) => {
  if (status === 'completed') {
    // Give the poll handler a moment to populate result data, then navigate
    setTimeout(() => navigateToResult(), 800)
  } else if (status === 'failed') {
    clearInterval(loadTimer)
    clearInterval(phaseTimer)
  }
})

onMounted(() => {
  pct.value = 0
  doneStep.value = 0
  phaseIdx = 0
  phase.value = phases.value[0]
  navigated = false

  phaseTimer = setInterval(() => {
    phaseIdx = (phaseIdx + 1) % phases.value.length
    phase.value = phases.value[phaseIdx]
    
    const status = store.profileJobStatus
    if (status === 'pending') {
      phase.value = phases.value[0]
    } else if (status === 'processing') {
      const analysisPhases = [phases.value[1], phases.value[2], phases.value[3]]
      phase.value = analysisPhases[phaseIdx % analysisPhases.length]
    }
  }, 2000)

  // Start submit — but only if no job is already in progress (e.g., from resumePaidRetest)
  if (!store.profileJobId) {
    store.submitQuizResult().catch(() => {})
  }

  // Progress bar animation
  const startTime = Date.now()
  loadTimer = setInterval(() => {
    const elapsed = Date.now() - startTime
    const status = store.profileJobStatus
    
    // Safety: if we've been loading for >30s and job is done, force navigate
    if (elapsed > 30000 && (status === 'completed' || store.result?.blinkCode)) {
      navigateToResult()
      return
    }
    
    // Safety: if we've been loading for >90s total, something is very wrong
    if (elapsed > 90000) {
      clearInterval(loadTimer)
      clearInterval(phaseTimer)
      // Timeout after 90s — something went very wrong
      console.error('[Blink] Loading timeout after 90s')
      store.go('s-info')
      return
    }

    if (status === 'completed') {
      pct.value = Math.min(100, pct.value + 8)
      if (pct.value >= 100) navigateToResult()
    } else if (status === 'processing') {
      // Calibrated for ~20-30s generation time
      // Fast start (0-40%: first 5s), slow middle (40-75%: next 15s), crawl (75-88%: rest)
      if (pct.value < 40) pct.value += Math.random() * 2.5 + 1.2
      else if (pct.value < 75) pct.value += Math.random() * 0.6 + 0.15
      else if (pct.value < 88) pct.value += Math.random() * 0.15 + 0.03
    } else if (status === 'pending') {
      if (pct.value < 20) pct.value += Math.random() * 4 + 1.5
    } else {
      // null or unknown — gentle crawl
      if (pct.value < 85) pct.value += Math.random() * 1.5 + 0.3
    }
    
    doneStep.value = Math.floor(pct.value / 26)
  }, 80)
})

onUnmounted(() => {
  clearInterval(loadTimer)
  clearInterval(phaseTimer)
})
</script>

<style scoped>
.s-loading {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  min-height: var(--vk-viewport-height, 100vh);
  padding: 40px 24px;
  position: relative; overflow: hidden;
  animation: screenIn .3s cubic-bezier(.16,1,.3,1);
}
.pulse-ring {
  position: absolute; width: 320px; height: 320px;
  border-radius: 50%; border: 1px solid rgba(155,109,255,0.06);
  animation: radarPulse 3s ease-out infinite;
}
.pulse-ring:nth-child(2) { animation-delay: 1s; }
.pulse-ring:nth-child(3) { animation-delay: 2s; }

.loading-geo { width: 140px; height: 140px; position: relative; z-index: 1; margin-bottom: 36px; }
.loading-geo svg { width: 100%; height: 100%; }
.spin-cw  { animation: spinCW  var(--dur,20s) linear infinite; transform-origin: 50% 50%; }
.spin-ccw { animation: spinCCW var(--dur,15s) linear infinite; transform-origin: 50% 50%; }
.pulse-el { animation: breathe var(--d,3s) ease-in-out infinite var(--dl,0s); }

.loading-phase {
  font-family: var(--f-sans); font-size: 15px; font-weight: 500;
  color: rgba(255,255,255,0.55); margin-bottom: 24px;
  text-align: center; min-height: 22px; letter-spacing: -0.01em;
  transition: opacity .3s;
}
.loading-bar-wrap {
  width: 100%; display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
}
.loading-bar-track {
  flex: 1; height: 3px; background: rgba(255,255,255,0.06);
  border-radius: 999px; overflow: hidden;
}
.loading-bar-fill {
  height: 100%; border-radius: 999px;
  background: linear-gradient(90deg,#5B21B6,#9B6DFF,#D4FF00);
  transition: width .3s ease;
}
.loading-pct {
  font-family: var(--f-mono); font-size: 12px; font-weight: 700;
  color: rgba(155,109,255,0.6); letter-spacing: .06em; width: 36px; flex-shrink: 0;
}
.load-steps-row {
  display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;
}
.load-step {
  font-family: var(--f-mono); font-size: 11px; font-weight: 700;
  color: rgba(255,255,255,0.2); letter-spacing: .06em;
  padding: 5px 12px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.03);
  transition: all .4s;
}
.load-step.done {
  color: rgba(155,109,255,0.7); border-color: rgba(155,109,255,0.25);
  background: rgba(155,109,255,0.08);
}
</style>
