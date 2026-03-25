<template>
  <section class="screen s-result">
    <!-- pending_report_id banner — 回访用户合盘恢复（PRD §2.4） -->
    <div v-if="store.pendingReportBanner" class="pending-report-banner">
      <div class="prb-left">
        <div class="prb-dot"></div>
        <div>
          <div class="prb-title">{{ t('result.pendingTitle') }}</div>
          <div class="prb-sub">{{ t('result.pendingSub') }}</div>
        </div>
      </div>
      <div class="prb-spinner"></div>
    </div>
    <!-- Hero — screenshot-first design -->
    <div class="result-hero">
      <div class="hero-glow"></div>
      <div class="emotional-mbti-tag">{{ t('result.emotionalMbtiTag') }}</div>
      <div class="type-letters result-mbti">{{ mbti }}</div>

      <!-- Love Persona Sub — below MBTI letters -->
      <div v-if="lovePersonaSub" class="persona-sub-hero">{{ lovePersonaSub }}</div>

      <div class="type-poetic result-poetic-name">{{ poeticName }}</div>
      <div class="hero-pills-row">
        <div v-if="lovePersona" class="hero-pill persona-pill">{{ lovePersona }}</div>
        <div class="hero-pill attach-pill">
          <div class="attachment-dot"></div>
          <span>{{ attachmentLabel }} · {{ t('result.attachmentStyle') }}</span>
        </div>
      </div>

      <!-- Monologue — the 2am thought -->
      <div v-if="monologueText" class="hero-monologue">{{ monologueText }}</div>
    </div>

    <div class="result-body">

      <!-- Attachment card -->
      <div class="attachment-card">
        <div class="attachment-card-icon">🔗</div>
        <div class="attachment-card-body">
          <div class="attachment-card-label">{{ t('result.attachmentStyleLabel') }}</div>
          <div class="attachment-card-type">{{ attachmentLabel }}</div>
          <div class="attachment-card-desc">{{ oneLine }}</div>
        </div>
      </div>

      <!-- Description -->
      <div class="result-desc-card">
        <p class="result-desc">{{ description }}</p>
      </div>

      <!-- Stats row (2 columns) -->
      <div class="result-stats result-stats-2col">
        <div class="result-stat">
          <div class="result-stat-lbl">{{ t('result.sameType') }}</div>
          <div class="result-stat-val txt-infp">{{ sameTypeCount.toLocaleString() }}</div>
          <div class="result-stat-sub">{{ sameTypePct }}{{ t('result.ofUsers') }}</div>
        </div>
        <div class="result-stat">
          <div class="result-stat-lbl">{{ t('result.soulMatch') }}</div>
          <div class="result-stat-val" style="color:var(--c-enfj-light);">{{ soulMatchMbti }}</div>
          <div class="result-stat-sub">{{ soulMatchName }}</div>
        </div>
      </div>

      <!-- Primary CTA -->
      <button class="btn-primary" @click="store.go('s-detail')">{{ t('result.fullReport') }}</button>
      <div class="result-cta-hint">{{ t('result.fullReportSub') }}</div>

      <!-- Code + share -->
      <div class="share-zone">
        <div class="code-action-row">
          <div class="code-display">
            <div class="code-display-val">{{ store.blinkCode || '—' }}</div>
          </div>
          <button class="code-copy-btn" @click="copyCode">
            <span>{{ copyTxt }}</span>
          </button>
          <button class="icon-btn vk-icon-btn" @click="vkShareCode" title="Share to VK">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.188 1.368 1.259 2.184 1.814.616.42 1.084.328 1.084.328l2.178-.03s1.14-.07.599-.964c-.044-.073-.316-.661-1.627-1.87-1.373-1.264-1.188-1.06.465-3.248.505-.668 2.907-4.045 1.272-4.264 0 0-1.464-.04-2.164-.04-.7 0-.907.37-.907.37s-1.027 2.07-1.573 2.93c-1.342 2.116-1.878 1.17-1.878-.218 0-.45.206-2.405-.724-2.728-.344-.12-.596-.196-1.47-.21-.868-.015-1.606.005-2.022.207-.277.134-.49.434-.36.45.16.02.523.098.715.36.248.338.24 1.096.24 1.096s.143 2.563-.333 2.88c-.327.218-.776-.227-1.738-2.262-.493-1.044-1.555-2.96-1.555-2.96s-.13-.318-.36-.488c-.28-.206-.67-.272-.67-.272l-2.07.014s-.31.009-.424.143c-.1.12-.008.367-.008.367s1.95 4.558 4.155 6.854c2.026 2.11 4.33 1.97 4.33 1.97h1.042z"/></svg>
          </button>

        </div>
      </div>

      <!-- Referral hint — below code row -->
      <div class="invite-hint">{{ t('result.inviteHint') }}</div>

      <!-- Retake -->
      <button class="btn-retake" @click="retake">{{ t('result.retake') }}</button>

      <!-- Social proof strip -->
      <div class="open-blink-strip">
        <div class="open-blink-left">
          <div class="open-blink-dot"></div>
          <div class="open-blink-text">
            <div class="open-blink-count"><strong>{{ matchCount.toLocaleString() }}</strong> {{ t('result.matchYourType') }}</div>
            <div class="open-blink-sub"><strong>{{ activePercent }}%</strong> {{ t('result.areActive') }}</div>
          </div>
        </div>
        <button class="open-blink-btn" @click="openBlink">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.613c-.144.655-.54.812-1.094.506l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.332-.373-.119L7.48 14.618l-2.95-.924c-.641-.2-.654-.641.136-.948l11.532-4.448c.533-.194 1.001.13.828.95h-.464z"/></svg>
          {{ t('result.openBlink') }}
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAppStore, VK_APP_URL } from '@/stores/useAppStore'
import { useVK } from '@/composables/useVK'
import { useI18n } from '@/composables/useI18n'

