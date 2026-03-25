<template>
  <section class="screen s-report">

    <!-- Hero: duel layout -->
    <div class="report-hero">
      <div class="report-duel-row">
        <div class="report-duel-card a">
          <div class="report-duel-mbti">{{ codeA_mbti }}</div>
          <div class="report-duel-name">{{ codeA_name }}</div>
        </div>
        <div class="report-duel-score">
          <svg class="score-ring" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2.5"/>
            <circle cx="40" cy="40" r="36" fill="none" stroke="url(#scoreGrad)" stroke-width="2.5"
              stroke-linecap="round" :stroke-dasharray="`${compatScore * 2.26} 226`" stroke-dashoffset="0"
              style="transform:rotate(-90deg);transform-origin:center"/>
            <defs><linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#B8A8F0"/><stop offset="100%" stop-color="#D4FF00"/>
            </linearGradient></defs>
          </svg>
          <div class="report-score-inner">
            <div class="report-score-big">{{ compatScore }}</div>
          </div>
        </div>
        <div class="report-duel-card b">
          <div class="report-duel-mbti">{{ codeB_mbti }}</div>
          <div class="report-duel-name">{{ codeB_name }}</div>
        </div>
      </div>

      <!-- UID pill -->
      <div class="report-uid-pill">
        <span class="report-uid-code">{{ store.compatCodeA }} × {{ store.compatCodeB }}</span>
        <span class="report-uid-dot"></span>
        <span class="report-uid-date">{{ reportDate }}</span>
      </div>

      <!-- Pairing name -->
      <div v-if="pairingName" class="report-pairing-name">{{ pairingName }}</div>

      <!-- Gradient bar -->
      <div class="report-bar-wrap">
        <div class="report-bar-fill" :style="{ width: compatScore + '%' }"></div>
      </div>

      <!-- Tags -->
      <div class="report-tags-row">
        <div v-for="tag in tags" :key="tag.label" class="report-tag">
          <span class="report-tag-dot" :class="`report-tag-dot--${tag.color}`"></span>
          {{ tag.label }}
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="report-body">

      <!-- Core energy -->
      <div class="report-section">
        <div class="report-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(120,80,220,0.55)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          {{ t('report.coreEnergy') }}
        </div>
        <p class="report-section-body">{{ coreEnergy }}</p>
      </div>

      <!-- Peak Duration -->
      <div class="report-section peak-section">
        <div class="report-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(120,80,220,0.55)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {{ t('report.peakDuration') }}
        </div>
        <div class="peak-display">
          <div class="peak-number">{{ peakLabel }}</div>
          <div v-if="peakComment" class="peak-comment">{{ peakComment }}</div>
          <div class="peak-percentile">{{ t('report.peakBeats', { pct: peakPercentile }) }}</div>
        </div>
      </div>

      <!-- Compat breakdown -->
      <div class="report-section">
        <div class="report-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(120,80,220,0.55)" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          {{ t('report.compatBreakdown') }}
        </div>
        <div class="report-dims-inner">
          <div v-for="dim in dims" :key="dim.key" class="report-dim-row">
            <span class="report-dim-lbl">{{ dim.label }}</span>
            <div class="report-dim-track"><div class="report-dim-fill" :class="dimFillClass(getDim(dim.key))" :style="{ width: getDim(dim.key) + '%' }"></div></div>
            <span class="report-dim-val" :class="dimValClass(getDim(dim.key))">{{ getDim(dim.key) }}%</span>
          </div>
        </div>
      </div>

      <!-- Growth edges -->
      <div class="report-section">
        <div class="report-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(120,80,220,0.55)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {{ t('report.growthEdges') }}
        </div>
        <div class="scene-cards">
          <div v-for="(edge, i) in growthEdges" :key="i" class="scene-card">
            <div class="scene-label">{{ scenePrefix }} 0{{ i+1 }} · {{ edge.title }}</div>
            <p class="scene-body">{{ edge.trigger }}</p>
            <div class="report-tip">
              <span>→</span><span>{{ edge.suggestion }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Love languages -->
      <div class="report-section">
        <div class="report-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(120,80,220,0.38)" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          {{ t('report.loveLanguages') }}
        </div>
        <div class="report-lang-grid">
          <div class="report-lang-card">
            <div class="report-lang-type txt-infp">{{ codeA_mbti }}</div>
            <div class="report-lang-name">{{ loveLangA.name }}</div>
            <div class="report-lang-sub">{{ loveLangA.sub }}</div>
          </div>
          <div class="report-lang-card">
            <div class="report-lang-type txt-enfj">{{ codeB_mbti }}</div>
            <div class="report-lang-name">{{ loveLangB.name }}</div>
            <div class="report-lang-sub">{{ loveLangB.sub }}</div>
          </div>
        </div>
      </div>

      <!-- Letter -->
      <div class="report-letter" v-html="letter"></div>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useI18n } from '@/composables/useI18n'

