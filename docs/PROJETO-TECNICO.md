# Documento de Projeto Tecnico
## Palavra em Jogo - Direcao Clareza Solar

**Versao:** 1.0
**Data:** 13 de outubro de 2026
**Status:** Proposta tecnica para implementacao
**Base de produto:** PRD v0.1
**Direcao visual:** Clareza solar
**Plataforma:** Aplicacao web responsiva, instalavel como PWA

---

## 1. Objetivo

Este documento descreve como transformar o prototipo de interface em um jogo casual de adivinhacao de palavras funcional. A implementacao deve preservar a direcao **Clareza solar**: interface luminosa, feedback direto, hierarquia simples, pequenas animacoes e uma sensacao de progresso sem pressa.

O primeiro produto entregue sera um MVP sem cadastro, sem backend obrigatorio e com funcionamento offline depois do primeiro carregamento dos dados necessarios.

### 1.1 Resultado esperado

O jogador deve conseguir:

1. Abrir o jogo sem criar conta.
2. Escolher desafio diario ou pratica.
3. Digitar uma palavra por teclado fisico, virtual ou toque.
4. Receber feedback correto sobre cada letra.
5. Usar uma dica com penalidade de pontuacao.
6. Concluir ou abandonar a partida e retomar depois.
7. Ver estatisticas locais.
8. Compartilhar o resultado diario sem revelar a resposta.
9. Jogar sem conexao depois do carregamento inicial.

---

## 2. Direcao visual e principios de implementacao

### 2.1 Caracteristicas da direcao Clareza solar

- Fundo quente e claro, com amarelo solar como cor de acao.
- Verde-petroleo para textos, navegacao e superficies de contraste.
- Coral como cor de destaque e comunicacao afetiva.
- Tipografia de leitura simples combinada com uma serifada expressiva para titulos.
- Tabuleiro como foco visual da tela de jogo.
- Feedback por cor reforcado por simbolo, texto e padrao.
- Animacoes curtas, suaves e desligaveis.
- Espacamento generoso para reduzir carga cognitiva.

### 2.2 Tokens visuais iniciais

Os tokens devem ficar centralizados em CSS variables para permitir ajustes sem alterar componentes individualmente.

```css
:root {
  --color-ink: #153f46;
  --color-ink-soft: #5f716d;
  --color-surface: #fbf9f4;
  --color-background: #f4f0e8;
  --color-solar: #f5c84b;
  --color-coral: #eb6b52;
  --color-correct: #4a9c83;
  --color-near: #f1c44f;
  --color-absent: #dfe4dd;
  --color-border: #d7ddd6;
  --radius-small: 4px;
  --radius-medium: 8px;
  --motion-fast: 160ms;
  --motion-standard: 280ms;
}
```

A paleta deve ser validada com contraste minimo de 4.5:1 para texto normal. Cores de estado nunca devem ser o unico mecanismo de comunicacao.

---

## 3. Estado atual do projeto

A base existente utiliza:

- Vite 8.
- JavaScript com modulos ES.
- CSS sem framework.
- `src/main.js` como ponto de montagem da interface atual.
- `src/style.css` com os estilos do painel e dos mockups.
- `localStorage` ainda nao implementado para o jogo real.
- Nao existe backend nem banco remoto.

O painel atual e um prototipo de direcao. A proxima etapa deve separar a interface de apresentacao da logica do jogo, evitando que o estado da partida continue embutido em templates grandes dentro de `main.js`.

---

## 4. Arquitetura proposta

### 4.1 Estrutura de pastas

