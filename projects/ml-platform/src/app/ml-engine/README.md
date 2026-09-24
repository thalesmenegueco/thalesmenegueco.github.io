# ml-engine — onde ficam os testes do motor

O motor de ML (funções de álgebra, regressão e probabilidade, mais o contrato de
conteúdo das lições) mora em [`libs/ml-engine`](../../../../../libs/ml-engine/), importado
como `@ml/engine`.

Os **testes** ficam aqui, no projeto da aplicação, por uma restrição real do builder:

> `@angular/build:karma` descobre specs com `glob(include, { cwd: projectSourceRoot })`, e o
> `include` padrão é `**/*.spec.ts`. `projectSourceRoot` é `projects/ml-platform/src`, então um
> spec em `libs/` é invisível para o runner — testado e confirmado: padrões com `../` não
> resolvem fora do `cwd`.

Ou seja: `libs/` não é "onde os specs de lib vivem" neste repositório; specs vivem sob
`src/` e importam código de lib pelo alias (é o que `studies.component.spec.ts` já faz com
`@shared/progress`).

| Arquivo | O que verifica |
| :--- | :--- |
| `engine.spec.ts` | A matemática do motor, com valores conferidos à mão |
| `manifest-examples.generated.ts` | **Gerado** por `npm run examples:build` a partir dos manifestos — não edite à mão |
| `manifest-examples.spec.ts` | Cada `numericExample` dos manifestos, rodado no motor (nível 2 de verificação do `PIPELINE.md`) |

Fluxo ao mexer num exemplo numérico de manifesto:

```bash
npm run examples:build      # regenera a fixture a partir dos manifestos
npm run validate:manifests  # confere, entre outras coisas, que a fixture não ficou velha
npm run test:headless       # roda os testes de verdade
```

A fixture carrega um `manifestsHash`: se ela ficar para trás, o gate falha em vez de deixar
um teste verde provando números antigos.
