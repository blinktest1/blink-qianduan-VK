<template>
  <section class="screen s-qm-result">

    <!-- Hero -->
    <div class="qm-hero">
      <div class="qm-pairing-name">{{ report.pairing_name || '...' }}</div>
      <div class="qm-score-wrap">
        <svg class="qm-score-ring" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="3"/>
          <circle cx="50" cy="50" r="44" fill="none" stroke="url(#qmGrad)" stroke-width="3"
            stroke-linecap="round" :stroke-dasharray="`${(report.compat_score || 50) * 2.76} 276`"
            style="transform:rotate(-90deg);transform-origin:center"/>
          <defs><linearGradient id="qmGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#B8A8F0"/><stop offset="100%" stop-color="#D4FF00"/>
          </linearGradient></defs>
        </svg>
        <div class="qm-score-inner">
          <div class="qm-score-big">{{ report.compat_score || '—' }}</div>
          <div class="qm-score-label">{{ t('qm.score') }}</div>
        </div>
      </div>
    </div>

    <!-- Tags -->
    <div class="qm-tags" v-if="report.tags?.length">
      <span v-for="tag in report.tags" :key="tag" class="qm-tag">{{ tag }}</span>
    </div>

    <!-- Core Energy -->
    <div class="qm-section">
      <div class="qm-section-title">{{ t('qm.coreEnergy') }}</div>
      <p class="qm-text">{{ report.core_energy }}</p>
    </div>

    <!-- Insight -->
    <div class="qm-section">
      <div class="qm-section-title">{{ t('qm.insight') }}</div>
      <p class="qm-text qm-insight">{{ report.insight }}</p>
    </div>

    <!-- Risk -->
    <div class="qm-section">
      <div class="qm-section-title">{{ t('qm.risk') }}</div>
      <p class="qm-text qm-risk">{{ report.risk }}</p>
    </div>

    <!-- CTA -->
    <div class="qm-cta">
      <p class="qm-cta-hint">{{ t('qm.fullReportHint') }}</p>
      <button class="btn-primary" @click="store.go('s-dual')">{{ t('qm.backToMatch') }}</button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useI18n } from '@/composables/useI18n'

const store = useAppStore()
const { t } = useI18n()

const report = computed(() => store.quickMatchReport || {})
</script>

<style scoped>
.s-qm-result {
  display: flex; flex-direction: column;
  min-height: var(--vk-viewport-height, 100vh);
  padding: 32px 20px;
  padding-bottom: calc(100px + env(safe-area-inset-bottom));
  animation: screenIn .3s cubic-bezier(.16,1,.3,1);
}
.qm-hero {
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  margin-bottom: 28px;
}
.qm-pairing-name {
  font-family: var(--f-serif); font-size: 22px; font-weight: 800;
  text-align: center; letter-spacing: -0.02em;
  background: linear-gradient(135deg, #C4B5FD, #D4FF00);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.qm-score-wrap { position: relative; width: 100px; height: 100px; }
.qm-score-ring { width: 100%; height: 100%; }
.qm-score-inner {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}
.qm-score-big { font-family: var(--f-mono); font-size: 28px; font-weight: 900; color: var(--accent); }
.qm-score-label { font-family: var(--f-mono); font-size: 9px; color: rgba(255,255,255,0.35); letter-spacing: .1em; text-transform: uppercase; }

.qm-tags { display: flex; gap: 8px; justify-content: center; margin-bottom: 24px; flex-wrap: wrap; }
.qm-tag {
  font-family: var(--f-mono); font-size: 11px; font-weight: 700;
  color: rgba(155,109,255,0.7); letter-spacing: .06em;
  padding: 5px 14px; border-radius: 999px;
  border: 1px solid rgba(155,109,255,0.2); background: rgba(155,109,255,0.06);
}

.qm-section { margin-bottom: 22px; }
.qm-section-title {
  font-family: var(--f-mono); font-size: 10px; font-weight: 700;
  color: rgba(255,255,255,0.4); letter-spacing: .14em; text-transform: uppercase;
  margin-bottom: 8px;
}
.qm-text {
  font-family: var(--f-sans); font-size: 15px; color: rgba(255,255,255,0.72);
  line-height: 1.7; margin: 0;
}
.qm-insight {
  padding: 14px 16px; border-radius: 16px;
  background: rgba(212,255,0,0.05); border: 1px solid rgba(212,255,0,0.15);
  color: rgba(255,255,255,0.82);
}
.qm-risk {
  padding: 14px 16px; border-radius: 16px;
  background: rgba(214,116,168,0.06); border: 1px solid rgba(214,116,168,0.18);
  color: rgba(255,255,255,0.72);
}

.qm-cta { margin-top: 12px; text-align: center; }
.qm-cta-hint {
  font-size: 12px; color: rgba(255,255,255,0.3); margin-bottom: 14px;
  font-family: var(--f-sans);
}
</style>