```text
src/
  main.js
  app/
    router.js
    state.js
    events.js
  components/
    AppShell.js
    HomeScreen.js
    GameScreen.js
    GameBoard.js
    VirtualKeyboard.js
    HintButton.js
    ResultDialog.js
    StatsScreen.js
    SettingsScreen.js
    ShareResult.js
  domain/
    game.js
    scoring.js
    normalize.js
    word-evaluator.js
    daily-challenge.js
    difficulty.js
  data/
    dictionary.js
    answer-schedule.js
    word-metadata.js
  services/
    storage.js
    offline.js
    clipboard.js
    date.js
    analytics.js
  styles/
    tokens.css
    base.css
    components.css
    themes.css
  tests/
    word-evaluator.test.js
    game.test.js
    scoring.test.js
    storage.test.js
    accessibility.test.js
public/
  manifest.webmanifest
  icons/
```

A estrutura pode continuar em JavaScript puro no MVP. Se o projeto crescer para multiplos modos, migrar para TypeScript sera recomendado antes de adicionar sincronizacao ou conteudo criado por usuarios.

### 4.2 Camadas

**Apresentacao**

Renderiza telas, recebe eventos de teclado/toque e anuncia mudancas para tecnologias assistivas. Nao deve decidir regras de pontuacao ou avaliacao de letras.

**Estado da aplicacao**

Mantem tela atual, modo, dificuldade, partida corrente, preferencias e estatisticas. A atualizacao deve ser previsivel e centralizada.

**Dominio**

Contem regras puras e testaveis: normalizacao, avaliacao de tentativas, transicoes de partida, dicas, pontuacao e desafio diario.

**Dados e servicos**

Fornecem dicionario, agenda de respostas, armazenamento local, clipboard, data local e cache offline.

---

## 5. Modelo de dados

### 5.1 Palavra

```js
{
  value: "praia",
  normalized: "praia",
  length: 5,
  difficulty: "easy",
  frequency: "common",
  allowAsGuess: true,
  allowAsAnswer: true,
  categories: ["natureza", "lugar"],
  hint: "Lugar onde a areia encontra o mar"
}
```

`normalized` deve remover acentos e aplicar caixa baixa. `value` preserva a grafia apresentada ao jogador.

### 5.2 Partida

```js
{
  id: "daily-2026-10-13",
  mode: "daily",
  difficulty: "easy",
  answerLength: 5,
  answerId: "praia-001",
  guesses: [
    {
      value: "palavra",
      normalized: "palavra",
      result: ["absent", "near", "absent", "correct", "absent"]
    }
  ],
  hintsUsed: 0,
  status: "playing",
  startedAt: "2026-10-13T10:15:00.000Z",
  finishedAt: null
}
```

A resposta nao deve ser exposta em dados de interface antes do encerramento da partida. Em modo offline, a lista de respostas precisa estar no dispositivo; isso e uma limitacao aceita no MVP.

### 5.3 Estatisticas

```js
{
  version: 1,
  daily: {
    played: 0,
    won: 0,
    currentStreak: 0,
    bestStreak: 0,
    distribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 }
  },
  practice: {
    played: 0,
    won: 0
  },
  totalScore: 0,
  hintsUsed: 0,
  lastDailyDate: null
}
```

O formato deve ter um campo `version` para permitir migracoes futuras do `localStorage`.

---

## 6. Motor de avaliacao de palavras

### 6.1 Normalizacao

A entrada do jogador deve:

1. Remover espacos nas extremidades.
2. Converter para caixa baixa.
3. Normalizar acentos para comparacao.
4. Preservar uma forma de exibicao adequada quando necessario.
5. Rejeitar caracteres que nao sejam letras do idioma aceito.

Exemplo:

```js
normalize("Ação") // "acao"
normalize(" acao ") // "acao"
```

A normalizacao deve usar `String.prototype.normalize('NFD')` e remover marcas diacriticas com regex Unicode.

### 6.2 Avaliacao com letras repetidas

A avaliacao deve ocorrer em duas passagens:

1. Marcar como `correct` as letras que coincidem na mesma posicao.
2. Contar apenas as letras restantes da resposta e marcar como `near` enquanto houver ocorrencia disponivel.
3. Marcar o restante como `absent`.

