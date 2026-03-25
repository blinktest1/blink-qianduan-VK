<template>
  <section class="screen s-info">
    <!-- Pending dual banner -->
    <div v-if="showPendingBanner" class="pending-banner">
      <span style="font-size:16px;">🔮</span>
      <span>{{ t('info.pendingBanner') }}</span>
    </div>

    <div class="page-tag">{{ t('info.pageTag') }}</div>
    <h2 class="page-title">{{ t('info.pageTitle1') }}<br>{{ t('info.pageTitle2') }}</h2>

    <!-- Gender -->
    <div class="field-group" ref="genderRef">
      <div class="field-label">{{ t('info.gender') }}</div>
      <div class="chips-row">
        <div
          v-for="opt in genderOptions" :key="opt.value"
          class="chip" :class="{ sel: store.gender === opt.value }"
          @click="store.gender = opt.value"
        >{{ opt.label }}</div>
      </div>
    </div>

    <!-- Birth year + Zodiac -->
    <div class="field-group">
      <div class="field-label">{{ t('info.birthYearZodiac') }}</div>
      <div class="selects-row" style="margin-bottom:14px;">
        <div class="sel-wrap">
          <select v-model.number="store.birthYear">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
      </div>
      <div class="zodiac-selector" ref="zodiacRef">
        <div
          v-for="sign in zodiacSigns" :key="sign.value"
          class="zodiac-chip" :class="{ sel: store.zodiac === sign.value }"
          @click="store.zodiac = sign.value"
        >
          <span class="z-sym">{{ sign.sym }}</span>
          <span class="z-name">{{ sign.name }}</span>
        </div>
      </div>
    </div>

    <!-- Relationship slider -->
    <div class="field-group">
      <div class="field-label flex-between">
        <span>{{ t('info.pastRelationships') }}</span>
        <span class="rel-label">{{ relLabels[store.relHistory] }}</span>
      </div>
      <div class="slider-wrap">
        <input
          type="range" class="rel-slider"
          min="0" max="3" step="1"
          v-model.number="store.relHistory"
          :style="sliderStyle"
          @input="onSlider"
        />
        <div class="slider-ticks">
          <span>0</span><span>1–2</span><span>3–5</span><span>6+</span>
        </div>
      </div>
    </div>

    <div class="continue-wrap">
      <button class="btn-primary" @click="proceed">{{ t('info.continue') }}</button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useVK } from '@/composables/useVK'
import { useI18n } from '@/composables/useI18n'

const store = useAppStore()
const { haptic } = useVK()
const { t } = useI18n()

// Show banner if user was redirected from Dual screen (pending_dual flow)
const showPendingBanner = ref(false)
try {
  showPendingBanner.value = localStorage.getItem('pending_dual') === 'true'
} catch {}

const genderOptions = computed(() => [
  { value: 'male',   label: t('info.male') },
  { value: 'female', label: t('info.female') },
  { value: 'other',  label: t('info.other') },
])

const years = Array.from({ length: 31 }, (_, i) => 2015 - i)

const ZODIAC_NAMES = {
  aries:       { en: 'Aries',    ru: 'Овен',      zh: '白羊座' },
  taurus:      { en: 'Taurus',   ru: 'Телец',     zh: '金牛座' },
  gemini:      { en: 'Gemini',   ru: 'Близнецы',  zh: '双子座' },
  cancer:      { en: 'Cancer',   ru: 'Рак',       zh: '巨蟹座' },
  leo:         { en: 'Leo',      ru: 'Лев',       zh: '狮子座' },
  virgo:       { en: 'Virgo',    ru: 'Дева',      zh: '处女座' },
  libra:       { en: 'Libra',    ru: 'Весы',      zh: '天秤座' },
  scorpio:     { en: 'Scorpio',  ru: 'Скорпион',  zh: '天蝎座' },
  sagittarius: { en: 'Sagitt.',  ru: 'Стрелец',   zh: '射手座' },
  capricorn:   { en: 'Capric.',  ru: 'Козерог',   zh: '摩羯座' },
  aquarius:    { en: 'Aquarius', ru: 'Водолей',   zh: '水瓶座' },
  pisces:      { en: 'Pisces',   ru: 'Рыбы',      zh: '双鱼座' },
}
const zodiacSigns = computed(() => [
  { value:'aries',       sym:'♈', name: ZODIAC_NAMES.aries[store.lang] || ZODIAC_NAMES.aries.en },
  { value:'taurus',      sym:'♉', name: ZODIAC_NAMES.taurus[store.lang] || ZODIAC_NAMES.taurus.en },
  { value:'gemini',      sym:'♊', name: ZODIAC_NAMES.gemini[store.lang] || ZODIAC_NAMES.gemini.en },
  { value:'cancer',      sym:'♋', name: ZODIAC_NAMES.cancer[store.lang] || ZODIAC_NAMES.cancer.en },
  { value:'leo',         sym:'♌', name: ZODIAC_NAMES.leo[store.lang] || ZODIAC_NAMES.leo.en },
  { value:'virgo',       sym:'♍', name: ZODIAC_NAMES.virgo[store.lang] || ZODIAC_NAMES.virgo.en },
  { value:'libra',       sym:'♎', name: ZODIAC_NAMES.libra[store.lang] || ZODIAC_NAMES.libra.en },
  { value:'scorpio',     sym:'♏', name: ZODIAC_NAMES.scorpio[store.lang] || ZODIAC_NAMES.scorpio.en },
  { value:'sagittarius', sym:'♐', name: ZODIAC_NAMES.sagittarius[store.lang] || ZODIAC_NAMES.sagittarius.en },
  { value:'capricorn',   sym:'♑', name: ZODIAC_NAMES.capricorn[store.lang] || ZODIAC_NAMES.capricorn.en },
  { value:'aquarius',    sym:'♒', name: ZODIAC_NAMES.aquarius[store.lang] || ZODIAC_NAMES.aquarius.en },
  { value:'pisces',      sym:'♓', name: ZODIAC_NAMES.pisces[store.lang] || ZODIAC_NAMES.pisces.en },
])

