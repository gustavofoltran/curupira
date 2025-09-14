# MAC0332 Engenharia de Software

Área destinada a organização do projeto final e entregas parciais da disciplina MAC0332

<img src="https://cdn.hackaday.io/images/4049831560526224990.jpg" width="638" height="478.5">

## Contribuição

Em uma equipe ágil deve-se adota um padrão de codificação comum (Coding Standard), de modo que todo o código do sistema pareça ter sido escrito por uma única pessoa altamente competente. Dessa forma, diminuimos o tempo necessário para decifrar decisões arbritrária por partes da equipe e garantimos que o sistema possa ser desenvolvido de forma assíncrona e independente. [1]

### Coding Standard

- A linguagem adotada para a escrita de TODO o código é a lingua Inglesa (EN - US);
- Só podem ser escritos caracteres da tabela ASCII (não pode haver accents, decorators, etc);

Para cada projeto há uma especificação quanto à sua escrita:

#### Commits e Git

Seguiremos o Git Flow. Então, temos uma branch **main** e **dev**, a qual não deve ser commitada diretamente, mas deve ser atualizada somente sob pull request.

Cada nova funcionalidade ou manutenção do sistema deve ser feita em uma branch, cujo nome identifica o que está sendo feito. Após a aprovação de PELO MENOS UM OUTRO integrante do time, essa branch deve ser apagada (prune it).

##### Classes de trabalho

feat: Feature
fix: Fixing, maintainance
style: mudança de estilo (frontend)
mr: merge

##### Padrões de nome

**Branch**: [classe de trabalho]-[nome da branch]
Ex.: feat-new-activity, fix-request-for-new-activity, style-layout-home-page

**Commit**: "[classe de trabalho]: [descrição do que foi feito]"
Ex.: "feat: adding activity request and layout for form submittion"

#### Typscript

- Variáveis ou parâmetros: camelCase
- Nome de classes: PascalCase

#### Python

- variáveis: snake_case
- Nome de classes: PascalCase

#### Comunicação HTTP por API

- Content-Type: JSON
- Parâmetro de um objeto: camelCase


## Autores

- [@brunapaulo](https://github.com/brunapaulo)
- [@fernando38954](https://github.com/fernando38954)
- [@Gabriellimmaa](https://github.com/Gabriellimmaa)
- [@gustavofoltran](https://github.com/gustavofoltran)
- [@lorekozz](https://github.com/lorekozz)
- [@lucas](https://www.instagram.com/franco.lucasr/)
- [@Xnths](https://github.com/Xnths)

## Plano geral para o repositório:

em "code" ficarão as linhas de código colaboratias de back e front, bem como arquivos para facil acesso como resumo de reuniões e envios 
em "issues" estarão as tasks, todos tem a permissão de editar, criar, e atribuir uma task a alguém
em project está nosso plano de trabalho principal (curupira), ainda vou organizá-lo para ficar com mais cara de scrum - estou pensando em fazer um plano de trabalho para cada sprint (talvez fique meio poluído), mas por enquanto tem so um projeto com 3 partes principais (to-do, in progress e done)
pretendo organizar melhor isso e arrumar um melhor template
na parte de "view 3", estarão todas as tasks dispostas em forma de lista com datas, talvez acompanhada de um projeto geral listando as datas principais dos envios e nossas sprints 
acho que é isso ainda pretendo organizar bem melhor e ver videos para ter ideias bj


# Bibliografia

[1] BECK, Kent. Extreme Programming Explained: Embrace Change. 2. ed. Massachusetts: Addison-Wesley, 2005.
