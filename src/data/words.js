export const WORDS = [
  { value: 'PRAIA', difficulty: 'easy', hint: 'Lugar onde a areia encontra o mar', category: 'natureza' },
  { value: 'FOLHA', difficulty: 'easy', hint: 'Parte verde de uma planta', category: 'natureza' },
  { value: 'NORTE', difficulty: 'easy', hint: 'Direção indicada pela bússola', category: 'direção' },
  { value: 'LIVRO', difficulty: 'easy', hint: 'Objeto com páginas para ler', category: 'cultura' },
  { value: 'MUSICA', difficulty: 'easy', hint: 'Arte organizada em sons', category: 'cultura' },
  { value: 'JANELA', difficulty: 'medium', hint: 'Abertura que deixa a luz entrar', category: 'casa' },
  { value: 'CAMINHO', difficulty: 'medium', hint: 'Por onde alguém pode passar', category: 'movimento' },
  { value: 'SORRISO', difficulty: 'medium', hint: 'Expressão de alegria no rosto', category: 'pessoas' },
  { value: 'CORAGEM', difficulty: 'hard', hint: 'Força para enfrentar o medo', category: 'sentimentos' },
  { value: 'MEMORIA', difficulty: 'hard', hint: 'Capacidade de guardar lembranças', category: 'mente' },
]

const EXTRA_GUESSES = ['CASA', 'AMIGO', 'TEMPO', 'MUNDO', 'SONHO', 'VERDE', 'NOITE', 'DANCA', 'NUVEM', 'PONTE', 'PAPEL', 'RISCO', 'IDEIA', 'LUZES', 'CAMPO', 'CHAVE', 'JOGAR', 'PENSAR', 'LETRAS']
const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')
export const VALID_GUESSES = new Set([...WORDS.map(({ value }) => normalize(value)), ...EXTRA_GUESSES.map(normalize)])
export const ANSWERS = WORDS