const relLabels = computed(() => [
  t('info.relNone'),
  t('info.rel12'),
  t('info.rel35'),
  t('info.rel6plus'),
])

const sliderStyle = computed(() => {
  const pct = (store.relHistory / 3) * 100
  return `background: linear-gradient(to right, rgba(212,255,0,0.7) 0%, rgba(212,255,0,0.7) ${pct}%, rgba(255,255,255,0.06) ${pct}%, rgba(255,255,255,0.06) 100%)`
})

function onSlider() {
  haptic('light')
}

// Shake utility
const genderRef = ref(null)
const zodiacRef = ref(null)

function shakeEl(el) {
  if (!el) return
  el.style.animation = 'none'
  void el.offsetWidth
  el.style.animation = 'shake .35s ease'
  setTimeout(() => (el.style.animation = ''), 400)
}

function proceed() {
  if (!store.gender) { shakeEl(genderRef.value); return }
  if (!store.zodiac) { shakeEl(zodiacRef.value); return }
  store.go('s-emotion')
}
</script>

<style scoped>
.s-info {
  display: flex; flex-direction: column;
  min-height: var(--vk-viewport-height, 100vh);
  padding: 32px 20px 0;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  animation: screenIn .3s cubic-bezier(.16,1,.3,1);
}
.continue-wrap {
  margin-top: 24px;
  padding-bottom: 20px;
  position: sticky;
  bottom: calc(16px + env(safe-area-inset-bottom));
  z-index: 10;
}
.field-group { margin-bottom: 36px; }
.selects-row { display: flex; gap: 12px; }

.zodiac-selector { display: grid; grid-template-columns: repeat(6,1fr); gap: 5px; margin-top: 4px; }
.zodiac-chip {
  padding: 7px 4px 6px; border-radius: 9px;
  border: 1px solid rgba(255,255,255,0.09); background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.55); font-size: 10px; font-family: var(--f-mono);
  cursor: pointer; transition: all .16s; text-align: center; line-height: 1.3;
  display: flex; flex-direction: column; align-items: center; gap: 2px;
}
.zodiac-chip .z-sym  { font-size: 13px; }
.zodiac-chip .z-name { font-size: 8px; letter-spacing: .02em; }
.zodiac-chip.sel {
  border-color: rgba(155,109,255,0.6); background: rgba(155,109,255,0.20);
  color: #DDD0FF; font-weight: 700;
}

.rel-label {
  font-family: var(--f-mono); font-size: 13px; font-weight: 700;
  color: rgba(212,255,0,0.85); letter-spacing: .08em;
  padding: 5px 14px; background: rgba(212,255,0,0.08);
  border: 1px solid rgba(212,255,0,0.25); border-radius: 999px;
  min-width: 52px; text-align: center;
}
.slider-wrap { padding: 8px 4px 0; }
.rel-slider {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 4px; border-radius: 999px; outline: none; cursor: pointer;
  margin-bottom: 14px;
}
.rel-slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(212,255,0,0.9);
  box-shadow: 0 0 0 3px rgba(212,255,0,0.15);
  cursor: pointer; transition: transform .15s;
}
.rel-slider::-webkit-slider-thumb:active { transform: scale(1.2); }
.slider-ticks {
  display: flex; justify-content: space-between;
  font-family: var(--f-mono); font-size: 10px; color: rgba(255,255,255,0.3);
  padding: 0 2px;
}

.pending-banner {
  display: flex; align-items: center; gap: 10px;
  margin: 0 0 16px; padding: 10px 14px;
  background: rgba(120,80,220,0.12); border: 1px solid rgba(120,80,220,0.25);
  border-radius: 12px; font-size: 13px; color: rgba(255,255,255,0.75);
  font-family: var(--f-sans); line-height: 1.5;
}
</style>
