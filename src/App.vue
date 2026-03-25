<template>
  <div class="app">
    <div class="stars-field" id="stars" ref="starsEl"></div>

    <LandingScreen   v-if="store.currentScreen === 's-landing'" />
    <InfoScreen      v-else-if="store.currentScreen === 's-info'" />
    <EmotionScreen   v-else-if="store.currentScreen === 's-emotion'" />
    <QuizScreen      v-else-if="store.currentScreen === 's-quiz'" />
    <LoadingScreen   v-else-if="store.currentScreen === 's-loading'" />
    <ResultScreen    v-else-if="store.currentScreen === 's-result'" />
    <DetailScreen    v-else-if="store.currentScreen === 's-detail'" />
    <DualScreen      v-else-if="store.currentScreen === 's-dual'" />
    <ReportScreen    v-else-if="store.currentScreen === 's-report'" />
    <QuickMatchScreen  v-else-if="store.currentScreen === 's-qm-result'" />
    <TraceScreen       v-else-if="store.currentScreen === 's-trace'" />
    <PaywallScreen     v-else-if="store.currentScreen === 's-paywall'" />

    <nav class="bnav" :class="{ 'bnav--hidden': !store.navVisible }">
      <button class="bnav-item" :class="{ active: store.activeNav === 'me' }" @click="store.go('s-result')">
        <span class="bnav-icon">👤</span><span class="bnav-lbl">ME</span>
      </button>
      <button class="bnav-item" :class="{ active: store.activeNav === 'dual' }" @click="store.go('s-dual')">
        <span class="bnav-icon">💫</span><span class="bnav-lbl">MATCH</span>
      </button>
      <button class="bnav-item" :class="{ active: store.activeNav === 'trace' }" @click="store.go('s-trace')">
        <span class="bnav-icon">📈</span><span class="bnav-lbl">TRACE</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useVK } from '@/composables/useVK'

import LandingScreen  from '@/views/LandingScreen.vue'
import InfoScreen     from '@/views/InfoScreen.vue'
import EmotionScreen  from '@/views/EmotionScreen.vue'
import QuizScreen     from '@/views/QuizScreen.vue'
import LoadingScreen  from '@/views/LoadingScreen.vue'
import ResultScreen   from '@/views/ResultScreen.vue'
import DetailScreen   from '@/views/DetailScreen.vue'
import DualScreen     from '@/views/DualScreen.vue'
import ReportScreen   from '@/views/ReportScreen.vue'
import QuickMatchScreen from '@/views/QuickMatchScreen.vue'
import TraceScreen    from '@/views/TraceScreen.vue'
import PaywallScreen  from '@/views/PaywallScreen.vue'

const store = useAppStore()
const { setBackHandler } = useVK()
const starsEl = ref(null)

onMounted(() => {
  // Stars background
  if (starsEl.value) {
    for (let i = 0; i < 90; i++) {
      const s = document.createElement('div')
      const sz = Math.random() * 1.8 + 0.6
      s.className = 'star-dot'
      s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${3+Math.random()*5}s;--dl:-${Math.random()*6}s;--lo:${(.06+Math.random()*.15).toFixed(2)};--hi:${(.35+Math.random()*.55).toFixed(2)};`
      starsEl.value.appendChild(s)
    }
  }

  // VK back button handling via Android hardware back / history
  // On VK Mini Apps, Android back triggers history.back()
  // We intercept popstate to navigate our in-app screens
  setBackHandler(() => {
    store.goBack()
  })

  store.initAppState()
})
</script>
