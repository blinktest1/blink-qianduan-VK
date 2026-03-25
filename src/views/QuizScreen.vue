<template>
  <section class="screen s-quiz">
    <div class="quiz-top">
      <div class="quiz-meta">
        <span class="quiz-num">Q{{ store.quizIdx + 1 }} / {{ questions.length }}</span>
      </div>
      <div class="progress-wrap">
        <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
      </div>
    </div>

    <div class="quiz-card">
      <p class="quiz-q" :key="store.quizIdx">{{ questions[store.quizIdx] }}</p>
    </div>

    <div class="orb-section">
      <div class="orb-matrix" id="orbScale">
        <div class="orb-group">
          <div class="orb orb-lg agree" :class="{ sel: pickedIdx === 0 }" @click="pickOrb(0, 'Strongly Agree', 5)" title="Strongly Agree"></div>
          <div class="orb orb-md agree" :class="{ sel: pickedIdx === 1 }" @click="pickOrb(1, 'Agree', 4)" title="Agree"></div>
          <div class="orb orb-sm agree" :class="{ sel: pickedIdx === 2 }" @click="pickOrb(2, 'Slightly Agree', 3)" title="Slightly Agree"></div>
        </div>
        <div class="orb-gap"></div>
        <div class="orb-group">
          <div class="orb orb-sm disagree" :class="{ sel: pickedIdx === 3 }" @click="pickOrb(3, 'Slightly Disagree', 2)" title="Slightly Disagree"></div>
          <div class="orb orb-md disagree" :class="{ sel: pickedIdx === 4 }" @click="pickOrb(4, 'Disagree', 1)" title="Disagree"></div>
          <div class="orb orb-lg disagree" :class="{ sel: pickedIdx === 5 }" @click="pickOrb(5, 'Strongly Disagree', 1)" title="Strongly Disagree"></div>
        </div>
      </div>
      <div class="orb-label-row">
        <span class="orb-lbl agree-lbl">{{ t('quiz.agree') }}</span>
        <span class="orb-lbl disagree-lbl">{{ t('quiz.disagree') }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useVK } from '@/composables/useVK'
import { useI18n } from '@/composables/useI18n'

const store = useAppStore()
const { haptic, showBackButton } = useVK()
const { t } = useI18n()
const QUIZ_LEN = 16

onMounted(() => {
  try {
    const saved = localStorage.getItem('blink_quiz')
    if (saved && store.quizAnswers.length === 0) {
      const { answers, idx } = JSON.parse(saved)
      // Only restore if cache matches current quiz length (discard stale 13-Q caches)
      if (answers?.length >= QUIZ_LEN) {
        store.quizAnswers = answers.slice(0, QUIZ_LEN)
        store.quizIdx = Math.min(idx || 0, QUIZ_LEN - 1)
      } else {
        localStorage.removeItem('blink_quiz')
      }
    }
  } catch {}

  showBackButton(true, () => {
    if (store.quizIdx > 0) {
      store.quizIdx--
      pickedIdx.value = null
    } else {
      store.go('s-emotion')
    }
  })
})

onUnmounted(() => {
  showBackButton(false, null)
})

const pickedIdx = ref(null)

