import { ANSWERS, VALID_GUESSES } from '../data/words.js'
import { evaluateGuess } from './word-evaluator.js'
import { isLettersOnly, normalizeWord } from './normalize.js'

export const MAX_ATTEMPTS = 6
export const MIN_WORD_LENGTH = 4
export const MAX_WORD_LENGTH = 7

export function getDateKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(date)
}

export function getDailyAnswer(date = new Date()) {
  const key = getDateKey(date)
  const seed = [...key].reduce((total, char) => total + char.charCodeAt(0), 0)
  return ANSWERS[seed % ANSWERS.length]
}

export function getPracticeAnswer(index = 0, difficulty = 'easy') {
  const candidates = ANSWERS.filter((word) => word.difficulty === difficulty)
  return candidates[index % candidates.length] || ANSWERS[index % ANSWERS.length]
}

export function createGame({ mode = 'daily', difficulty = 'easy', answer, id }) {
  return { id, mode, difficulty, answer: answer.value, answerHint: answer.hint, guesses: [], currentGuess: '', hintsUsed: 0, status: 'playing', startedAt: new Date().toISOString(), finishedAt: null }
}

export function isValidGuess(value, answer) {
  const normalized = normalizeWord(value)
  return isLettersOnly(value) && normalized.length >= MIN_WORD_LENGTH && normalized.length <= MAX_WORD_LENGTH && normalized.length === normalizeWord(answer).length && VALID_GUESSES.has(normalized)
}

export function submitGuess(game, value) {
  const normalized = normalizeWord(value)
  const answer = normalizeWord(game.answer)
  if (game.status !== 'playing') return { game, error: 'A partida já terminou.' }
  if (normalized.length !== answer.length) return { game, error: `Digite ${answer.length} letras.` }
  if (!isLettersOnly(value) || !VALID_GUESSES.has(normalized)) return { game, error: 'Essa palavra não está na lista.' }

  const result = evaluateGuess(game.answer, value, normalizeWord)
  const guesses = [...game.guesses, { value: value.trim().toLocaleUpperCase('pt-BR'), result }]
  const won = result.every((state) => state === 'correct')
  const lost = !won && guesses.length >= MAX_ATTEMPTS
  return { game: { ...game, guesses, currentGuess: '', status: won ? 'won' : lost ? 'lost' : 'playing', finishedAt: won || lost ? new Date().toISOString() : null }, error: '' }
}

export function scoreGame(game) {
  if (game.status === 'lost') return 50
  return Math.max(0, 1000 - (game.guesses.length - 1) * 120 - game.hintsUsed * 100)
}
