const config = window.SLOVO_SUPABASE_CONFIG || {}
const createClient = window.supabase?.createClient
const app = document.querySelector('#app')
const inviteStorageKey = 'slovo-pending-invite'
const emptyData = { students: [], words: [], packs: [], assignments: [], progress: {}, invites: [] }
const translations = {
  'your Ukrainian words': 'твої українські слова',
  'Ukrainian, one word at a time': 'Українська, слово за словом',
  'Use your invite code': 'Введи код запрошення',
  'A new word is a small win.': 'Кожне нове слово — це перемога.',
  'This Google account is ready. Enter the code that the admin shared with you.': 'Цей обліковий запис Google готовий. Введи код, який надав адміністратор.',
  'Enter the invite code that the admin shared with you. Then continue with Google.': 'Введи код запрошення від адміністратора. Потім продовж через Google.',
  'Invite code': 'Код запрошення',
  'Activate account': 'Активувати обліковий запис',
  'Continue with Google': 'Продовжити з Google',
  'Already joined?': 'Вже маєш обліковий запис?',
  'Sign out': 'Вийти',
  'Sign in with Google': 'Увійти через Google',
  'Your code is not tied to an email. Use the Google account that you want to use for learning.': 'Код не прив’язаний до електронної пошти. Використовуй обліковий запис Google, з яким будеш навчатися.',
  'Connection setup': 'Налаштування з’єднання',
  'Connect this site to Supabase.': 'Під’єднай цей сайт до Supabase.',
  'Add the project URL and public publishable key to the ignored .env file. Then build the site again.': 'Додай URL проєкту та відкритий ключ до файлу .env. Потім знову збери сайт.',
  'Do not add the service-role key here. The site uses only a public client key and protects data with database policies.': 'Не додавай сюди секретний ключ service-role. Сайт використовує лише відкритий ключ. Правила бази даних захищають дані.',
  'Loading your learning space…': 'Завантаження твого навчального простору…',
  'Workspace': 'Робочий простір',
  'Overview': 'Огляд',
  'Students': 'Учні',
  'Word library': 'Словник',
  'Flashcard packs': 'Набори карток',
  'My learning': 'Моє навчання',
  'My packs': 'Мої набори',
  'My progress': 'Мій прогрес',
  'Admin': 'Адміністратор',
  'Student': 'Учень',
  'Connected': 'Під’єднано',
  'Your Ukrainian practice': 'Твоя практика української',
  'Ready for a little practice?': 'Потренуємося?',
  'Pick a pack and learn a few new words today.': 'Обери набір і вивчи сьогодні кілька нових слів.',
  'Choose a pack →': 'Обрати набір →',
  'thank you': 'дякую',
  'hello': 'привіт',
  'My packs': 'Мої набори',
  'Assigned by your admin': 'Призначив адміністратор',
  'Words known': 'Відомі слова',
  'Across your packs': 'У всіх твоїх наборах',
  'Still learning': 'Ще вчу',
  'Keep them in rotation': 'Повторюй ці слова',
  'Progress': 'Прогрес',
  'Words marked as known': 'Слова, які ти знаєш',
  'Your packs': 'Твої набори',
  'View all →': 'Переглянути всі →',
  'No packs yet': 'Наборів поки немає',
  'Your admin will assign a pack when it is ready.': 'Адміністратор призначить тобі набір, коли він буде готовий.',
  'words': 'слів',
  'known': 'відомо',
  'complete': 'готово',
  'New pack': 'Новий набір',
  'Study words →': 'Вивчати слова →',
  'Your library': 'Твоя бібліотека',
  'Choose a set and practise at your own pace.': 'Обери набір і навчайся у власному темпі.',
  'Your learning': 'Твоє навчання',
  'Words that you know and words that you practise.': 'Слова, які ти знаєш, і слова, які ще вивчаєш.',
  'Words in your packs': 'Слова у твоїх наборах',
  'Unique words': 'Унікальні слова',
  'Known': 'Знаю',
  'Words you know': 'Слова, які ти знаєш',
  'Learning': 'Вивчаю',
  'Words to practise': 'Слова для повторення',
  'Not started': 'Ще не починав',
  'New words to meet': 'Нові слова',
  'Pack progress': 'Прогрес за наборами',
  'Teacher workspace': 'Простір учителя',
  'Manage students, words, and flashcard packs.': 'Керуй учнями, словами та наборами карток.',
  'Create invite code': 'Створити код запрошення',
  'Learners with access': 'Учні з доступом',
  'Words ready to teach': 'Слова для вивчення',
  'Curated sets': 'Підготовлені набори',
  'Assignments': 'Призначення',
  'Packs shared with students': 'Набори для учнів',
  'Your students': 'Твої учні',
  'Manage students →': 'Керувати учнями →',
  'Quick actions': 'Швидкі дії',
  'Add a word': 'Додати слово',
  'Create a pack': 'Створити набір',
  'No students yet': 'Учнів поки немає',
  'Create an invite code and share it with a learner.': 'Створи код запрошення та надішли його учню.',
  'Assigned packs': 'Призначені набори',
  'Assign packs': 'Призначити набори',
  'Class list': 'Список учнів',
  'Create a code and add a note to identify the learner.': 'Створи код і додай примітку, щоб упізнати учня.',
  'Invite codes': 'Коди запрошення',
  'Label and note': 'Ім’я та примітка',
  'Role': 'Роль',
  'Status': 'Статус',
  'Expires': 'Дійсний до',
  'Redeemed by': 'Використав',
  'Used': 'Використано',
  'Unused': 'Не використано',
  'No expiry': 'Без терміну дії',
  'Redeemed': 'Активовано',
  'No invite codes yet.': 'Кодів запрошення поки немає.',
  'Shared library': 'Спільний словник',
  'Add translations once. Use them in any pack.': 'Додай переклад один раз і використовуй його в різних наборах.',
  'Add a word': 'Додати слово',
  'Example': 'Приклад',
  'Audio': 'Аудіо',
  'Audio set': 'Аудіо додано',
  'Browser voice': 'Голос браузера',
  'Edit': 'Змінити',
  'Remove': 'Видалити',
  'Browser speech works when a Ukrainian voice is available.': 'Озвучення працює, якщо в браузері є український голос.',
  'Search words': 'Пошук слів',
  'No words match this search.': 'За цим запитом слів немає.',
  'Your teaching sets': 'Твої навчальні набори',
  'Build a set from your word library, then assign it.': 'Створи набір зі словника та признач його учням.',
  'Use words from your shared library.': 'Використовуй слова зі спільного словника.',
  'No packs yet': 'Наборів поки немає',
  'Create a pack to begin.': 'Створи перший набір.',
  'Close': 'Закрити',
  'Edit word': 'Змінити слово',
  'Add Ukrainian text and an English meaning.': 'Додай українське слово та його значення англійською.',
  'Ukrainian word': 'Українське слово',
  'English meaning': 'Значення англійською',
  'Example sentence': 'Приклад речення',
  'Audio file path or URL': 'Шлях або URL аудіофайлу',
  'Optional': 'Необов’язково',
  'Cancel': 'Скасувати',
  'Save word': 'Зберегти слово',
  'Create a pack': 'Створити набір',
  'Choose a name and add words.': 'Вкажи назву та додай слова.',
  'Pack name': 'Назва набору',
  'Description': 'Опис',
  'Level': 'Рівень',
  'Words in this pack': 'Слова в наборі',
  'Add words first.': 'Спочатку додай слова.',
  'Save pack': 'Зберегти набір',
  'Create an invite code': 'Створити код запрошення',
  'Add a label so you know who will use this code.': 'Додай ім’я, щоб знати, хто використає цей код.',
  'Learner label': 'Ім’я учня',
  'For example: Ana, year 8': 'Наприклад: Анна, 8 клас',
  'Admin note': 'Примітка адміністратора',
  'Optional details for you': 'Необов’язкова примітка для тебе',
  'This code is not tied to an email address.': 'Цей код не прив’язаний до електронної пошти.',
  'Create code': 'Створити код',
  'Choose who can study this pack.': 'Обери, хто може вивчати цей набір.',
  'Create a student and a pack first.': 'Спочатку створи учня та набір.',
  'Save assignments': 'Зберегти призначення',
  'Exit study': 'Завершити навчання',
  'Back to packs': 'До наборів',
  'Ukrainian → English': 'Українська → англійська',
  'English → Ukrainian': 'Англійська → українська',
  'What does this word mean?': 'Що означає це слово?',
  'Ukrainian': 'Українська',
  'English': 'Англійська',
  'Play Ukrainian pronunciation': 'Прослухати вимову українською',
  'I know this': 'Я це знаю',
  'Show meaning →': 'Показати значення →',
  'Already know this · skip →': 'Вже знаю · пропустити →',
  'Skip for now →': 'Пропустити →',
  'Study session complete': 'Навчання завершено',
  'Your progress is saved.': 'Твій прогрес збережено.',
  'Чудово! Nice work.': 'Чудово! Гарна робота.',
  'You finished this set. Your progress is saved.': 'Ти завершив цей набір. Твій прогрес збережено.',
  'Study again': 'Вчити ще раз',
  'Audio is not available in this browser.': 'У цьому браузері аудіо недоступне.',
  'This pack does not have any words yet.': 'У цьому наборі ще немає слів.',
  'Invite code copied.': 'Код запрошення скопійовано.',
  'Word removed.': 'Слово видалено.',
  'Word saved.': 'Слово збережено.',
  'Pack saved.': 'Набір збережено.',
  'Pack assignments saved.': 'Призначення набору збережено.',
  'Enter the invite code.': 'Введи код запрошення.',
  'This code is invalid, expired, or already used. Ask the admin for a new code.': 'Цей код недійсний, прострочений або вже використаний. Попроси адміністратора створити новий код.',
  'Invite code ready': 'Код запрошення готовий',
  'Student invite code': 'Код запрошення для учня',
  'Copy code': 'Скопіювати код',
  'Done': 'Готово',
  'Assign': 'Призначити',
  'Edit pack': 'Змінити набір',
  'The database does not save the code itself. Copy it now.': 'База даних не зберігає сам код. Скопіюй його зараз.',
  'Share this code with': 'Надішли цей код учню:',
  'Suspend access': 'Призупинити доступ',
  'Restore access': 'Відновити доступ',
  'Active': 'Активний',
  'Suspended': 'Призупинено',
  'Access': 'Доступ',
  'Actions': 'Дії',
  'Import JSON': 'Імпорт JSON',
  'Import a pack from JSON': 'Імпортувати набір із JSON',
  'Choose a JSON file with a pack title and a words list.': 'Обери JSON-файл із назвою набору та списком слів.',
  'Search Ukrainian or English words': 'Шукати слова українською або англійською',
  'Scroll to load more words': 'Прокрути, щоб завантажити більше слів',
  'Loading words…': 'Завантаження слів…',
  'selected': 'вибрано',
  'JSON pack format': 'Формат JSON набору',
  'Select JSON file': 'Обрати JSON-файл',
  'Import pack': 'Імпортувати набір',
  'Pack imported.': 'Набір імпортовано.',
  'The JSON file must contain a title and a words list.': 'У JSON-файлі мають бути назва набору та список слів.',
  'Each word needs Ukrainian and English text.': 'Кожне слово має містити український та англійський текст.',
  'Account suspended': 'Обліковий запис призупинено',
  'Your access is paused. Contact the admin if you think this is a mistake.': 'Твій доступ призупинено. Звернися до адміністратора, якщо це помилка.',
  'Student access restored.': 'Доступ учня відновлено.',
  'Student access suspended.': 'Доступ учня призупинено.',
  'Select a JSON file.': 'Обери JSON-файл.',
  'A pack can contain no more than 5000 words.': 'Набір може містити не більше 5000 слів.',
  'Only an active admin can change student access': 'Змінювати доступ може лише активний адміністратор.',
  'An admin cannot suspend their own account': 'Адміністратор не може призупинити власний обліковий запис.',
  'Student account was not found': 'Обліковий запис учня не знайдено.',
  'Only an active admin can import a pack': 'Імпортувати набір може лише активний адміністратор.',
  'The JSON file must contain one pack object': 'JSON-файл має містити один об’єкт набору.',
  'The pack title must have 1 to 120 characters': 'Назва набору має містити від 1 до 120 символів.',
  'The pack description must have 2000 characters or less': 'Опис набору має містити не більше 2000 символів.',
  'The pack level must have 40 characters or less': 'Рівень набору має містити не більше 40 символів.',
  'The pack must include a words array': 'Набір має містити список слів.',
  'A pack must include from 1 to 5000 words': 'Набір має містити від 1 до 5000 слів.',
  'Each word must be a JSON object': 'Кожне слово має бути об’єктом JSON.',
  'Each Ukrainian word must have 1 to 200 characters': 'Українське слово має містити від 1 до 200 символів.',
  'Each English meaning must have 1 to 300 characters': 'Англійське значення має містити від 1 до 300 символів.',
  'The word could not be saved': 'Не вдалося зберегти слово.',
  'The file does not contain valid JSON.': 'JSON-файл має містити коректний JSON.',
  'The database does not save the code itself. Copy it now.': 'База даних не зберігає сам код. Скопіюй його зараз.',
  'You finished this set. Your progress is saved.': 'Ти завершив цей набір. Твій прогрес збережено.',
  'Main navigation': 'Головна навігація',
  'No description': 'Без опису',
  'For now': 'Поки що',
  'Example:': 'Наприклад:',
  'Pack': 'Набір',
  'Starter': 'Початковий',
  'student': 'учень',
  'admin': 'адміністратор',
  'Invite code ready': 'Код запрошення готовий',
  'Invite code copied.': 'Код запрошення скопійовано.',
  'Show meaning': 'Показати значення',
  'Save assignments': 'Зберегти призначення',
  'English meaning': 'Значення англійською',
  'Already joined?': 'Вже маєш обліковий запис?',
  'The code is not tied to an email address.': 'Код не прив’язаний до електронної пошти.',
  'Audio file path or URL': 'Шлях або URL аудіофайлу',
  'Words known': 'Відомі слова',
  'Words ready to teach': 'Слова для вивчення',
  'Assignments': 'Призначення',
  'Set': 'Набір',
  'Done': 'Готово',
  'settings': 'налаштування'
}

