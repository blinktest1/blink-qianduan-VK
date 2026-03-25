<template>
  <section class="screen s-emotion">
    <div class="page-tag">{{ t('emotion.pageTag') }}</div>
    <h2 class="page-title">{{ t('emotion.pageTitle1') }}<br>{{ t('emotion.pageTitle2') }}</h2>
    <p class="emotion-subtitle">{{ t('emotion.subtitle') }}</p>

    <div class="emotion-grid">
      <div
        v-for="card in emotions" :key="card.color"
        class="emotion-card" :class="[`color-${card.color}`, { sel: selected === card.color }]"
        @click="select(card)"
      >
        <div class="emotion-emoji">{{ card.emoji }}</div>
        <div class="emotion-title">{{ card.title }}</div>
        <div class="emotion-sub">{{ card.sub }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useI18n } from '@/composables/useI18n'

const store = useAppStore()
const { t } = useI18n()
const selected = ref(null)

const emotions = computed(() => [
  { color:'purple', emoji:'🔮', title: t('emotion.openTitle'),        sub: t('emotion.openSub'),        status:'single',       emotion:'joy' },
  { color:'pink',   emoji:'💘', title: t('emotion.loveTitle'),        sub: t('emotion.loveSub'),        status:'relationship', emotion:'anxiety' },
  { color:'blue',   emoji:'🌫️', title: t('emotion.complicatedTitle'), sub: t('emotion.complicatedSub'), status:'complicated',  emotion:'melancholy' },
  { color:'teal',   emoji:'🌧️', title: t('emotion.healingTitle'),     sub: t('emotion.healingSub'),     status:'casual',       emotion:'numbness' },
])

function select(card) {
  selected.value = card.color
  store.emotion       = card.emotion
  store.currentStatus = card.status
  setTimeout(() => store.go('s-quiz'), 380)
}
</script>

<style scoped>
.s-emotion {
  display: flex; flex-direction: column;
  min-height: var(--vk-viewport-height, 100vh);
  padding: 32px 20px;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  animation: screenIn .3s cubic-bezier(.16,1,.3,1);
}
.emotion-subtitle {
  font-size: 15px; color: rgba(255,255,255,0.45);
  font-family: var(--f-sans); margin-bottom: 28px; line-height: 1.5;
}
.emotion-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}
.emotion-card {
  padding: 22px 18px; border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.04);
  cursor: pointer; transition: all .22s;
  display: flex; flex-direction: column; gap: 6px;
  min-height: 130px;
}
.emotion-card.sel {
  border-color: rgba(155,109,255,0.45);
  background: rgba(155,109,255,0.12);
  transform: scale(1.02);
}
.emotion-card.color-pink.sel   { border-color: rgba(214,116,168,0.45); background: rgba(214,116,168,0.10); }
.emotion-card.color-blue.sel   { border-color: rgba(100,130,220,0.45); background: rgba(100,130,220,0.10); }
.emotion-card.color-teal.sel   { border-color: rgba(80,180,160,0.45);  background: rgba(80,180,160,0.10); }
.emotion-emoji { font-size: 28px; }
.emotion-title { font-size: 14px; font-weight: 700; color: #fff; font-family: var(--f-sans); }
.emotion-sub   { font-size: 12px; color: rgba(255,255,255,0.45); font-family: var(--f-sans); line-height: 1.4; }
</style>