const store = useAppStore()
const { t } = useI18n()

const r = computed(() => store.compatReport || {})

const codeA_mbti = computed(() => r.value.mbti_a || 'INFP')
const codeA_name = computed(() => r.value.poetic_a || 'The Grounded Rose')
const codeB_mbti = computed(() => r.value.mbti_b || 'ENFJ')
const codeB_name = computed(() => r.value.poetic_b || 'The Protagonist')
const compatScore = computed(() => r.value.compat_score ?? 88)
const pairingName = computed(() => r.value.pairing_name || '')
const reportDate  = computed(() => {
  const d = r.value.generated_at ? new Date(r.value.generated_at) : new Date()
  return d.toLocaleDateString('en', { month: 'short', year: 'numeric' })
})
const coreEnergy  = computed(() => r.value.core_energy || 'You two are a "still waters run deep" pairing. The magic here is wordless understanding — no explanation needed.')
const letter      = computed(() => {
  const l = r.value.letter || 'You found each other in a sea of noise.<br><br>This is the rare kind. The kind that teaches both of you what you were missing.'
  return l.replace(/\n/g, '<br>')
})
// Tag translations + colors
const TAG_MAP = {
  complementary: { en: 'Complementary', ru: 'Дополняющие',       zh: '互补型',     id: 'Saling Melengkapi', color: 'lime' },
  mirror:        { en: 'Mirror',        ru: 'Зеркальные',        zh: '镜像型',     id: 'Cermin', color: 'lime' },
  'push-pull':   { en: 'Push-Pull',     ru: 'Притяжение-отталкивание', zh: '推拉型', id: 'Tarik-Ulur', color: 'pink' },
  'slow-burn':   { en: 'Slow Burn',     ru: 'Медленное пламя',   zh: '慢热型',     id: 'Perlahan Membara', color: 'purple' },
  intense:       { en: 'Intense',       ru: 'Интенсивные',       zh: '激烈型',     id: 'Intens', color: 'pink' },
  stable:        { en: 'Stable',        ru: 'Стабильные',        zh: '稳定型',     id: 'Stabil', color: 'lime' },
  chaotic:       { en: 'Chaotic',       ru: 'Хаотичные',         zh: '混乱型',     id: 'Kacau', color: 'pink' },
  healing:       { en: 'Healing',       ru: 'Исцеляющие',        zh: '治愈型',     id: 'Menyembuhkan', color: 'lime' },
  challenging:   { en: 'Challenging',   ru: 'Сложные',           zh: '挑战型',     id: 'Menantang', color: 'purple' },
  intellectual:  { en: 'Intellectual',  ru: 'Интеллектуальные',  zh: '智识型',     id: 'Intelektual', color: 'purple' },
  passionate:    { en: 'Passionate',    ru: 'Страстные',         zh: '热烈型',     id: 'Penuh Gairah', color: 'pink' },
  grounding:     { en: 'Grounding',     ru: 'Заземляющие',       zh: '踏实型',     id: 'Membumi', color: 'lime' },
  adventurous:   { en: 'Adventurous',   ru: 'Авантюрные',        zh: '冒险型',     id: 'Petualang', color: 'pink' },
  complicated:   { en: 'Complicated',   ru: 'Непростые',         zh: '复杂型',     id: 'Rumit', color: 'purple' },
}
const COLORS = ['lime', 'pink', 'purple']
const tags = computed(() => {
  const raw = r.value.tags
  if (!raw || !Array.isArray(raw) || raw.length === 0) {
    // Fallback
    return [
      { label: TAG_MAP.complementary[store.lang] || 'Complementary', color: 'lime' },
      { label: TAG_MAP.intense[store.lang] || 'Intense', color: 'pink' },
      { label: TAG_MAP.challenging[store.lang] || 'Challenging', color: 'purple' },
    ]
  }
  return raw.slice(0, 3).map((tag, i) => {
    const key = typeof tag === 'string' ? tag.toLowerCase().trim() : ''
    const mapped = TAG_MAP[key]
    return {
      label: mapped ? (mapped[store.lang] || mapped.en) : tag,
      color: mapped ? mapped.color : COLORS[i % 3],
    }
  })
})
const dims = computed(() => [
  { key: 'chemistry',       label: t('report.dimChemistry') },
  { key: 'emotional_sync',  label: t('report.dimEmotionalSync') },
  { key: 'resonance',       label: t('report.dimResonance') },
  { key: 'synergy',         label: t('report.dimSynergy') },
])
const scenePrefix = computed(() => (store.lang === 'zh' ? '场景' : store.lang === 'ru' ? 'СЦЕНА' : 'SCENE'))
const defaultDims = { chemistry: 75, emotional_sync: 68, resonance: 72, synergy: 70 }
function getDim(key) {
  return r.value[`dim_${key}`] ?? defaultDims[key] ?? 65
}
function dimFillClass(v) {
  if (v >= 75) return 'report-dim-fill--high'
  if (v >= 50) return 'report-dim-fill--mid'
  return 'report-dim-fill--low'
}
function dimValClass(v) {
  if (v >= 75) return 'report-dim-val--high'
  if (v >= 50) return 'report-dim-val--mid'
  return 'report-dim-val--low'
}