const QUESTIONS = {
  en: [
    "I joke things off even when something actually hurt me.",
    "If the vibe gets intense fast, I get attached fast too.",
    "Even in a good thing, part of me is already bracing for the drop.",
    "After something ends, I replay the details way longer than I admit.",
    "When conflict hits, I want to resolve it now, not later.",
    "I show love more through doing useful things than talking about feelings.",
    "I can feel a lot for someone and still struggle to say it out loud.",
    "If someone starts pulling back, I notice immediately and it gets under my skin.",
    "In love, I trust logic over emotion when the two clash.",
    "A part of me worries that if someone sees the real me, they may want less of me.",
    "When someone really needs me emotionally, my instinct is often to step back first.",
    "My body reacts to stress in relationships before my mind catches up.",
    "The moment a connection starts feeling too serious, I want more space.",
    "I usually understand my feelings better after I talk them out with someone.",
    "I trust clear facts more than hidden meanings or vibes.",
    "I feel safer when a relationship has direction instead of staying undefined.",
  ],
  ru: [
    "Я часто всё свожу в шутку, даже если меня реально задело.",
    "Если связь быстро становится интенсивной, я тоже быстро привязываюсь.",
    "Даже когда всё хорошо, часть меня уже ждёт, где это рухнет.",
    "Когда всё заканчивается, я разбираю детали дольше, чем признаюсь.",
    "Когда возникает конфликт, мне хочется решить всё сразу, а не потом.",
    "Я чаще показываю любовь делами, чем разговорами о чувствах.",
    "Я могу чувствовать очень многое к человеку и всё равно не суметь сказать это вслух.",
    "Если кто-то начинает отдаляться, я замечаю это сразу и меня это задевает.",
    "В любви я чаще выбираю логику, если она спорит с чувствами.",
    "Во мне есть страх, что если человек увидит настоящего меня, он захочет меня меньше.",
    "Когда кому-то очень нужна от меня эмоциональная близость, мой первый импульс - отступить.",
    "В отношениях тело часто реагирует на стресс раньше, чем разум успевает всё понять.",
    "Как только связь становится слишком серьёзной, мне хочется больше пространства.",
    "Обычно я понимаю свои чувства лучше после того, как проговорю их с кем-то.",
    "Я больше доверяю фактам, чем скрытым смыслам или вайбу.",
    "Мне спокойнее, когда у отношений есть направление, а не вечное 'посмотрим'.",
  ],
  zh: [
    "有些话明明刺到我了，我也会先用玩笑带过去。",
    "一段关系如果升温很快，我也会很快上头。",
    "就算一切都很好，我心里也有一部分已经在防它变坏。",
    "一段关系结束后，我会比自己承认的更久地反复回想细节。",
    "一有冲突，我会想立刻解决，而不是拖着。",
    "比起谈感受，我更习惯用行动去表达喜欢。",
    "我明明很在意一个人，却还是很难把那份在意直接说出口。",
    "一旦对方开始冷下来，我会立刻感觉到，而且会被影响。",
    "感情里如果理智和感觉打架，我更容易站理智那边。",
    "我心里有一块地方会担心：如果别人真的看见完整的我，可能就没那么喜欢了。",
    "当一个人很需要我在情绪上靠近时，我的第一反应常常是先后退一点。",
    "关系里的压力一来，我的身体通常比脑子更早有反应。",
    "一段关系一旦开始变得太认真，我就会想要更多自己的空间。",
    "很多时候，我是把感受说出来之后，才真的知道自己在想什么。",
    "我更信明确的事实，不太信那些暧昧的暗示和气氛。",
    "比起一直悬着不定义，我会更想知道这段关系到底往哪走。",
  ],
  id: [
    "Aku sering menutupinya dengan bercanda, bahkan saat sebenarnya aku tersakiti.",
    "Kalau hubungan memanas dengan cepat, aku juga cepat ikut terikat.",
    "Bahkan saat semuanya terasa baik, ada bagian diriku yang sudah siap kalau ini jatuh.",
    "Kalau sesuatu berakhir, aku memikirkan detailnya lebih lama dari yang kuakui.",
    "Saat konflik muncul, aku maunya cepat beres, bukan ditunda.",
    "Aku lebih sering menunjukkan rasa sayang lewat tindakan daripada ngobrol soal perasaan.",
    "Aku bisa sangat peduli pada seseorang tapi tetap susah mengatakannya langsung.",
    "Kalau seseorang mulai menjauh, aku langsung merasa dan itu menggangguku.",
    "Dalam cinta, kalau logika dan perasaan bertabrakan, aku lebih sering percaya logika.",
    "Ada bagian diriku yang takut: kalau seseorang benar-benar melihat diriku yang asli, mereka mungkin jadi kurang suka.",
    "Saat seseorang sangat butuh kedekatan emosional dariku, insting pertamaku sering justru mundur dulu.",
    "Dalam hubungan, tubuhku sering bereaksi pada stres lebih dulu daripada pikiranku.",
    "Begitu hubungan mulai terasa terlalu serius, aku ingin lebih banyak ruang.",
    "Sering kali aku baru benar-benar paham perasaanku setelah mengatakannya ke seseorang.",
    "Aku lebih percaya fakta yang jelas daripada makna tersembunyi atau vibe.",
    "Aku merasa lebih aman kalau hubungan punya arah, bukan dibiarkan menggantung terus.",
  ],
}
const questions = computed(() => QUESTIONS[store.lang] || QUESTIONS.en)
const progressPct = computed(() => ((store.quizIdx + 1) / questions.value.length) * 100)

