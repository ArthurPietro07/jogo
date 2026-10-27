# PRD - Jogo Casual de Adivinhação de Palavras

**Status:** Rascunho para validação
**Versão:** 0.1
**Plataforma inicial:** Aplicação web responsiva
**Idioma inicial:** Português brasileiro
**Nome do produto:** A definir

## 1. Resumo

Um jogo casual de palavras com partidas rápidas, visual moderno e colorido, e foco em diversão, curiosidade e desafio. No modo principal, o jogador tenta descobrir uma palavra secreta em até seis tentativas usando o feedback das letras. O produto também terá desafio diário, prática ilimitada, dicas, níveis de dificuldade, estatísticas e funcionamento offline após o carregamento dos dados necessários.

A variedade será introduzida por modos complementares baseados em pistas e categorias, sem comprometer a simplicidade do fluxo principal.

## 2. Visão do produto

### 2.1 Objetivo

Criar uma experiência acessível e fácil de aprender que estimule o raciocínio em sessões curtas, incentive o retorno diário e continue interessante por meio de palavras, pistas e regras variadas.

### 2.2 Proposta de valor

- Uma partida começa rapidamente e não exige cadastro.
- As regras são compreendidas em poucos segundos.
- Cada tentativa fornece informação útil para o próximo palpite.
- O jogador pode escolher entre um desafio diário e prática ilimitada.
- A experiência funciona em computador, tablet e celular.
- A interface não depende somente de cores e pode ser usada por teclado.

### 2.3 Diferencial

Combinar a clareza da adivinhação por letras com pistas criativas, categorias e desafios variados. A variedade será organizada em modos distintos, para que cada modo tenha uma regra clara em vez de sobrecarregar a partida principal.

## 3. Público-alvo

### Primário

Adolescentes, jovens e adultos que gostam de jogos casuais, desafios de lógica e palavras em português.

### Necessidades do público

- Aprender a jogar sem tutorial longo.
- Ter uma partida curta, mas intelectualmente satisfatória.
- Receber feedback compreensível após cada tentativa.
- Poder pausar e retomar a partida.
- Jogar sem criar conta.
- Ter opções de acessibilidade e controle sobre sons e animações.

## 4. Metas e fora de escopo

### 4.1 Metas do MVP

- Entregar uma partida principal completa e confiável.
- Oferecer desafio diário e prática ilimitada.
- Permitir entrada por teclado, mouse e toque.
- Garantir feedback equivalente por cor, texto e símbolo.
- Salvar partida, progresso e estatísticas no dispositivo.
- Funcionar offline depois que o aplicativo e os dados necessários forem armazenados.
- Criar uma base técnica para novos modos e pacotes de palavras.

### 4.2 Fora de escopo do MVP

- Login e sincronização entre dispositivos.
- Desafios entre amigos por link ou código.
- Competição em tempo real.
- Ranking global.
- Criação de desafios personalizados.
- Temas e cosméticos desbloqueáveis.
- Anúncios e monetização.
- Suporte a outros idiomas.
- Nomes próprios e abreviações no modo principal.

## 5. Loop principal

1. O jogador escolhe o desafio diário ou a prática.
2. O jogo apresenta o tamanho da palavra e as tentativas disponíveis.
3. O jogador digita uma palavra válida.
4. O jogador edita as letras antes de enviar.
5. Ao confirmar, o jogo valida a palavra e revela o feedback letra por letra.
6. O jogador usa as informações para formular a próxima tentativa.
7. A partida termina quando a palavra é descoberta ou quando as tentativas acabam.
8. O jogo apresenta resultado, pontuação, estatísticas e opção de compartilhar.
9. No desafio diário, o jogador recebe um novo desafio no próximo ciclo diário.

## 6. Regras do modo principal