let supabase = null
let session = null
let profile = null
let data = structuredClone(emptyData)
let sessionWork = null
let sessionWorkToken = ''
let page = 'home'
let modal = null
let study = null
let alertMessage = ''
let search = ''
let lastInviteCode = ''
let wordPickerSearch = ''
let wordPickerOffset = 0
let wordPickerHasMore = true
let wordPickerLoading = false
let wordPickerRequest = 0
let wordPickerItems = []
let wordPickerTimer = 0
let wordPickerSelected = new Set()
let language = localStorage.getItem('slovo-language') === 'uk' ? 'uk' : 'en'

function languageToggle() {
  return `<button class="language-toggle" type="button" data-action="toggle-language" aria-label="${language === 'en' ? 'Switch to Ukrainian' : 'Перемкнути на англійську'}"><span class="${language === 'en' ? 'selected' : ''}">EN</span><span class="${language === 'uk' ? 'selected' : ''}">УКР</span></button>`
}

function localize(root = app) {
  document.documentElement.lang = language
  if (language === 'en') return
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node
  while ((node = walker.nextNode())) {
    const original = node.nodeValue
    const trimmed = original.trim()
    if (!trimmed) continue
    let translated = translations[trimmed]
    if (!translated) translated = trimmed
      .replace(/^Welcome, (.+)$/, 'Вітаємо, $1')
      .replace(/^Привіт, (.+)! Ready for a little practice\?$/, 'Привіт, $1! Потренуємося?')
      .replace(/^Share this code with (.+)\. It can be used once\.$/, 'Надішли цей код учню: $1. Його можна використати один раз.')
      .replace(/^Assign packs to (.+)$/, 'Призначити набори для $1')
      .replace(/^Assign (.+)$/, 'Призначити: $1')
      .replace(/^(Admin|Student) · (.+)$/, (_, role, email) => `${role === 'Admin' ? 'Адміністратор' : 'Учень'} · ${email}`)
      .replace(/^(\d+) packs shared with students$/, '$1 наборів призначено учням')
      .replace(/^(\d+) words in this pack$/, '$1 слів у наборі')
      .replace(/^(\d+) students assigned$/, '$1 учнів мають доступ')
      .replace(/^(\d+) packs$/, '$1 наборів')
      .replace(/^(\d+) known$/, '$1 відомо')
      .replace(/^(\d+) selected$/, '$1 вибрано')
      .replace(/^(\d+) of (\d+)$/, '$1 з $2')
      .replace(/^(\d+) words$/, '$1 слів')
    if (translated !== trimmed) node.nodeValue = original.replace(trimmed, translated)
  }
  root.querySelectorAll('[placeholder], [aria-label]').forEach(element => {
    for (const attribute of ['placeholder', 'aria-label']) {
      const value = element.getAttribute(attribute)
      if (translations[value]) element.setAttribute(attribute, translations[value])
      else if (value === 'Main navigation') element.setAttribute(attribute, 'Головна навігація')
      else if (value.startsWith('Play ')) element.setAttribute(attribute, `Відтворити ${value.slice(5)}`)
    }
  })
}