const store = useAppStore()
const { shareUrl } = useVK()
const { t } = useI18n()

// 回访用户：pending_report_id 轮询（PRD §2.4）
let stopPoll = null
onMounted(() => {
  if (store.pendingReportBanner && store.compatReportId) {
    stopPoll = store.pollCompatReport(
      () => {
        store.pendingReportBanner = false
        store.go('s-report')
      },
      (msg) => {
        store.pendingReportBanner = false
        console.warn('[Blink] pending report poll error:', msg)
      }
    )
  }
})
onUnmounted(() => { stopPoll?.() })

const p = computed(() => store.profileData || {})
const mbti       = computed(() => store.mbti || 'INFP')
const poeticName = computed(() => store.poeticName || 'The Grounded Rose')
const lovePersona = computed(() => store.lovePersona || '')
const lovePersonaSub = computed(() => store.lovePersonaSub || '')
const monologueText = computed(() => store.monologue || '')
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
const oneLine    = computed(() => p.value.one_line || 'You love deeply — and quietly wonder if it\'s ever enough.')
const description = computed(() => p.value.description || 'You feel everything deeply but keep it hidden.')
const soulMatchMbti = computed(() => p.value.soul_match_mbti || 'ENFJ')
const soulMatchName = computed(() => p.value.soul_match_name || 'The Protagonist')

const sameTypePctRaw = computed(() => p.value.same_type_pct ?? 0.05)
const sameTypeCount  = computed(() => p.value.same_type_count ?? Math.floor((p.value.total_readings ?? 250) * sameTypePctRaw.value))
const sameTypePct    = computed(() => (sameTypePctRaw.value * 100).toFixed(1))
const matchCount     = computed(() => sameTypeCount.value)
const activePercent  = computed(() => {
  // Dynamic: 38-52% range based on same_type_pct
  const base = Math.round(38 + sameTypePctRaw.value * 200)
  return Math.min(52, Math.max(38, base))
})
const sharePct       = ref(8 + Math.floor(Math.random() * 6))

// Copy
const copyTxt = ref(t('result.copy'))
function copyCode() {
  const code = store.blinkCode || ''
  navigator.clipboard?.writeText(code).catch(() => {})
  copyTxt.value = t('result.copied')
  setTimeout(() => (copyTxt.value = t('result.copy')), 1500)
}

// Share — link includes referral param via hash so inviter earns free compat credit
const shareLink = computed(() => {
  const uid = store.userId
  return uid ? `${VK_APP_URL}#ref_${uid}` : VK_APP_URL
})
function vkShareCode() {
  const text = t('result.shareText', {
    mbti: store.mbti,
    poeticName: store.poeticName,
    persona: store.lovePersona || store.poeticName || store.mbti,
    code: store.blinkCode,
  })
  shareUrl(shareLink.value, text)
}

// Open Blink VK app
function openBlink() {
  window.open(VK_APP_URL, '_blank')
}

function retake() {
  store.resetQuizState()
  store.go('s-info')
}
</script>

<style scoped>
.s-result {
  display: flex; flex-direction: column;
  min-height: var(--vk-viewport-height, 100vh);
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  overflow-y: auto; padding-top: 0;
}

