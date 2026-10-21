# Barras de Auditoria — Looker Studio

Visualização comunitária com barras horizontais empilhadas: **Conforme** em verde e **Não conformidade** em laranja. O rótulo da barra usa o resumo principal; ao passar o mouse, o tooltip nativo mostra a pergunta original e os valores.

## Campos a configurar
1. **Resumo principal (eixo):** `ResumoPrincipalExibicao`
2. **Pergunta original (tooltip):** `PerguntaBase`
3. **Conforme:** métrica `Conforme`
4. **Não conformidade:** métrica `Não conformidade`

A pergunta deve corresponder ao resumo de cada linha e as métricas precisam ser numéricas.

## Publicação
O manifesto está em `manifest.json` e aponta para arquivos em `dev/`. Ative o GitHub Pages nas configurações do repositório, usando a branch `main` e a pasta `/ (root)`.

Manifesto para adicionar no Looker Studio:
`https://rafaelpinto85.github.io/looker-barras-auditoria/manifest.json`

## Observações
- O tooltip usa o elemento SVG `title`; a aparência depende do navegador.
- A visualização precisa ser autorizada na fonte de dados do Looker Studio.