const languageObserver = new MutationObserver(() => localize(document.body))
languageObserver.observe(document.body, { childList: true, subtree: true })

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

function showAlert(message) {
  alertMessage = message
  render()
}

function clearAlert() {
  alertMessage = ''
}

function isAdmin() {
  return profile?.role === 'admin'
}

function displayName(user = profile) {
  return user?.full_name || user?.email || 'Learner'
}

function packWords(pack) {
  const ids = data.packWords.filter(item => item.pack_id === pack.id).sort((a, b) => a.position - b.position)
  return ids.map(item => data.words.find(word => word.id === item.word_id)).filter(Boolean)
}

function assignedPacks() {
  const ids = data.assignments.filter(item => item.student_id === profile.user_id).map(item => item.pack_id)
  return data.packs.filter(pack => ids.includes(pack.id))
}

function progressFor(pack) {
  const words = packWords(pack)
  const known = words.filter(word => data.progress[word.id] === 'known').length
  return { total: words.length, known, percent: words.length ? Math.round(known / words.length * 100) : 0 }
}

async function loadAdminWords() {
  if (!isAdmin() || data.words.length >= data.wordCount) return
  const words = []
  for (let start = 0; start < data.wordCount; start += 1000) {
    const { data: rows, error } = await supabase.from('words').select('id,ukrainian,english,example_ukrainian,audio_path,created_by,created_at').order('ukrainian').range(start, start + 999)
    if (error) throw error
    words.push(...rows.map(item => ({ ...item, ua: item.ukrainian, en: item.english, example: item.example_ukrainian, audioPath: item.audio_path })))
  }
  data.words = words
}

async function setPage(nextPage) {
  page = nextPage
  search = ''
  modal = null
  study = null
  clearAlert()
  if (nextPage === 'words') await loadAdminWords()
  render()
}

function renderLogin() {
  const hasSession = Boolean(session)
  const authText = hasSession ? 'This Google account is ready. Enter the code that the admin shared with you.' : 'Enter the invite code that the admin shared with you. Then continue with Google.'
  app.innerHTML = `<main class="auth-page"><section class="auth-card">${languageToggle()}<a class="brand auth-brand" href="./"><span class="brand-mark">S</span><span><span class="brand-name">slovo</span><span class="brand-note">your Ukrainian words</span></span></a><div class="eyebrow">Ukrainian, one word at a time</div><h1>${hasSession ? 'Use your invite code' : 'A new word is a small win.'}</h1><p class="subhead">${authText}</p>${alertMessage ? `<div class="alert-box" role="alert">${esc(alertMessage)}</div>` : ''}<form class="form" data-form="redeem"><div class="field"><label for="invite-code">Invite code</label><input id="invite-code" name="code" autocomplete="one-time-code" placeholder="SL-1234567890ABCDEF12345678" required></div><button class="button" type="submit">${hasSession ? 'Activate account' : 'Continue with Google'} <span>→</span></button></form><div class="auth-divider"><span>Already joined?</span></div><button class="button secondary auth-google" data-action="google-login">${hasSession ? 'Sign out' : 'Sign in with Google'}</button><p class="auth-foot">Your code is not tied to an email. Use the Google account that you want to use for learning.</p></section></main>`
}

function renderLoading(message = 'Loading your learning space…') {
  app.innerHTML = `<main class="auth-page"><section class="auth-card loading-card"><span class="brand-mark">S</span><p>${esc(message)}</p></section></main>`
}

function renderSetup() {
  app.innerHTML = `<main class="auth-page"><section class="auth-card">${languageToggle()}<a class="brand auth-brand" href="./"><span class="brand-mark">S</span><span><span class="brand-name">slovo</span><span class="brand-note">your Ukrainian words</span></span></a><div class="eyebrow">Connection setup</div><h1>Connect this site to Supabase.</h1><p class="subhead">Add the project URL and public publishable key to the ignored .env file. Then build the site again.</p><div class="alert-box">Do not add the service-role key here. The site uses only a public client key and protects data with database policies.</div></section></main>`
}

function renderSuspended() {
  app.innerHTML = `<main class="auth-page"><section class="auth-card">${languageToggle()}<a class="brand auth-brand" href="./"><span class="brand-mark">S</span><span><span class="brand-name">slovo</span><span class="brand-note">your Ukrainian words</span></span></a><div class="eyebrow">Account suspended</div><h1>Account suspended</h1><p class="subhead">Your access is paused. Contact the admin if you think this is a mistake.</p><button class="button secondary auth-google" data-action="sign-out">Sign out</button></section></main>`
}

async function loadData() {
  const wordsQuery = isAdmin()
    ? supabase.from('words').select('id,ukrainian,english,example_ukrainian,audio_path,created_by,created_at', { count: 'exact' }).order('ukrainian').range(0, 39)
    : supabase.from('words').select('id,ukrainian,english,example_ukrainian,audio_path,created_by,created_at').order('ukrainian')
  const queries = [
    supabase.from('profiles').select('user_id,role,full_name,email,created_at,suspended_at').order('created_at'),
    wordsQuery,
    supabase.from('packs').select('id,title,description,level,created_by,created_at').order('created_at', { ascending: false }),
    supabase.from('pack_words').select('pack_id,word_id,position').order('position'),
    supabase.from('assignments').select('id,student_id,pack_id,assigned_by,created_at'),
    supabase.from('student_word_progress').select('student_id,word_id,status,updated_at'),
    isAdmin() ? supabase.from('invites').select('id,label,note,role,created_at,expires_at,redeemed_by,redeemed_at').order('created_at', { ascending: false }) : Promise.resolve({ data: [], error: null })
  ]
  const results = await Promise.all(queries)
  const issue = results.find(result => result.error)
  if (issue) throw issue.error
  const [profiles, words, packs, packWordsRows, assignments, progressRows, invites] = results.map(result => result.data || [])
  data = {
    students: profiles.filter(item => item.role === 'student'),
    words: words.map(item => ({ ...item, ua: item.ukrainian, en: item.english, example: item.example_ukrainian, audioPath: item.audio_path })),
    wordCount: results[1].count ?? words.length,
    packs,
    packWords: packWordsRows,
    assignments,
    progress: Object.fromEntries(progressRows.filter(item => item.student_id === profile.user_id).map(item => [item.word_id, item.status])),
    allProgress: progressRows,
    invites
  }
}

async function finishSignIn(currentSession) {
  session = currentSession
  if (!session) {
    profile = null
    page = 'home'
    renderLogin()
    return
  }
  renderLoading()
  const { data: ownProfile, error: profileError } = await supabase.from('profiles').select('user_id,role,full_name,email,invite_id,suspended_at').eq('user_id', session.user.id).maybeSingle()
  if (profileError) {
    showAlert(profileError.message)
    return
  }
  profile = ownProfile
  if (profile?.suspended_at) {
    renderSuspended()
    return
  }
  if (profile) sessionStorage.removeItem(inviteStorageKey)
  if (!profile) {
    const pendingCode = sessionStorage.getItem(inviteStorageKey)
    if (pendingCode) {
      const { error } = await supabase.rpc('redeem_invite', { p_code: pendingCode })
      if (error) {
        sessionStorage.removeItem(inviteStorageKey)
        renderLogin()
        alertMessage = error.message.includes('invalid') || error.message.includes('expired') || error.message.includes('used')
          ? 'This code is invalid, expired, or already used. Ask the admin for a new code.'
          : error.message
        renderLogin()
        return
      }
      sessionStorage.removeItem(inviteStorageKey)
      const { data: redeemedProfile, error: reloadError } = await supabase.from('profiles').select('user_id,role,full_name,email,invite_id,suspended_at').eq('user_id', session.user.id).single()
      if (reloadError) {
        showAlert(reloadError.message)
        return
      }
      profile = redeemedProfile
    } else {
      renderLogin()
      return
    }
  }
  try {
    await loadData()
    page = 'home'
    clearAlert()
    render()
  } catch (error) {
    profile = null
    renderLogin()
    alertMessage = error.message
    renderLogin()
  }
}

