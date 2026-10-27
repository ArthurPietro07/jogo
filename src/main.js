import './style.css'
import { ANSWERS } from './data/words.js'
import { createGame, getDailyAnswer, getDateKey, getPracticeAnswer, MAX_ATTEMPTS, scoreGame, submitGuess } from './domain/game.js'
import { displayWord, normalizeWord } from './domain/normalize.js'
import { buildShareText, copyText } from './services/share.js'
import { load, save } from './services/storage.js'
import { LETTER_STATES } from './domain/word-evaluator.js'
import { playTone } from './services/sound.js'

const defaultStats = { version: 1, daily: { played: 0, won: 0, currentStreak: 0, bestStreak: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 } }, practice: { played: 0, won: 0 }, totalScore: 0, hintsUsed: 0, lastDailyDate: null }
const defaultSettings = { highContrast: false, colorblind: false, largeText: false, reducedMotion: false, sound: true }
const keyboardRows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']
function normalizeStats(value) {
  return {
    ...defaultStats,
    ...value,
    daily: { ...defaultStats.daily, ...(value?.daily || {}), distribution: { ...defaultStats.daily.distribution, ...(value?.daily?.distribution || {}) } },
    practice: { ...defaultStats.practice, ...(value?.practice || {}) },
  }
}

let stats = normalizeStats(load('stats:v1', defaultStats))
let settings = { ...defaultSettings, ...load('settings:v1', {}) }
let game = null
let screen = 'home'
let practiceIndex = load('practice-index:v1', 0)
let message = ''
let hintOpen = false
let gameId = ''

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
}

function answerFor(mode, difficulty) {
  if (mode === 'daily') return getDailyAnswer()
  return getPracticeAnswer(practiceIndex, difficulty)
}

function startGame(mode = 'daily', difficulty = 'easy') {
  const dateKey = getDateKey()
  gameId = mode === 'daily' ? `daily-${dateKey}` : `practice-${difficulty}-${practiceIndex}`
  const saved = load(`game:${gameId}`, null)
  if (saved?.answer && typeof saved.answer === 'string' && Array.isArray(saved.guesses) && saved.guesses.every((guess) => typeof guess.value === 'string' && Array.isArray(guess.result)) && ['playing', 'won', 'lost'].includes(saved.status)) game = saved
  else game = createGame({ mode, difficulty, answer: answerFor(mode, difficulty), id: gameId })
  screen = 'game'
  message = ''
  hintOpen = Boolean(game.hintsUsed)
  persistGame()
  render()
}

function persistGame() { if (game) save(`game:${gameId}`, game) }
function persistSettings() { save('settings:v1', settings) }
function announce(text) { message = text; render() }

function handleLetter(letter) {
  if (!game || game.status !== 'playing') return
  if (normalizeWord(game.currentGuess).length >= normalizeWord(game.answer).length) return
  game.currentGuess += letter
  persistGame()
  render()
}

function handleBackspace() {
  if (!game || game.status !== 'playing') return
  game.currentGuess = game.currentGuess.slice(0, -1)
  persistGame()
  render()
}

function handleSubmit() {
  if (!game || game.status !== 'playing') return
  const result = submitGuess(game, game.currentGuess)
  if (result.error) { playTone('error', settings.sound); return announce(result.error) }
  game = result.game
  message = game.status === 'won' ? 'Você encontrou a palavra.' : game.status === 'lost' ? 'A rodada terminou. A resposta está logo abaixo.' : 'Boa tentativa. Use as pistas para avançar.'
  playTone(game.status === 'won' ? 'win' : 'tap', settings.sound)
  persistGame()
  if (game.status !== 'playing') finishGame()
  render()
}

function useHint() {
  if (!game || game.status !== 'playing') return
  if (game.hintsUsed > 0) return
  game.hintsUsed += 1
  hintOpen = true
  message = 'Dica usada: -100 pontos nesta partida.'
  persistGame()
  render()
}

