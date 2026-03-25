<template>
  <section class="screen s-detail">

    <!-- Hero -->
    <div class="detail-hero">
      <div class="detail-type">{{ mbti }}</div>
      <div class="detail-name">{{ poeticName }}</div>
      <div class="detail-pills-row">
        <div v-if="store.lovePersona" class="detail-pill detail-persona-pill">{{ store.lovePersona }}</div>
        <div class="detail-pill detail-attach-pill">
          <div class="detail-attach-dot"></div>
          <span>{{ attachmentLabel }} · {{ t('result.attachmentStyle') }}</span>
        </div>
      </div>
    </div>

    <!-- Tabs: Analysis | Love Letter（PRD §2.2 S7） -->
    <div class="tabs-row">
      <button class="tab-btn" :class="{ active: tab === 'analysis' }" @click="tab = 'analysis'">{{ t('detail.analysis') }}</button>
      <button class="tab-btn" :class="{ active: tab === 'letter' }"   @click="tab = 'letter'">{{ t('detail.loveLetter') }}</button>
    </div>

    <!-- ══ Tab: Analysis ══ -->
    <div v-show="tab === 'analysis'" class="tab-panel">

      <!-- Emotional Radar Card -->
      <div class="radar-card">
        <div class="radar-card-head">{{ t('detail.emotionalRadar') || 'EMOTIONAL RADAR' }}</div>
        <div class="radar-card-body">
          <div class="radar-canvas-wrap">
            <canvas ref="radarCanvas"></canvas>
          </div>
          <div class="radar-legend">
            <div v-for="dim in dims" :key="dim.key" class="radar-leg-row">
              <div class="radar-leg-dot" :style="{ background: dim.color, boxShadow: '0 0 6px ' + dim.color }"></div>
              <div class="radar-leg-info">
                <div class="radar-leg-label">{{ dim.label }}</div>
                <div class="radar-leg-track">
                  <div class="radar-leg-bar" :style="{ width: pct(dim.key) + '%', background: dim.color }"></div>
                </div>
              </div>
              <div class="radar-leg-val" :style="{ color: dim.color }">{{ pct(dim.key) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- YOUR PROFILE section -->
      <div class="profile-section" style="margin-top:20px;">
        <div class="profile-section-head">{{ t('detail.yourProfile') }}</div>
        <div class="profile-section-inner">

          <!-- Attachment card -->
          <div class="attach-inline-card">
            <div class="aic-icon">🔗</div>
            <div class="aic-body">
              <div class="aic-lbl">{{ t('result.attachmentStyleLabel') }}</div>
              <div class="aic-type">{{ attachmentLabel }}</div>
              <div class="aic-desc">{{ oneLine }}</div>
            </div>
          </div>

          <!-- Strengths -->
          <div v-if="strengths.length">
            <div class="detail-section-label">{{ t('detail.strengths') }}</div>
            <div class="traits-scroll">
              <div v-for="(s, i) in strengths" :key="i" class="trait-card-h str">
                <div class="trait-lbl">{{ t('detail.strengthLabel') }} 0{{ i + 1 }}</div>
                <div class="trait-text">{{ s }}</div>
              </div>
            </div>
          </div>

          <!-- Blind spots -->
          <div v-if="blindSpots.length">
            <div class="detail-section-label">{{ t('detail.blindSpots') }}</div>
            <div class="traits-scroll">
              <div v-for="(b, i) in blindSpots" :key="i" class="trait-card-h blind">
                <div class="trait-lbl">{{ t('detail.blindSpotLabel') }} 0{{ i + 1 }}</div>
                <div class="trait-text">{{ b }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Soul Match -->
      <div class="match-card" style="margin-top:16px;">
        <div class="match-title">{{ t('detail.yourSoulMatch') }}</div>
        <div class="match-pair">
          <div class="match-chip">{{ soulMatchMbti }}</div>
          <div class="match-heart">💗</div>
          <div class="match-desc">
            <strong>{{ soulMatchName }}</strong>
            <span>{{ soulMatchReason }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- ══ Tab: Love Letter ══ -->
    <div v-show="tab === 'letter'" class="tab-panel">
      <div class="love-letter" v-html="loveLetter || defaultLetter"></div>
      <!-- Share button -->
      <button class="btn-primary" style="margin-top:20px;" @click="vkShare">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right:6px;vertical-align:middle;"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.613c-.144.655-.54.812-1.094.506l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.332-.373-.119L7.48 14.618l-2.95-.924c-.641-.2-.654-.641.136-.948l11.532-4.448c.533-.194 1.001.13.828.95h-.464z"/></svg>
        {{ t('detail.shareMyLetter') }}
      </button>
    </div>

  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useAppStore, VK_APP_URL } from '@/stores/useAppStore'
import { useVK } from '@/composables/useVK'
import { useI18n } from '@/composables/useI18n'

const store = useAppStore()
const { shareUrl } = useVK()
const { t } = useI18n()

const tab         = ref('analysis')
const radarCanvas = ref(null)

const p = computed(() => store.profileData || {})

const mbti        = computed(() => store.mbti || 'INFP')
const poeticName  = computed(() => store.poeticName || 'The Grounded Rose')
const ATTACH_NAMES = {
  secure:       { en: 'SECURE',       ru: 'НАДЁЖНЫЙ',      zh: '安全型', id: 'AMAN' },
  anxious:      { en: 'ANXIOUS',      ru: 'ТРЕВОЖНЫЙ',     zh: '焦虑型', id: 'CEMAS' },
  avoidant:     { en: 'AVOIDANT',     ru: 'ИЗБЕГАЮЩИЙ',    zh: '回避型', id: 'MENGHINDAR' },
  disorganised: { en: 'DISORGANISED', ru: 'ДЕЗОРГАНИЗОВАННЫЙ', zh: '混乱型', id: 'TIDAK TERATUR' },
  disorganized: { en: 'DISORGANIZED', ru: 'ДЕЗОРГАНИЗОВАННЫЙ', zh: '混乱型', id: 'TIDAK TERATUR' },
  fearful:      { en: 'FEARFUL',      ru: 'ТРЕВОЖНО-ИЗБЕГАЮЩИЙ', zh: '恐惧型', id: 'TAKUT' },
  'fearful-avoidant': { en: 'FEARFUL-AVOIDANT', ru: 'ТРЕВОЖНО-ИЗБЕГАЮЩИЙ', zh: '恐惧回避型', id: 'TAKUT-MENGHINDAR' },
}
const attachmentLabel = computed(() => {
  const key = (store.attachment || 'anxious').toLowerCase()
  return ATTACH_NAMES[key]?.[store.lang] || ATTACH_NAMES[key]?.en || key.toUpperCase()
})
const oneLine       = computed(() => p.value.one_line || '')
const strengths     = computed(() => (p.value.strengths   || []).map(s => s.text || s).slice(0, 3))
const blindSpots    = computed(() => (p.value.blind_spots || []).map(b => b.text || b).slice(0, 3))
const soulMatchMbti = computed(() => p.value.soul_match_mbti  || 'ENFJ')
const soulMatchName = computed(() => p.value.soul_match_name  || 'The Protagonist')
const soulMatchReason = computed(() => p.value.soul_match_reason || 'Deeply complementary — they bring out what you keep hidden.')
const loveLetterPending = computed(() => !!p.value.love_letter_pending && !p.value.love_letter)
const loveLetter    = computed(() => p.value.love_letter ? p.value.love_letter.replace(/\n/g, '<br>') : null)
const defaultLetter = `正在为你生成专属情书...<br><br>通常还需要几秒。先去看分析卡片，写好会自动出现。<br><br>— Blink`

const radarValues = computed(() => ({
  crush_speed:      p.value.crush_speed       ?? p.value.heat       ?? 0.48,
  emotional_walls:  p.value.emotional_walls    ?? p.value.guard      ?? 0.65,
  intimacy_craving: p.value.intimacy_craving   ?? p.value.depth      ?? 0.82,
  bounce_back:      p.value.bounce_back        ?? p.value.heal       ?? 0.38,
  sixth_sense:      p.value.sixth_sense        ?? p.value.read_score ?? 0.91,
}))

const dims = computed(() => [
  { key: 'crush_speed',      label: t('detail.dimCrushSpeed'),      color: '#F97066' },
  { key: 'emotional_walls',  label: t('detail.dimEmotionalWalls'),  color: '#60B8CC' },
  { key: 'intimacy_craving', label: t('detail.dimIntimacyCraving'), color: '#7C6CFF' },
  { key: 'bounce_back',      label: t('detail.dimBounceBack'),      color: '#5EC487' },
  { key: 'sixth_sense',      label: t('detail.dimSixthSense'),      color: '#FBBF24' },
])
function pct(key) { return Math.round((radarValues.value[key] ?? 0.5) * 100) }

// Draw radar when Analysis tab is shown
watch(tab, t => { if (t === 'analysis') nextTick(drawRadar) })

let letterPollTimer = null
onMounted(() => {
  if (tab.value === 'analysis') nextTick(drawRadar)
  if (loveLetterPending.value) {
    letterPollTimer = setInterval(async () => {
      try {
        await store.refreshLatestProfile()
        if (!loveLetterPending.value && letterPollTimer) {
          clearInterval(letterPollTimer)
          letterPollTimer = null
        }
      } catch (e) {
        // Best-effort refresh only.
      }
    }, 5000)
  }
})

onUnmounted(() => {
  if (letterPollTimer) clearInterval(letterPollTimer)
})

function drawRadar() {
  const canvas = radarCanvas.value
  if (!canvas) return
  const rv  = radarValues.value
  const dpr = window.devicePixelRatio || 1
  const SIZE = 240
  canvas.width = canvas.height = SIZE * dpr
  canvas.style.width = canvas.style.height = SIZE + 'px'
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  const W = SIZE, cx = W / 2, cy = W / 2, R = 90
  const data   = [rv.crush_speed, rv.emotional_walls, rv.intimacy_craving, rv.bounce_back, rv.sixth_sense]
  const colors = ['#A78BFA', '#60B8CC', '#7C6CFF', '#5EC487', '#FBBF24']
  const N = 5, ao = -Math.PI / 2
  const pt = (i, r) => { const a = ao + (2 * Math.PI / N) * i; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] }
  const poly = (r, fn) => { ctx.beginPath(); for (let i = 0; i < N; i++) { const [x, y] = pt(i, r); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y) } ctx.closePath(); fn() }
  const dur = 700, t0 = performance.now()
  ;(function frame(now) {
    const prog = 1 - Math.pow(1 - Math.min((now - t0) / dur, 1), 3)
    ctx.clearRect(0, 0, W, W)
    for (let ring = 1; ring <= 4; ring++) poly(R * ring / 4, () => { ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1; ctx.stroke() })
    for (let i = 0; i < N; i++) { const [x, y] = pt(i, R); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1; ctx.stroke() }
    ctx.beginPath()
    for (let i = 0; i < N; i++) { const [x, y] = pt(i, R * data[i] * prog); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y) }
    ctx.closePath(); ctx.fillStyle = 'rgba(120,80,220,0.12)'; ctx.fill()
    ctx.strokeStyle = 'rgba(120,80,220,0.38)'; ctx.lineWidth = 1.5; ctx.stroke()
    for (let i = 0; i < N; i++) {
      const [x, y] = pt(i, R * data[i] * prog)
      ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2)
      ctx.fillStyle = colors[i]; ctx.shadowColor = colors[i]; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0
    }
    if (prog < 1) requestAnimationFrame(frame)
  })(t0)
}