Pseudocodigo:

```text
resultado = vazio
restantes = contagem das letras da resposta

para cada posicao:
  se tentativa[posicao] == resposta[posicao]:
    resultado[posicao] = correct
    diminuir contagem da letra

para cada posicao ainda sem resultado:
  se contagem da tentativa[posicao] > 0:
    resultado[posicao] = near
    diminuir contagem da letra
  senao:
    resultado[posicao] = absent
```

Esse algoritmo evita marcar duas ocorrencias como presentes quando a resposta possui apenas uma.

### 6.3 Contrato da funcao

```js
 evaluateGuess({ answer: "praia", guess: "palma" })
 // ["correct", "correct", "near", "absent", "absent"]
```

A funcao deve ser pura, nao alterar a partida e ter testes para acentos, letras repetidas, palavra exata, nenhuma coincidencia e tamanhos invalidos.

---

## 7. Fluxo de partida

### 7.1 Estados

```text
idle -> playing -> won
                 -> lost
                 -> abandoned
```

A partida em `playing` deve ser persistida apos cada tentativa valida. Uma tentativa invalida nao altera o numero de tentativas nem o estado.

### 7.2 Entrada

- Teclado fisico: letras, Backspace, Enter.
- Teclado virtual: botoes sem inserir caracteres diretamente no DOM.
- Toque: cada tecla deve ter area minima de 44 por 44 CSS pixels quando possivel.
- A digitacao deve ter limite pelo tamanho da palavra.
- Enter sem quantidade correta de letras deve exibir erro contextual.

### 7.3 Mensagens de erro

Mensagens devem ser curtas e orientadas a recuperacao:

- `Digite 5 letras.`
- `Essa palavra nao esta na lista.`
- `A partida ja terminou.`
- `A dica reduz sua pontuacao em 10 pontos.`

A mensagem deve aparecer em texto visivel e ser anunciada em uma regiao `aria-live="polite"`.

---

## 8. Desafio diario e pratica

### 8.1 Identidade do desafio diario

O desafio deve ter um identificador deterministico baseado na data civil do produto:

```text
daily-YYYY-MM-DD
```

O fuso oficial deve ser definido antes do lancamento. A recomendacao para o MVP e usar `America/Sao_Paulo`, com reset as 00:00 nesse fuso.

### 8.2 Selecao offline

A agenda de respostas deve ser empacotada no build, com uma margem de datas para permitir o uso offline. A aplicacao deve:

- escolher a resposta pelo identificador do dia;
- manter a mesma resposta durante o dia;
- nao depender de uma requisicao para iniciar a partida;
- detectar data fora da agenda e mostrar estado de atualizacao necessario.

### 8.3 Pratica

A pratica deve usar um gerador deterministico local ou uma fila embarcada de palavras. A mesma palavra nao deve reaparecer ate que o jogador tenha consumido a fila disponivel, salvo quando a lista for esgotada.

A pratica nao altera a sequencia do desafio diario.

---

## 9. Pontuacao e dicas

### 9.1 Formula inicial

Uma formula simples e auditavel para o MVP:

```text
pontuacao = max(0, 1000 - (tentativas - 1) * 120 - dicas * 100)
```

Regras:

- Resolver na primeira tentativa: 1000 pontos.
- Cada tentativa adicional: menos 120 pontos.
- Cada dica utilizada: menos 100 pontos.
- A pontuacao minima de uma vitoria e 0.
- Derrota pode conceder 50 pontos de participacao, sem entrar na distribuicao de vitorias.

A formula deve ser configuravel em um modulo, pois o balanceamento depende de testes reais.

### 9.2 Dicas

No MVP, uma dica deve revelar a categoria ou uma frase semantica curta. Revelar letra ou posicao pode ficar para um modo posterior, pois altera mais profundamente a dificuldade.

Antes de usar a dica, o jogador deve ver a penalidade. O estado `hintsUsed` precisa ser salvo junto com a partida.