function navItems() {
  if (isAdmin()) return [['home', '⌂', 'Overview'], ['students', '♙', 'Students'], ['words', '▤', 'Word library'], ['packs', '▱', 'Flashcard packs']]
  return [['home', '⌂', 'My learning'], ['packs', '▱', 'My packs'], ['progress', '◷', 'My progress']]
}

function render() {
  if (profile?.suspended_at) {
    renderSuspended()
    return
  }
  if (!profile) {
    renderLogin()
    return
  }
  if (study) {
    renderStudy()
    return
  }
  const nav = navItems().map(([key, icon, label]) => `<button class="nav-item ${page === key ? 'active' : ''}" data-action="nav" data-page="${key}"><span class="nav-icon">${icon}</span><span>${label}</span></button>`).join('')
  const title = navItems().find(item => item[0] === page)?.[2] || 'My learning'
  app.innerHTML = `<div class="shell"><aside class="sidebar"><a class="brand" href="./"><span class="brand-mark">S</span><span><span class="brand-name">slovo</span><span class="brand-note">your Ukrainian words</span></span></a><div class="nav-label">Workspace</div><nav class="nav-list" aria-label="Main navigation">${nav}</nav><div class="sidebar-bottom"><div class="user-box"><span class="avatar ${isAdmin() ? 'blue' : 'green'}">${esc(displayName().split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase())}</span><div style="min-width:0"><div class="user-name">${esc(displayName())}</div><div class="user-role">${isAdmin() ? 'Admin' : 'Student'} · ${esc(profile.email)}</div></div></div><button class="button secondary logout-button" data-action="sign-out">Sign out</button></div></aside><main class="main"><header class="topbar"><div class="crumb">Workspace <span style="padding:0 7px;color:#c4c8d1">/</span><strong>${esc(title)}</strong></div><div class="top-actions">${languageToggle()}<span class="demo-badge"><span class="demo-dot" style="background:#35a77c"></span> Connected</span><button class="button small secondary" data-action="sign-out">Sign out</button></div></header><section class="page">${alertMessage ? `<div class="alert-box" role="alert">${esc(alertMessage)}</div>` : ''}${renderPage()}</section></main></div>${renderModal()}`
}

function renderPage() {
  if (isAdmin()) {
    if (page === 'students') return renderStudents()
    if (page === 'words') return renderWords()
    if (page === 'packs') return renderAdminPacks()
    return renderAdminHome()
  }
  if (page === 'packs') return renderStudentPacks()
  if (page === 'progress') return renderProgress()
  return renderStudentHome()
}

function renderStudentHome() {
  const packs = assignedPacks()
  const ids = [...new Set(packs.flatMap(pack => packWords(pack).map(word => word.id)))]
  const known = ids.filter(id => data.progress[id] === 'known').length
  const learning = ids.filter(id => data.progress[id] === 'learning').length
  return `<div class="welcome"><div class="welcome-copy"><div class="welcome-kicker">Your Ukrainian practice</div><h1>Привіт, ${esc(displayName().split(/\s+/)[0])}! Ready for a little practice?</h1><p>Pick a pack and learn a few new words today.</p><button class="button" data-action="nav" data-page="packs">Choose a pack →</button></div><div class="welcome-art" aria-hidden="true"><div class="mini-card back"><strong>дякую</strong><span>thank you</span></div><div class="mini-card"><strong>привіт</strong><span>hello</span></div></div></div><div class="stat-grid"><div class="stat-card"><div class="stat-top"><span>My packs</span><span class="stat-icon">▱</span></div><div class="stat-value">${packs.length}</div><div class="stat-foot">Assigned by your admin</div></div><div class="stat-card"><div class="stat-top"><span>Words known</span><span class="stat-icon">✓</span></div><div class="stat-value">${known}</div><div class="stat-foot">Across your packs</div></div><div class="stat-card"><div class="stat-top"><span>Still learning</span><span class="stat-icon">↗</span></div><div class="stat-value">${learning}</div><div class="stat-foot">Keep them in rotation</div></div><div class="stat-card"><div class="stat-top"><span>Progress</span><span class="stat-icon">◷</span></div><div class="stat-value">${ids.length ? Math.round(known / ids.length * 100) : 0}%</div><div class="stat-foot">Words marked as known</div></div></div><div class="section-title"><h2>Your packs</h2><button class="text-button" data-action="nav" data-page="packs">View all →</button></div>${renderPackGrid(packs)}`
}

function renderPackGrid(packs) {
  if (!packs.length) return '<div class="empty-state"><div class="empty-icon">📚</div><h3>No packs yet</h3><p>Your admin will assign a pack when it is ready.</p></div>'
  return `<div class="pack-grid">${packs.map(pack => {
    const progress = progressFor(pack)
    return `<article class="pack-card"><div class="pack-art tone-blue"><span class="pack-emoji">📘</span><span class="pack-level">${esc(pack.level)}</span></div><div class="pack-body"><h3>${esc(pack.title)}</h3><p>${esc(pack.description || 'A set of Ukrainian words.')}</p><div class="pack-meta"><span>${progress.total} words</span><span>${progress.known} known</span></div><div class="progress-line"><span style="width:${progress.percent}%"></span></div><div class="pack-footer"><span class="pill">${progress.percent ? progress.percent + '% complete' : 'New pack'}</span><button class="button small soft" data-action="study" data-id="${esc(pack.id)}">Study words →</button></div></div></article>`
  }).join('')}</div>`
}

function renderStudentPacks() {
  return `<div class="page-head"><div><div class="eyebrow">Your library</div><h1>My packs</h1><p class="subhead">Choose a set and practise at your own pace.</p></div></div>${renderPackGrid(assignedPacks())}`
}

function renderProgress() {
  const packs = assignedPacks()
  const ids = [...new Set(packs.flatMap(pack => packWords(pack).map(word => word.id)))]
  const known = ids.filter(id => data.progress[id] === 'known').length
  const learning = ids.filter(id => data.progress[id] === 'learning').length
  return `<div class="page-head"><div><div class="eyebrow">Your learning</div><h1>My progress</h1><p class="subhead">Words that you know and words that you practise.</p></div></div><div class="stat-grid"><div class="stat-card"><div class="stat-top"><span>Words in your packs</span><span class="stat-icon">▤</span></div><div class="stat-value">${ids.length}</div><div class="stat-foot">Unique words</div></div><div class="stat-card"><div class="stat-top"><span>Known</span><span class="stat-icon">✓</span></div><div class="stat-value">${known}</div><div class="stat-foot">Words you know</div></div><div class="stat-card"><div class="stat-top"><span>Learning</span><span class="stat-icon">↗</span></div><div class="stat-value">${learning}</div><div class="stat-foot">Words to practise</div></div><div class="stat-card"><div class="stat-top"><span>Not started</span><span class="stat-icon">○</span></div><div class="stat-value">${ids.length - known - learning}</div><div class="stat-foot">New words to meet</div></div></div><div class="section-title"><h2>Pack progress</h2></div>${renderPackGrid(packs)}`
}