const shareLink = computed(() => {
  const uid = store.userId
  return uid ? `${VK_APP_URL}#ref_${uid}` : VK_APP_URL
})
function vkShare() {
  const text = t('detail.shareLetterText', {
    mbti: store.mbti,
    poeticName: store.poeticName,
    persona: store.lovePersona || store.poeticName || store.mbti,
    code: store.blinkCode,
  })
  shareUrl(shareLink.value, text)
}
</script>

<style scoped>
.s-detail {
  display: flex; flex-direction: column;
  min-height: var(--vk-viewport-height, 100vh);
  padding: 0; overflow-y: auto;
  animation: screenIn .3s cubic-bezier(.16,1,.3,1);
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}

.detail-hero {
  text-align: center; padding: 32px 20px 24px;
  background: radial-gradient(ellipse 80% 100% at 50% 0%, rgba(139,92,246,.2) 0%, transparent 70%);
  border-bottom: 1px solid rgba(255,255,255,0.04); flex-shrink: 0;
}
.detail-type {
  font-family: var(--f-mono); font-size: 38px; font-weight: 700; letter-spacing: .1em;
  background: linear-gradient(135deg,#B8A8F0,#E8A8C8);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 4px;
}
.detail-name  { font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.7); margin-bottom: 6px; }
.detail-pills-row {
  display: flex; align-items: center; justify-content: center;
  gap: 8px; flex-wrap: wrap; margin-top: 4px;
}
.detail-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 16px; border-radius: 999px;
  font-size: 12px; font-weight: 600; font-family: var(--f-sans);
}
.detail-persona-pill {
  background: rgba(155,109,255,0.12); border: 1px solid rgba(155,109,255,0.30);
  color: rgba(196,181,253,0.90);
}
.detail-attach-pill {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(155,109,255,0.22);
  color: rgba(255,255,255,0.62);
}
.detail-attach-dot { width: 6px; height: 6px; border-radius: 50%; background: #9B6DFF; box-shadow: 0 0 6px #9B6DFF; flex-shrink: 0; }

.tab-panel { padding: 0 20px; }

/* Radar Card */
.radar-card {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px; overflow: hidden; margin: 0 0 4px;
}
.radar-card-head {
  padding: 14px 18px 0;
  font-family: var(--f-mono); font-size: 9px; font-weight: 700;
  letter-spacing: .2em; color: rgba(255,255,255,0.30); text-transform: uppercase;
}
.radar-card-body { padding: 8px 24px 20px; }
.radar-canvas-wrap { display: flex; justify-content: center; padding: 8px 0 12px; }
.radar-legend { display: flex; flex-direction: column; gap: 12px; }
.radar-leg-row { display: flex; align-items: center; gap: 10px; }
.radar-leg-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.radar-leg-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.radar-leg-label { font-family: var(--f-sans); font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.50); }
.radar-leg-track { height: 4px; background: rgba(255,255,255,0.06); border-radius: 999px; overflow: hidden; }
.radar-leg-bar { height: 100%; border-radius: 999px; transition: width .8s ease; }
.radar-leg-val { font-family: var(--f-mono); font-size: 12px; font-weight: 600; width: 28px; text-align: right; flex-shrink: 0; }

