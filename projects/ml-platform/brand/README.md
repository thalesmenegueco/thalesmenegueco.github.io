# brand — a marca do VisuaLab

A arte de origem do ícone do VisuaLab.

Fica fora de [`../public/`](../public/) de propósito: o builder copia `public/`
inteiro para o bundle que vai ao ar, e um PNG de 891 KB não tem o que fazer lá.
Só o `.ico` derivado dele é publicado.

| Arquivo | Papel |
| :--- | :--- |
| `visualab-icon.png` | Arte de origem — 1024×1024, RGB: um quadrado de cantos arredondados que sangra até as quatro bordas do canvas |
| [`../public/favicon.ico`](../public/favicon.ico) | O que o navegador carrega: 16, 32 e 48 px em BMP, 64 e 128 px em PNG |

O `index.html` do app já declara `<link rel="icon" type="image/x-icon" href="favicon.ico">`,
então trocar o `.ico` basta para trocar o ícone da aba — nada de HTML muda junto.

## Registro

| Campo | Valor |
| :--- | :--- |
| Arte de origem | `visualab-icon.png` |
| sha256 da origem | `d9eb1087cb4ed8ad3e94db6b22a714b3ceeeac8e88b85998fb4b7c5d6cd3b901` |
| sha256 do `.ico` publicado | `e94f70b912329913c73cb6c440f4f06ac2aee3251a858d249900f481a78b1bf0` |
| Substituiu | o favicon padrão do Angular CLI (o escudo rosa/roxo), que ficou no ar até aqui |

## O que a conversão teve de resolver

Três coisas, todas medidas na arte em vez de presumidas:

1. **A geometria.** Um ajuste por mínimos quadrados sobre 129 pontos de contorno
   limpos dá raio de canto **245,75 px de 1024** (rms 0,31 px, máximo 0,87 px) e
   expoente de superelipse 1,96 — ou seja, o canto é circular.
2. **Os cantos.** A arte vem pintada sobre branco. O `.ico` reconstrói a cobertura
   como máscara de borda dura e tira a média por área em cada tamanho, então o
   canto é transparência de verdade e não um quadradinho branco em tema escuro.
3. **A borda.** O anel de 1 px na fronteira é uma mistura de azul-marinho com
   branco; deixado como está, ele vira um halo claro na aba de tema escuro. Antes
   de descartá-lo foi conferido que **nenhum pixel saturado** (o brilho da curva)
   chega a menos de 6 px para dentro da fronteira — por isso esse anel pôde ser
   substituído pela cor de preenchimento amostrada 6 px para dentro. Medição
   final: **zero pixels claros** nos cinco tamanhos.

Cores e cobertura são reduzidas já pré-multiplicadas, para a transparência dos
cantos não escorrer para dentro da arte.

## Refazendo o `.ico`

Não há script versionado: as três etapas acima foram feitas uma vez, com Pillow. Se
a arte mudar, o caminho é o mesmo — máscara de borda dura do quadrado arredondado
(raio 245,75 de 1024), média por área por tamanho, e o anel de fronteira trocado
pela cor amostrada para dentro.

Os tamanhos publicados são 16/32/48 em BMP e 64/128 em PNG: BMP nos pequenos,
porque é o que leitor antigo entende; PNG nos grandes, porque comprime cerca de
3× melhor e todo renderizador que pede 64 px já entende entrada PNG. Não há 256
porque o site não publica manifesto de web app — nada pede ao `.ico` um ícone de
instalação.
