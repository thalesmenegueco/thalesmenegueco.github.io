Quero substituir o atual método de tradução na página de OCR no meu app Angular, integrando à ferramenta de OCR existente neste projeto.

REQUISITOS DE NEGÓCIO:
- Traduzir texto extraído pelo OCR entre PT, FR, IT, DE e EN
- Privacidade total: nenhum dado sai do browser do usuário
- Usar a Chrome Translator API (client-side, sem servidor)
- Fallback elegante para browsers sem suporte (mensagem informativa)
- Detecção automática de idioma via LanguageDetector API quando disponível

REFERÊNCIA ARQUITETURAL (adapte ao que já existe no projeto):
- Um serviço TranslatorService que encapsula a Chrome Translator API
- Um componente TranslatorComponent que recebe o texto do OCR via @Input()
- Cache do translator instance por par de idiomas (recriar apenas quando muda)
- Feature detection: 'Translator' in self
- ngOnDestroy para limpar o translator

ANALISE:
1. Como o componente OCR atual funciona e expõe o texto extraído
2. Que padrões de design/CSS já estão em uso no projeto
3. Onde o novo componente deve ser colocado na estrutura de pastas
4. Se há signals, OnPush, standalone components em uso já
5. Que ajustes são necessários no template do componente OCR para 
   abrigar o tradutor

PROPONHA um plano detalhado e integrado ao design atual antes de codar.