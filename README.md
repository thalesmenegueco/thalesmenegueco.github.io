# Personal Page

A website where I share my current and future learning projects.
Website available [here](https://thalesmenegueco.github.io).

## Info 🛈

**Clickable link:** https://thalesmenegueco.github.io/home

Figma project: https://www.figma.com/design/znqxvoSCfB5o9nw7ZsatNU/Personal-Website?node-id=0-1&t=MEL5qexmwXE77shC-1

## Interface 🎨

O site é um **portfólio de uma página só**: a raiz (`/`) é um scroll com seis
seções — hero, sobre, projetos, ferramentas, trajetória e contato — e a barra
fixa tem âncoras para cada uma. Como as âncoras são `/#secao`, elas também
funcionam a partir das outras rotas: `/tools/*` (as ferramentas) e `/estudos`
continuam páginas próprias, e `/project-gallery` virou redirect para a raiz.

- **Paleta "Aurora Arcana"**: preto arroxeado (`--ink-*`), rosa como cor
  principal (`--rose`), violeta e azul como detalhes. Todo par de texto/fundo
  passa em WCAG AA, e os tokens antigos (`--color-*`) seguem existindo como
  aliases para as páginas das ferramentas não precisarem mudar.
- **Tipografia**: Sora (títulos) + Inter (texto), carregadas em `index.html`.
- **Movimento**: reveal por `IntersectionObserver`, aurora em CSS puro, tudo
  desligado sob `prefers-reduced-motion`.
- O conteúdo (projetos, ferramentas, marcos, redes) vive em
  `projects/portfolio/src/app/data/portfolio-content.ts`.
- **Ícone da aba**: `favicon.ico` (16/32/48/64 px), `favicon.svg` e
  `apple-touch-icon.png` são gerados por `npm run build:favicon` a partir de um
  único desenho em `tools/build-favicon.mjs` — o mesmo quadrado arredondado com
  o gradiente rosa→violeta do logo da barra. Edite o script, não os PNGs.

### Verificando a UI sem olhar para ela

`tools/audit/` controla um Chrome de verdade pelo DevTools Protocol e mede o que
dá para medir: overflow horizontal, fontes carregadas, se cada âncora para 80px
abaixo da barra, CLS, se todos os reveals disparam, e o menu mobile. Com o app
servido em `:4200`:

```bash
npx ng serve portfolio --configuration production --port 4200
npm run audit:layout
npm run audit:images -- shots/desktop-full.png
```

## Good Practices and Patterns - Reminders for myself 👨🏻

### 🗃️ Convenções de Nomenclatura
- Classes: PascalCase (Ex: ContaBancaria)
- Métodos e variáveis: camelCase (Ex: calcularIdade)
- Constantes: UPPER_CASE (Ex: TAXA_JUROS)
- Pacotes: lowercase (Ex: com.empresa.projeto)

### ✅ Princípios SOLID
- Single Responsibility: Uma classe deve ter apenas uma razão para mudar
- Open/Closed: Aberto para extensão, fechado para modificação
- Liskov Substitution: Objetos de uma classe derivada devem poder substituir objetos da classe base
- Interface Segregation: Muitas interfaces específicas são melhores que uma interface geral
- Dependency Inversion: Dependa de abstrações, não de implementações

## From Angular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.0.

### Development server

To start a local development server, run:

```bash
ng serve
```
or
```bash
npx ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

### Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

### Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
