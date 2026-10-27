export function buildShareText(game, dateKey) {
  const symbols = { correct: '🟩', near: '🟨', absent: '⬜' }
  const grid = game.guesses.map(({ result }) => result.map((state) => symbols[state]).join('')).join('\n')
  return `Palavra em Jogo ${dateKey} · ${game.status === 'won' ? game.guesses.length : 'X'}/6\n${grid}`
}

export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to the legacy copy path when permission is denied.
    }
  }
  const area = document.createElement('textarea')
  area.value = text
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.append(area)
  area.select()
  const copied = document.execCommand('copy')
  area.remove()
  return copied
}
