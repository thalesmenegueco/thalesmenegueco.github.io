# Project Manager — Import/Export de dados (JSON)

## Objetivo

Adicionar ao `ProjectManager` (standalone Angular) dois botões sutis na sidebar:
"Exportar notas" (baixa um `.json`) e "Importar notas" (seleciona um `.json` e
substitui os dados, atualizando a UI e o `localStorage`).

## Decisões acordadas

- **Formato:** JSON apenas. O arquivo contém exatamente a estrutura `StoredData`
  (`{ projects, standaloneTasks }`), garantindo round-trip sem perda.
- **Import:** substitui os dados atuais (com `confirm()`), consistente com o
  `confirm()` já usado em `deleteProject`.
- **Posicionamento/ícones:** seção de rodapé na sidebar com dois botões
  secundários sutis, usando SVG inline (seta de download/upload). Sem nova
  dependência de biblioteca de ícones.

## Arquivos afetados

- `src/app/projects/componentized-projects/project-manager/project-manager.ts`
- `src/app/projects/componentized-projects/project-manager/project-manager.html`
- `src/app/projects/componentized-projects/project-manager/project-manager.scss`
- `src/app/projects/componentized-projects/project-manager/project-manager.spec.ts`

## Tarefas

### 1. `project-manager.ts` — lógica de export/import

Adicionar métodos na classe `ProjectManager` (sem novos imports de módulos;
`FormsModule`/`NgTemplateOutlet` já importados).

- **`exportFilename(): string`** — retorna
  `project-manager-${new Date().toISOString().slice(0, 10)}.json`.
- **`exportData(): string`** — retorna `JSON.stringify({ projects, standaloneTasks }, null, 2)`
  (pretty-print para legibilidade humana).
- **`downloadExport(): void`** — cria `Blob` com `type: 'application/json'`,
  `URL.createObjectURL`, cria `<a download="<exportFilename()>">`, clica e
  revoga a URL (`URL.revokeObjectURL`). Extrair para método próprio para ser
  testável.
- **`importData(json: string): boolean`** — parseia e valida/sanitiza:
  - `JSON.parse` em `try/catch` → em erro, `alert('Arquivo inválido. Selecione um .json exportado por esta ferramenta.')` e retorna `false`.
  - Sanitizar via `normalizeData(raw)` (ver abaixo).
  - Atribui `this.projects`/`this.standaloneTasks`, reseta `selectedProjectId = null`,
    chama `saveToStorage()`, retorna `true`.
- **`onImportFileSelected(event: Event): void`** — lê `event.target.files?.[0]`
  via `file.text()` (async), chama `importData(text)`, depois reseta
  `input.value = ''` (padrão já usado em `ocr/.../image-input.component.ts`).
  Em caso de `confirm()` recusado ou falha, não altera nada.
- **`normalizeData(raw: unknown): StoredData`** (privado ou local) — retorna
  objeto seguro com defaults:
  - `projects`: filtra para objetos; para cada um, coerce `id`/`name`/`description`
    para string, `status` para um de `Pendente|Em andamento|Concluído`
    (default `Pendente` se inválido), `deadline` para string ou `null`,
    `tasks` para array (aplicando a mesma normalização recursiva de tasks).
  - `standaloneTasks`: idem para `Task[]`.
  - `Task`: `id`/`text` string, `done` boolean, `subtasks` array normalizado.

> O round-trip export→import deve preservar os dados; a normalização serve apenas
> para tolerar arquivos levemente fora do formato e evitar estados inválidos
> (status inexistente, campos ausentes).

### 2. `project-manager.html` — botões na sidebar

- Adicionar uma nova `<div class="pm-sidebar-section pm-sidebar-footer">` no fim
  do `<aside class="pm-sidebar">` (após a seção "Novo Projeto").
- **Exportar:** `<button class="pm-btn pm-btn-secondary pm-btn-full pm-io-btn" (click)="downloadExport()">`
  com SVG inline (seta download) + texto "Exportar notas".