function renderAdminHome() {
  return `<div class="page-head"><div><div class="eyebrow">Teacher workspace</div><h1>Welcome, ${esc(displayName().split(/\s+/)[0])}</h1><p class="subhead">Manage students, words, and flashcard packs.</p></div><button class="button" data-action="new-invite">＋ Create invite code</button></div><div class="stat-grid"><div class="stat-card"><div class="stat-top"><span>Students</span><span class="stat-icon">♙</span></div><div class="stat-value">${data.students.length}</div><div class="stat-foot">Learners with access</div></div><div class="stat-card"><div class="stat-top"><span>Word library</span><span class="stat-icon">▤</span></div><div class="stat-value">${data.wordCount}</div><div class="stat-foot">Words ready to teach</div></div><div class="stat-card"><div class="stat-top"><span>Flashcard packs</span><span class="stat-icon">▱</span></div><div class="stat-value">${data.packs.length}</div><div class="stat-foot">Curated sets</div></div><div class="stat-card"><div class="stat-top"><span>Assignments</span><span class="stat-icon">↗</span></div><div class="stat-value">${data.assignments.length}</div><div class="stat-foot">Packs shared with students</div></div></div><div class="section-title"><h2>Your students</h2><button class="text-button" data-action="nav" data-page="students">Manage students →</button></div>${renderStudentTable(data.students.slice(0, 5))}<div class="section-title"><h2>Quick actions</h2></div><div class="toolbar"><button class="button secondary" data-action="new-word">＋ Add a word</button><button class="button secondary" data-action="new-pack">＋ Create a pack</button><button class="button secondary" data-action="new-invite">＋ Create invite</button></div>`
}

function renderStudentTable(rows, manage = false) {
  if (!rows.length) return '<div class="empty-state"><div class="empty-icon">♙</div><h3>No students yet</h3><p>Create an invite code and share it with a learner.</p></div>'
  return `<div class="panel"><div class="table-wrap"><table><thead><tr><th>Student</th><th>Assigned packs</th><th>Words known</th>${manage ? '<th>Access</th><th>Actions</th>' : ''}</tr></thead><tbody>${rows.map(student => {
    const assigned = data.assignments.filter(item => item.student_id === student.user_id)
    const wordIds = [...new Set(assigned.flatMap(item => data.packWords.filter(pw => pw.pack_id === item.pack_id).map(pw => pw.word_id)))]
    const known = data.allProgress.filter(item => item.student_id === student.user_id && item.status === 'known').length
    const management = manage ? `<td><span class="pill ${student.suspended_at ? 'yellow' : 'green'}">${student.suspended_at ? 'Suspended' : 'Active'}</span></td><td><div class="table-actions"><button class="table-action" data-action="assign-student" data-id="${esc(student.user_id)}">Assign packs</button><button class="table-action ${student.suspended_at ? '' : 'danger-action'}" data-action="suspend-student" data-id="${esc(student.user_id)}" data-suspended="${Boolean(student.suspended_at)}">${student.suspended_at ? 'Restore access' : 'Suspend access'}</button></div></td>` : ''
    return `<tr><td><div class="person-cell"><span class="avatar">${esc(student.full_name.slice(0, 2).toUpperCase())}</span><div class="person-detail"><strong>${esc(student.full_name)}</strong><span>${esc(student.email)}</span></div></div></td><td>${assigned.length} packs</td><td>${known} / ${wordIds.length} words</td>${management}</tr>`
  }).join('')}</tbody></table></div></div>`
}

function renderStudents() {
  const redeemed = new Map(data.invites.filter(item => item.redeemed_by).map(item => [item.redeemed_by, item]))
  const rows = data.students.map(student => ({ ...student, invite: redeemed.get(student.user_id) }))
  const inviteRows = data.invites.map(invite => `<tr><td><strong>${esc(invite.label)}</strong><div class="field-hint">${esc(invite.note || '')}</div></td><td>${esc(invite.role)}</td><td><span class="pill ${invite.redeemed_by ? 'green' : 'yellow'}">${invite.redeemed_by ? 'Used' : 'Unused'}</span></td><td>${invite.expires_at ? new Date(invite.expires_at).toLocaleDateString() : 'No expiry'}</td><td>${esc(invite.redeemed_by ? data.students.find(student => student.user_id === invite.redeemed_by)?.full_name || 'Redeemed' : '—')}</td></tr>`).join('')
  return `<div class="page-head"><div><div class="eyebrow">Class list</div><h1>Students</h1><p class="subhead">Create a code and add a note to identify the learner.</p></div><button class="button" data-action="new-invite">＋ Create invite code</button></div>${renderStudentTable(rows, true)}<div class="section-title"><h2>Invite codes</h2></div><div class="panel"><div class="table-wrap"><table><thead><tr><th>Label and note</th><th>Role</th><th>Status</th><th>Expires</th><th>Redeemed by</th></tr></thead><tbody>${inviteRows || '<tr><td colspan="5">No invite codes yet.</td></tr>'}</tbody></table></div></div>`
}

function renderWords() {
  const query = search.toLowerCase()
  const words = data.words.filter(word => `${word.ua} ${word.en}`.toLowerCase().includes(query))
  const rows = words.map(word => `<tr><td><div class="word-row"><button class="word-audio" data-action="speak" data-id="${esc(word.id)}" aria-label="Play ${esc(word.ua)}">▶</button><span class="word-ua" lang="uk">${esc(word.ua)}</span></div></td><td><strong>${esc(word.en)}</strong></td><td>${esc(word.example || '—')}</td><td>${word.audioPath ? 'Audio set' : 'Browser voice'}</td><td><button class="table-action" data-action="edit-word" data-id="${esc(word.id)}">Edit</button><button class="table-action" data-action="delete-word" data-id="${esc(word.id)}">Remove</button></td></tr>`).join('')
  return `<div class="page-head"><div><div class="eyebrow">Shared library</div><h1>Word library</h1><p class="subhead">Add translations once. Use them in any pack.</p></div><button class="button" data-action="new-word">＋ Add a word</button></div><div class="panel"><div class="panel-head"><div><h2>${data.wordCount} words</h2><p>Browser speech works when a Ukrainian voice is available.</p></div><input class="search" data-action="search" type="search" placeholder="Search words" value="${esc(search)}" aria-label="Search words"></div><div class="table-wrap"><table><thead><tr><th>Ukrainian</th><th>English</th><th>Example</th><th>Audio</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="5">No words match this search.</td></tr>'}</tbody></table></div></div>`
}

function renderAdminPacks() {
  const rows = data.packs.map(pack => {
    const count = data.packWords.filter(item => item.pack_id === pack.id).length
    const students = data.assignments.filter(item => item.pack_id === pack.id).length
    return `<div class="assigned-row"><div><div class="assigned-title">${esc(pack.title)}</div><div class="field-hint">${esc(pack.description || 'No description')}</div></div><span class="pill">${count} words</span><span style="color:#7c8494;font-size:10px">${students} students assigned</span><div class="toolbar"><button class="table-action" data-action="edit-pack" data-id="${esc(pack.id)}">Edit</button><button class="table-action" data-action="assign-pack" data-id="${esc(pack.id)}">Assign</button></div></div>`
  }).join('')
  return `<div class="page-head"><div><div class="eyebrow">Your teaching sets</div><h1>Flashcard packs</h1><p class="subhead">Build a set from your word library, then assign it.</p></div><div class="toolbar"><button class="button secondary" data-action="import-pack">Import JSON</button><button class="button" data-action="new-pack">＋ Create a pack</button></div></div><div class="panel"><div class="panel-head"><div><h2>${data.packs.length} packs</h2><p>Use words from your shared library.</p></div></div><div class="panel-body"><div class="assigned-list">${rows || '<div class="empty-state"><h3>No packs yet</h3><p>Create a pack to begin.</p></div>'}</div></div></div>`
}

function renderModal() {
  if (!modal) return ''
  return `<div class="modal-backdrop" data-action="backdrop"><section class="modal ${modal.wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true"><div class="modal-head"><div><h2>${esc(modal.title)}</h2><p>${esc(modal.subtitle || '')}</p></div><button class="close-button" data-action="close-modal" aria-label="Close">×</button></div>${modal.body}</section></div>`
}

function openModal(title, subtitle, body, wide = false) {
  modal = { title, subtitle, body, wide }
  render()
}

function wordForm(word = {}) {
  openModal(word.id ? 'Edit word' : 'Add a word', 'Add Ukrainian text and an English meaning.', `<form class="form" data-form="word" data-id="${esc(word.id || '')}"><div class="field"><label for="word-ua">Ukrainian word</label><input id="word-ua" name="ua" required value="${esc(word.ua || '')}"></div><div class="field"><label for="word-en">English meaning</label><input id="word-en" name="en" required value="${esc(word.en || '')}"></div><div class="field"><label for="word-example">Example sentence</label><textarea id="word-example" name="example">${esc(word.example || '')}</textarea></div><div class="field"><label for="word-audio">Audio file path or URL</label><input id="word-audio" name="audioPath" value="${esc(word.audioPath || '')}" placeholder="Optional"></div><div class="form-actions"><button type="button" class="button secondary" data-action="close-modal">Cancel</button><button class="button" type="submit">Save word</button></div></form>`)
}