// Peak duration
const peakDays = computed(() => r.value.peak_duration_days ?? 42)
const peakPercentile = computed(() => r.value.peak_percentile ?? 60)
const peakComment = computed(() => r.value.peak_comment || '')
const peakLabel = computed(() => {
  const d = peakDays.value
  const lang = store.lang
  if (d >= 36500) return t('report.peakLifetime')
  if (d >= 1095) {
    const y = Math.round(d / 365)
    return lang === 'zh' ? `约${y}年` : lang === 'ru' ? `~${y} лет` : `~${y} years`
  }
  if (d >= 365) {
    const y = Math.round(d / 365 * 10) / 10
    return lang === 'zh' ? `约${y}年` : lang === 'ru' ? `~${y} года` : `~${y} year${y > 1 ? 's' : ''}`
  }
  if (d >= 90) {
    const m = Math.round(d / 30)
    return lang === 'zh' ? `约${m}个月` : lang === 'ru' ? `~${m} мес.` : `~${m} months`
  }
  if (d >= 14) {
    const w = Math.round(d / 7)
    return lang === 'zh' ? `约${w}周` : lang === 'ru' ? `~${w} нед.` : `~${w} weeks`
  }
  if (d >= 4) {
    return lang === 'zh' ? `约${d}天` : lang === 'ru' ? `~${d} дней` : `~${d} days`
  }
  // 1-3 days: dramatic
  return lang === 'zh' ? `${d}天` : lang === 'ru' ? `${d} дн.` : `${d} days`
})
const growthEdges = computed(() => {
  const raw = r.value.growth_edges
  if (raw && Array.isArray(raw) && raw.length > 0) {
    // Ensure each edge has a title (old reports may lack it)
    const defaultTitles = store.lang === 'zh' ? ['沉默', '反馈', '需求'] : store.lang === 'ru' ? ['МОЛЧАНИЕ', 'ОБРАТНАЯ СВЯЗЬ', 'ПОТРЕБНОСТИ'] : ['SILENCE', 'FEEDBACK', 'NEEDS']
    return raw.map((edge, i) => ({
      title: edge.title || defaultTitles[i] || '',
      trigger: edge.trigger || '',
      suggestion: edge.suggestion || '',
    }))
  }
  return [
    { title: 'SILENCE',  trigger: store.lang === 'zh' ? '一方沉默退缩，另一方不断追问——恶性循环。' : store.lang === 'ru' ? 'Один замолкает, другой давит сильнее — замкнутый цикл.' : 'When things get heavy, one goes quiet while the other pushes harder.', suggestion: store.lang === 'zh' ? '先给空间。说："我在这里，你准备好了再聊。"' : store.lang === 'ru' ? 'Дай пространство. Скажи: «Я здесь, когда будешь готов(а)».' : 'Give space first. Say: "I\'ll be here when you\'re ready."' },
    { title: 'FEEDBACK', trigger: store.lang === 'zh' ? '好意的建议被当成批评，然后默默消化好几天。' : store.lang === 'ru' ? 'Обратная связь воспринимается как критика и молча переваривается днями.' : 'Well-intentioned feedback lands as criticism, internalized for days.', suggestion: store.lang === 'zh' ? '用"我注意到……"开头，别用"你总是……"' : store.lang === 'ru' ? 'Начни с «Я заметил(а)…» а не «Ты всегда…»' : 'Lead with "I noticed…" not "You always…"' },
    { title: 'NEEDS',    trigger: store.lang === 'zh' ? '一方期待不说对方也能懂，结果两个人在同一种沉默里失望。' : store.lang === 'ru' ? 'Один ожидает, что его поймут без слов. Оба разочарованы в одной и той же тишине.' : 'One expects to be understood without asking. Both end up disappointed.', suggestion: store.lang === 'zh' ? '练习一句话："我需要的是安静，不是距离。"' : store.lang === 'ru' ? 'Потренируйся: «Мне нужна тишина, а не дистанция».' : 'Practice: "I need quiet time, not distance."' },
  ]
})
const loveLangA = computed(() => {
  const ll = r.value.love_languages?.person_a
  if (ll) return { name: ll, sub: '' }
  return { name: store.lang === 'zh' ? '高质量陪伴' : store.lang === 'ru' ? 'Качественное время' : 'Quality Time', sub: '' }
})
const loveLangB = computed(() => {
  const ll = r.value.love_languages?.person_b
  if (ll) return { name: ll, sub: '' }
  return { name: store.lang === 'zh' ? '肯定的言语' : store.lang === 'ru' ? 'Слова поддержки' : 'Words of Affirmation', sub: '' }
})
</script>