- A palavra secreta terá de 4 a 7 letras, conforme a configuração do desafio.
- O jogador terá seis tentativas.
- Não haverá limite de tempo.
- Cada tentativa deverá ter o mesmo número de letras da palavra em jogo.
- A tentativa deverá existir no dicionário permitido para o modo.
- Serão aceitos plurais e verbos conjugados quando estiverem no dicionário selecionado.
- Nomes próprios e abreviações não serão aceitos no modo principal.
- Letras acentuadas e não acentuadas serão consideradas equivalentes para facilitar a digitação. A apresentação da resposta poderá preservar a grafia correta.
- Uma tentativa enviada não poderá ser alterada.
- O jogador poderá editar livremente as letras ainda não enviadas.
- A partida será vencida ao encontrar a palavra dentro do limite de tentativas.

### 6.1 Feedback das letras

Cada letra deverá receber pelo menos dois sinais equivalentes entre si:

- **Posição correta:** a letra existe e está na posição correta.
- **Posição incorreta:** a letra existe na palavra, mas está em outra posição.
- **Letra ausente:** a letra não ocorre na palavra, respeitando a contagem de ocorrências.

O feedback deverá ser comunicado por combinação de cor, texto acessível, símbolo ou padrão visual. Nenhum resultado essencial poderá depender somente de cor.

Letras repetidas deverão obedecer à contagem real da palavra. Por exemplo, uma letra repetida na tentativa não deverá ser marcada como presente duas vezes quando a resposta só possui uma ocorrência.

## 7. Modos de jogo

### 7.1 Desafio diário - MVP

- Uma palavra ou desafio fixo por dia para todos os jogadores.
- O resultado poderá ser compartilhado sem revelar a resposta.
- O jogador terá uma oportunidade válida por ciclo diário.
- O estado da partida deverá ser salvo localmente.
- O aplicativo deverá definir o desafio de forma consistente mesmo offline.

### 7.2 Prática ilimitada - MVP

- Partidas sem limite de quantidade.
- A prática não deverá alterar a sequência do desafio diário.
- Poderá reutilizar palavras somente depois de uma política definida para evitar repetição excessiva.

### 7.3 Modos futuros

- Palavras baseadas em pistas criativas.
- Desafios por categoria.
- Desafios entre amigos por código ou link.
- Modo competitivo e rankings.
- Criação de desafios personalizados.

## 8. Dificuldade

O MVP terá três níveis:

- **Fácil:** palavras frequentes, pistas diretas quando aplicável e distribuição favorável de letras.
- **Médio:** palavras comuns com maior variedade de combinações e menos previsibilidade.
- **Difícil:** palavras menos frequentes, combinações de letras mais complexas ou restrições adicionais claramente informadas.

A dificuldade deverá ser determinada editorialmente e validada por testes com jogadores. O jogo não deverá usar palavras obscuras apenas para aumentar a taxa de falha.

## 9. Dicas e pontuação

### Dicas

- Serão opcionais.
- A dica poderá revelar uma categoria, uma letra, uma posição ou uma informação semântica, conforme o modo.
- Usar uma dica reduzirá a pontuação da partida.
- A penalidade deverá ser explicada antes da confirmação.
- O uso de dica não deverá bloquear a conclusão da partida.

### Pontuação inicial sugerida

A fórmula definitiva deverá ser validada em testes, mas o MVP pode considerar:

- Pontuação-base por concluir a partida.
- Bônus por resolver com menos tentativas.
- Penalidade por dicas utilizadas.
- Bônus separado por sequência diária.

A pontuação deve incentivar raciocínio, não apenas velocidade, já que o modo principal não terá limite de tempo.

## 10. Progressão e estatísticas

O MVP deverá registrar localmente:

- Partidas jogadas.
- Partidas vencidas.
- Percentual de vitórias.
- Distribuição de vitórias por número de tentativas.
- Sequência atual de vitórias.
- Melhor sequência.
- Pontuação acumulada.
- Uso de dicas.
- Resultado do desafio diário separado da prática.

A progressão poderá incluir níveis calculados a partir de partidas concluídas e pontuação. Conquistas podem ser incluídas no MVP apenas se não aumentarem significativamente o escopo da primeira entrega.

## 11. Compartilhamento

Ao finalizar um desafio diário, o jogador deverá poder copiar uma representação compacta do resultado, contendo:

- Identificação do jogo e do desafio.
- Número de tentativas usadas.
- Uma grade de símbolos ou padrões que represente o feedback.
- Nenhuma letra da palavra secreta.