function finishGame() {
  const mode = game.mode
  const bucket = stats[mode]
  bucket.played += 1
  if (game.status === 'won') {
    bucket.won += 1
    if (mode === 'daily') {
      const today = getDateKey()
      const yesterday = new Date(Date.now() - 86400000)
      const previous = getDateKey(yesterday)
      bucket.currentStreak = stats.daily.lastDailyDate === previous ? bucket.currentStreak + 1 : 1
      bucket.bestStreak = Math.max(bucket.bestStreak, bucket.currentStreak)
      bucket.distribution[game.guesses.length] += 1
      stats.daily.lastDailyDate = today
    }
  } else if (mode === 'daily') {
    bucket.currentStreak = 0
    stats.daily.lastDailyDate = getDateKey()
  }
  stats.totalScore += scoreGame(game)
  stats.hintsUsed += game.hintsUsed
  save('stats:v1', stats)
  if (mode === 'practice') {
    practiceIndex += 1
    save('practice-index:v1', practiceIndex)
  }
}

function currentKeyStates() {
  const states = {}
  game?.guesses.forEach(({ value, result }) => [...value].forEach((letter, index) => {
    const state = result[index]
    if (!states[letter] || state === LETTER_STATES.CORRECT || (state === LETTER_STATES.NEAR && states[letter] === LETTER_STATES.ABSENT)) states[letter] = state
  }))
  return states
}

function tileLabel(letter, state, row, index) {
  const labels = { correct: 'correta na posição', near: 'presente em outra posição', absent: 'não está na palavra', '': 'vazia' }
  return `${letter || 'casa vazia'}, linha ${row + 1}, posição ${index + 1}, ${labels[state || '']}`
}

function renderBoard() {
  const length = normalizeWord(game.answer).length
  const rows = Array.from({ length: MAX_ATTEMPTS }, (_, row) => {
    const submitted = game.guesses[row]
    const letters = submitted ? [...submitted.value] : row === game.guesses.length ? [...game.currentGuess.toLocaleUpperCase('pt-BR')] : []
    return `<div class="board-row" role="row" style="grid-template-columns:repeat(${length}, minmax(0, 1fr))">${Array.from({ length }, (_, index) => {
      const letter = letters[index] || ''
      const state = submitted?.result[index] || ''
      const symbols = { correct: '✓', near: '↔', absent: '×' }
      return `<span class="tile ${state} ${letter && !state ? 'draft' : ''}" role="gridcell" data-state="${state}" aria-label="${tileLabel(letter, state, row, index)}">${letter}<b aria-hidden="true">${symbols[state] || ''}</b></span>`
    }).join('')}</div>`
  }).join('')
  return `<div class="board" role="grid" aria-label="Tabuleiro com ${MAX_ATTEMPTS} tentativas">${rows}</div>`
}

function renderKeyboard() {
  const states = currentKeyStates()
  return `<div class="keyboard" aria-label="Teclado virtual">${keyboardRows.map((row) => `<div class="keyboard-row">${[...row].map((letter) => `<button class="key ${states[letter] || ''}" type="button" data-key="${letter}" aria-label="Letra ${letter}, ${states[letter] || 'não usada'}">${letter}</button>`).join('')}</div>`).join('')}<div class="keyboard-row"><button class="key wide" type="button" data-action="backspace" aria-label="Apagar letra">⌫</button><button class="key submit" type="button" data-action="submit">Enviar</button></div></div>`
}

function homeView() {
  const daily = load(`game:daily-${getDateKey()}`, null)
  return `<section class="home-view"><div class="sun-orb" aria-hidden="true"></div><div class="home-copy"><p class="eyebrow">PALAVRA EM JOGO <span>·</span> DESAFIO ${getDateKey()}</p><h1>Uma pausa.<br><em>Uma palavra.</em></h1><p class="lede">Descubra a palavra secreta em seis tentativas. Sem cronômetro, sem cadastro, só você e a próxima ideia.</p><div class="home-actions"><button class="primary-button" type="button" data-start="daily">Jogar desafio diário <span>↗</span></button><button class="secondary-button" type="button" data-start="practice">Praticar livremente</button></div><label class="difficulty-picker">Nível da prática <select id="difficulty"><option value="easy">Fácil</option><option value="medium">Médio</option><option value="hard">Difícil</option></select></label><p class="return-note">${daily?.status === 'playing' ? 'Você tem uma partida diária em andamento.' : 'O desafio muda todos os dias à meia-noite.'}</p></div><div class="home-card"><span class="card-index">01</span><p>Como funciona</p><div class="mini-rules"><span><b>01</b> Arrisque uma palavra</span><span><b>02</b> Leia o feedback</span><span><b>03</b> Tente de novo</span></div><div class="home-card-bottom"><span>4–7 letras</span><span>6 tentativas</span></div></div></section>`
}