- **Importar:** `<label class="pm-btn pm-btn-secondary pm-btn-full pm-io-btn">`
  contendo SVG inline (seta upload) + texto "Importar notas", e um
  `<input type="file" accept=".json,application/json" (change)="onImportFileSelected($event)" hidden />`
  dentro do `<label>` (padrão de `image-input.component.html`, que usa
  `label[for]` envolvendo o input).
- Manter ordem: Exportar acima, Importar abaixo.

### 3. `project-manager.scss` — estilos

- `.pm-sidebar-footer { margin-top: auto; border-top: 1px solid var(--pm-border); border-bottom: none; display: flex; flex-direction: column; gap: 8px; }`
  (empurra para o rodapé da sidebar; `margin-top: auto` requer que a sidebar já
  seja `display: flex; flex-direction: column`, o que já é o caso).
- `.pm-io-btn` — estilo de botão secundário sutil: `justify-content: center`,
  `display: flex`, `gap: 8px`, `align-items: center`, cor `var(--pm-text-muted)`
  com hover para `var(--pm-text)`; tamanho de fonte ~0.85rem.
- `.pm-io-btn svg` — `width: 16px; height: 16px;` (ou 1rem).
- `<label>` precisa de `cursor: pointer` e mesmo box do `.pm-btn` (já tem via
  classes reutilizadas; garantir `text-align: center`).

### 4. `project-manager.spec.ts` — testes

Seguir o padrão dos specs existentes (`simple-math.spec.ts` / `test-llms.spec.ts`
com `TestBed` + `jasmine.createSpy`). Cobrir:

- `exportData()` produz JSON com `projects` e `standaloneTasks`.
- `exportFilename()` contém data ISO (`/^\d{4}-\d{2}-\d{2}/`).
- `importData()` com JSON válido atribui `projects`/`standaloneTasks`, reseta
  `selectedProjectId` para `null` e chama `saveToStorage` (spy no `localStorage.setItem`).
- `importData()` com JSON inválido → retorna `false`, mantém dados anteriores,
  não chama `saveToStorage`.
- `normalizeData()` com dados parciais/status inválido → preenche defaults e
  coerce status.
- `downloadExport()` — spy em `URL.createObjectURL`/`revokeObjectURL` e
  `HTMLAnchorElement.prototype.click`; verifica que `click` foi chamado e a URL
  revogada. (Se complicado no Karma, reduzir a verificação de DOM e manter a
  cobertura em `exportData`/`importData`.)

## Validação

- `npm test` (Karma/`ng test`) — todos os specs verdes, incluindo o novo.
- `npm run build` (ou `ng build`) para garantir que não há erros de compilação/estilo.
- Verificação manual:
  - Criar projetos/tarefas → "Exportar notas" → baixa `.json` com conteúdo esperado.
  - Limpar/alterar dados → "Importar notas" seleciona o arquivo → confirma → UI
    e `localStorage` refletem o import; `selectedProjectId` volta para "Tarefas Gerais".
  - Importar arquivo inválido (.json corrompido) → `alert` e dados intactos.
  - Reimportar o mesmo arquivo duas vezes seguidas funciona (input resetado).

## Riscos / observações

- `File.text()` é suportado nos navegadores modernos; alternativa `FileReader`
  caso se deseje compatibilidade mais ampla (não necessário para este site).
- O label do botão de import usa `<label>` estilizado como botão; garantir
  acessibilidade mínima (`cursor`, foco) já coberta pelas classes existentes.
- Nenhum novo módulo/serviço é necessário; toda a lógica fica no componente,
  mantendo o padrão atual de simplicidade.

## Fora de escopo

- Exportação em `.txt` legível para humanos (decisão: JSON apenas).
- Merge de dados no import (decisão: substituir com confirmação).
- Migração de versões futuras do schema.
