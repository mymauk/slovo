const storeKey = 'slovo-demo-v1'

const seedData = {
  users: [
    { id: 'admin', name: 'Olena Kovalenko', email: 'olena.teacher@example.com', role: 'admin', color: 'blue' },
    { id: 'student-1', name: 'Mia Johnson', email: 'mia.johnson@example.com', role: 'student', color: 'green' },
    { id: 'student-2', name: 'Noah Miller', email: 'noah.miller@example.com', role: 'student', color: '' },
    { id: 'student-3', name: 'Sofia Brown', email: 'sofia.brown@example.com', role: 'student', color: 'blue' }
  ],
  words: [
    { id: 'w1', ua: 'Привіт', en: 'Hello', example: 'Привіт, як справи?', audio: true },
    { id: 'w2', ua: 'Дякую', en: 'Thank you', example: 'Дякую за допомогу.', audio: true },
    { id: 'w3', ua: 'Будь ласка', en: 'Please / You are welcome', example: 'Воду, будь ласка.', audio: true },
    { id: 'w4', ua: 'Так', en: 'Yes', example: 'Так, я розумію.', audio: true },
    { id: 'w5', ua: 'Ні', en: 'No', example: 'Ні, дякую.', audio: true },
    { id: 'w6', ua: 'Вода', en: 'Water', example: 'Я п’ю воду.', audio: true },
    { id: 'w7', ua: 'Кава', en: 'Coffee', example: 'Я люблю каву.', audio: true },
    { id: 'w8', ua: 'Чай', en: 'Tea', example: 'Чай з лимоном.', audio: true },
    { id: 'w9', ua: 'Хліб', en: 'Bread', example: 'Свіжий хліб.', audio: true },
    { id: 'w10', ua: 'Молоко', en: 'Milk', example: 'Молоко в холодильнику.', audio: true },
    { id: 'w11', ua: 'Дім', en: 'Home', example: 'Я йду додому.', audio: true },
    { id: 'w12', ua: 'Друг', en: 'Friend', example: 'Мій друг тут.', audio: true },
    { id: 'w13', ua: 'Книга', en: 'Book', example: 'Це цікава книга.', audio: true },
    { id: 'w14', ua: 'Місто', en: 'City', example: 'Київ — красиве місто.', audio: true },
    { id: 'w15', ua: 'Ранок', en: 'Morning', example: 'Доброго ранку!', audio: true },
    { id: 'w16', ua: 'Вечір', en: 'Evening', example: 'Гарного вечора!', audio: true }
  ],
  packs: [
    { id: 'p1', title: 'First conversations', description: 'Say hello and be polite.', level: 'Starter', tone: 'blue', emoji: '👋', wordIds: ['w1', 'w2', 'w3', 'w4', 'w5'] },
    { id: 'p2', title: 'At the cafe', description: 'Order a drink or a snack.', level: 'Starter', tone: 'peach', emoji: '☕', wordIds: ['w6', 'w7', 'w8', 'w9', 'w10'] },
    { id: 'p3', title: 'Around town', description: 'Words for places and people.', level: 'A1', tone: 'green', emoji: '🏙️', wordIds: ['w11', 'w12', 'w13', 'w14'] },
    { id: 'p4', title: 'Time of day', description: 'Start and end your day.', level: 'A1', tone: 'yellow', emoji: '🌤️', wordIds: ['w15', 'w16', 'w1', 'w2'] }
  ],
  assignments: [
    { studentId: 'student-1', packId: 'p1' }, { studentId: 'student-1', packId: 'p2' }, { studentId: 'student-1', packId: 'p3' },
    { studentId: 'student-2', packId: 'p1' }, { studentId: 'student-2', packId: 'p4' },
    { studentId: 'student-3', packId: 'p1' }, { studentId: 'student-3', packId: 'p2' }, { studentId: 'student-3', packId: 'p4' }
  ],
  progress: {
    'student-1': { w1: 'known', w2: 'known', w3: 'learning', w4: 'known', w5: 'learning', w6: 'known', w7: 'learning', w8: 'known', w9: 'learning' },
    'student-2': { w1: 'known', w2: 'learning' },
    'student-3': { w1: 'known', w2: 'known', w3: 'known', w4: 'learning', w5: 'learning', w6: 'known' }
  },
  invites: [
    { id: 'i1', code: 'SL-7K2M', email: 'mia.johnson@example.com', status: 'Used', studentId: 'student-1' },
    { id: 'i2', code: 'SL-4P9R', email: 'noah.miller@example.com', status: 'Sent', studentId: 'student-2' },
    { id: 'i3', code: 'SL-8W3D', email: 'sofia.brown@example.com', status: 'Used', studentId: 'student-3' }
  ]
}

