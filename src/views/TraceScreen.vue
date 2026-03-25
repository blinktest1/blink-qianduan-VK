<template>
  <section class="screen s-trace">
    <div class="trace-head">
      <div>
        <div class="trace-eyebrow">TRACE</div>
        <h2 class="trace-title">{{ t('trace.title') }}</h2>
        <p class="trace-sub">{{ t('trace.subtitle') }}</p>
      </div>
      <div class="trace-streak">
        <div class="trace-streak-num">{{ store.traceStreakDays || 0 }}</div>
        <div class="trace-streak-lbl">{{ t('trace.streak') }}</div>
      </div>
    </div>

    <div class="trace-card">
      <div class="trace-card-title">{{ t('trace.todayCheckin') }}</div>

      <label class="trace-label">{{ t('trace.moodLabel') }}</label>
      <div class="chip-grid mood-grid">
        <button
          v-for="item in moods"
          :key="item.value"
          class="chip"
          :class="{ active: form.mood === item.value }"
          @click="form.mood = item.value"
        >
          <span>{{ item.emoji }}</span>
          <span>{{ item.label }}</span>
        </button>
      </div>

      <label class="trace-label">{{ t('trace.personLabel') }}</label>
      <div class="chip-grid">
        <button
          v-for="item in people"
          :key="item.value"
          class="chip small"
          :class="{ active: form.person_type === item.value }"
          @click="form.person_type = item.value"
        >
          {{ item.label }}
        </button>
      </div>

      <label class="trace-label">{{ t('trace.shiftLabel') }}</label>
      <div class="chip-grid">
        <button
          v-for="item in shifts"
          :key="item.value"
          class="chip shift"
          :class="{ active: form.relationship_shift === item.value }"
          @click="form.relationship_shift = item.value"
        >
          {{ item.label }}
        </button>
      </div>

      <label class="trace-label">{{ t('trace.noteLabel') }}</label>
      <textarea
        v-model="form.note"
        class="trace-note"
        :placeholder="t('trace.notePlaceholder')"
        maxlength="200"
      />

      <button class="btn-primary trace-submit" :disabled="saving" @click="submit">
        {{ saving ? t('trace.saving') : t('trace.saveToday') }}
      </button>
    </div>

    <div v-if="store.traceToday" class="trace-card trace-insight">
      <div class="trace-card-title">{{ t('trace.todayInsight') }}</div>
      <p class="trace-hint">{{ store.traceToday.ai_hint }}</p>
    </div>

    <div class="trace-card">
      <div class="trace-card-title">{{ t('trace.weekWeather') }}</div>
      <div v-if="store.traceRecent?.length" class="trace-timeline">
        <div v-for="item in store.traceRecent" :key="item.entry_date" class="trace-day">
          <div class="trace-day-top">
            <span class="trace-day-date">{{ formatDate(item.entry_date) }}</span>
            <span class="trace-day-mood">{{ moodEmoji(item.mood) }}</span>
          </div>
          <div class="trace-day-shift">{{ shiftLabel(item.relationship_shift) }}</div>
          <div v-if="item.note" class="trace-day-note">{{ item.note }}</div>
        </div>
      </div>
      <div v-else class="trace-empty">{{ t('trace.empty') }}</div>
    </div>

    <div v-if="store.tracePatternHint" class="trace-card trace-pattern">
      <div class="trace-card-title">{{ t('trace.patternTitle') }}</div>
      <p class="trace-pattern-text">{{ store.tracePatternHint }}</p>
    </div>
  </section>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useI18n } from '@/composables/useI18n'

const store = useAppStore()
const { t } = useI18n()

const form = reactive({
  mood: 'calm',
  person_type: 'none',
  relationship_shift: 'unchanged',
  note: '',
})

const moods = [
  { value: 'calm', emoji: '😌', label: t('trace.moodCalm') },
  { value: 'happy', emoji: '🙂', label: t('trace.moodHappy') },
  { value: 'anxious', emoji: '😵', label: t('trace.moodAnxious') },
  { value: 'numb', emoji: '🫥', label: t('trace.moodNumb') },
  { value: 'obsessed', emoji: '🥵', label: t('trace.moodObsessed') },
  { value: 'hurt', emoji: '💔', label: t('trace.moodHurt') },
]