function wordPickerResults() {
  const query = wordPickerSearch.trim().replace(/[%_(),\\"]/g, ' ').toLocaleLowerCase()
  return wordPickerItems.filter(word => !query || `${word.ua} ${word.en}`.toLocaleLowerCase().includes(query))
}

function renderWordPickerItems() {
  const results = wordPickerResults()
  const rows = results.map(word => `<label class="check-row pack-word-row"><span class="pack-word-spacer"></span><input type="checkbox" name="wordIds" data-action="pack-word-select" value="${esc(word.id)}" ${wordPickerSelected.has(word.id) ? 'checked' : ''}><span lang="uk">${esc(word.ua)} <span class="pack-word-en">· ${esc(word.en)}</span></span></label>`).join('')
  const empty = results.length || wordPickerLoading ? '' : '<div class="empty-state"><p>No words match this search.</p></div>'
  const more = wordPickerLoading ? '<div class="word-picker-more">Loading words…</div>' : wordPickerHasMore ? '<div class="word-picker-more">Scroll to load more words</div>' : ''
  return `${rows}${empty}${more}`
}

async function loadWordPickerPage(reset = false) {
  if (reset) {
    wordPickerRequest += 1
    wordPickerOffset = 0
    wordPickerHasMore = true
    wordPickerLoading = false
    wordPickerItems = []
    const list = app.querySelector('.pack-word-list')
    if (list) list.innerHTML = renderWordPickerItems()
  }
  if (wordPickerLoading || !wordPickerHasMore) return
  const request = wordPickerRequest
  const start = wordPickerOffset
  const term = wordPickerSearch.trim().replace(/[%_(),\\"]/g, ' ').trim()
  let query = supabase.from('words').select('id,ukrainian,english').order('ukrainian').range(start, start + 39)
  if (term) query = query.or(`ukrainian.ilike.%${term}%,english.ilike.%${term}%`)
  wordPickerLoading = true
  const list = app.querySelector('.pack-word-list')
  if (list) list.innerHTML = renderWordPickerItems()
  let result
  try {
    result = await query
  } catch (error) {
    if (request !== wordPickerRequest) return
    wordPickerLoading = false
    showToast(error.message)
    const currentList = app.querySelector('.pack-word-list')
    if (currentList) currentList.innerHTML = renderWordPickerItems()
    return
  }
  const { data: rows, error } = result
  if (request !== wordPickerRequest) return
  wordPickerLoading = false
  if (error) {
    showToast(error.message)
    const currentList = app.querySelector('.pack-word-list')
    if (currentList) currentList.innerHTML = renderWordPickerItems()
    return
  }
  const knownIds = new Set(wordPickerItems.map(word => word.id))
  for (const row of rows || []) {
    if (!knownIds.has(row.id)) wordPickerItems.push({ ...row, ua: row.ukrainian, en: row.english })
  }
  wordPickerOffset = start + (rows || []).length
  wordPickerHasMore = (rows || []).length === 40
  const currentList = app.querySelector('.pack-word-list')
  if (currentList) currentList.innerHTML = renderWordPickerItems()
}

function packForm(pack = {}) {
  wordPickerSelected = new Set(data.packWords.filter(item => item.pack_id === pack.id).map(item => item.word_id))
  wordPickerSearch = ''
  wordPickerOffset = 0
  wordPickerHasMore = true
  wordPickerItems = []
  openModal(pack.id ? 'Edit pack' : 'Create a pack', 'Choose a name and add words.', `<form class="form" data-form="pack" data-id="${esc(pack.id || '')}"><div class="field"><label for="pack-title">Pack name</label><input id="pack-title" name="title" required value="${esc(pack.title || '')}"></div><div class="field"><label for="pack-description">Description</label><input id="pack-description" name="description" value="${esc(pack.description || '')}"></div><div class="field"><label for="pack-level">Level</label><select id="pack-level" name="level"><option ${pack.level === 'Starter' ? 'selected' : ''}>Starter</option><option ${pack.level === 'A1' ? 'selected' : ''}>A1</option><option ${pack.level === 'A2' ? 'selected' : ''}>A2</option></select></div><div class="field"><div class="word-picker-heading"><label for="pack-word-search">Words in this pack</label><span data-word-picker-count>${wordPickerSelected.size} selected</span></div><input class="search pack-word-search" id="pack-word-search" data-action="pack-word-search" type="search" placeholder="Search Ukrainian or English words" value=""><div class="check-list pack-word-list">${renderWordPickerItems()}</div></div><div class="form-actions"><button type="button" class="button secondary" data-action="close-modal">Cancel</button><button class="button" type="submit">Save pack</button></div></form>`, true)
  loadWordPickerPage(true)
}

function packImportForm() {
  const sample = JSON.stringify({ title: 'Greetings', description: 'Basic greetings', level: 'A1', words: [{ ukrainian: 'привіт', english: 'hello', example_ukrainian: 'Привіт, як справи?', audio_path: null }] }, null, 2)
  openModal('Import a pack from JSON', 'Choose a JSON file with a pack title and a words list.', `<form class="form" data-form="pack-import"><div class="field"><label for="pack-json">Select JSON file</label><input id="pack-json" name="file" type="file" accept=".json,application/json" required></div><details class="json-format"><summary>JSON pack format</summary><pre>${esc(sample)}</pre></details><div class="form-actions"><button type="button" class="button secondary" data-action="close-modal">Cancel</button><button class="button" type="submit">Import pack</button></div></form>`)
}

function inviteForm() {
  openModal('Create an invite code', 'Add a label so you know who will use this code.', '<form class="form" data-form="invite"><div class="field"><label for="invite-label">Learner label</label><input id="invite-label" name="label" required placeholder="For example: Ana, year 8"></div><div class="field"><label for="invite-note">Admin note</label><textarea id="invite-note" name="note" placeholder="Optional details for you"></textarea><span class="field-hint">This code is not tied to an email address.</span></div><div class="form-actions"><button type="button" class="button secondary" data-action="close-modal">Cancel</button><button class="button" type="submit">Create code</button></div></form>')
}

function assignmentForm(studentId = '', packId = '') {
  const chosenStudent = data.students.find(item => item.user_id === studentId)
  const chosenPack = data.packs.find(item => item.id === packId)
  const targetType = chosenStudent ? 'pack' : 'student'
  const current = chosenStudent
    ? data.assignments.filter(item => item.student_id === studentId).map(item => item.pack_id)
    : data.assignments.filter(item => item.pack_id === packId).map(item => item.student_id)
  const options = chosenStudent
    ? data.packs.map(item => `<label class="check-row"><input type="checkbox" name="targets" value="${esc(item.id)}" ${current.includes(item.id) ? 'checked' : ''}><span>${esc(item.title)}</span></label>`).join('')
    : data.students.map(item => `<label class="check-row"><input type="checkbox" name="targets" value="${esc(item.user_id)}" ${current.includes(item.user_id) ? 'checked' : ''}><span>${esc(item.full_name)} · ${esc(item.email)}</span></label>`).join('')
  openModal(chosenStudent ? `Assign packs to ${chosenStudent.full_name.split(' ')[0]}` : `Assign ${chosenPack?.title || 'pack'}`, 'Choose who can study this pack.', `<form class="form" data-form="assignment" data-student="${esc(studentId)}" data-pack="${esc(packId)}" data-target-type="${targetType}"><div class="check-list">${options || '<span class="field-hint">Create a student and a pack first.</span>'}</div><div class="form-actions"><button type="button" class="button secondary" data-action="close-modal">Cancel</button><button class="button" type="submit">Save assignments</button></div></form>`)
}

function renderStudy() {
  const pack = data.packs.find(item => item.id === study.packId)
  const words = packWords(pack)
  const word = words[study.index]
  if (!word) {
    study = null
    render()
    return
  }
  const progress = data.progress[word.id]
  const percent = Math.round(study.index / words.length * 100)
  app.innerHTML = `<main class="study-shell"><div class="study-top"><button class="study-back" data-action="exit-study">← Exit study</button><div class="study-pack"><strong>${esc(pack.title)}</strong><span>${esc(pack.level)} · Ukrainian → English</span></div><div class="study-top-actions">${languageToggle()}<span class="study-count">${study.index + 1} of ${words.length}</span></div></div><div class="study-progress"><span style="width:${percent}%"></span></div><div class="study-content"><div class="study-inner"><div class="study-hint">${study.revealed ? 'English meaning' : 'What does this word mean?'}</div><article class="flashcard"><div class="flash-side">${study.revealed ? 'English' : 'Ukrainian'}</div><div class="flash-word ${study.revealed ? 'translation' : ''}" lang="${study.revealed ? 'en' : 'uk'}">${esc(study.revealed ? word.en : word.ua)}</div>${study.revealed && word.example ? `<p class="flash-example" lang="uk">${esc(word.example)}</p>` : ''}<button class="word-audio" data-action="speak" data-id="${esc(word.id)}" aria-label="Play Ukrainian pronunciation">▶</button></article>${study.revealed ? `<div class="flash-controls"><button class="button ghost" data-action="mark-word" data-status="learning">↻ &nbsp;Still learning</button><button class="button known" data-action="mark-word" data-status="known">✓ &nbsp;I know this</button></div>` : '<button class="button" style="width:100%;margin-top:16px;min-height:48px" data-action="reveal">Show meaning →</button>'}<button class="flip-control" data-action="skip-word">${progress === 'known' ? 'Already know this · skip →' : 'Skip for now →'}</button></div></div></main>`
}

function renderFinish() {
  app.innerHTML = `<main class="study-shell"><div class="study-top"><button class="study-back" data-action="exit-study">← Back to packs</button><div class="study-pack"><strong>Study session complete</strong><span>Your progress is saved.</span></div>${languageToggle()}</div><div class="study-content"><div class="study-finish"><div class="finish-icon">🎉</div><h1>Чудово! Nice work.</h1><p>You finished this set. Your progress is saved.</p><div class="toolbar" style="justify-content:center"><button class="button secondary" data-action="exit-study">Back to packs</button><button class="button" data-action="restart-study">Study again</button></div></div></div></main>`
}

function processSession(currentSession) {
  if (!currentSession) return finishSignIn(null)
  const token = currentSession.access_token
  if (sessionWorkToken === token && sessionWork) return sessionWork
  sessionWorkToken = token
  sessionWork = finishSignIn(currentSession).finally(() => {
    sessionWork = null
  })
  return sessionWork
}

function speak(word) {
  if (word.audioPath) {
    const url = /^https?:\/\//i.test(word.audioPath)
      ? word.audioPath
      : supabase.storage.from('word-audio').createSignedUrl(word.audioPath, 3600)
    if (typeof url === 'string') {
      new Audio(url).play().catch(() => browserSpeech(word))
      return
    }
    url.then(({ data: result, error }) => error ? browserSpeech(word) : new Audio(result.signedUrl).play().catch(() => browserSpeech(word)))
    return
  }
  browserSpeech(word)
}

function browserSpeech(word) {
  if (!('speechSynthesis' in window)) {
    showToast('Audio is not available in this browser.')
    return
  }
  const utterance = new SpeechSynthesisUtterance(word.ua)
  utterance.lang = 'uk-UA'
  utterance.rate = 0.85
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

let toastTimer = 0

function showToast(message) {
  document.querySelector('.toast')?.remove()
  const item = document.createElement('div')
  item.className = 'toast'
  item.setAttribute('role', 'status')
  item.textContent = message
  document.body.append(item)
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => item.remove(), 2500)
}

async function reloadData() {
  await loadData()
  if (page === 'words') await loadAdminWords()
  render()
}

async function handleAction(action, element, event) {
  const id = element.dataset.id
  if (action === 'toggle-language') {
    language = language === 'en' ? 'uk' : 'en'
    localStorage.setItem('slovo-language', language)
    if (study) {
      if (study.index >= packWords(data.packs.find(item => item.id === study.packId)).length) renderFinish()
      else renderStudy()
    } else render()
    localize(document.body)
    return
  }
    if (action === 'nav') await setPage(element.dataset.page)
  if (action === 'google-login') {
    if (session) {
      await supabase.auth.signOut()
      session = null
      profile = null
      renderLogin()
      return
    }
    const form = app.querySelector('[data-form="redeem"]')
    const code = new FormData(form).get('code')?.trim()
    if (code) sessionStorage.setItem(inviteStorageKey, code)
    else sessionStorage.removeItem(inviteStorageKey)
    const redirectTo = window.location.origin + window.location.pathname
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
    if (error) showAlert(error.message)
  }
  if (action === 'sign-out') {
    await supabase.auth.signOut()
    session = null
    profile = null
    data = structuredClone(emptyData)
    renderLogin()
  }
  if (action === 'new-invite') inviteForm()
  if (action === 'import-pack') packImportForm()
  if (action === 'new-word') wordForm()
  if (action === 'edit-word') wordForm(data.words.find(word => word.id === id))
  if (action === 'new-pack') packForm()
  if (action === 'edit-pack') packForm(data.packs.find(pack => pack.id === id))
  if (action === 'assign-student') assignmentForm(id)
  if (action === 'assign-pack') assignmentForm('', id)
  if (action === 'suspend-student') {
    const suspended = element.dataset.suspended === 'true'
    const prompt = suspended
      ? (language === 'uk' ? 'Відновити доступ цього учня?' : 'Restore this student’s access?')
      : (language === 'uk' ? 'Призупинити доступ цього учня? Його дані та прогрес залишаться.' : 'Suspend this student’s access? Their data and progress will remain.')
    if (!confirm(prompt)) return
    const { error } = await supabase.rpc('set_student_suspended', { p_student_id: id, p_suspended: !suspended })
    if (error) throw error
    await reloadData()
    showToast(suspended ? 'Student access restored.' : 'Student access suspended.')
  }
  if (action === 'close-modal') {
    modal = null
    render()
  }
  if (action === 'backdrop' && element === event.target) {
    modal = null
    render()
  }
  if (action === 'study') {
    const pack = data.packs.find(item => item.id === id)
    if (!packWords(pack).length) {
      showToast('This pack does not have any words yet.')
      return
    }
    study = { packId: id, index: 0, revealed: false }
    renderStudy()
  }
  if (action === 'reveal' && study) {
    study.revealed = true
    renderStudy()
  }
  if (action === 'skip-word' && study) {
    study.index += 1
    study.revealed = false
    if (study.index >= packWords(data.packs.find(item => item.id === study.packId)).length) renderFinish()
    else renderStudy()
  }
  if (action === 'mark-word' && study) {
    const word = packWords(data.packs.find(item => item.id === study.packId))[study.index]
    const { error } = await supabase.from('student_word_progress').upsert({ student_id: profile.user_id, word_id: word.id, status: element.dataset.status }, { onConflict: 'student_id,word_id' })
    if (error) {
      showToast(error.message)
      return
    }
    data.progress[word.id] = element.dataset.status
    study.index += 1
    study.revealed = false
    if (study.index >= packWords(data.packs.find(item => item.id === study.packId)).length) renderFinish()
    else renderStudy()
  }
  if (action === 'exit-study') {
    study = null
    page = 'packs'
    render()
  }
  if (action === 'restart-study' && study) {
    study.index = 0
    study.revealed = false
    renderStudy()
  }
  if (action === 'speak') {
    const word = data.words.find(item => item.id === id)
    if (word) speak(word)
  }
  if (action === 'copy-code') {
    if (navigator.clipboard) navigator.clipboard.writeText(lastInviteCode).then(() => showToast('Invite code copied.')).catch(() => showToast(lastInviteCode))
    else showToast(lastInviteCode)
  }
  if (action === 'delete-word') {
    const word = data.words.find(item => item.id === id)
    const removePrompt = language === 'uk' ? `Видалити ${word?.ua} зі словника та всіх наборів?` : `Remove ${word?.ua} from the library and all packs?`
    if (word && confirm(removePrompt)) {
      const { error } = await supabase.from('words').delete().eq('id', id)
      if (error) showToast(error.message)
      else {
        await reloadData()
        showToast('Word removed.')
      }
    }
  }
  if (action === 'search') return
}

app.addEventListener('click', event => {
  const element = event.target.closest('[data-action]')
  if (!element) return
  handleAction(element.dataset.action, element, event).catch(error => showToast(error.message))
})

app.addEventListener('input', event => {
  if (event.target.dataset.action === 'pack-word-search') {
    wordPickerSearch = event.target.value
    wordPickerRequest += 1
    wordPickerLoading = false
    wordPickerOffset = 0
    wordPickerHasMore = true
    wordPickerItems = []
    const list = app.querySelector('.pack-word-list')
    if (list) {
      list.scrollTop = 0
      list.innerHTML = '<div class="word-picker-more">Loading words…</div>'
    }
    clearTimeout(wordPickerTimer)
    wordPickerTimer = setTimeout(() => loadWordPickerPage(true), 250)
    return
  }
  if (event.target.dataset.action === 'search') {
    search = event.target.value
    const cursor = event.target.selectionStart
    render()
    const field = app.querySelector('[data-action="search"]')
    field.focus()
    field.setSelectionRange(cursor, cursor)
  }
})

app.addEventListener('submit', async event => {
  const form = event.target.closest('form[data-form]')
  if (!form) return
  event.preventDefault()
  const values = new FormData(form)
  const kind = form.dataset.form
  try {
    if (kind === 'redeem') {
      const code = String(values.get('code') || '').trim()
      if (!code) {
        showAlert('Enter the invite code.')
        return
      }
      if (!session) {
        sessionStorage.setItem(inviteStorageKey, code)
        const redirectTo = window.location.origin + window.location.pathname
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
        if (error) showAlert(error.message)
      } else {
        const { error } = await supabase.rpc('redeem_invite', { p_code: code })
        if (error) {
          showAlert('This code is invalid, expired, or already used. Ask the admin for a new code.')
          return
        }
        sessionStorage.removeItem(inviteStorageKey)
      await processSession(session)
      }
    }
    if (kind === 'invite') {
      const { data: result, error } = await supabase.rpc('create_student_invite', { p_label: values.get('label').trim(), p_note: values.get('note').trim() || null })
      if (error) throw error
      const invite = Array.isArray(result) ? result[0] : result
      lastInviteCode = invite.code
      modal = null
      await reloadData()
      openModal('Invite code ready', `Share this code with ${invite.label}. It can be used once.`, `<div class="form"><div class="invite-code-display"><div class="eyebrow">Student invite code</div><strong>${esc(invite.code)}</strong><p>${esc(invite.label)}</p></div><p class="field-hint">The database does not save the code itself. Copy it now.</p><div class="form-actions"><button type="button" class="button secondary" data-action="copy-code">Copy code</button><button class="button" data-action="close-modal">Done</button></div></div>`)
    }
    if (kind === 'pack-import') {
      const file = values.get('file')
      if (!(file instanceof File) || !file.size) throw new Error(language === 'uk' ? 'Обери JSON-файл.' : 'Select a JSON file.')
      let pack
      try {
        pack = JSON.parse(await file.text())
      } catch {
        throw new Error(language === 'uk' ? 'JSON-файл має містити коректний JSON.' : 'The file does not contain valid JSON.')
      }
      if (!pack || typeof pack !== 'object' || typeof pack.title !== 'string' || !Array.isArray(pack.words) || !pack.words.length) {
        throw new Error(language === 'uk' ? translations['The JSON file must contain a title and a words list.'] : 'The JSON file must contain a title and a words list.')
      }
      if (pack.words.length > 5000) throw new Error(language === 'uk' ? translations['A pack can contain no more than 5000 words.'] : 'A pack can contain no more than 5000 words.')
      if (pack.words.some(word => !word || typeof word.ukrainian !== 'string' || typeof word.english !== 'string')) {
        throw new Error(language === 'uk' ? translations['Each word needs Ukrainian and English text.'] : 'Each word needs Ukrainian and English text.')
      }
      const { error } = await supabase.rpc('import_pack_json', { p_pack: pack })
      if (error) throw error
      modal = null
      page = 'packs'
      await reloadData()
      showToast('Pack imported.')
    }
    if (kind === 'word') {
      const id = form.dataset.id
      const payload = { ukrainian: values.get('ua').trim(), english: values.get('en').trim(), example_ukrainian: values.get('example').trim() || null, audio_path: values.get('audioPath').trim() || null }
      const query = id
        ? supabase.from('words').update(payload).eq('id', id)
        : supabase.from('words').insert({ ...payload, created_by: profile.user_id })
      const { error } = await query
      if (error) throw error
      modal = null
      await reloadData()
      showToast('Word saved.')
    }
    if (kind === 'pack') {
      const id = form.dataset.id
      const payload = { title: values.get('title').trim(), description: values.get('description').trim() || null, level: values.get('level') }
      let packId = id
      if (id) {
        const { error } = await supabase.from('packs').update(payload).eq('id', id)
        if (error) throw error
      } else {
        const { data: created, error } = await supabase.from('packs').insert({ ...payload, created_by: profile.user_id }).select('id').single()
        if (error) throw error
        packId = created.id
      }
      const { error: deleteError } = await supabase.from('pack_words').delete().eq('pack_id', packId)
      if (deleteError) throw deleteError
      const wordIds = [...wordPickerSelected]
      if (wordIds.length) {
        const { error: insertError } = await supabase.from('pack_words').insert(wordIds.map((wordId, position) => ({ pack_id: packId, word_id: wordId, position })))
        if (insertError) throw insertError
      }
      modal = null
      await reloadData()
      showToast('Pack saved.')
    }
    if (kind === 'assignment') {
      const targets = values.getAll('targets')
      if (form.dataset.targetType === 'pack') {
        const studentId = form.dataset.student
        const existing = data.assignments.filter(item => item.student_id === studentId)
        const remove = existing.filter(item => !targets.includes(item.pack_id)).map(item => item.id)
        const add = targets.filter(packId => !existing.some(item => item.pack_id === packId)).map(packId => ({ student_id: studentId, pack_id: packId, assigned_by: profile.user_id }))
        if (remove.length) {
          const { error } = await supabase.from('assignments').delete().in('id', remove)
          if (error) throw error
        }
        if (add.length) {
          const { error } = await supabase.from('assignments').insert(add)
          if (error) throw error
        }
      } else {
        const packId = form.dataset.pack
        const existing = data.assignments.filter(item => item.pack_id === packId)
        const remove = existing.filter(item => !targets.includes(item.student_id)).map(item => item.id)
        const add = targets.filter(studentId => !existing.some(item => item.student_id === studentId)).map(studentId => ({ student_id: studentId, pack_id: packId, assigned_by: profile.user_id }))
        if (remove.length) {
          const { error } = await supabase.from('assignments').delete().in('id', remove)
          if (error) throw error
        }
        if (add.length) {
          const { error } = await supabase.from('assignments').insert(add)
          if (error) throw error
        }
      }
      modal = null
      await reloadData()
      showToast('Pack assignments saved.')
    }
  } catch (error) {
    showToast(error.message)
  }
})

app.addEventListener('change', event => {
  if (event.target.dataset.action === 'pack-word-select') {
    if (event.target.checked) wordPickerSelected.add(event.target.value)
    else wordPickerSelected.delete(event.target.value)
    const count = app.querySelector('[data-word-picker-count]')
    if (count) count.textContent = `${wordPickerSelected.size} selected`
  }
  if (event.target.dataset.action === 'search') {
    search = event.target.value
    render()
  }
})

app.addEventListener('scroll', event => {
  const list = event.target.closest?.('.pack-word-list')
  if (!list || list.scrollTop + list.clientHeight < list.scrollHeight - 60) return
  loadWordPickerPage()
}, true)

async function boot() {
  if (!config.url || !config.key || !createClient) {
    renderSetup()
    return
  }
  supabase = createClient(config.url, config.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  supabase.auth.onAuthStateChange((event, currentSession) => {
    if (event === 'SIGNED_OUT') {
      session = null
      profile = null
      renderLogin()
      return
    }
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
      queueMicrotask(() => processSession(currentSession))
    }
  })
  const { data: authData, error } = await supabase.auth.getSession()
  if (error) {
    showAlert(error.message)
    renderLogin()
    return
  }
  await processSession(authData.session)
}

boot().catch(error => {
  renderSetup()
  alertMessage = error.message
})