function gameView() {
  const answer = escapeHtml(displayWord(game.answer))
  const finished = game.status !== 'playing'
  return `<section class="game-view"><div class="game-header"><div><p class="eyebrow">${game.mode === 'daily' ? 'DESAFIO DIÁRIO' : 'PRÁTICA LIVRE'} <span>·</span> ${escapeHtml(game.difficulty.toUpperCase())}</p><h1>Descubra a palavra.</h1></div><button class="back-button" type="button" data-screen="home">← início</button></div><div class="game-layout"><div class="game-main"><div class="game-meta"><span>${MAX_ATTEMPTS - game.guesses.length} tentativas restantes</span><span>${game.guesses.length} de ${MAX_ATTEMPTS}</span></div>${renderBoard()}<div class="live-message" role="status" aria-live="polite">${escapeHtml(message || 'Digite uma palavra e confirme com Enter.')}</div>${renderKeyboard()}</div><aside class="game-aside"><div class="hint-card"><span class="aside-label">PISTA OPCIONAL</span><h2>Não precisa correr.</h2><p>${hintOpen ? escapeHtml(game.answerHint) : 'Uma pista curta pode destravar a próxima ideia.'}</p><button class="secondary-button" type="button" data-action="hint" ${hintOpen || finished ? 'disabled' : ''}>${hintOpen ? 'Pista revelada' : 'Revelar pista'} <small>−100 pts</small></button></div><div class="legend"><span class="aside-label">COMO LER</span><p><i class="legend-dot correct"></i> letra correta</p><p><i class="legend-dot near"></i> outra posição</p><p><i class="legend-dot absent"></i> não aparece</p></div></aside></div>${finished ? resultPanel(answer) : ''}</section>`
}

function resultPanel(answer) {
  const won = game.status === 'won'
  return `<div class="result-panel ${won ? 'won' : 'lost'}"><div><span class="eyebrow">${won ? 'VOCÊ CONSEGUIU' : 'FIM DA RODADA'}</span><h2>${won ? 'A palavra era ' : 'A resposta era '}<em>${answer}</em></h2><p>${won ? `Resolvida em ${game.guesses.length} tentativa${game.guesses.length === 1 ? '' : 's'}.` : 'Amanhã tem uma nova chance.'} ${game.hintsUsed ? `· ${game.hintsUsed} dica usada` : ''}</p></div><div class="result-score"><strong>${scoreGame(game)}</strong><span>pontos · sequência ${stats.daily.currentStreak}</span></div>${game.mode === 'daily' ? '<button class="primary-button" type="button" data-action="share">Compartilhar resultado ↗</button>' : ''}<button class="secondary-button" type="button" data-start="practice">Jogar prática</button></div>`
}

function statsView() {
  const winRate = stats.daily.played ? Math.round((stats.daily.won / stats.daily.played) * 100) : 0
  return `<section class="simple-view"><p class="eyebrow">SEU RITMO</p><h1>Estatísticas</h1><p class="lede">Tudo fica salvo neste dispositivo. Sem conta, sem placar público.</p><div class="stats-grid"><div><strong>${stats.daily.played}</strong><span>diários jogados</span></div><div><strong>${winRate}%</strong><span>taxa de vitória</span></div><div><strong>${stats.daily.currentStreak}</strong><span>sequência atual</span></div><div><strong>${stats.daily.bestStreak}</strong><span>melhor sequência</span></div><div><strong>${stats.practice.played}</strong><span>práticas jogadas</span></div><div><strong>${stats.practice.won}</strong><span>práticas vencidas</span></div><div><strong>${stats.totalScore}</strong><span>pontos acumulados</span></div><div><strong>${stats.hintsUsed}</strong><span>dicas usadas</span></div></div><div class="distribution"><h2>Distribuição de vitórias</h2>${[1,2,3,4,5,6].map((number) => `<div class="distribution-row"><span>${number}</span><div><i style="width:${Math.min(100, stats.daily.distribution[number] ? Math.max(10, stats.daily.distribution[number] * 12) : 0)}%"></i></div><b>${stats.daily.distribution[number]}</b></div>`).join('')}</div></section>`
}

