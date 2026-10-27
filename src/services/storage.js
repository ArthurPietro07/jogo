const PREFIX = 'palavra-em-jogo:'

export function load(key, fallback) {
  try {
    const value = localStorage.getItem(`${PREFIX}${key}`)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
  } catch {
    // Storage can be unavailable in private or restricted contexts.
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(`${PREFIX}${key}`)
  } catch {
    // Storage can be unavailable in private or restricted contexts.
  }
}