/* Profile section */
.detail-section-label {
  font-family: var(--f-mono); font-size: 10px; font-weight: 700;
  letter-spacing: .15em; color: rgba(255,255,255,0.45); text-transform: uppercase; margin-bottom: 10px;
}
.profile-section { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.04); border-radius: 20px; overflow: hidden; }
.profile-section-head { padding: 14px 18px 0; font-family: var(--f-mono); font-size: 9px; font-weight: 700; letter-spacing: .2em; color: rgba(255,255,255,0.3); text-transform: uppercase; }
.profile-section-inner { padding: 14px 18px 18px; display: flex; flex-direction: column; gap: 14px; }
.traits-scroll { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.traits-scroll::-webkit-scrollbar { display: none; }
.trait-card-h { flex-shrink: 0; width: 160px; padding: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.04); border-radius: 16px; }
.trait-card-h::before { content: ''; display: block; width: 8px; height: 8px; border-radius: 50%; margin-bottom: 10px; }
.trait-card-h.str::before   { background: rgba(212,255,0,0.8); box-shadow: 0 0 8px rgba(212,255,0,0.5); }
.trait-card-h.blind::before { background: rgba(175,80,125,0.56); box-shadow: 0 0 8px rgba(180,80,130,0.30); }
.trait-lbl  { font-size: 10px; color: var(--muted); margin-bottom: 4px; font-family: var(--f-mono); letter-spacing: .08em; }
.trait-text { font-size: 12px; font-weight: 500; line-height: 1.5; font-family: var(--f-sans); color: rgba(255,255,255,0.75); }