<style scoped>
.s-report {
  display: flex; flex-direction: column;
  min-height: var(--vk-viewport-height, 100vh);
  padding: 0; overflow-y: auto;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}
.report-hero {
  padding: 44px 28px 32px; text-align: center; position: relative;
  border-bottom: 1px solid rgba(255,255,255,0.04); overflow: hidden;
}
.report-hero::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 54% 48% at 20% 50%, rgba(120,80,220,0.06) 0%, transparent 72%),
    radial-gradient(ellipse 54% 48% at 80% 50%, rgba(255,255,255,0.02) 0%, transparent 72%);
}
.report-duel-row { display: flex; align-items: center; justify-content: space-between; gap: 0; margin-bottom: 20px; position: relative; z-index: 1; }
.report-duel-card { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; background: none; border: none; padding: 0; }
.report-duel-mbti { font-family: var(--f-mono); font-size: 28px; font-weight: 700; letter-spacing: .05em; line-height: 1; }
.report-duel-card.a .report-duel-mbti { color: #B8A8F0; text-shadow: 0 0 28px rgba(196,181,253,0.5); }
.report-duel-card.b .report-duel-mbti { color: #E8A8C8; text-shadow: 0 0 28px rgba(249,168,212,0.5); }
.report-duel-name { font-size: 11px; font-family: var(--f-serif); font-style: italic; color: rgba(255,255,255,0.45); line-height: 1.35; text-align: center; }
.report-duel-score {
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px; flex-shrink: 0; position: relative;
  width: 80px; height: 80px;
}
.score-ring {
  position: absolute; inset: 0; width: 80px; height: 80px;
}
.report-score-inner {
  position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center;
}
.report-score-big {
  font-family: var(--f-mono); font-size: 32px; font-weight: 700;
  line-height: 1; letter-spacing: -0.02em;
  background: linear-gradient(160deg,#B8A8F0 0%,#9B6DFF 50%,#D4FF00 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.report-uid-pill {
  display: inline-flex; align-items: center; gap: 8px; padding: 5px 14px;
  border-radius: 999px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.055);
  margin-bottom: 18px; position: relative; z-index: 1;
}
.report-uid-code { font-family: var(--f-mono); font-size: 10px; color: rgba(255,255,255,0.3); letter-spacing: .06em; }
.report-uid-dot  { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.18); flex-shrink: 0; }
.report-uid-date { font-family: var(--f-mono); font-size: 10px; color: rgba(155,109,255,0.29); letter-spacing: .04em; }
.report-pairing-name {
  font-family: var(--f-serif); font-size: 16px; font-style: italic;
  color: rgba(255,255,255,0.55); margin-bottom: 16px; position: relative; z-index: 1;
}
.report-bar-wrap { height: 3px; background: rgba(255,255,255,0.04); border-radius: 999px; overflow: hidden; margin-bottom: 16px; position: relative; z-index: 1; }
.report-bar-fill { height: 100%; background: linear-gradient(90deg,#B8A8F0,#9B6DFF,#7C6CFF,#D4FF00); border-radius: 999px; transition: width 1s ease; }
.report-tags-row { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }
.report-tag { font-size: 11px; color: rgba(255,255,255,0.38); font-family: var(--f-sans); display: flex; align-items: center; gap: 5px; }
.report-tag-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.report-tag-dot--lime   { background: #D4FF00; box-shadow: 0 0 6px rgba(212,255,0,0.5); }
.report-tag-dot--pink   { background: #7C6CFF; box-shadow: 0 0 6px rgba(124,108,255,0.30); }
.report-tag-dot--purple { background: #9B6DFF; box-shadow: 0 0 6px rgba(120,80,220,0.32); }
/* Body */
.report-body { padding: 20px 20px 120px; display: flex; flex-direction: column; gap: 12px; }
.report-section { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.04); border-radius: 18px; padding: 20px; }
.report-section-title { font-family: var(--f-sans); font-size: 14px; font-weight: 800; letter-spacing: -0.02em; color: #fff; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
.report-section-body { font-size: 14px; color: var(--muted); line-height: 1.78; font-family: var(--f-sans); margin: 0; }
.report-dims-inner { display: flex; flex-direction: column; gap: 12px; margin-top: 4px; }
.report-dim-row { display: flex; align-items: center; gap: 10px; }
.report-dim-lbl { font-size: 12px; color: rgba(255,255,255,0.50); font-family: var(--f-sans); width: 80px; flex-shrink: 0; }
.report-dim-track { flex: 1; height: 5px; background: rgba(255,255,255,0.06); border-radius: 999px; overflow: hidden; }
.report-dim-fill { height: 100%; border-radius: 999px; transition: width .8s ease; }
.report-dim-fill--high { background: linear-gradient(90deg, #9B6DFF, #D4FF00); }
.report-dim-fill--mid  { background: linear-gradient(90deg, #7C6CFF, #B8A8F0); }
.report-dim-fill--low  { background: linear-gradient(90deg, rgba(120,80,220,0.4), rgba(120,80,220,0.6)); }
.report-dim-val { font-family: var(--f-mono); font-size: 13px; font-weight: 700; width: 36px; text-align: right; flex-shrink: 0; }
.report-dim-val--high { color: #D4FF00; }
.report-dim-val--mid  { color: rgba(196,181,253,0.85); }
.report-dim-val--low  { color: rgba(255,255,255,0.38); }
.report-lang-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
.report-lang-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.04); border-radius: 14px; padding: 14px; }
.report-lang-type { font-family: var(--f-mono); font-size: 11px; font-weight: 700; letter-spacing: .08em; margin-bottom: 5px; }
.report-lang-name { font-size: 13px; font-weight: 700; font-family: var(--f-sans); margin-bottom: 3px; color: rgba(255,255,255,0.72); }
.report-lang-sub  { font-size: 11px; color: rgba(255,255,255,0.38); font-family: var(--f-sans); }
.scene-cards { display: flex; flex-direction: column; gap: 12px; margin-top: 4px; }
.scene-card { padding: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.04); border-radius: 14px; }
.scene-label { font-size: 11px; font-family: var(--f-mono); color: rgba(155,109,255,0.62); letter-spacing: .08em; margin-bottom: 6px; }
.scene-body  { font-size: 13px; color: rgba(255,255,255,0.62); line-height: 1.55; margin: 0; }
.report-tip  { display: flex; align-items: flex-start; gap: 8px; margin-top: 10px; padding: 12px 14px; background: rgba(212,255,0,0.06); border: 1px solid rgba(212,255,0,0.18); border-radius: 12px; font-size: 13px; color: rgba(255,255,255,0.66); line-height: 1.45; font-family: var(--f-sans); }
.report-letter {
  background: rgba(120,80,220,0.07); border: 1px solid rgba(155,109,255,0.16);
  border-radius: 18px; padding: 22px 22px 22px 28px; font-size: 14px;
  color: rgba(255,255,255,0.66); line-height: 1.72; font-family: var(--f-sans); font-style: italic; position: relative;
}
/* Peak Duration */
.peak-section { text-align: center; }
.peak-display { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 0 10px; }
.peak-number {
  font-family: var(--f-mono); font-size: 36px; font-weight: 700; letter-spacing: -0.02em;
  color: rgba(255,255,255,0.95);
  line-height: 1;
  background: none; border: none; padding: 0;
  text-shadow: 0 0 32px rgba(155,109,255,0.18);
}
.peak-comment {
  font-size: 14px; color: rgba(255,255,255,0.66); font-family: var(--f-sans);
  font-style: italic; line-height: 1.5; max-width: 280px;
}
.peak-percentile {
  font-size: 13px; color: rgba(255,255,255,0.56); font-family: var(--f-sans);
  padding: 4px 14px; border-radius: 999px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.10);
}

.report-letter::before {
  content: '"'; position: absolute; top: 14px; left: 18px; font-size: 48px;
  color: rgba(155,109,255,0.13); font-family: var(--f-serif); line-height: 1;
}
</style>