const people = [
  { value: 'none', label: t('trace.personNone') },
  { value: 'crush', label: t('trace.personCrush') },
  { value: 'partner', label: t('trace.personPartner') },
  { value: 'ex', label: t('trace.personEx') },
  { value: 'friend', label: t('trace.personFriend') },
  { value: 'family', label: t('trace.personFamily') },
  { value: 'other', label: t('trace.personOther') },
]

const shifts = [
  { value: 'closer', label: t('trace.shiftCloser') },
  { value: 'unchanged', label: t('trace.shiftUnchanged') },
  { value: 'distant', label: t('trace.shiftDistant') },
  { value: 'wanted_closer', label: t('trace.shiftWantedCloser') },
  { value: 'pulled_back', label: t('trace.shiftPulledBack') },
]

let saving = $ref(false)

onMounted(async () => {
  await store.loadTrace().catch(() => {})
  if (store.traceToday) {
    form.mood = store.traceToday.mood || 'calm'
    form.person_type = store.traceToday.person_type || 'none'
    form.relationship_shift = store.traceToday.relationship_shift || 'unchanged'
    form.note = store.traceToday.note || ''
  }
})

async function submit() {
  saving = true
  try {
    await store.saveTraceEntry({ ...form })
  } finally {
    saving = false
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function moodEmoji(mood) {
  return ({ calm: '😌', happy: '🙂', anxious: '😵', numb: '🫥', obsessed: '🥵', hurt: '💔' })[mood] || '•'
}

function shiftLabel(value) {
  const hit = shifts.find(s => s.value === value)
  return hit ? hit.label : value
}
</script>

<style scoped>
.s-trace {
  min-height: var(--vk-viewport-height, 100vh);
  padding: 18px 18px calc(92px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.trace-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.trace-eyebrow {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: .18em;
  color: rgba(212,255,0,.6);
  margin-bottom: 6px;
}
.trace-title {
  font-size: 28px;
  line-height: 1.05;
  letter-spacing: -.03em;
  margin: 0 0 8px;
}
.trace-sub {
  margin: 0;
  color: rgba(255,255,255,.52);
  font-size: 13px;
  line-height: 1.5;
  max-width: 250px;
}
.trace-streak {
  min-width: 72px;
  padding: 12px 10px;
  border-radius: 18px;
  background: rgba(163,230,53,.08);
  border: 1px solid rgba(163,230,53,.18);
  text-align: center;
}
.trace-streak-num { font-size: 24px; font-weight: 900; color: #d4ff00; }
.trace-streak-lbl { font-size: 11px; color: rgba(255,255,255,.56); }
.trace-card {
  border-radius: 22px;
  padding: 16px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  backdrop-filter: blur(18px);
}
.trace-card-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
  color: rgba(255,255,255,.9);
}
.trace-label {
  display: block;
  font-size: 12px;
  color: rgba(255,255,255,.55);
  margin: 10px 0 8px;
}
.chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.mood-grid .chip { min-width: calc(50% - 4px); }
.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.03);
  color: rgba(255,255,255,.78);
  padding: 11px 12px;
  font-size: 12px;
}
.chip.small, .chip.shift { font-size: 11px; }
.chip.active {
  background: rgba(212,255,0,.12);
  border-color: rgba(212,255,0,.25);
  color: #f4ffd0;
}
.trace-note {
  width: 100%;
  min-height: 84px;
  resize: none;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.03);
  padding: 12px 14px;
  color: #fff;
  font: inherit;
  box-sizing: border-box;
}
.trace-submit { margin-top: 14px; width: 100%; }
.trace-hint, .trace-pattern-text {
  margin: 0;
  color: rgba(255,255,255,.86);
  line-height: 1.65;
  font-size: 14px;
}
.trace-timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.trace-day {
  padding: 12px 0;
  border-top: 1px solid rgba(255,255,255,.06);
}
.trace-day:first-child { border-top: 0; padding-top: 0; }
.trace-day-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.trace-day-date { font-size: 12px; color: rgba(255,255,255,.45); }
.trace-day-shift { font-size: 13px; color: rgba(255,255,255,.82); }
.trace-day-note { margin-top: 6px; font-size: 12px; color: rgba(255,255,255,.46); }
.trace-empty { color: rgba(255,255,255,.36); font-size: 13px; }
</style>