/* Pending report banner */
.pending-report-banner {
  display: flex; align-items: center; justify-content: space-between;
  margin: 0 20px 0; padding: 12px 16px; border-radius: 14px;
  background: rgba(120,80,220,0.10); border: 1px solid rgba(120,80,220,0.25);
  flex-shrink: 0;
}
.prb-left  { display: flex; align-items: center; gap: 10px; }
.prb-dot   { width: 8px; height: 8px; border-radius: 50%; background: #9B6DFF; box-shadow: 0 0 8px rgba(155,109,255,0.6); flex-shrink: 0; animation: breathe 2s ease-in-out infinite; --lo:.4; --hi:1; }
.prb-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8); font-family: var(--f-sans); }
.prb-sub   { font-size: 11px; color: rgba(255,255,255,0.4); font-family: var(--f-mono); margin-top: 2px; }
.prb-spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid rgba(155,109,255,0.2);
  border-top-color: rgba(155,109,255,0.8);
  animation: spinCW 0.9s linear infinite; flex-shrink: 0;
}

/* Hero — screenshot-first */
.result-hero {
  position: relative; text-align: center; padding: 48px 24px 32px;
  background: radial-gradient(ellipse 90% 120% at 50% -10%, rgba(139,92,246,.28) 0%, transparent 65%);
  border-bottom: 1px solid rgba(255,255,255,0.04); flex-shrink: 0;
  overflow: hidden;
}
.hero-glow {
  position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
  width: 260px; height: 260px; border-radius: 50%;
  background: radial-gradient(circle, rgba(155,109,255,0.10) 0%, transparent 72%);
  pointer-events: none; opacity: 0.82;
}
.emotional-mbti-tag {
  position: relative; z-index: 1;
  font-size: 11px; font-weight: 600; letter-spacing: .15em; text-transform: uppercase;
  color: rgba(155,109,255,0.7); margin-bottom: 8px;
}
.result-mbti {
  position: relative; z-index: 1;
  font-family: var(--f-mono); font-size: 56px; font-weight: 700;
  letter-spacing: .12em; line-height: 1;
  background: linear-gradient(135deg, #C4B5FD 0%, #9B6DFF 45%, #7C6CFF 70%, #D4FF00 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  margin-bottom: 12px;
  filter: drop-shadow(0 0 30px rgba(155,109,255,0.3));
}

/* Persona sub line below MBTI */
.persona-sub-hero {
  position: relative; z-index: 1;
  font-family: var(--f-sans); font-size: 13px; font-weight: 400;
  color: rgba(255,255,255,0.45); margin-bottom: 8px; line-height: 1.5;
  font-style: italic; padding: 0 24px;
}

/* Pills row — persona + attachment side by side */
.hero-pills-row {
  position: relative; z-index: 1;
  display: flex; align-items: center; justify-content: center;
  gap: 8px; flex-wrap: wrap; margin-top: 14px;
}
.hero-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 16px; border-radius: 999px;
  font-size: 12px; font-weight: 600; font-family: var(--f-sans);
}
.persona-pill {
  background: rgba(155,109,255,0.12); border: 1px solid rgba(155,109,255,0.30);
  color: rgba(196,181,253,0.90);
}
.attach-pill {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(155,109,255,0.22);
  color: rgba(255,255,255,0.62);
}

.result-poetic-name {
  position: relative; z-index: 1;
  font-family: var(--f-serif); font-size: 17px; font-style: italic;
  color: rgba(255,255,255,0.5); margin-bottom: 14px; letter-spacing: .01em;
}

/* Monologue — 2am thought in hero */
.hero-monologue {
  position: relative; z-index: 1;
  font-family: var(--f-serif); font-size: 13px; font-style: italic;
  color: rgba(255,255,255,0.32); line-height: 1.6; margin-top: 12px;
  padding: 10px 24px; max-width: 300px; margin-left: auto; margin-right: auto;
  border-left: 2px solid rgba(155,109,255,0.15);
  text-align: left;
}
.attachment-dot { width: 6px; height: 6px; border-radius: 50%; background: #9B6DFF; box-shadow: 0 0 8px #9B6DFF; flex-shrink: 0; }

/* Body */
.result-body { padding: 20px 20px 0; display: flex; flex-direction: column; gap: 14px; }

.attachment-card {
  display: flex; gap: 14px; padding: 18px; border-radius: 18px;
  background: rgba(120,80,220,0.06); border: 1px solid rgba(120,80,220,0.2);
}
.attachment-card-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
.attachment-card-body { display: flex; flex-direction: column; gap: 3px; }
.attachment-card-label { font-family: var(--f-mono); font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.35); letter-spacing: .15em; text-transform: uppercase; }
.attachment-card-type  { font-family: var(--f-mono); font-size: 14px; font-weight: 700; color: var(--c-infp); letter-spacing: .08em; }
.attachment-card-desc  { font-size: 13px; color: rgba(255,255,255,0.55); font-family: var(--f-sans); line-height: 1.5; }

