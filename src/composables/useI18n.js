import { computed } from 'vue'
import { useAppStore } from '@/stores/useAppStore'

const messages = {
  // ═══════════════════════════════════════
  // LANDING SCREEN
  // ═══════════════════════════════════════
  landing: {
    title1: {
      en: 'Who are you',
      ru: 'Кто ты,',
      zh: '你是谁',
      id: 'Siapa kamu',
    },
    title2: {
      en: 'when you love?',
      ru: 'когда любишь?',
      zh: '当你爱的时候？',
      id: 'saat jatuh cinta?',
    },
    button: {
      en: 'Read me',
      ru: 'Прочитай меня',
      zh: '解读我',
      id: 'Baca aku',
    },
    pill1: {
      en: '⏱ 2 min',
      ru: '⏱ 2 мин',
      zh: '⏱ 2分钟',
      id: '⏱ 2 menit',
    },
    pill2: {
      en: '❓ 16 questions',
      ru: '❓ 16 вопросов',
      zh: '❓ 16个问题',
      id: '❓ 16 pertanyaan',
    },
    pill3: {
      en: '💕 Emotional MBTI',
      ru: '💕 Эмо-MBTI',
      zh: '💕 情感MBTI',
      id: '💕 MBTI Emosional',
    },
    socialProof: {
      en: 'readings done',
      ru: 'прочтений',
      zh: '次解读',
      id: 'pembacaan selesai',
    },
  },

  // ═══════════════════════════════════════
  // INFO SCREEN
  // ═══════════════════════════════════════
  info: {
    pageTag: {
      en: 'Profile',
      ru: 'Профиль',
      zh: '个人资料',
      id: 'Profil',
    },
    pageTitle1: {
      en: 'A few things',
      ru: 'Расскажи',
      zh: '关于你的',
      id: 'Beberapa hal',
    },
    pageTitle2: {
      en: 'about you',
      ru: 'о себе',
      zh: '一些小事',
      id: 'tentang kamu',
    },
    pendingBanner: {
      en: 'Complete your profile first — we\'ll bring you back to the match screen.',
      ru: 'Сначала заполни профиль — потом мы вернём тебя на экран совместимости.',
      zh: '先完成你的资料，我们会带你回到匹配页面。',
      id: 'Complete your profile first — we\'ll bring you back to the match screen.',
    },
    gender: {
      en: 'Gender',
      ru: 'Пол',
      zh: '性别',
      id: 'Gender',
    },
    male: {
      en: 'Male 👦',
      ru: 'М 👦',
      zh: '男生 👦',
      id: 'Pria 👦',
    },
    female: {
      en: 'Female 👧',
      ru: 'Ж 👧',
      zh: '女生 👧',
      id: 'Wanita 👧',
    },
    other: {
      en: 'Other ✨',
      ru: 'Другое ✨',
      zh: '其他 ✨',
      id: 'Lainnya ✨',
    },
    birthYearZodiac: {
      en: 'Birth Year & Zodiac',
      ru: 'Год рождения и знак',
      zh: '出生年份 & 星座',
      id: 'Tahun Lahir & Zodiak',
    },
    pastRelationships: {
      en: 'Past Relationships',
      ru: 'Прошлые отношения',
      zh: '过往恋爱经历',
      id: 'Hubungan Sebelumnya',
    },
    relNone: {
      en: 'None',
      ru: 'Нет',
      zh: '没有',
      id: 'Belum pernah',
    },
    rel12: {
      en: '1 – 2',
      ru: '1 – 2',
      zh: '1 – 2',
      id: '1 – 2',
    },
    rel35: {
      en: '3 – 5',
      ru: '3 – 5',
      zh: '3 – 5',
      id: '3 – 5',
    },
    rel6plus: {
      en: '6+',
      ru: '6+',
      zh: '6+',
      id: '6+',
    },
    continue: {
      en: 'Continue',
      ru: 'Продолжить',
      zh: '继续',
      id: 'Lanjut',
    },
  },

  // ═══════════════════════════════════════
  // EMOTION SCREEN
  // ═══════════════════════════════════════
  emotion: {
    pageTag: {
      en: 'Right now',
      ru: 'Прямо сейчас',
      zh: '此刻',
      id: 'Right now',
    },
    pageTitle1: {
      en: 'Where are you',
      ru: 'Где ты сейчас',
      zh: '你现在',
      id: 'Where are you',
    },
    pageTitle2: {
      en: 'emotionally?',
      ru: 'эмоционально?',
      zh: '情绪怎么样？',
      id: 'emotionally?',
    },
    subtitle: {
      en: 'It colors how you answer today.',
      ru: 'Это влияет на твои ответы.',
      zh: '这会影响你今天的作答方式。',
      id: 'It colors how you answer today.',
    },
    openTitle: {
      en: 'Open & Ready',
      ru: 'Открыт(а) и готов(а)',
      zh: '期待中',
      id: 'Open & Ready',
    },
    openSub: {
      en: 'Excited for something new',
      ru: 'Жду чего-то нового',
      zh: '对新感情充满期待',
      id: 'Excited for something new',
    },
    loveTitle: {
      en: 'Deeply in Love',
      ru: 'По уши влюблён(а)',
      zh: '恋爱脑ing',
      id: 'Deeply in Love',
    },
    loveSub: {
      en: 'Head and heart both in',
      ru: 'Голова и сердце — всё там',
      zh: '脑子和心都搭进去了',
      id: 'Head and heart both in',
    },
    complicatedTitle: {
      en: "It's Complicated",
      ru: 'Всё сложно',
      zh: '说不清楚',
      id: "It's Complicated",
    },
    complicatedSub: {
      en: 'Push and pull energy',
      ru: 'Тянет и отталкивает',
      zh: '又想靠近又想逃',
      id: 'Push and pull energy',
    },
    healingTitle: {
      en: 'Healing Mode',
      ru: 'Восстанавливаюсь',
      zh: '自我修复中',
      id: 'Healing Mode',
    },
    healingSub: {
      en: 'Taking time for myself',
      ru: 'Уделяю время себе',
      zh: '先照顾好自己',
      id: 'Taking time for myself',
    },
  },

  // ═══════════════════════════════════════
  // QUIZ SCREEN
  // ═══════════════════════════════════════
  quiz: {
    agree: {
      en: 'Agree',
      ru: 'Согласен',
      zh: '同意',
      id: 'Agree',
    },
    disagree: {
      en: 'Disagree',
      ru: 'Не согласен',
      zh: '不同意',
      id: 'Disagree',
    },
  },

  // ═══════════════════════════════════════
  // LOADING SCREEN
  // ═══════════════════════════════════════
  loading: {
    phase1: {
      en: 'Mapping emotional memory…',
      ru: 'Считываю эмоции…',
      zh: '正在读取情绪记忆…',
      id: 'Mapping emotional memory…',
    },
    phase2: {
      en: 'Analyzing attachment patterns…',
      ru: 'Анализирую привязанности…',
      zh: '正在分析依恋模式…',
      id: 'Analyzing attachment patterns…',
    },
    phase3: {
      en: 'Modeling your love style…',
      ru: 'Строю модель любви…',
      zh: '正在建模恋爱风格…',
      id: 'Modeling your love style…',
    },
    phase4: {
      en: 'Writing your profile…',
      ru: 'Пишу твой профиль…',
      zh: '正在写你的档案…',
      id: 'Writing your profile…',
    },
    step1: {
      en: '✦ Memory',
      ru: '✦ Память',
      zh: '✦ 记忆',
      id: '✦ Memory',
    },
    step2: {
      en: '✦ Attachment',
      ru: '✦ Привязанность',
      zh: '✦ 依恋',
      id: '✦ Attachment',
    },
    step3: {
      en: '✦ Love Style',
      ru: '✦ Стиль любви',
      zh: '✦ 恋爱风格',
      id: '✦ Love Style',
    },
    step4: {
      en: '✦ Profile',
      ru: '✦ Профиль',
      zh: '✦ 档案',
      id: '✦ Profile',
    },
  },

  // ═══════════════════════════════════════
  // RESULT SCREEN
  // ═══════════════════════════════════════
  result: {
    emotionalMbtiTag: {
      en: 'YOUR EMOTIONAL MBTI',
      ru: 'ТВОЙ ЭМО-MBTI',
      zh: '你的情感MBTI',
      id: 'YOUR EMOTIONAL MBTI',
    },
    attachmentStyle: {
      en: '· Attachment Style',
      ru: '· Тип привязанности',
      zh: '· 依恋类型',
      id: '· Attachment Style',
    },
    attachmentStyleLabel: {
      en: 'Attachment Style',
      ru: 'Тип привязанности',
      zh: '依恋类型',
      id: 'Gaya Kelekatan',
    },
    sameType: {
      en: 'Same Type',
      ru: 'Такой же тип',
      zh: '同类型',
      id: 'Same Type',
    },
    ofUsers: {
      en: '% of users',
      ru: '% пользователей',
      zh: '% 的用户',
      id: '% of users',
    },
    emotionalIQ: {
      en: 'Emotional IQ',
      ru: 'Эмоциональный IQ',
      zh: '情商',
      id: 'Emotional IQ',
    },
    aboveAverage: {
      en: 'Above average',
      ru: 'Выше среднего',
      zh: '高于平均',
      id: 'Above average',
    },
    soulMatch: {
      en: 'Soul Match',
      ru: 'Идеальная пара',
      zh: '灵魂匹配',
      id: 'Soul Match',
    },
    fullReport: {
      en: 'Full Report',
      ru: 'Полный отчёт',
      zh: '完整报告',
      id: 'Full Report',
    },
    fullReportSub: {
      en: 'No fluff. Just the parts you pretend are random.',
      ru: 'Без воды. Только то, что ты обычно списываешь на "случайно".',
      zh: '不灌鸡汤，只说你嘴硬不承认的那部分。',
      id: 'No fluff. Just the parts you pretend are random.',
    },
    copy: {
      en: 'Copy',
      ru: 'Скопировать',
      zh: '复制',
      id: 'Copy',
    },
    copied: {
      en: '✓ Copied',
      ru: '✓ Скопировано',
      zh: '✓ 已复制',
      id: '✓ Copied',
    },
    inviteHint: {
      en: 'Invite 1 friend, unlock a free match read',
      ru: 'Пригласи друга — бесплатный анализ связи',
      zh: '邀请1位好友，解锁免费合盘',
      id: 'Invite 1 friend, unlock a free match read',
    },

    retake: {
      en: '↺ Retake Test',
      ru: '↺ Пройти заново',
      zh: '↺ 重新测试',
      id: '↺ Retake Test',
    },
    matchYourType: {
      en: 'match your type',
      ru: 'с таким же типом',
      zh: '和你同类型',
      id: 'match your type',
    },
    areActive: {
      en: 'are active in Blink',
      ru: 'уже в Blink',
      zh: '正在使用Blink',
      id: 'are active in Blink',
    },
    openBlink: {
      en: 'Open Blink',
      ru: 'Открыть Blink',
      zh: '打开Blink',
      id: 'Open Blink',
    },
    pendingTitle: {
      en: 'Your reading is being generated',
      ru: 'Генерируем твой результат',
      zh: '正在生成你的解读',
      id: 'Your reading is being generated',
    },
    pendingSub: {
      en: "We'll take you there when it's ready",
      ru: 'Покажем, как только будет готово',
      zh: '好了马上给你看',
      id: "We'll take you there when it's ready",
    },
    shareText: {
      en: 'Blink says I\'m "{persona}" 💀\n{mbti} — code: {code}\n\nDrop yours, let\'s see if we\'re a disaster or endgame 👉',
      ru: 'Blink назвал меня «{persona}» 💀\n{mbti} — код: {code}\n\nСкидывай свой, проверим: катастрофа или endgame 👉',
      zh: 'Blink说我是「{persona}」💀\n{mbti}，代码：{code}\n\n发你的，看看我们是灾难还是天作之合 👉',
      id: 'Blink says I\'m "{persona}" 💀\n{mbti} — code: {code}\n\nDrop yours, let\'s see if we\'re a disaster or endgame 👉',
    },
  },

  // ═══════════════════════════════════════
  // DETAIL SCREEN
  // ═══════════════════════════════════════
  detail: {
    analysis: {
      en: 'Analysis',
      ru: 'Анализ',
      zh: '分析',
      id: 'Analisis',
    },
    loveLetter: {
      en: 'Love Letter',
      ru: 'Любовное письмо',
      zh: '情书',
      id: 'Surat Cinta',
    },
    emotionalMbtiTag: {
      en: 'YOUR EMOTIONAL MBTI',
      ru: 'ТВОЙ ЭМО-MBTI',
      zh: '你的情感MBTI',
      id: 'YOUR EMOTIONAL MBTI',
    },
    emotionalMbtiSub: {
      en: 'How you love, not just who you are',
      ru: 'Как ты любишь, а не кто ты есть',
      zh: '测的不是你是谁，是你怎么爱',
      id: 'How you love, not just who you are',
    },
    yourProfile: {
      en: 'YOUR PROFILE',
      ru: 'ВАШ ПРОФИЛЬ',
      zh: '你的档案',
      id: 'PROFILMU',
    },
    strengths: {
      en: 'STRENGTHS',
      ru: 'СИЛЬНЫЕ СТОРОНЫ',
      zh: '优势',
      id: 'KEKUATAN',
    },
    blindSpots: {
      en: 'BLIND SPOTS',
      ru: 'СЛЕПЫЕ ЗОНЫ',
      zh: '盲点',
      id: 'TITIK BUTA',
    },
    strengthLabel: {
      en: 'STRENGTH',
      ru: 'СИЛА',
      zh: '优势',
      id: 'STRENGTH',
    },
    blindSpotLabel: {
      en: 'BLINDSPOT',
      ru: 'СЛЕПАЯ ЗОНА',
      zh: '盲点',
      id: 'BLINDSPOT',
    },
    yourSoulMatch: {
      en: 'YOUR SOUL MATCH',
      ru: 'ТВОЯ ИДЕАЛЬНАЯ ПАРА',
      zh: '你的灵魂匹配',
      id: 'PASANGAN JIWAMU',
    },
    shareMyLetter: {
      en: 'Share My Letter',
      ru: 'Поделиться письмом',
      zh: '分享我的情书',
      id: 'Share My Letter',
    },
    shareLetterText: {
      en: 'Blink wrote me a love letter ✨\n\nI\'m {mbti} — "{persona}" 🌹\nMy code: {code}\n\nCheck our chemistry 👉',
      ru: 'Blink написал мне любовное письмо ✨\n\nЯ {mbti} — «{persona}» 🌹\nМой код: {code}\n\nПроверь нашу химию 👉',
      zh: 'Blink给我写了封情书 ✨\n\n我是 {mbti}「{persona}」🌹\n代码：{code}\n\n来看看我们的化学反应 👉',
      id: 'Blink wrote me a love letter ✨\n\nI\'m {mbti} — "{persona}" 🌹\nMy code: {code}\n\nCheck our chemistry 👉',
    },
    dimCrushSpeed: {
      en: 'Catch Feelings',
      ru: 'Скорость влюблённости',
      zh: '上头速度',
      id: 'Catch Feelings',
    },
    dimEmotionalWalls: {
      en: 'Emotional Armor',
      ru: 'Эмоциональная броня',
      zh: '情感防线',
      id: 'Emotional Armor',
    },
    dimIntimacyCraving: {
      en: 'Intimacy Craving',
      ru: 'Жажда близости',
      zh: '亲密渴望',
      id: 'Intimacy Craving',
    },
    dimBounceBack: {
      en: 'Bounce Back',
      ru: 'Восстановление',
      zh: '自愈能力',
      id: 'Bounce Back',
    },
    dimSixthSense: {
      en: 'Sixth Sense',
      ru: 'Шестое чувство',
      zh: '第六感',
      id: 'Sixth Sense',
    },
  },

  // ═══════════════════════════════════════
  // DUAL SCREEN
  // ═══════════════════════════════════════
  dual: {
    pageTag: {
      en: 'Emotional Match',
      ru: 'Эмоциональная связь',
      zh: '情感匹配',
      id: 'Emotional Match',
    },
    pageTitle1: {
      en: 'Check your',
      ru: 'Проверь свою',
      zh: '查看你的',
      id: 'Check your',
    },
    pageTitle2: {
      en: 'emotional match',
      ru: 'эмоциональную связь',
      zh: '情感匹配',
      id: 'emotional match',
    },
    personA: {
      en: 'Person A',
      ru: 'Человек A',
      zh: 'A',
      id: 'Person A',
    },
    personB: {
      en: 'Person B',
      ru: 'Человек B',
      zh: 'B',
      id: 'Person B',
    },
    useMine: {
      en: 'USE MINE',
      ru: 'МОЙ КОД',
      zh: '用我的',
      id: 'USE MINE',
    },
    checkCompat: {
      en: 'Check Match',
      ru: 'Проверить связь',
      zh: '测配对',
      id: 'Check Match',
    },
    pastReadings: {
      en: 'Past Readings',
      ru: 'История',
      zh: '历史记录',
      id: 'Past Readings',
    },
    noReadings: {
      en: 'No readings yet',
      ru: 'Пока пусто',
      zh: '还没有记录',
      id: 'No readings yet',
    },
    errorNotFound: {
      en: 'User not found',
      ru: 'Пользователь не найден',
      zh: '找不到用户',
      id: 'User not found',
    },
    errorNetwork: {
      en: 'Network error, please retry',
      ru: 'Ошибка сети, попробуй снова',
      zh: '网络错误，请重试',
      id: 'Network error, please retry',
    },
    errorSameCode: {
      en: 'Codes must be different',
      ru: 'Коды должны быть разными',
      zh: '两个代码不能一样',
      id: 'Codes must be different',
    },
    errorInvalidCode: {
      en: 'Enter a valid BLINK code (e.g. BLINK-7K3M2P)',
      ru: 'Введите корректный код BLINK (напр. BLINK-7K3M2P)',
      zh: '请输入有效的BLINK代码（例如 BLINK-7K3M2P）',
      id: 'Enter a valid BLINK code (e.g. BLINK-7K3M2P)',
    },
    freeReadsAvailable: {
      en: 'free match read available',
      ru: 'бесплатное чтение доступно',
      zh: '次免费匹配可用',
      id: 'free match read available',
    },
    freeReadsAvailablePlural: {
      en: 'free match reads available',
      ru: 'бесплатных чтений доступно',
      zh: '次免费匹配可用',
      id: 'free match reads available',
    },
    useFreeRead: {
      en: 'Use Free Match Read',
      ru: 'Бесплатное чтение',
      zh: '使用免费匹配',
      id: 'Use Free Match Read',
    },
  },

  // ═══════════════════════════════════════
  // REPORT SCREEN
  // ═══════════════════════════════════════
  report: {
    match: {
      en: 'MATCH',
      ru: 'МАТЧ',
      zh: '匹配',
      id: 'MATCH',
    },
    coreEnergy: {
      en: 'Your Main Dynamic',
      ru: 'Ваша главная динамика',
      zh: '你们这段关系的主线',
      id: 'Your Main Dynamic',
    },
    compatBreakdown: {
      en: 'What Works vs What Breaks',
      ru: 'Что работает и где ломается',
      zh: '哪里稳，哪里会炸',
      id: 'What Works vs What Breaks',
    },
    growthEdges: {
      en: '3 Fights You Will Have',
      ru: '3 конфликта, которые точно будут',
      zh: '你们大概率会吵的3件事',
      id: '3 Fights You Will Have',
    },
    loveLanguages: {
      en: 'How You Two Show Love',
      ru: 'Как вы двое проявляете любовь',
      zh: '你们各自怎么表达爱',
      id: 'How You Two Show Love',
    },
    dimChemistry: {
      en: 'Chemistry',
      ru: 'Химия',
      zh: '化学反应',
      id: 'Chemistry',
    },
    dimEmotionalSync: {
      en: 'Emotional Sync',
      ru: 'Эмоциональный синхрон',
      zh: '情绪契合',
      id: 'Emotional Sync',
    },
    dimResonance: {
      en: 'Resonance',
      ru: 'Резонанс',
      zh: '灵魂共振',
      id: 'Resonance',
    },
    dimSynergy: {
      en: 'Synergy',
      ru: 'Синергия',
      zh: '共生潜力',
      id: 'Synergy',
    },
    peakDuration: {
      en: 'Peak Duration',
      ru: 'Пик отношений',
      zh: '情感高峰期',
      id: 'Peak Duration',
    },
    peakDays: {
      en: 'days',
      ru: 'дней',
      zh: '天',
      id: 'days',
    },
    peakYears: {
      en: 'years',
      ru: 'лет',
      zh: '年',
      id: 'years',
    },
    peakLifetime: {
      en: 'A lifetime',
      ru: 'Всю жизнь',
      zh: '一辈子',
      id: 'A lifetime',
    },
    peakBeats: {
      en: 'Beats {pct}% of pairs',
      ru: 'Лучше {pct}% пар',
      zh: '超过了 {pct}% 的配对',
      id: 'Beats {pct}% of pairs',
    },
  },

  // ═══════════════════════════════════════
  // PAYWALL SCREEN
  // ═══════════════════════════════════════
  paywall: {
    pageTag: {
      en: 'Retest',
      ru: 'Пересдать',
      zh: '重测',
      id: 'Retest',
    },
    title1: {
      en: "You've used your",
      ru: 'Ты использовал(а) все',
      zh: '你已经用完了',
      id: "You've used your",
    },
    title2: {
      en: 'free readings',
      ru: 'бесплатные попытки',
      zh: '免费解读次数',
      id: 'free readings',
    },
    sub: {
      en: 'Fresh run, fresh callout. New code, new profile, new blind spots.',
      ru: 'Новый прогон, новый разбор. Новый код, новый профиль, новые слепые зоны.',
      zh: '每次都是全新重跑：新代码、新档案、新盲点。',
      id: 'Fresh run, fresh callout. New code, new profile, new blind spots.',
    },
    unlockAnother: {
      en: '10 Stars for a full rerun (worth it if your life changed this week).',
      ru: '10 Stars за полный перезапуск (особенно если жизнь уже перевернулась за неделю).',
      zh: '10 Stars 全量重测（这周感情状态变了的话很值）。',
      id: '10 Stars for a full rerun (worth it if your life changed this week).',
    },
    whatYouGet: {
      en: 'WHAT YOU GET',
      ru: 'ЧТО ТЫ ПОЛУЧИШЬ',
      zh: '你将获得',
      id: 'WHAT YOU GET',
    },
    item1: {
      en: '✦ New BLINK Code',
      ru: '✦ Новый BLINK-код',
      zh: '✦ 全新BLINK代码',
      id: '✦ New BLINK Code',
    },
    item2: {
      en: '✦ Fresh GPT-5.4 profile',
      ru: '✦ Свежий GPT-5.4 профиль',
      zh: '✦ 全新GPT-5.4档案',
      id: '✦ Fresh GPT-5.4 profile',
    },
    item3: {
      en: '✦ Updated love persona & radar',
      ru: '✦ Обновлённая персона и радар',
      zh: '✦ 全新恋爱人格 & 雷达图',
      id: '✦ Updated love persona & radar',
    },
    unlockBtn: {
      en: 'Unlock for 10 Stars ✦',
      ru: 'Разблокировать за 10 Stars ✦',
      zh: '解锁 10 Stars ✦',
      id: 'Unlock for 10 Stars ✦',
    },
    maybeLater: {
      en: 'Maybe later',
      ru: 'Может потом',
      zh: '以后再说',
      id: 'Maybe later',
    },
  },

  // ═══════════════════════════════════════
  // COMPAT MODAL
  // ═══════════════════════════════════════
  compat: {
    checkCompat: {
      en: 'Check Match',
      ru: 'Проверить связь',
      zh: '测配对',
      id: 'Check Match',
    },
    desc: {
      en: 'Not a cute horoscope. This is a blunt breakdown of your chemistry, conflict loops, and long-term potential.',
      ru: 'Это не милый гороскоп. Это жёсткий разбор вашей химии, конфликтных циклов и потенциала вдолгую.',
      zh: '这不是甜甜星座文案，是你们化学反应、吵架循环和长期潜力的硬核拆解。',
      id: 'Not a cute horoscope. This is a blunt breakdown of your chemistry, conflict loops, and long-term potential.',
    },
    readingPrice: {
      en: 'READING PRICE',
      ru: 'СТОИМОСТЬ',
      zh: '解读价格',
      id: 'READING PRICE',
    },
    priceVal: {
      en: '20 ⭐ Stars',
      ru: '20 ⭐ Stars',
      zh: '20 ⭐ Stars',
      id: '20 ⭐ Stars',
    },
    priceNote: {
      en: 'One-time · Instant',
      ru: 'Разовый · Мгновенный',
      zh: '一次性 · 即时',
      id: 'One-time · Instant',
    },
    unlockBtn: {
      en: 'Unlock Reading ✦ 20 Stars',
      ru: 'Открыть за 20 Stars ✦',
      zh: '解锁解读 ✦ 20 Stars',
      id: 'Unlock Reading ✦ 20 Stars',
    },
    maybeLater: {
      en: 'Maybe later',
      ru: 'Может потом',
      zh: '以后再说',
      id: 'Maybe later',
    },
    loadPhase1: {
      en: 'Reading emotional patterns…',
      ru: 'Считываю эмоциональные паттерны…',
      zh: '正在解读情感模式…',
      id: 'Reading emotional patterns…',
    },
    loadPhase2: {
      en: 'Analyzing attachment styles…',
      ru: 'Анализирую стили привязанности…',
      zh: '正在分析依恋类型…',
      id: 'Analyzing attachment styles…',
    },
    loadPhase3: {
      en: 'Modeling love dynamics…',
      ru: 'Моделирую динамику любви…',
      zh: '正在建模爱情互动…',
      id: 'Modeling love dynamics…',
    },
    loadPhase4: {
      en: 'Generating your reading…',
      ru: 'Генерирую ваш результат…',
      zh: '正在生成你的解读…',
      id: 'Generating your reading…',
    },
    step1: {
      en: '✦ Patterns',
      ru: '✦ Паттерны',
      zh: '✦ 模式',
      id: '✦ Patterns',
    },
    step2: {
      en: '✦ Attachment',
      ru: '✦ Привязанность',
      zh: '✦ 依恋',
      id: '✦ Attachment',
    },
    step3: {
      en: '✦ Dynamics',
      ru: '✦ Динамика',
      zh: '✦ 互动',
      id: '✦ Dynamics',
    },
    step4: {
      en: '✦ Reading',
      ru: '✦ Чтение',
      zh: '✦ 解读',
      id: '✦ Reading',
    },
    retryBtn: {
      en: '↺ Retry',
      ru: '↺ Повторить',
      zh: '↺ 重试',
      id: '↺ Retry',
    },
    close: {
      en: 'Close',
      ru: 'Закрыть',
      zh: '关闭',
      id: 'Close',
    },
    paymentFailed: {
      en: 'Payment was not completed.',
      ru: 'Оплата не была завершена.',
      zh: '支付未完成。',
      id: 'Payment was not completed.',
    },
    invoiceError: {
      en: 'Could not create invoice. Please try again.',
      ru: 'Не удалось создать счёт. Попробуйте снова.',
      zh: '无法创建账单，请重试。',
      id: 'Could not create invoice. Please try again.',
    },
    retryFailed: {
      en: 'Retry failed. Please try again.',
      ru: 'Повтор не удался. Попробуйте ещё раз.',
      zh: '重试失败，请再试一次。',
      id: 'Retry failed. Please try again.',
    },
  },

  // ═══════════════════════════════════════
  // QUICK MATCH
  // ═══════════════════════════════════════
  qm: {
    score: { en: 'match', ru: 'совпадение', zh: '匹配', id: 'kecocokan' },
    coreEnergy: { en: 'Core dynamic', ru: 'Ключевая динамика', zh: '核心互动', id: 'Dinamika inti' },
    insight: { en: 'Insight', ru: 'Инсайт', zh: '洞察', id: 'Insight' },
    risk: { en: 'Risk', ru: 'Риск', zh: '风险', id: 'Risiko' },
    fullReportHint: {
      en: 'Want the full deep-read? Get their BLINK code.',
      ru: 'Хочешь полный анализ? Получи их BLINK код.',
      zh: '想要完整深度分析？拿到对方的 BLINK 码。',
      id: 'Mau analisis lengkap? Dapatkan kode BLINK mereka.',
    },
    backToMatch: { en: 'Back to Match', ru: 'Назад к Match', zh: '返回匹配', id: 'Kembali ke Match' },
  },
  dual: {
    quickMatchToggle: {
      en: "Don't have their code? Quick match ✦",
      ru: 'Нет их кода? Быстрый матч ✦',
      zh: '没有对方的码？快速匹配 ✦',
      id: 'Tidak punya kode mereka? Quick match ✦',
    },
    qmRelationship: { en: 'Relationship', ru: 'Отношение', zh: '关系', id: 'Hubungan' },
    qmSelectRelation: { en: 'Select…', ru: 'Выберите…', zh: '选择…', id: 'Pilih…' },
    qmFriends: { en: 'Friends', ru: 'Друзья', zh: '朋友', id: 'Teman' },
    qmFlirting: { en: 'Flirting', ru: 'Флирт', zh: '暧昧中', id: 'PDKT' },
    qmDating: { en: 'Dating', ru: 'Встречаемся', zh: '约会中', id: 'Pacaran' },
    qmEx: { en: 'Ex', ru: 'Бывший/-ая', zh: '前任', id: 'Mantan' },
    qmMbti: { en: 'Their MBTI', ru: 'Их MBTI', zh: '对方的 MBTI', id: 'MBTI mereka' },
    qmSelectMbti: { en: 'Select or skip…', ru: 'Выберите или пропустите…', zh: '选择或跳过…', id: 'Pilih atau lewati…' },
    qmDontKnow: { en: "I don't know", ru: 'Не знаю', zh: '不知道', id: 'Tidak tahu' },
    qmAge: { en: 'Age range', ru: 'Возраст', zh: '年龄段', id: 'Rentang usia' },
    qmSelectAge: { en: 'Select…', ru: 'Выберите…', zh: '选择…', id: 'Pilih…' },
    qmZodiac: { en: 'Zodiac', ru: 'Знак', zh: '星座', id: 'Zodiak' },
    qmSelectZodiac: { en: 'Select…', ru: 'Выберите…', zh: '选择…', id: 'Pilih…' },
    qmDescribe: { en: 'Describe them (optional)', ru: 'Опишите их (необязательно)', zh: '描述对方（选填）', id: 'Deskripsikan mereka (opsional)' },
    qmDescPlaceholder: {
      en: 'e.g. "Always overthinking, texts back fast, secretly a softie"',
      ru: 'напр. "Всегда перед-думывает, отвечает быстро, тайный мягкий"',
      zh: '例如"总是想太多，秒回消息，嘴硬心软"',
      id: 'cth. "Selalu overthinking, balas chat cepat, diam-diam lembut"',
    },
    qmSubmit: { en: '✦ Quick Read', ru: '✦ Быстрый анализ', zh: '✦ 快速解读', id: '✦ Quick Read' },
    qmHint: { en: 'Free · Based on your profile + their type', ru: 'Бесплатно · На основе вашего профиля', zh: '免费 · 基于你的档案和对方的类型', id: 'Gratis · Berdasarkan profilmu + tipe mereka' },
  },

  // ═══════════════════════════════════════
  // TRACE SCREEN
  // ═══════════════════════════════════════
  trace: {
    title: { en: 'Your inner weather', ru: 'Твоя внутренняя погода', zh: '你的内心天气', id: 'Cuaca batinmu' },
    subtitle: { en: 'A one-minute daily check-in for emotion, connection, and patterns.', ru: 'Ежедневная минутная отметка про эмоции, близость и паттерны.', zh: '每天 1 分钟，记录情绪、关系和模式。', id: 'Check-in satu menit untuk emosi, koneksi, dan pola.' },
    streak: { en: 'day streak', ru: 'дней подряд', zh: '连续天数', id: 'hari beruntun' },
    todayCheckin: { en: 'Today check-in', ru: 'Отметка на сегодня', zh: '今天的记录', id: 'Check-in hari ini' },
    moodLabel: { en: 'How do you feel overall?', ru: 'Как ты себя чувствуешь?', zh: '你今天整体感觉如何？', id: 'Secara keseluruhan kamu merasa bagaimana?' },
    personLabel: { en: 'Who affected you most today?', ru: 'Кто сильнее всего повлиял на тебя сегодня?', zh: '今天最影响你的人是谁？', id: 'Siapa yang paling memengaruhimu hari ini?' },
    shiftLabel: { en: 'How did the relationship feel?', ru: 'Как ощущалась связь?', zh: '今天这段关系是什么感觉？', id: 'Bagaimana hubungan ini terasa?' },
    noteLabel: { en: 'One short note', ru: 'Короткая заметка', zh: '一句短备注', id: 'Satu catatan singkat' },
    notePlaceholder: { en: 'e.g. replied fast, acted cold, I wanted to text first...', ru: 'напр. быстро ответил, был холоден, я хотел написать первым...', zh: '比如：秒回了、突然变冷、我很想先发消息……', id: 'mis. balas cepat, jadi dingin, aku ingin chat duluan...' },
    saveToday: { en: 'Save today', ru: 'Сохранить сегодня', zh: '记录今天', id: 'Simpan hari ini' },
    saving: { en: 'Saving...', ru: 'Сохраняю...', zh: '记录中...', id: 'Menyimpan...' },
    todayInsight: { en: 'Today\'s insight', ru: 'Инсайт дня', zh: '今天的洞察', id: 'Insight hari ini' },
    weekWeather: { en: 'Your 7-day weather', ru: 'Твоя погода за 7 дней', zh: '你的 7 天天气', id: 'Cuaca 7 harimu' },
    patternTitle: { en: 'Pattern hint', ru: 'Подсказка о паттерне', zh: '模式提示', id: 'Petunjuk pola' },
    empty: { en: 'Your first few entries will start drawing the pattern.', ru: 'Первые записи начнут проявлять твой паттерн.', zh: '记录几天后，你的模式就会慢慢浮出来。', id: 'Beberapa catatan pertama akan mulai membentuk polamu.' },
    moodCalm: { en: 'Calm', ru: 'Спокойно', zh: '平静', id: 'Tenang' },
    moodHappy: { en: 'Happy', ru: 'Радостно', zh: '开心', id: 'Senang' },
    moodAnxious: { en: 'Anxious', ru: 'Тревожно', zh: '焦虑', id: 'Cemas' },
    moodNumb: { en: 'Numb', ru: 'Пусто', zh: '空掉', id: 'Hampa' },
    moodObsessed: { en: 'Obsessed', ru: 'Накрыло', zh: '上头', id: 'Tergila-gila' },
    moodHurt: { en: 'Hurt', ru: 'Больно', zh: '难受', id: 'Terluka' },
    personNone: { en: 'No one', ru: 'Никто', zh: '没有人', id: 'Tidak ada' },
    personCrush: { en: 'Crush', ru: 'Краш', zh: '暧昧对象', id: 'Gebetan' },
    personPartner: { en: 'Partner', ru: 'Партнёр', zh: '伴侣', id: 'Pasangan' },
    personEx: { en: 'Ex', ru: 'Бывший(ая)', zh: '前任', id: 'Mantan' },
    personFriend: { en: 'Friend', ru: 'Друг', zh: '朋友', id: 'Teman' },
    personFamily: { en: 'Family', ru: 'Семья', zh: '家人', id: 'Keluarga' },
    personOther: { en: 'Other', ru: 'Другое', zh: '其他', id: 'Lainnya' },
    shiftCloser: { en: 'Closer', ru: 'Стали ближе', zh: '更靠近了', id: 'Lebih dekat' },
    shiftUnchanged: { en: 'No change', ru: 'Без изменений', zh: '没变化', id: 'Tidak berubah' },
    shiftDistant: { en: 'More distant', ru: 'Стало дальше', zh: '更疏远了', id: 'Lebih jauh' },
    shiftWantedCloser: { en: 'I wanted more closeness', ru: 'Хотелось больше близости', zh: '我想更靠近', id: 'Aku ingin lebih dekat' },
    shiftPulledBack: { en: 'I pulled back', ru: 'Я отстранился(ась)', zh: '我主动后撤了', id: 'Aku yang menarik diri' },
  },

  // ═══════════════════════════════════════
  // COMMON / SHARED
  // ═══════════════════════════════════════
  common: {
    errorGeneric: {
      en: 'Something went wrong. Please try again.',
      ru: 'Что-то пошло не так. Попробуйте снова.',
      zh: '出了点问题，请重试。',
      id: 'Something went wrong. Please try again.',
    },
    paymentFailed: {
      en: 'Payment failed. Please try again.',
      ru: 'Оплата не удалась. Попробуйте ещё раз.',
      zh: '支付失败，请重试。',
      id: 'Payment failed. Please try again.',
    },
  },
}

// Flatten nested messages into dot-notation keys
function flatten(obj, prefix = '') {
  const result = {}
  for (const key of Object.keys(obj)) {
    const val = obj[key]
    const newKey = prefix ? `${prefix}.${key}` : key
    if (val && typeof val === 'object' && !val.en && !val.ru && !val.zh) {
      Object.assign(result, flatten(val, newKey))
    } else {
      result[newKey] = val
    }
  }
  return result
}

const flatMessages = flatten(messages)

export function useI18n() {
  const store = useAppStore()

  const t = (key, params) => {
    const entry = flatMessages[key]
    if (!entry) return key
    let text = entry[store.lang] || entry.en || key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
      }
    }
    return text
  }

  // Reactive computed version for templates
  const tc = (key, params) => {
    return computed(() => t(key, params))
  }

  return { t, tc }
}
