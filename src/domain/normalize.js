export function normalizeWord(value = '') {
  return value
    .trim()
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function displayWord(value = '') {
  return value.trim().toLocaleUpperCase('pt-BR')
}

export function isLettersOnly(value = '') {
  return /^[a-záàâãéêíóôõúçü]+$/iu.test(value)
}