.result-desc-card { padding: 18px; border-radius: 18px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); }
.result-desc { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.75; font-family: var(--f-sans); }

/* Stats */
.result-stats-2col { grid-template-columns: 1fr 1fr !important; }
.result-stats {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 18px; overflow: hidden;
}
.result-stat {
  padding: 16px 12px; display: flex; flex-direction: column; gap: 3px; text-align: center;
  border-right: 1px solid rgba(255,255,255,0.06);
}
.result-stat:last-child { border-right: none; }
.result-stat-lbl { font-family: var(--f-mono); font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.35); letter-spacing: .1em; text-transform: uppercase; }
.result-stat-val { font-family: var(--f-mono); font-size: 20px; font-weight: 700; letter-spacing: .04em; line-height: 1.2; }
.result-stat-sub { font-size: 10px; color: var(--muted); font-family: var(--f-sans); }

.result-cta-hint { font-size: 11px; color: rgba(255,255,255,0.28); text-align: center; font-family: var(--f-mono); }

/* Share zone */
.share-zone {
  border-radius: 16px; border: 1px solid rgba(255,255,255,0.04);
  background: rgba(255,255,255,0.04); padding: 14px 16px;
}
.code-action-row { display: flex; align-items: center; gap: 8px; }
.code-display {
  flex: 1; padding: 12px 16px; border-radius: 12px;
  background: rgba(212,255,0,0.05); border: 1px solid rgba(212,255,0,0.22);
  min-width: 0;
}
.code-display-val {
  font-family: var(--f-mono); font-size: 17px; font-weight: 700;
  color: var(--accent); letter-spacing: .14em;
  text-shadow: 0 0 12px rgba(212,255,0,0.4);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.code-copy-btn {
  padding: 12px 16px; border-radius: 12px; flex-shrink: 0;
  border: 1px solid rgba(212,255,0,0.4); background: rgba(212,255,0,0.08);
  color: var(--accent); font-family: var(--f-mono); font-size: 12px; font-weight: 700;
  cursor: pointer; transition: all .2s; letter-spacing: .05em;
}
.code-copy-btn:hover { background: var(--accent); color: #080610; border-color: var(--accent); }
.icon-btn {
  width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255,255,255,0.09); background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.55); cursor: pointer; transition: all .2s;
}
.icon-btn:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.9); }
.tg-icon-btn {
  background: rgba(42,171,238,0.15); border-color: rgba(42,171,238,0.35);
  color: #2AABEE;
}
.tg-icon-btn:hover { background: rgba(42,171,238,0.25); border-color: rgba(42,171,238,0.5); color: #2AABEE; }

/* Retake */
.btn-retake {
  width: 100%; padding: 13px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.56);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
  font-family: var(--f-sans); font-size: 14px; font-weight: 600; cursor: pointer; transition: all .2s;
}
.btn-retake:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.26); color: rgba(255,255,255,0.78); }

.invite-hint {
  text-align: center; font-size: 12px; color: rgba(255,255,255,0.45);
  font-family: var(--f-sans); margin: -4px 0 8px;
}

/* Social proof strip */
.open-blink-strip {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 12px 16px; border-radius: 14px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(158,126,255,0.18);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
  margin-bottom: 20px;
}
.open-blink-left { display: flex; align-items: center; gap: 10px; }
.open-blink-dot  { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px rgba(212,255,0,0.5); flex-shrink: 0; animation: breathe 2s ease-in-out infinite; --lo:.4; --hi:1; }
.open-blink-text { display: flex; flex-direction: column; gap: 2px; }
.open-blink-count { font-size: 12px; color: rgba(255,255,255,0.65); font-family: var(--f-sans); }
.open-blink-sub   { font-size: 11px; color: rgba(255,255,255,0.35); font-family: var(--f-sans); }
.open-blink-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 999px; border: 1px solid rgba(110,70,210,0.35);
  background: rgba(120,80,220,0.08); color: rgba(196,181,253,0.85);
  font-size: 12px; font-weight: 600; font-family: var(--f-sans); cursor: pointer;
  transition: all .2s; flex-shrink: 0;
}
.open-blink-btn:hover { background: rgba(120,80,220,0.15); }
</style>
