export const LETTER_STATES = Object.freeze({
  CORRECT: 'correct',
  NEAR: 'near',
  ABSENT: 'absent',
})

export function evaluateGuess(answer, guess, normalize = (value) => value) {
  const target = normalize(answer)
  const attempt = normalize(guess)
  const result = Array.from({ length: attempt.length }, () => LETTER_STATES.ABSENT)
  const remaining = new Map()

  for (let index = 0; index < target.length; index += 1) {
    if (attempt[index] === target[index]) {
      result[index] = LETTER_STATES.CORRECT
    } else {
      const letter = target[index]
      remaining.set(letter, (remaining.get(letter) || 0) + 1)
    }
  }

  for (let index = 0; index < attempt.length; index += 1) {
    if (result[index] === LETTER_STATES.CORRECT) continue
    const count = remaining.get(attempt[index]) || 0
    if (count > 0) {
      result[index] = LETTER_STATES.NEAR
      remaining.set(attempt[index], count - 1)
    }
  }

  return result
}