/* Attachment inline card */
.attach-inline-card { display: flex; gap: 12px; align-items: flex-start; background: rgba(120,80,220,0.06); border: 1px solid rgba(120,80,220,0.2); border-radius: 16px; padding: 16px; }
.aic-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
.aic-lbl  { font-family: var(--f-mono); font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.35); letter-spacing: .15em; text-transform: uppercase; margin-bottom: 3px; }
.aic-type { font-family: var(--f-mono); font-size: 14px; font-weight: 700; color: var(--c-infp); letter-spacing: .08em; margin-bottom: 3px; }
.aic-desc { font-size: 12px; color: rgba(255,255,255,0.5); font-family: var(--f-sans); line-height: 1.5; }

/* Soul match */
.match-card { background: rgba(120,80,220,0.06); border: 1px solid rgba(110,70,210,.28); border-radius: 20px; padding: 24px 20px; position: relative; overflow: hidden; }
.match-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1.5px; background: linear-gradient(90deg,#9B6DFF,#7C6CFF,transparent); }
.match-title { font-size: 10px; color: var(--muted); margin-bottom: 12px; font-family: var(--f-mono); letter-spacing: .12em; }
.match-pair  { display: flex; align-items: center; gap: 14px; }
.match-chip  { background: rgba(255,255,255,0.04); border: 1px solid rgba(110,70,210,.38); border-radius: 12px; padding: 12px 18px; font-family: var(--f-mono); font-size: 18px; font-weight: 700; color: var(--c-enfj-light); flex-shrink: 0; }
.match-heart { font-size: 20px; animation: hb 1.5s ease-in-out infinite; flex-shrink: 0; }
.match-desc  { font-size: 14px; color: var(--muted); line-height: 1.65; }
.match-desc strong { font-size: 15px; color: rgba(255,255,255,0.85); display: block; margin-bottom: 4px; }

/* Love letter */
.love-letter {
  background: rgba(255,255,255,0.04); backdrop-filter: blur(16px);
  border: 1px solid rgba(139,92,246,0.18); border-radius: 20px;
  padding: 32px 24px 28px 28px; font-size: 14px; line-height: 1.9;
  color: var(--muted); font-style: italic; font-family: var(--f-sans);
  position: relative; overflow: hidden; margin-top: 4px;
}
.love-letter::before {
  content: '"'; position: absolute; top: -8px; left: 14px; font-size: 80px;
  color: rgba(139,92,246,.1); font-family: var(--f-serif); font-weight: 800; line-height: 1; font-style: normal;
}
</style>