---

## 10. Persistencia local e offline

### 10.1 Armazenamento

Usar `localStorage` para o MVP por simplicidade. Centralizar o acesso em `services/storage.js`; componentes nunca devem chamar `localStorage` diretamente.

Chaves sugeridas:

```text
pj:settings:v1
pj:current-game:v1
pj:stats:v1
pj:daily-history:v1
```

### 10.2 Protecoes

- Envolver leitura e escrita em `try/catch`.
- Validar o formato antes de usar dados persistidos.
- Recuperar valores padrao quando os dados forem invalidos.
- Nao armazenar informacoes pessoais.
- Avisar que limpar os dados do navegador apaga o progresso local.
- Fazer migracao por versao, nunca sobrescrever dados desconhecidos silenciosamente.

### 10.3 PWA

Adicionar:

- `manifest.webmanifest` com nome, icones, cor de tema e modo `standalone`.
- Service worker para cachear shell, CSS, JavaScript, fontes e dados de palavras.
- Estrategia cache-first para assets versionados.
- Estrategia stale-while-revalidate para a agenda futura quando houver rede.
- Tela offline informativa apenas quando os dados do desafio nao estiverem disponiveis.

A instalacao como PWA e uma melhoria do MVP, mas a partida offline deve funcionar mesmo sem instalacao quando o navegador suportar cache e armazenamento.

---

## 11. Componentes da interface

### 11.1 Tela inicial

Responsabilidades:

- Mostrar desafio diario e pratica.
- Exibir resumo de sequencia e ultima pontuacao.
- Indicar quando existe uma partida interrompida.
- Levar a instrucoes e configuracoes.

### 11.2 Tela de jogo

Hierarquia da direcao Clareza solar:

1. Palavra em jogo e quantidade de tentativas.
2. Tabuleiro.
3. Teclado virtual.
4. Dica e controles secundarios.
5. Estado de conexao e sem cronometro.

O tabuleiro deve manter dimensoes estaveis. O tamanho da fonte pode diminuir conforme a palavra, mas nao pode causar deslocamento da grade.

### 11.3 Resultado

Deve exibir:

- Vitoria ou fim das tentativas.
- Palavra correta.
- Pontuacao.
- Tentativas utilizadas.
- Dicas utilizadas.
- Atualizacao da sequencia.
- Compartilhar resultado.
- Jogar pratica ou voltar ao inicio.

### 11.4 Estatisticas

Usar graficos simples ou barras textuais. Todos os valores devem ter rotulo textual; nao usar apenas altura, cor ou icone para transmitir informacao.

---

## 12. Acessibilidade tecnica

### 12.1 Teclado e foco

- Todos os botoes devem ser elementos `button` nativos.
- A ordem de foco deve seguir a ordem visual.
- Usar `:focus-visible` com indicador de alto contraste.
- Nao remover foco apos uma acao.
- Esc deve fechar dialogs e menus.
- Enter e Space devem ativar botoes.

### 12.2 Leitores de tela

- O tabuleiro deve ter `role="grid"` quando isso melhorar a navegacao.
- Cada celula deve anunciar letra, linha, posicao e resultado.
- Resultado de uma tentativa deve ser anunciado de forma resumida.
- Mensagens temporarias devem usar `aria-live="polite"`.
- Icones decorativos devem ter `aria-hidden="true"`.
- Botoes com apenas icone precisam de `aria-label`.

### 12.3 Cor e movimento

- `correct`, `near` e `absent` devem possuir texto ou padrao adicional.
- Oferecer modo para daltonismo com simbolos ou texturas diferentes.
- Respeitar `prefers-reduced-motion`.
- Nunca exigir tempo de reacao para concluir uma jogada.
- Permitir desativar animacoes nas configuracoes.

### 12.4 Validacao

Testar com:

