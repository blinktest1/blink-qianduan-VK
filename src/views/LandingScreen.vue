<template>
  <section class="screen s-landing">
    <!-- Lang switcher -->
    <div class="lang-switcher">
      <button
        id="langEN" class="lang-btn"
        :class="{ active: store.lang === 'en' }"
        @click="store.setLang('en')"
      >EN</button>
      <button
        id="langRU" class="lang-btn"
        :class="{ active: store.lang === 'ru' }"
        @click="store.setLang('ru')"
      >RU</button>
      <button
        id="langZH" class="lang-btn"
        :class="{ active: store.lang === 'zh' }"
        @click="store.setLang('zh')"
      >ZH</button>
    </div>

    <div class="land-brand">Blink · Emotional MBTI</div>

    <!-- Geometric orb -->
    <div class="geo-wrap">
      <div class="geo-halo"></div>
      <div class="geo-glow pulse-el" style="--d:5s;--lo:.25;--hi:.55;"></div>
      <svg viewBox="0 0 240 240" fill="none" style="position:absolute;inset:0;width:100%;height:100%;z-index:3;overflow:visible;">
        <defs>
          <filter id="glow-violet" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-platinum" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="1.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <g class="spin-cw" style="--dur:28s;">
          <circle cx="120" cy="120" r="110" stroke="rgba(255,255,255,0.05)" stroke-width="0.75" stroke-dasharray="3 8"/>
        </g>
        <g class="spin-ccw" style="--dur:20s;" filter="url(#glow-violet)">
          <polygon points="120,22 198,158 42,158" stroke="rgba(120,80,220,0.28)" stroke-width="1" fill="none"/>
          <polygon points="120,218 42,82 198,82" stroke="rgba(120,80,220,0.28)" stroke-width="1" fill="none"/>
          <circle cx="120" cy="120" r="72" stroke="rgba(120,80,220,0.10)" stroke-width="0.75" fill="none"/>
        </g>
        <g class="spin-cw" style="--dur:12s;">
          <circle cx="120" cy="120" r="38" stroke="rgba(110,70,210,0.23)" stroke-width="1" fill="none"/>
        </g>
        <g filter="url(#glow-platinum)">
          <circle cx="120" cy="120" r="10" fill="rgba(120,80,220,0.10)" stroke="rgba(200,180,255,0.5)" stroke-width="1" class="pulse-el" style="--d:3.5s;--lo:.4;--hi:.9;--dl:0s;"/>
          <circle cx="120" cy="120" r="3.5" fill="rgba(220,210,255,0.95)" class="core-breathe"/>
        </g>
      </svg>
    </div>

    <h1 class="land-title">{{ t('landing.title1') }}<br><span>{{ t('landing.title2') }}</span></h1>

    <div class="z1 mt-8" style="width:100%;">
      <button class="btn-primary" @click="store.go('s-info')">{{ t('landing.button') }}</button>
      <div class="land-pills">
        <div class="land-pill">{{ t('landing.pill1') }}</div>
        <div class="land-pill">{{ t('landing.pill2') }}</div>
        <div class="land-pill">{{ t('landing.pill3') }}</div>
      </div>
      <div class="result-cta-hint" style="margin-top:14px;">
        <span>{{ socialProof.toLocaleString() }}</span> {{ t('landing.socialProof') }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useI18n } from '@/composables/useI18n'

const store = useAppStore()
const { t } = useI18n()
const socialProof = ref(180000 + Math.floor(Math.random() * 40000))
</script>

<style scoped>
.s-landing {
  align-items: center;
  padding: 40px 24px 0;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: var(--vk-viewport-height, 100vh);
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  animation: screenIn .3s cubic-bezier(.16,1,.3,1);
}
.land-brand {
  font-family: var(--f-sans); font-size: 11px; font-weight: 600;
  letter-spacing: 0.2em; color: rgba(120,80,220,0.38); text-transform: uppercase;
  margin-bottom: 44px; position: relative; z-index: 1;
  animation: fadeUp .7s .1s both;
}
.geo-wrap {
  position: relative; width: 220px; height: 220px; margin-bottom: 48px;
  z-index: 1; flex-shrink: 0; overflow: visible; animation: fadeUp .8s .2s both;
}
.geo-halo {
  position: absolute; width: 440px; height: 440px; top: 50%; left: 50%;
  transform: translate(-50%,-50%); border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, rgba(60,40,120,0.08) 0%, rgba(40,20,80,0.03) 40%, transparent 68%);
  filter: blur(72px); pointer-events: none; z-index: 0;
  animation: breathe 8s ease-in-out infinite; --lo:.5; --hi:.85;
}
.geo-glow {
  position: absolute; inset: 26%; border-radius: 50%;
  background: radial-gradient(circle, rgba(60,40,120,0.1) 0%, rgba(40,20,80,0.04) 55%, transparent 72%);
  filter: blur(22px); z-index: 2; pointer-events: none;
}
.land-title {
  font-family: var(--f-sans); font-size: 30px; font-weight: 900;
  text-align: center; line-height: 1.12; letter-spacing: -0.035em;
  margin-bottom: 40px; position: relative; z-index: 1; animation: fadeUp .7s .35s both;
}
.land-title span { color: #A78BFA; }
.land-pills {
  display: flex; gap: 8px; justify-content: center;
  margin-top: 16px; flex-wrap: wrap;
}
.land-pill {
  padding: 7px 14px; border-radius: 999px;
  border: 1px solid rgba(110,70,210,0.25); background: rgba(120,80,220,0.06);
  font-family: var(--f-mono); font-size: 11px;
  color: rgba(196,181,253,0.7); letter-spacing: .04em; white-space: nowrap;
}
.lang-switcher {
  position: absolute; top: 20px; right: 20px; z-index: 10;
  display: flex; gap: 4px; background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 3px;
}
.lang-btn {
  padding: 5px 12px; border-radius: 7px; border: none;
  background: transparent; color: rgba(255,255,255,0.38);
  font-family: var(--f-mono); font-size: 11px; font-weight: 700;
  letter-spacing: .06em; cursor: pointer; transition: all .18s;
}
.lang-btn.active { background: rgba(255,255,255,0.08); color: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.3); }
.result-cta-hint { font-size: 12px; color: rgba(255,255,255,0.28); text-align: center; font-family: var(--f-mono); }

.spin-cw  { animation: spinCW  var(--dur,20s) linear infinite; transform-origin: 50% 50%; }
.spin-ccw { animation: spinCCW var(--dur,15s) linear infinite; transform-origin: 50% 50%; }
.pulse-el { animation: breathe var(--d,3s) ease-in-out infinite var(--dl,0s); }
.core-breathe { transform-origin: 120px 120px; animation: corePulse 3.5s cubic-bezier(.45,0,.55,1) infinite; }
</style>