function loadData() {
  try {
    const saved = localStorage.getItem(storeKey)
    if (saved) return JSON.parse(saved)
  } catch (error) {
    localStorage.removeItem(storeKey)
  }
  return structuredClone(seedData)
}

let data = loadData()
let activeUserId = 'student-1'
let activePage = 'home'
let searchText = ''
let study = null
let toastTimer = 0

const app = document.querySelector('#app')

function saveData() {
  localStorage.setItem(storeKey, JSON.stringify(data))
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

function currentUser() {
  return data.users.find(user => user.id === activeUserId) || data.users[0]
}

function isAdmin() {
  return currentUser().role === 'admin'
}

function students() {
  return data.users.filter(user => user.role === 'student')
}

function assignedPacks(studentId) {
  return data.assignments.filter(item => item.studentId === studentId).map(item => data.packs.find(pack => pack.id === item.packId)).filter(Boolean)
}

function packWords(pack) {
  return pack.wordIds.map(id => data.words.find(word => word.id === id)).filter(Boolean)
}

function packProgress(pack, studentId) {
  const words = packWords(pack)
  const known = words.filter(word => data.progress[studentId]?.[word.id] === 'known').length
  return { known, total: words.length, percent: words.length ? Math.round(known / words.length * 100) : 0 }
}

function avatar(user, extra = '') {
  const initials = user.name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase()
  return `<span class="avatar ${esc(user.color)} ${extra}">${esc(initials)}</span>`
}

function headerTitle() {
  const labels = isAdmin()
    ? { home: 'Overview', students: 'Students', words: 'Word library', packs: 'Flashcard packs' }
    : { home: 'My learning', packs: 'My packs', progress: 'My progress' }
  return labels[activePage] || 'My learning'
}

function navItems() {
  if (isAdmin()) return [
    ['home', '⌂', 'Overview'], ['students', '♙', 'Students'], ['words', '▤', 'Word library'], ['packs', '▱', 'Flashcard packs']
  ]
  return [['home', '⌂', 'Overview'], ['packs', '▱', 'My packs'], ['progress', '◷', 'My progress']]
}

function render() {
  if (study) {
    app.innerHTML = renderStudy()
    return
  }
  const user = currentUser()
  const links = navItems().map(([page, icon, label]) => `<button class="nav-item ${activePage === page ? 'active' : ''}" data-action="nav" data-page="${page}"><span class="nav-icon">${icon}</span><span>${label}</span>${page === 'packs' && !isAdmin() ? `<span class="nav-count">${assignedPacks(user.id).length}</span>` : ''}</button>`).join('')
  const options = data.users.map(item => `<option value="${esc(item.id)}" ${item.id === user.id ? 'selected' : ''}>${item.role === 'admin' ? 'Teacher' : 'Student'} · ${esc(item.name.split(' ')[0])}</option>`).join('')
  app.innerHTML = `<div class="shell">
    <aside class="sidebar">
      <div class="sidebar-top"><a class="brand" href="./" aria-label="Slovo home"><span class="brand-mark">S</span><span><span class="brand-name">slovo</span><span class="brand-note">your Ukrainian words</span></span></a></div>
      <div class="nav-label">Workspace</div>
      <nav class="nav-list" aria-label="Main navigation">${links}</nav>
      <div class="sidebar-bottom">
        <div class="demo-card"><div class="demo-label">Preview as</div><select class="demo-select" data-action="switch-user" aria-label="Preview as">${options}</select><p class="demo-caption">Change the demo user to preview each role.</p></div>
        <div class="user-box">${avatar(user)}<div style="min-width:0"><div class="user-name">${esc(user.name)}</div><div class="user-role">${isAdmin() ? 'Teacher account' : 'Student account'}</div></div></div>
      </div>
    </aside>
    <main class="main">
      <header class="topbar"><div class="crumb">Workspace <span style="padding:0 7px;color:#c4c8d1">/</span><strong>${headerTitle()}</strong></div><div class="top-actions"><span class="demo-badge"><span class="demo-dot"></span> Demo mode</span><select class="demo-select mobile-user" data-action="switch-user" aria-label="Preview as">${options}</select><button class="icon-button" data-action="help" aria-label="About this demo">?</button></div></header>
      <section class="page">${renderPage()}</section>
    </main>
  </div>${renderModal()}`
}

function renderPage() {
  if (isAdmin()) {
    if (activePage === 'students') return renderStudentsPage()
    if (activePage === 'words') return renderWordsPage()
    if (activePage === 'packs') return renderAdminPacksPage()
    return renderAdminHome()
  }
  if (activePage === 'packs') return renderStudentPacks()
  if (activePage === 'progress') return renderProgressPage()
  return renderStudentHome()
}

function renderStudentHome() {
  const user = currentUser()
  const packs = assignedPacks(user.id)
  const allWords = [...new Set(packs.flatMap(pack => pack.wordIds))]
  const known = allWords.filter(id => data.progress[user.id]?.[id] === 'known').length
  const learning = allWords.filter(id => data.progress[user.id]?.[id] === 'learning').length
  const totalPercent = allWords.length ? Math.round(known / allWords.length * 100) : 0
  return `<div class="welcome"><div class="welcome-copy"><div class="welcome-kicker">Your Ukrainian practice</div><h1>Привіт, ${esc(user.name.split(' ')[0])}! Ready for a little practice?</h1><p>Small steps add up. Pick a pack and learn a few new words today.</p><button class="button" data-action="nav" data-page="packs">Choose a pack <span>→</span></button></div><div class="welcome-art" aria-hidden="true"><div class="mini-card back"><strong>дякую</strong><span>thank you</span></div><div class="mini-card"><strong>привіт</strong><span>hello</span></div></div></div>
    <div class="stat-grid"><div class="stat-card"><div class="stat-top"><span>My packs</span><span class="stat-icon">▱</span></div><div class="stat-value">${packs.length}</div><div class="stat-foot">Ready to study</div></div><div class="stat-card"><div class="stat-top"><span>Words known</span><span class="stat-icon">✓</span></div><div class="stat-value">${known}</div><div class="stat-foot">Across your packs</div></div><div class="stat-card"><div class="stat-top"><span>Still learning</span><span class="stat-icon">↗</span></div><div class="stat-value">${learning}</div><div class="stat-foot">Keep them in rotation</div></div><div class="stat-card"><div class="stat-top"><span>Pack progress</span><span class="stat-icon">◷</span></div><div class="stat-value">${totalPercent}%</div><div class="stat-foot">Words marked as known</div></div></div>
    <div class="section-title"><h2>Pick up where you left off</h2><button class="text-button" data-action="nav" data-page="packs">View all packs →</button></div>
    ${renderPackGrid(packs.slice(0, 3), user.id)}`
}

function renderPackGrid(packs, studentId) {
  if (!packs.length) return `<div class="empty-state"><div class="empty-icon">📚</div><h3>No packs yet</h3><p>Your teacher will add a pack here when it is ready.</p></div>`
  return `<div class="pack-grid">${packs.map(pack => {
    const count = packWords(pack).length
    const progress = packProgress(pack, studentId)
    return `<article class="pack-card"><div class="pack-art tone-${esc(pack.tone || 'blue')}"><span class="pack-emoji">${esc(pack.emoji || '📘')}</span><span class="pack-level">${esc(pack.level || 'Starter')}</span></div><div class="pack-body"><h3>${esc(pack.title)}</h3><p>${esc(pack.description || 'A set of useful Ukrainian words.')}</p><div class="pack-meta"><span>${count} ${count === 1 ? 'word' : 'words'}</span><span>${progress.known} of ${count} known</span></div><div class="progress-line"><span style="width:${progress.percent}%"></span></div><div class="pack-footer"><span class="pill">${progress.percent ? `${progress.percent}% complete` : 'New pack'}</span><button class="button small soft" data-action="study" data-id="${esc(pack.id)}">Study words <span>→</span></button></div></div></article>`
  }).join('')}</div>`
}

function renderStudentPacks() {
  const packs = assignedPacks(currentUser().id)
  return `<div class="page-head"><div><div class="eyebrow">Your library</div><h1>My packs</h1><p class="subhead">Choose a set and practise at your own pace.</p></div></div>${renderPackGrid(packs, currentUser().id)}`
}

function renderProgressPage() {
  const user = currentUser()
  const packs = assignedPacks(user.id)
  const ids = [...new Set(packs.flatMap(pack => pack.wordIds))]
  const known = ids.filter(id => data.progress[user.id]?.[id] === 'known').length
  const learning = ids.filter(id => data.progress[user.id]?.[id] === 'learning').length
  const fresh = ids.length - known - learning
  return `<div class="page-head"><div><div class="eyebrow">Your learning</div><h1>My progress</h1><p class="subhead">A clear view of the words you know and the words you practise.</p></div></div><div class="stat-grid"><div class="stat-card"><div class="stat-top"><span>Words in your packs</span><span class="stat-icon">▤</span></div><div class="stat-value">${ids.length}</div><div class="stat-foot">Unique words</div></div><div class="stat-card"><div class="stat-top"><span>Known</span><span class="stat-icon">✓</span></div><div class="stat-value">${known}</div><div class="stat-foot">Words you know</div></div><div class="stat-card"><div class="stat-top"><span>Learning</span><span class="stat-icon">↗</span></div><div class="stat-value">${learning}</div><div class="stat-foot">Words to practise</div></div><div class="stat-card"><div class="stat-top"><span>Not started</span><span class="stat-icon">○</span></div><div class="stat-value">${fresh}</div><div class="stat-foot">New words to meet</div></div></div><div class="section-title"><h2>Pack progress</h2></div>${renderPackGrid(packs, user.id)}`
}

function renderAdminHome() {
  const activeStudents = students().length
  const assigned = data.assignments.length
  const totalWords = data.words.length
  const usedInvites = data.invites.filter(item => item.status === 'Used').length
  const recent = students().slice(0, 3)
  return `<div class="page-head"><div><div class="eyebrow">Teacher workspace</div><h1>Good morning, Olena</h1><p class="subhead">Your class is learning a little more Ukrainian every day.</p></div><button class="button" data-action="new-invite">＋ Invite a student</button></div><div class="stat-grid"><div class="stat-card"><div class="stat-top"><span>Students</span><span class="stat-icon">♙</span></div><div class="stat-value">${activeStudents}</div><div class="stat-foot">${usedInvites} invite codes used</div></div><div class="stat-card"><div class="stat-top"><span>Word library</span><span class="stat-icon">▤</span></div><div class="stat-value">${totalWords}</div><div class="stat-foot">Words ready to teach</div></div><div class="stat-card"><div class="stat-top"><span>Flashcard packs</span><span class="stat-icon">▱</span></div><div class="stat-value">${data.packs.length}</div><div class="stat-foot">Curated sets</div></div><div class="stat-card"><div class="stat-top"><span>Assignments</span><span class="stat-icon">↗</span></div><div class="stat-value">${assigned}</div><div class="stat-foot">Packs shared with students</div></div></div><div class="section-title"><h2>Your students</h2><button class="text-button" data-action="nav" data-page="students">Manage students →</button></div><div class="panel"><div class="table-wrap"><table><thead><tr><th>Student</th><th>Assigned packs</th><th>Invite</th><th>Joined</th><th></th></tr></thead><tbody>${recent.map(student => `<tr><td><div class="person-cell">${avatar(student)}<div class="person-detail"><strong>${esc(student.name)}</strong><span>${esc(student.email)}</span></div></div></td><td>${assignedPacks(student.id).length} packs</td><td><span class="pill ${data.invites.find(invite => invite.studentId === student.id)?.status === 'Used' ? 'green' : 'yellow'}">${data.invites.find(invite => invite.studentId === student.id)?.status || 'No invite'}</span></td><td>Recently</td><td><button class="table-action" data-action="assign" data-id="${esc(student.id)}">Assign pack</button></td></tr>`).join('')}</tbody></table></div></div><div class="section-title"><h2>Quick actions</h2></div><div class="toolbar"><button class="button secondary" data-action="new-word">＋ Add a word</button><button class="button secondary" data-action="new-pack">＋ Create a pack</button><button class="button secondary" data-action="new-invite">＋ Invite a student</button></div>`
}

function renderStudentsPage() {
  const rows = students().map(student => {
    const invite = data.invites.find(item => item.studentId === student.id)
    const total = assignedPacks(student.id).reduce((sum, pack) => sum + packWords(pack).length, 0)
    const known = new Set(assignedPacks(student.id).flatMap(pack => pack.wordIds)).size ? [...new Set(assignedPacks(student.id).flatMap(pack => pack.wordIds))].filter(id => data.progress[student.id]?.[id] === 'known').length : 0
    return `<tr><td><div class="person-cell">${avatar(student)}<div class="person-detail"><strong>${esc(student.name)}</strong><span>${esc(student.email)}</span></div></div></td><td>${assignedPacks(student.id).length} packs</td><td>${known} / ${total} words</td><td><span class="pill ${invite?.status === 'Used' ? 'green' : 'yellow'}">${invite ? esc(invite.status) : 'No invite'}</span></td><td>${invite ? `<strong>${esc(invite.code)}</strong>` : '—'}</td><td><button class="table-action" data-action="assign" data-id="${esc(student.id)}">Assign packs</button></td></tr>`
  }).join('')
  return `<div class="page-head"><div><div class="eyebrow">Class list</div><h1>Students</h1><p class="subhead">Invite learners and share packs with them.</p></div><button class="button" data-action="new-invite">＋ Invite a student</button></div><div class="panel"><div class="panel-head"><div><h2>${students().length} students</h2><p>Demo data is stored in this browser.</p></div></div><div class="table-wrap"><table><thead><tr><th>Student</th><th>Assigned</th><th>Words known</th><th>Invite status</th><th>Code</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div><div class="section-title"><h2>Invite codes</h2></div><div class="panel"><div class="table-wrap"><table><thead><tr><th>Code</th><th>Email</th><th>Status</th><th></th></tr></thead><tbody>${data.invites.map(invite => `<tr><td><strong>${esc(invite.code)}</strong></td><td>${esc(invite.email)}</td><td><span class="pill ${invite.status === 'Used' ? 'green' : 'yellow'}">${esc(invite.status)}</span></td><td>${invite.status !== 'Used' ? `<button class="table-action" data-action="copy-code" data-code="${esc(invite.code)}">Copy code</button>` : ''}</td></tr>`).join('')}</tbody></table></div></div>`
}

function renderWordsPage() {
  const query = searchText.toLowerCase()
  const words = data.words.filter(word => `${word.ua} ${word.en}`.toLowerCase().includes(query))
  const rows = words.map(word => `<tr><td><div class="word-row"><button class="word-audio" data-action="speak" data-id="${esc(word.id)}" aria-label="Play ${esc(word.ua)}">▶</button><span class="word-ua">${esc(word.ua)}</span></div></td><td><strong>${esc(word.en)}</strong></td><td>${esc(word.example || '—')}</td><td>${data.packs.filter(pack => pack.wordIds.includes(word.id)).length} packs</td><td><button class="table-action" data-action="edit-word" data-id="${esc(word.id)}">Edit</button><button class="table-action" data-action="delete-word" data-id="${esc(word.id)}">Remove</button></td></tr>`).join('')
  return `<div class="page-head"><div><div class="eyebrow">Shared library</div><h1>Word library</h1><p class="subhead">Add translations once. Use them in any pack.</p></div><button class="button" data-action="new-word">＋ Add a word</button></div><div class="panel"><div class="panel-head"><div><h2>${data.words.length} words</h2><p>Play audio to hear browser pronunciation.</p></div><input class="search" data-action="search" type="search" placeholder="Search words" value="${esc(searchText)}" aria-label="Search words"></div><div class="table-wrap"><table><thead><tr><th>Ukrainian</th><th>English</th><th>Example</th><th>Packs</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="5">No words match this search.</td></tr>'}</tbody></table></div></div>`
}

function renderAdminPacksPage() {
  const rows = data.packs.map(pack => `<div class="assigned-row"><div><div class="assigned-title">${esc(pack.emoji)} &nbsp;${esc(pack.title)}</div><div class="field-hint">${esc(pack.description || 'No description')}</div></div><span class="pill">${packWords(pack).length} words</span><span style="color:#7c8494;font-size:10px">${data.assignments.filter(item => item.packId === pack.id).length} students assigned</span><div class="toolbar"><button class="table-action" data-action="edit-pack" data-id="${esc(pack.id)}">Edit</button><button class="table-action" data-action="assign-pack" data-id="${esc(pack.id)}">Assign</button></div></div>`).join('')
  return `<div class="page-head"><div><div class="eyebrow">Your teaching sets</div><h1>Flashcard packs</h1><p class="subhead">Build a set from your word library, then assign it.</p></div><button class="button" data-action="new-pack">＋ Create a pack</button></div><div class="panel"><div class="panel-head"><div><h2>${data.packs.length} packs</h2><p>Use words from your shared library.</p></div></div><div class="panel-body"><div class="assigned-list">${rows || '<div class="empty-state"><h3>No packs yet</h3><p>Create a pack to begin.</p></div>'}</div></div></div>`
}

function renderModal() {
  if (!modal) return ''
  return `<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><h2 id="modal-title">${esc(modal.title)}</h2><p>${esc(modal.subtitle || '')}</p></div><button class="close-button" data-action="close-modal" aria-label="Close">×</button></div>${modal.body}</section></div>`
}

let modal = null

function showModal(title, subtitle, body) {
  modal = { title, subtitle, body }
  render()
}

function closeModal() {
  modal = null
  render()
}

function wordForm(word = {}) {
  showModal(word.id ? 'Edit word' : 'Add a word', 'Add a Ukrainian word and its English meaning.', `<form class="form" data-form="word" data-id="${esc(word.id || '')}"><div class="field"><label for="word-ua">Ukrainian word</label><input id="word-ua" name="ua" required value="${esc(word.ua || '')}" placeholder="For example: Привіт"></div><div class="field"><label for="word-en">English meaning</label><input id="word-en" name="en" required value="${esc(word.en || '')}" placeholder="For example: Hello"></div><div class="field"><label for="word-example">Example sentence</label><textarea id="word-example" name="example" placeholder="A short sentence in Ukrainian">${esc(word.example || '')}</textarea></div><div class="form-actions"><button type="button" class="button secondary" data-action="close-modal">Cancel</button><button class="button" type="submit">Save word</button></div></form>`)
}

function packForm(pack = {}) {
  const selected = new Set(pack.wordIds || [])
  const boxes = data.words.map(word => `<label class="check-row"><input type="checkbox" name="wordIds" value="${esc(word.id)}" ${selected.has(word.id) ? 'checked' : ''}><span>${esc(word.ua)} <span style="color:#9198a6">· ${esc(word.en)}</span></span></label>`).join('')
  showModal(pack.id ? 'Edit pack' : 'Create a pack', 'Give your pack a name and add words.', `<form class="form" data-form="pack" data-id="${esc(pack.id || '')}"><div class="field"><label for="pack-title">Pack name</label><input id="pack-title" name="title" required value="${esc(pack.title || '')}" placeholder="For example: At the market"></div><div class="field"><label for="pack-description">Description</label><input id="pack-description" name="description" value="${esc(pack.description || '')}" placeholder="What will students learn?"></div><div class="field"><label for="pack-level">Level</label><select id="pack-level" name="level"><option ${pack.level === 'Starter' ? 'selected' : ''}>Starter</option><option ${pack.level === 'A1' ? 'selected' : ''}>A1</option><option ${pack.level === 'A2' ? 'selected' : ''}>A2</option></select></div><div class="field"><label for="pack-emoji">Pack icon</label><select id="pack-emoji" name="emoji">${['📘','👋','☕','🏙️','🌤️','🍎','🧭'].map(icon => `<option ${pack.emoji === icon ? 'selected' : ''}>${icon}</option>`).join('')}</select></div><div class="field"><label>Words in this pack</label><div class="check-list">${boxes || '<span class="field-hint">Add words to your library first.</span>'}</div></div><div class="form-actions"><button type="button" class="button secondary" data-action="close-modal">Cancel</button><button class="button" type="submit">Save pack</button></div></form>`)
}

function inviteForm() {
  showModal('Invite a student', 'Create a demo code for one student.', `<form class="form" data-form="invite"><div class="field"><label for="invite-name">Student name</label><input id="invite-name" name="name" required placeholder="For example: Alex Smith"></div><div class="field"><label for="invite-email">Student email</label><input id="invite-email" name="email" type="email" required placeholder="student@example.com"></div><p class="field-hint">This demo adds the student to this browser only.</p><div class="form-actions"><button type="button" class="button secondary" data-action="close-modal">Cancel</button><button class="button" type="submit">Create invite code</button></div></form>`)
}

function assignmentForm(studentId, packId) {
  const chosenStudent = data.users.find(user => user.id === studentId)
  const chosenPack = data.packs.find(pack => pack.id === packId)
  const current = chosenStudent ? assignedPacks(chosenStudent.id).map(pack => pack.id) : chosenPack ? data.assignments.filter(item => item.packId === chosenPack.id).map(item => item.studentId) : []
  const targetType = chosenStudent ? 'pack' : 'student'
  const options = chosenStudent ? data.packs.map(item => `<label class="check-row"><input type="checkbox" name="targets" value="${esc(item.id)}" ${current.includes(item.id) ? 'checked' : ''}><span>${esc(item.title)} <span style="color:#9198a6">· ${packWords(item).length} words</span></span></label>`).join('') : students().map(item => `<label class="check-row"><input type="checkbox" name="targets" value="${esc(item.id)}" ${current.includes(item.id) ? 'checked' : ''}><span>${esc(item.name)} <span style="color:#9198a6">· ${esc(item.email)}</span></span></label>`).join('')
  const title = chosenStudent ? `Assign packs to ${chosenStudent.name.split(' ')[0]}` : `Assign ${chosenPack?.title || 'pack'}`
  showModal(title, 'Select the packs that this student can study.', `<form class="form" data-form="assignment" data-student="${esc(chosenStudent?.id || '')}" data-pack="${esc(chosenPack?.id || '')}" data-target-type="${targetType}"><div class="check-list">${options || '<span class="field-hint">Add a student and a pack first.</span>'}</div><div class="form-actions"><button type="button" class="button secondary" data-action="close-modal">Cancel</button><button class="button" type="submit">Save assignments</button></div></form>`)
}

function renderStudy() {
  const pack = data.packs.find(item => item.id === study.packId)
  const wordIds = study.wordIds
  const total = wordIds.length
  if (!pack || !total) return `<div class="study-shell"><div class="study-top"><button class="study-back" data-action="exit-study">← Exit study</button></div><div class="study-content"><div class="study-finish"><div class="finish-icon">📚</div><h1>This pack has no words yet</h1><p>Ask your teacher to add words to this pack.</p><button class="button" data-action="exit-study">Back to packs</button></div></div></div>`
  if (study.index >= total) return `<div class="study-shell"><div class="study-top"><button class="study-back" data-action="exit-study">← Back to packs</button><div class="study-pack"><strong>${esc(pack.title)}</strong><span>Study session complete</span></div><span class="study-count">${total} words</span></div><div class="study-content"><div class="study-finish"><div class="finish-icon">🎉</div><h1>Чудово! Nice work.</h1><p>You finished this set. Your progress is saved in this browser.</p><div class="toolbar" style="justify-content:center"><button class="button secondary" data-action="exit-study">Back to packs</button><button class="button" data-action="restart-study">Study again</button></div></div></div></div>`
  const word = data.words.find(item => item.id === wordIds[study.index])
  if (!word) {
    study.index += 1
    return renderStudy()
  }
  const userProgress = data.progress[currentUser().id]?.[word.id]
  const width = Math.round(study.index / total * 100)
  return `<div class="study-shell"><div class="study-top"><button class="study-back" data-action="exit-study">← Exit study</button><div class="study-pack"><strong>${esc(pack.title)}</strong><span>${esc(pack.level || 'Starter')} · Ukrainian → English</span></div><span class="study-count">${study.index + 1} of ${total}</span></div><div class="study-progress"><span style="width:${width}%"></span></div><div class="study-content"><div class="study-inner"><div class="study-hint">${study.revealed ? 'English meaning' : 'What does this word mean?'}</div><article class="flashcard"><div class="flash-side">${study.revealed ? 'English' : 'Ukrainian'}</div><div class="flash-word ${study.revealed ? 'translation' : ''}" lang="${study.revealed ? 'en' : 'uk'}">${esc(study.revealed ? word.en : word.ua)}</div>${study.revealed && word.example ? `<p class="flash-example" lang="uk">${esc(word.example)}</p>` : ''}<button class="word-audio" data-action="speak" data-id="${esc(word.id)}" aria-label="Play Ukrainian pronunciation">▶</button></article>${study.revealed ? `<div class="flash-controls"><button class="button ghost" data-action="mark-word" data-status="learning">↻ &nbsp;Still learning</button><button class="button known" data-action="mark-word" data-status="known">✓ &nbsp;I know this</button></div>` : `<button class="button" style="width:100%;margin-top:16px;min-height:48px" data-action="reveal">Show meaning <span>→</span></button>`}<button class="flip-control" data-action="skip-word">${userProgress === 'known' ? 'Already know this · skip →' : 'Skip for now →'}</button></div></div></div>`
}

function toast(message) {
  document.querySelector('.toast')?.remove()
  const item = document.createElement('div')
  item.className = 'toast'
  item.setAttribute('role', 'status')
  item.textContent = message
  document.body.append(item)
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => item.remove(), 2600)
}

function makeCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const randomPart = Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
  return `SL-${randomPart}`
}

function startStudy(packId) {
  const pack = data.packs.find(item => item.id === packId)
  if (!pack) return
  const wordIds = packWords(pack).map(word => word.id)
  study = { packId, wordIds, index: 0, revealed: false }
  render()
}

function speakWord(word) {
  if (!('speechSynthesis' in window)) {
    toast('Audio is not available in this browser.')
    return
  }
  const utterance = new SpeechSynthesisUtterance(word.ua)
  utterance.lang = 'uk-UA'
  utterance.rate = 0.85
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

function doAction(action, element, sourceEvent) {
  const id = element.dataset.id
  if (action === 'nav') {
    activePage = element.dataset.page
    searchText = ''
    render()
  }
  if (action === 'switch-user') {
    activeUserId = element.value
    activePage = 'home'
    searchText = ''
    modal = null
    study = null
    render()
  }
  if (action === 'help') showModal('About this preview', 'This site runs as a static page on GitHub Pages.', '<div class="form"><p style="margin:0;color:#697184;font-size:12px;line-height:1.7">This preview uses sample accounts and saves changes in this browser. Google sign-in, shared data, and secure invites need Supabase. Ukrainian audio uses your browser voice when it is available.</p><div class="form-actions"><button class="button secondary" data-action="reset-demo">Reset demo data</button><button class="button" data-action="close-modal">Got it</button></div></div>')
  if (action === 'reset-demo') {
    if (confirm('Reset the demo data in this browser?')) {
      localStorage.removeItem(storeKey)
      window.location.reload()
    }
  }
  if (action === 'new-invite') inviteForm()
  if (action === 'new-word') wordForm()
  if (action === 'edit-word') wordForm(data.words.find(word => word.id === id))
  if (action === 'new-pack') packForm()
  if (action === 'edit-pack') packForm(data.packs.find(pack => pack.id === id))
  if (action === 'assign') assignmentForm(id)
  if (action === 'assign-pack') assignmentForm('', id)
  if (action === 'close-modal') closeModal()
  if (action === 'backdrop' && element === sourceEvent.target) closeModal()
  if (action === 'study') startStudy(id)
  if (action === 'speak') {
    const word = data.words.find(item => item.id === id)
    if (word) speakWord(word)
  }
  if (action === 'reveal' && study) {
    study.revealed = true
    render()
  }
  if (action === 'skip-word' && study) {
    study.index += 1
    study.revealed = false
    render()
  }
  if (action === 'mark-word' && study) {
    const wordId = study.wordIds[study.index]
    data.progress[currentUser().id] ||= {}
    data.progress[currentUser().id][wordId] = element.dataset.status
    saveData()
    study.index += 1
    study.revealed = false
    render()
  }
  if (action === 'exit-study') {
    study = null
    activePage = 'packs'
    render()
  }
  if (action === 'restart-study' && study) {
    study.index = 0
    study.revealed = false
    render()
  }
  if (action === 'delete-word') {
    const word = data.words.find(item => item.id === id)
    if (word && confirm(`Remove ${word.ua} from the library and all packs?`)) {
      data.words = data.words.filter(item => item.id !== id)
      data.packs.forEach(pack => { pack.wordIds = pack.wordIds.filter(wordId => wordId !== id) })
      Object.values(data.progress).forEach(progress => { delete progress[id] })
      saveData()
      render()
      toast('Word removed.')
    }
  }
  if (action === 'copy-code') {
    const code = element.dataset.code
    navigator.clipboard?.writeText(code).then(() => toast(`Invite code copied: ${code}`)).catch(() => toast(`Invite code: ${code}`))
  }
}

app.addEventListener('click', event => {
  const element = event.target.closest('[data-action]')
  if (!element) return
  const action = element.dataset.action
  if (action === 'search') return
  doAction(action, element, event)
})

app.addEventListener('input', event => {
  if (event.target.dataset.action === 'search') {
    searchText = event.target.value
    const cursor = event.target.selectionStart
    render()
    const field = app.querySelector('[data-action="search"]')
    field.focus()
    field.setSelectionRange(cursor, cursor)
  }
})

app.addEventListener('change', event => {
  if (event.target.dataset.action === 'switch-user') doAction('switch-user', event.target, event)
})

app.addEventListener('submit', event => {
  const form = event.target.closest('form[data-form]')
  if (!form) return
  event.preventDefault()
  const kind = form.dataset.form
  const values = new FormData(form)
  if (kind === 'word') {
    const word = { id: form.dataset.id || `w${Date.now()}`, ua: values.get('ua').trim(), en: values.get('en').trim(), example: values.get('example').trim(), audio: true }
    const index = data.words.findIndex(item => item.id === word.id)
    if (index >= 0) data.words[index] = word
    else data.words.push(word)
    saveData()
    modal = null
    render()
    toast('Word saved.')
  }
  if (kind === 'pack') {
    const pack = { id: form.dataset.id || `p${Date.now()}`, title: values.get('title').trim(), description: values.get('description').trim(), level: values.get('level'), emoji: values.get('emoji'), tone: 'blue', wordIds: values.getAll('wordIds') }
    const index = data.packs.findIndex(item => item.id === pack.id)
    if (index >= 0) data.packs[index] = { ...data.packs[index], ...pack }
    else data.packs.push(pack)
    saveData()
    modal = null
    render()
    toast('Pack saved.')
  }
  if (kind === 'invite') {
    const name = values.get('name').trim()
    const email = values.get('email').trim()
    const id = `student-${Date.now()}`
    const firstName = name.split(/\s+/)[0]
    const colors = ['', 'blue', 'green']
    data.users.push({ id, name, email, role: 'student', color: colors[data.users.length % colors.length] })
    data.progress[id] = {}
    const code = makeCode()
    data.invites.push({ id: `i${Date.now()}`, code, email, status: 'Sent', studentId: id })
    saveData()
    modal = null
    render()
    showModal('Invite code ready', `Share this code with ${firstName}.`, `<div class="form"><div style="padding:18px;border:1px solid #e7ebf4;border-radius:12px;background:#f7f8fc;text-align:center"><div class="eyebrow" style="margin:0 0 8px">Student invite code</div><strong style="font-family:Manrope,sans-serif;font-size:27px;letter-spacing:2px">${esc(code)}</strong><div class="field-hint" style="margin-top:7px">${esc(email)}</div></div><p class="field-hint">This code is a demo. It is saved in this browser only.</p><div class="form-actions"><button class="button secondary" data-action="copy-code" data-code="${esc(code)}">Copy code</button><button class="button" data-action="close-modal">Done</button></div></div>`)
  }
  if (kind === 'assignment') {
    const targets = values.getAll('targets')
    if (form.dataset.targetType === 'pack') {
      const studentId = form.dataset.student
      data.assignments = data.assignments.filter(item => item.studentId !== studentId || targets.includes(item.packId))
      targets.forEach(packId => {
        if (!data.assignments.some(item => item.studentId === studentId && item.packId === packId)) data.assignments.push({ studentId, packId })
      })
    } else {
      const packId = form.dataset.pack
      data.assignments = data.assignments.filter(item => item.packId !== packId || targets.includes(item.studentId))
      targets.forEach(studentId => {
        if (!data.assignments.some(item => item.studentId === studentId && item.packId === packId)) data.assignments.push({ studentId, packId })
      })
    }
    saveData()
    modal = null
    render()
    toast('Pack assignments saved.')
  }
})

render()