O compartilhamento deverá funcionar sem exigir login ou integração direta com redes sociais.

## 12. Experiência e interface

### Telas do MVP

1. **Tela inicial:** acesso rápido ao desafio diário, prática e estatísticas.
2. **Tela de instruções:** explicação curta das regras e do significado dos feedbacks.
3. **Tela de jogo:** tabuleiro, teclado, tentativas restantes, dica e controles de áudio.
4. **Tela de resultado:** vitória ou fim das tentativas, resposta, pontuação, sequência e compartilhamento.
5. **Tela de estatísticas:** resumo pessoal com dados do desafio diário e da prática.
6. **Tela de configurações:** som, animações, contraste, modo para daltonismo e tamanho da fonte.

### Princípios de interface

- A partida deve começar com uma ação clara.
- O tabuleiro deve ser o elemento visual principal durante o jogo.
- O teclado virtual deve permanecer estável e não mudar de tamanho.
- Mensagens de erro devem explicar o problema e indicar como corrigi-lo.
- Animações devem confirmar ações sem atrasar o fluxo.
- O estado do jogo deve ser sempre visível: tentativa atual, tentativas restantes e modo ativo.

## 13. Acessibilidade

O MVP deverá incluir:

- Operação completa por teclado.
- Foco visível em todos os controles.
- Compatibilidade com toque e mouse.
- Feedback de letras que não dependa apenas de cor.
- Modo de alto contraste.
- Modo para daltonismo.
- Ajuste de tamanho da fonte.
- Opção para reduzir ou desativar animações.
- Áudio opcional e controles independentes de volume ou silêncio.
- Texto claro e instruções que possam ser revisitadas.
- Alvos de toque grandes e bem espaçados.
- Contraste adequado entre texto, controles e fundo.
- Leitura acessível do estado do tabuleiro e do resultado por tecnologias assistivas.

## 14. Funcionamento offline e armazenamento

O aplicativo deverá:

- Carregar o shell da aplicação e os dados necessários para jogar.
- Permitir iniciar e concluir partidas sem conexão após o primeiro carregamento.
- Salvar automaticamente a partida em andamento.
- Recuperar a partida após fechar ou recarregar o navegador.
- Persistir estatísticas e configurações no dispositivo.
- Evitar perder a partida por atualização de página ou fechamento acidental.
- Tratar mudanças de data e horário de forma consistente no desafio diário.

Como não haverá conta no MVP, o usuário deverá ser informado de que limpar os dados do navegador pode apagar o progresso local.

## 15. Requisitos funcionais

### RF01 - Iniciar partida
O sistema deve permitir iniciar o desafio diário ou uma partida de prática.

### RF02 - Inserir tentativa
O sistema deve aceitar letras por teclado físico, teclado virtual e toque quando aplicável.

### RF03 - Validar palavra
O sistema deve verificar tamanho, caracteres permitidos e existência no dicionário do modo.

### RF04 - Avaliar tentativa
O sistema deve calcular corretamente letras corretas, letras em posição incorreta e letras ausentes, incluindo letras repetidas.

### RF05 - Exibir feedback
O sistema deve mostrar o resultado visualmente e disponibilizá-lo em texto acessível.

### RF06 - Encerrar partida
O sistema deve detectar vitória ou esgotamento das tentativas e exibir o resultado.

### RF07 - Salvar estado
O sistema deve salvar automaticamente a partida, as configurações e as estatísticas locais.

### RF08 - Exibir estatísticas
O sistema deve apresentar estatísticas separadas ou identificadas por modo.

### RF09 - Compartilhar resultado
O sistema deve gerar uma representação sem spoilers do desafio diário concluído.

### RF10 - Configurar acessibilidade
O sistema deve permitir alterar contraste, daltonismo, tamanho de fonte, animações e áudio.

### RF11 - Funcionar offline
O sistema deve permitir jogar com os dados previamente armazenados no dispositivo.

## 16. Requisitos não funcionais

