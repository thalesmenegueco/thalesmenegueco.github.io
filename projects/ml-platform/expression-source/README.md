# expression-source

Artefatos de origem das leituras de expressão (`focus: 'expressoes'`), **fora do que é
publicado**. Irmã de `../image-source/`: as duas guardam material de trabalho que não é servido ao
aluno.

```
expressoes_chinesas.xlsx   26 expressões: 14 成语, 8 谚语 e 4 expressões modernas
```

## Por que aqui, e não em `public/`

A planilha estava em `public/chinese-expressions/`, e `public/` é copiado inteiro para o build: tudo
o que entra lá é servido em produção. Uma planilha de trabalho não é lição — é rascunho — então ela
saiu para cá, onde nada é servido.

## Esta planilha está **congelada**

A fonte de verdade do backlog passou a ser
[`../src/app/languages/mandarin-expressions.ts`](../src/app/languages/mandarin-expressions.ts), e
o motivo é o gate: `mandarin-expressions.spec.ts` roda no navegador, sem sistema de arquivos, então
um `.xlsx` não pode ser um teste. Um módulo TypeScript pode.

A planilha fica como **proveniência**: de onde as 26 linhas vieram. Ela não é mais editada — mexer
nela não muda nada no app. As duas linhas que a planilha não tem (`一举两得`, `天上不会掉馅饼`, as
gêmeas nativas dos dois calques) existem só no módulo, de propósito: elas nunca fizeram parte da
lista original.

## O que a planilha tem e o módulo não usa

A coluna **Situação de uso** — a que descreve o contexto de fala ("resolver um problema tarde, mas
melhor que nunca") — não virou campo. No módulo, esse papel é da `note` de cada leitura, escrita por
extenso e em pt-BR quando a leitura é escrita. Guardá-la como campo repetiria, em forma de tabela,
o texto que a nota já diz melhor.