- Lighthouse Accessibility.
- axe-core.
- Navegacao somente por teclado.
- NVDA ou leitor equivalente em Windows.
- Zoom de 200%.
- Contraste alto e simulacoes de daltonismo.
- Viewports de 320, 768 e 1440 pixels.

---

## 13. Testes

### 13.1 Testes unitarios

Prioridade maxima:

- Normalizacao de acentos.
- Avaliacao de letras repetidas.
- Validacao de tamanho e dicionario.
- Transicoes de estado da partida.
- Formula de pontuacao.
- Penalidade de dicas.
- Identificador e reset do desafio diario.
- Migracao do armazenamento local.

### 13.2 Testes de integracao

- Iniciar desafio diario.
- Digitar por teclado e teclado virtual.
- Rejeitar tentativa invalida sem consumir jogada.
- Persistir partida apos recarregar.
- Retomar partida incompleta.
- Finalizar vitoria e atualizar estatisticas.
- Gerar compartilhamento sem palavra secreta.
- Jogar sem conexao depois do cache inicial.

### 13.3 Testes visuais

Manter snapshots ou screenshots dos tres estados principais:

- Tela inicial.
- Partida em andamento.
- Resultado.

Validar especialmente a direcao Clareza solar em celular e desktop. Os mockups Jornal de bolso e Modo foco podem permanecer como referencias futuras, mas nao devem quebrar a arquitetura de temas.

### 13.4 Testes manuais de produto

Checklist de cada release:

- Partida jogavel em menos de 20 segundos apos abertura.
- Todas as mensagens compreensiveis sem instrucoes externas.
- Palavra com acento aceita sem comportamento surpreendente.
- Sequencia nao quebra ao jogar pratica.
- Resultado compartilhado nao contem resposta.
- Alteracoes de configuracao persistem.
- Fechamento e retorno nao perdem dados.

---

## 14. Qualidade, desempenho e seguranca

### Desempenho

- Manter o primeiro carregamento pequeno e sem bibliotecas desnecessarias.
- Evitar renderizar toda a aplicacao para cada tecla no jogo final; atualizar apenas tabuleiro e teclado.
- Lazy-load de telas futuras quando houver crescimento.
- Comprimir agenda e dicionario, removendo metadados nao necessarios no cliente.
- Usar fontes locais ou uma familia com fallback confiavel para permitir offline.

### Seguranca e privacidade

- Nao coletar dados pessoais no MVP.
- Nao enviar tentativas ou estatisticas para servidor sem consentimento.
- Nao inserir conteudo de palavras diretamente em HTML sem escapar valores.
- Validar dados vindos do `localStorage`.
- Tratar clipboard como permissao opcional; oferecer copia manual como fallback.
- Revisar o dicionario para remover termos inadequados ou potencialmente ofensivos.

### Limite do offline

Como a agenda de respostas fica no cliente, um usuario tecnicamente habilidoso podera inspecionar os dados. Isso e aceitavel no MVP porque o objetivo e experiencia individual, nao seguranca competitiva. Um backend sera necessario se o produto adotar ranking, competicao ou protecao contra spoilers.

---

## 15. Plano de implementacao

### Fase 0 - Preparacao

- Confirmar nome, fuso do desafio e fonte/licenca do dicionario.
- Congelar tokens da direcao Clareza solar.
- Definir navegadores suportados.
- Selecionar lote inicial de respostas e palavras validas.

**Saida:** backlog tecnico, contrato de dados e checklist editorial.

### Fase 1 - Dominio

- Implementar normalizacao.
- Implementar avaliacao de tentativas.
- Implementar estados da partida.
- Implementar pontuacao e dicas.
- Criar testes unitarios.

**Saida:** motor de jogo sem interface.

### Fase 2 - Interface jogavel

- Separar `GameScreen`, `GameBoard` e `VirtualKeyboard`.
- Implementar entrada por teclado e toque.
- Implementar feedback, erros e resultado.
- Aplicar tokens da direcao Clareza solar.
- Implementar preferencias de som, contraste e animacao.