watch(() => store.quizIdx, () => { pickedIdx.value = null })

function pickOrb(idx, _label, value) {
  pickedIdx.value = idx
  navigator.vibrate?.(6)
  haptic('light')

  const arr = [...store.quizAnswers]
  arr[store.quizIdx] = value
  store.quizAnswers = arr
  try { localStorage.setItem('blink_quiz', JSON.stringify({ answers: arr, idx: store.quizIdx })) } catch {}

  setTimeout(() => {
    if (store.quizIdx + 1 < questions.value.length) {
      store.quizIdx++
    } else {
      store.go('s-loading')
    }
  }, 380)
}
</script>

<style scoped>
.s-quiz {
  display: flex; flex-direction: column;
  min-height: var(--vk-viewport-height, 100vh);
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  animation: screenIn .3s cubic-bezier(.16,1,.3,1);
}
.quiz-top { padding: 20px 20px 16px; flex-shrink: 0; }
.quiz-meta { margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
.quiz-num {
  font-family: var(--f-mono); font-size: 12px; font-weight: 700;
  color: rgba(155,109,255,0.6); letter-spacing: .1em;
}
.quiz-card {
  margin: 12px 20px 32px; padding: 28px 24px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 24px;
  min-height: 180px; max-height: 240px;
  display: flex; align-items: center;
}
.quiz-q {
  font-family: var(--f-sans); font-size: 20px; font-weight: 700;
  line-height: 1.4; letter-spacing: -0.02em; color: #fff;
  animation: fadeUp .25s ease both;
}
.orb-section {
  display: flex; flex-direction: column; align-items: center;
  gap: 16px; padding: 0 20px 32px; flex-shrink: 0;
}
.orb-matrix {
  display: flex; align-items: center; gap: 0;
  width: 100%; justify-content: center;
}
.orb-group { display: flex; align-items: center; gap: 12px; }
.orb-gap   { width: 24px; flex-shrink: 0; }
.orb {
  border-radius: 50%; cursor: pointer;
  transition: transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s;
  flex-shrink: 0;
  position: relative;
}
.orb-lg { width: 52px; height: 52px; }
.orb-md { width: 38px; height: 38px; }
.orb-sm { width: 26px; height: 26px; }
.orb.agree {
  background:
    radial-gradient(circle at 35% 25%, rgba(255,255,255,0.35) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(180,150,255,0.9) 0%, rgba(120,70,220,0.75) 60%, rgba(80,40,180,0.9));
  box-shadow: 0 4px 12px rgba(120,80,220,0.4), inset 0 -3px 6px rgba(60,20,140,0.4);
  border: none;
}
.orb.agree.sel {
  transform: scale(1.18);
  box-shadow: 0 0 0 3px rgba(155,109,255,0.5), 0 6px 20px rgba(120,80,220,0.55);
}
.orb.agree:active { transform: scale(0.9); }
.orb.disagree {
  background:
    radial-gradient(circle at 35% 25%, rgba(255,255,255,0.3) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(240,170,200,0.9) 0%, rgba(190,90,140,0.75) 60%, rgba(150,50,100,0.9));
  box-shadow: 0 4px 12px rgba(175,80,125,0.4), inset 0 -3px 6px rgba(120,30,70,0.4);
  border: none;
}
.orb.disagree.sel {
  transform: scale(1.18);
  box-shadow: 0 0 0 3px rgba(214,116,168,0.5), 0 6px 20px rgba(175,80,125,0.55);
}
.orb.disagree:active { transform: scale(0.9); }
.orb-label-row {
  display: flex; justify-content: space-between; align-items: center;
  width: 100%; padding: 0 4px;
}
.orb-lbl { font-family: var(--f-mono); font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.agree-lbl    { color: rgba(155,109,255,0.55); }
.disagree-lbl { color: rgba(214,116,168,0.55); }
</style>