function instructionsView() {
  return `<section class="simple-view"><p class="eyebrow">PRIMEIROS PASSOS</p><h1>Como jogar</h1><div class="instruction-grid"><article><b>01</b><h2>Arrisque</h2><p>Digite qualquer palavra válida com o mesmo número de letras da resposta.</p></article><article><b>02</b><h2>Observe</h2><p>Verde é posição certa. Amarelo é outra posição. Cinza não aparece.</p></article><article><b>03</b><h2>Descubra</h2><p>Você tem seis tentativas. Não existe cronômetro, então pense com calma.</p></article></div><button class="primary-button" type="button" data-screen="home">Entendi, começar ↗</button></section>`
}

function settingsView() {
  return `<section class="simple-view"><p class="eyebrow">PREFERÊNCIAS</p><h1>Jogue do seu jeito.</h1><div class="settings-list">${settingToggle('largeText', 'Texto ampliado', 'Aumenta a legibilidade das áreas principais.')} ${settingToggle('highContrast', 'Alto contraste', 'Reforça a diferença entre texto, fundo e controles.')} ${settingToggle('colorblind', 'Modo para daltonismo', 'Adiciona padrões e marcadores aos estados das letras.')} ${settingToggle('reducedMotion', 'Reduzir animações', 'Desativa transições e movimento decorativo.')} ${settingToggle('sound', 'Sons complementares', 'Mantém o áudio opcional do jogo ligado.')}</div></section>`
}

function settingToggle(key, title, description) { return `<label class="setting"><span><strong>${title}</strong><small>${description}</small></span><input type="checkbox" data-setting="${key}" ${settings[key] ? 'checked' : ''}><i></i></label>` }

function render() {
  const focusedKey = document.activeElement?.dataset?.key
  const focusedSetting = document.activeElement?.dataset?.setting
  const content = screen === 'game' ? gameView() : screen === 'stats' ? statsView() : screen === 'instructions' ? instructionsView() : screen === 'settings' ? settingsView() : homeView()
  document.querySelector('#app').innerHTML = `<div class="app ${settings.highContrast ? 'high-contrast' : ''} ${settings.colorblind ? 'colorblind' : ''} ${settings.largeText ? 'large-text' : ''} ${settings.reducedMotion ? 'reduced-motion' : ''}"><header class="site-header"><a class="brand" href="#" data-screen="home"><span>✦</span> palavra<strong>em jogo</strong></a><nav aria-label="Navegação"><button type="button" data-screen="instructions">Como jogar</button><button type="button" data-screen="stats">Estatísticas</button><button type="button" data-screen="settings" aria-label="Abrir configurações">⚙</button></nav></header><main>${content}</main><footer><span>Palavra em jogo · BR</span><span>Sem cronômetro · sem cadastro</span></footer></div>`
  bindEvents()
  if (focusedKey) document.querySelector(`[data-key="${focusedKey}"]`)?.focus()
  if (focusedSetting) document.querySelector(`[data-setting="${focusedSetting}"]`)?.focus()
}

function bindEvents() {
  document.querySelectorAll('[data-screen]').forEach((button) => button.addEventListener('click', (event) => { event.preventDefault(); screen = button.dataset.screen; render() }))
  document.querySelectorAll('[data-start]').forEach((button) => button.addEventListener('click', () => startGame(button.dataset.start, document.querySelector('#difficulty')?.value || 'easy')))
  document.querySelectorAll('[data-key]').forEach((button) => button.addEventListener('click', () => handleLetter(button.dataset.key)))
  document.querySelector('[data-action="backspace"]')?.addEventListener('click', handleBackspace)
  document.querySelector('[data-action="submit"]')?.addEventListener('click', handleSubmit)
  document.querySelector('[data-action="hint"]')?.addEventListener('click', useHint)
  document.querySelector('[data-action="share"]')?.addEventListener('click', async () => { const copied = await copyText(buildShareText(game, getDateKey())); announce(copied ? 'Resultado copiado sem spoiler.' : 'Não foi possível copiar automaticamente.') })
  document.querySelectorAll('[data-setting]').forEach((input) => input.addEventListener('change', () => { settings[input.dataset.setting] = input.checked; persistSettings(); render() }))
}

function keyboardHandler(event) {
  if (screen !== 'game' || event.ctrlKey || event.metaKey || event.altKey) return
  if (event.key === 'Backspace') handleBackspace()
  else if (event.key === 'Enter') handleSubmit()
  else if (/^[a-záàâãéêíóôõúçü]$/iu.test(event.key)) handleLetter(event.key.toLocaleUpperCase('pt-BR'))
}

document.addEventListener('keydown', keyboardHandler)
render()

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}))
}
