# VisualML - Aprender Aprendizado de Máquina de maneira Visual


**Um site próprio é significativamente melhor para o novo projeto especificamente.** E a razão principal não é técnica — é de produto.

---

## O problema central: propósitos conflitantes

Seu portfólio em `thalesmenegueco.github.io` tem um job: **vender você como profissional**. Recrutadores entram, vêem seus projetos, e em 30 segundos decidem se te chamam para uma entrevista. Cada segundo de carregamento e cada MB de bundle que não serve a esse propósito trabalha contra você.

Uma plataforma de curso interativo de ML tem um job completamente diferente: **ensinar alguém que pode passar 2 horas num módulo, voltar no dia seguinte, e querer ver seu progresso salvo**. O público-alvo, o tempo de sessão, as métricas de sucesso, e a identidade visual são fundamentalmente diferentes.

Juntar os dois é como colocar uma escola dentro do lobby de um escritório de advocacia — funcional, mas prejudica os dois.

---

## Por que separar faz sentido aqui (e não seria óbvio para um projeto menor)

O ponto de inflexão é o **peso dos cursos de ML**. Comparando com o que você já tem:

| Aspecto | Cálculo (existente) | Machine Learning (proposto) |
|---------|---------------------|---------------------------|
| Dependências pesadas | KaTeX (~280KB) | KaTeX + D3 (~270KB) + **TF.js (~1.2MB)** + Plotly (~1MB) |
| Número de cursos | 1 disciplina | 4 cursos, cada com 2 módulos |
| Estado persistente | Progresso simples | Progresso + datasets + modelos treinados |
| Interação esperada | Minutos por sessão | **Horas** por sessão |
| Público | Recrutador curioso | Estudante comprometido |

Mesmo com lazy loading perfeito, o **build pipeline**, o CI/CD, e a experiência de desenvolvimento do portfólio ficam mais complexos. Um `npm install` que puxa TensorFlow.js e Plotly para um portfólio que deveria ser leve é um custo que não se paga.

---

## O que eu recomendo: monorepo, dois deploys

Não precisa ser dois codebases. A melhor configuração seria:

```text
estudos-workspace/                     # Angular workspace único
├── projects/
│   ├── portfolio/                     # App 1: thalesmenegueco.github.io
│   │   └── ... (portfólio atual, leve)
│   └── ml-platform/                   # App 2: site próprio (ex: visualml.dev)
│       └── ... (cursos de ML)
├── libs/
│   ├── shared-plotting/               # PlotCanvasComponent, plotting.ts
│   ├── shared-katex/                  # KatexComponent + rich text
│   └── shared-progress/              # localStorage progress service
└── angular.json                       # Configura dois apps
```

**Vantagens dessa abordagem:**

1. **Código reutilizado sem acoplamento de deploy** — o `PlotCanvasComponent` e o service de progresso vivem em `libs/` e são importados por ambos os apps
2. **O portfólio permanece leve** — sem TF.js, sem Plotly, sem D3 no bundle do recrutador
3. **A plataforma de ML tem sua própria identidade** — domínio próprio, SEO próprio, analytics próprio
4. **Um linka para o outro** — o portfólio mostra "Plataforma de ML interativa" como um projeto, com link; a plataforma tem "feito por Thales Menegueco" no rodapé
5. **Escalabilidade** — se a plataforma crescer (comentários, contas de usuário, mais cursos), isso não arrasta o portfólio junto

---

## Quando manter junto faria sentido

Se o escopo fosse menor — digamos, apenas o Curso 1 (Fundamentos), sem TF.js, com widgets em canvas puro — manter no portfólio seria perfeitamente razoável. O peso seria equivalente ao módulo de Cálculo que já existe. A linha que eu usaria como critério:

> **Se a soma de novas dependências for maior que o bundle atual do portfólio → separa.**

TF.js sozinho (1.2MB minified) já é provavelmente maior que todo o bundle atual do seu portfólio. Isso é o sinal.

---

## Sugestão prática de domínio e deploy

Para o deploy da plataforma de ML:

- **GitHub Pages** funciona, mas o domão `thalesmenegueco.github.io/estudos` não é memorável para quem quer voltar a estudar
- **Opção gratuita ideal**: `ml.thalesmenegueco.dev` (subdomínio via Cloudflare DNS → GitHub Pages ou Vercel)
- **Ou um domínio próprio**: algo como `visualml.dev` ou `seeml.dev` — curto, memorável, compartilhável
- **Deploy**: Vercel ou Netlify seriam melhores que GitHub Pages para a plataforma de ML, porque você tem edge caching global (importante para os 1.2MB de TF.js) e preview deployments em cada PR

---

## Resumo

| | Portfólio (mantém) | Plataforma ML (separa) |
|---|---|---|
| **Propósito** | Mostrar você | Ensinar ML |
| **Bundle** | Leve, rápido | Pesado, lazy-loaded |
| **Público** | 30 seg de atenção | 2 horas de sessão |
| **Domínio** | `thalesmenegueco.github.io` | Próprio |
| **Analytics** | Bounce rate, contato | Completion rate, engagement |
| **Futuro** | Estável | Pode crescer (comunidade, mais cursos) |

A arquitetura técnica que discutimos antes (Angular 20, signals, widgets, KaTeX, lazy loading) **não muda** — ela apenas vira o app `ml-platform` ao invés de uma rota dentro do app `portfolio`. O `StudySubject` model, o `PlotCanvasComponent`, o progress service — tudo isso vai para `libs/` e é compartilhado. O trabalho extra é mínimal (configurar o workspace multi-app), mas o ganho em clareza de produto é grande.