**Saida:** partida completa em memoria.

### Fase 3 - Persistencia e modos

- Implementar storage versionado.
- Salvar e recuperar partida.
- Implementar desafio diario deterministico.
- Implementar pratica sem alterar sequencia diaria.
- Implementar estatisticas e compartilhamento.

**Saida:** MVP local completo.

### Fase 4 - Offline e acessibilidade

- Adicionar manifest e service worker.
- Cachear shell e dados necessarios.
- Rodar auditoria de teclado, leitor de tela e contraste.
- Testar viewports e reducao de movimento.

**Saida:** release candidata.

### Fase 5 - Validacao

- Testar com jogadores do publico-alvo.
- Medir taxa de conclusao, vitoria inicial, retorno e uso de dicas.
- Balancear dicionario, formula de pontos e dificuldade.
- Corrigir ambiguidades editoriais.

**Saida:** versao 1.0 priorizada por dados.

---

## 16. Criterios de aceite tecnico

O projeto pode ser considerado pronto para beta quando:

- `npm run build` conclui sem erros.
- O motor possui cobertura de testes para letras repetidas e acentos.
- O jogo inicia sem rede apos o cache inicial.
- O desafio diario e igual para o mesmo dia e fuso.
- Uma partida persiste apos fechar e reabrir a pagina.
- Pratica e desafio diario mantem estatisticas separadas.
- A interface funciona por teclado sem armadilhas de foco.
- O feedback continua compreensivel sem cor.
- O layout nao quebra em 320, 768 e 1440 pixels.
- O compartilhamento nao inclui a palavra secreta.
- A pontuacao e a penalidade da dica sao reproduziveis.
- A limpeza ou invalidacao de storage nao impede iniciar uma nova partida.

---

## 17. Riscos e mitigacoes

| Risco | Impacto | Mitigacao |
|---|---|---|
| Dicionario com palavras raras demais | Frustracao e baixa conclusao | Revisao editorial, metadados de frequencia e teste com jogadores |
| Letras repetidas avaliadas incorretamente | Perda de confianca no jogo | Algoritmo em duas passagens e testes de casos limite |
| Perda de progresso local | Abandono | Escrita apos cada evento importante, schema versionado e recuperacao segura |
| Offline com agenda insuficiente | Desafio indisponivel | Empacotar janela de datas e estado de fallback |
| Cor insuficiente para daltonismo | Informacao inacessivel | Simbolos, texto, padroes e auditoria de contraste |
| Escopo visual crescer antes do motor | Atraso do MVP | Implementar dominio antes de cosméticos e novos temas |
| Exposicao das respostas no cliente | Spoiler ou trapaça futura | Aceitar no MVP; migrar para backend se houver competicao |
| Reset incorreto por fuso horario | Sequencia quebrada | Usar fuso explicito e testes em datas de transicao |

---

## 18. Decisoes pendentes para iniciar o desenvolvimento

1. Confirmar que Clareza solar sera a direcao do MVP.
2. Definir o nome final do jogo.
3. Escolher dicionario e licenca de uso.
4. Confirmar `America/Sao_Paulo` e reset a meia-noite.
5. Definir quantidade de palavras e respostas no pacote inicial.
6. Confirmar navegadores e versoes minimas.
7. Validar a formula de pontuacao com testes de usuarios.
8. Definir se conquistas entram na primeira entrega.
9. Definir politica de repeticao da pratica.
10. Escolher a ferramenta de testes de interface e acessibilidade.

---

## 19. Proximo passo recomendado

Implementar primeiro o modulo puro `src/domain/word-evaluator.js`, acompanhado de testes para acentos e letras repetidas. Em seguida, substituir o teclado demonstrativo do mockup por uma `GameScreen` real. Essa ordem valida a regra mais sensivel do produto antes de investir em telas adicionais, animacoes e progressao.