- Interface responsiva em celulares, tablets e computadores.
- Compatibilidade com navegadores modernos definidos pela implementação.
- Feedback de uma tentativa sem atrasos perceptíveis após a confirmação.
- Layout estável durante digitação, feedback e animações.
- Nenhum dado pessoal necessário para jogar.
- Dados locais protegidos contra sobrescrita acidental durante atualizações.
- Código de palavras separado da interface para permitir revisão editorial.
- Arquitetura extensível para novos modos e idiomas.
- Sem publicidade invasiva no lançamento.

## 17. Conteúdo e operação editorial

Será necessário manter:

- Dicionário de palavras válidas para tentativas.
- Lista de respostas possíveis.
- Classificação de frequência e dificuldade.
- Regras de acentuação e normalização.
- Lista de palavras proibidas, ambíguas ou inadequadas.
- Agenda do desafio diário.
- Processo de revisão humana para respostas e pistas.

A seleção de palavras deve considerar frequência de uso, compreensão regional no Brasil, plural e conjugação, ambiguidade e qualidade da experiência ao receber pistas.

## 18. Métricas de sucesso

Após o lançamento, acompanhar:

- Taxa de conclusão da primeira partida.
- Percentual de jogadores que vencem a primeira partida.
- Tempo médio até a primeira tentativa.
- Duração média da sessão.
- Retorno ao desafio diário no dia seguinte.
- Retenção de 7 e 30 dias.
- Média de partidas de prática por jogador.
- Taxa de uso das dicas.
- Taxa de compartilhamento.
- Erros de validação e partidas interrompidas.
- Uso das opções de acessibilidade.

Uma meta numérica deverá ser definida antes do teste beta, depois de estabelecer uma linha de base com usuários reais.

## 19. Critérios de aceite do MVP

- O jogador consegue iniciar uma partida sem cadastro.
- O jogador consegue inserir e editar uma tentativa antes de enviá-la.
- Tentativas inválidas recebem uma mensagem clara e não consomem uma jogada.
- Tentativas válidas consomem exatamente uma jogada.
- O feedback de letras repetidas é calculado corretamente.
- A vitória e a derrota são reconhecidas corretamente.
- A resposta é exibida ao fim da partida.
- O desafio diário é consistente no mesmo ciclo diário.
- A prática permite iniciar novas partidas sem bloqueio artificial.
- Uma partida interrompida pode ser retomada após recarregar a página.
- Estatísticas básicas são atualizadas e persistidas localmente.
- O resultado diário pode ser compartilhado sem revelar a palavra.
- Todas as ações principais funcionam por teclado e toque.
- O significado do feedback continua compreensível sem depender apenas de cor.
- O jogo continua utilizável com animações e áudio desativados.
- Uma partida previamente carregada pode ser jogada offline.

## 20. Roadmap preliminar

### MVP

- Modo principal por letras.
- Desafio diário.
- Prática ilimitada.
- Três dificuldades.
- Dicas com penalidade.
- Pontuação e estatísticas básicas.
- Salvamento local.
- Compartilhamento sem spoilers.
- Acessibilidade essencial.
- Suporte offline após carregamento.

### Versão 1.1

- Modo de pistas criativas.
- Modo por categorias.
- Melhorias na apresentação de estatísticas.
- Mais opções de personalização visual.
- Pesquisa com jogadores e balanceamento de dificuldade.

### Versões futuras

- Desafios por código ou link.
- Rankings.
- Competição em tempo real.
- Desafios criados por usuários.
- Conta opcional e sincronização entre dispositivos.
- Temas, cosméticos e pacotes de palavras.
- Outros idiomas.

## 21. Decisões ainda pendentes

1. Nome do jogo e identidade verbal.
2. Fonte oficial do dicionário e licença de uso.
3. Lista inicial de tamanhos por dificuldade e modo.
4. Horário e fuso do reset do desafio diário.
5. Fórmula final de pontuação e progressão.
6. Quantidade de palavras e respostas incluídas no primeiro lançamento.
7. Navegadores e versões mínimas suportadas.
8. Lista exata de conquistas do MVP.
9. Política para repetir palavras na prática.
10. Política de backup ou exportação das estatísticas locais.
11. Ferramenta e processo para revisão editorial.
12. Metas numéricas de retenção, conclusão e compartilhamento.
