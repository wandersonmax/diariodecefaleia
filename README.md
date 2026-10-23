# Diário de Enxaqueca

Aplicativo web para registrar crises de enxaqueca pelo celular. Funciona offline, pode ser instalado na tela inicial e guarda os dados só no próprio aparelho.

O visual é escuro por padrão, pensado para quem está sensível à luz durante uma crise. O botão **Acender luz** troca para um tema claro.

## O que dá para registrar

- **Intensidade da dor** de 0 a 10, com cor e descrição (leve, moderada, forte…)
- **Quando:** data, horário de início e de fim, e se teve aura
- **Como foi:** onde doeu e sintomas (náusea, sensibilidade à luz, ao som, a cheiros, tontura)
- **Remédio:** nome, dose, horário e quanto aliviou
- **Fatores do dia:** horas de sono, copos de água e possíveis gatilhos
- **Observações** livres

As crises salvas aparecem numa lista, da mais recente para a mais antiga, e podem ser baixadas como planilha (CSV, separada por `;`), que abre no Excel ou no Google Planilhas. Dá para levar a planilha na consulta médica.

## Instalar no celular

O app precisa estar publicado num endereço `https://` (veja [Publicar](#publicar)). Depois, abra o endereço no celular:

- **iPhone (Safari):** botão Compartilhar → **Adicionar à Tela de Início**
- **Android (Chrome):** menu ⋮ → **Instalar app** ou **Adicionar à tela inicial**

Depois da primeira abertura com internet, o app passa a abrir sem conexão.

## Onde ficam os dados

Os registros ficam salvos no navegador do aparelho (`localStorage`). Não existe servidor nem conta, e nada é enviado pela internet.

Por isso:

- Os dados de um celular não aparecem em outro aparelho.
- Limpar os dados do navegador ou desinstalar o app apaga os registros. **Baixe a planilha de vez em quando como backup.**

## Publicar

O projeto é só HTML, CSS e JavaScript, sem etapa de build. Para publicar no GitHub Pages:

1. No GitHub, abra **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Depois de alguns minutos, o app fica em `https://<usuário>.github.io/diariodecefaleia/`.

## Rodar localmente

O service worker e o manifest não funcionam abrindo o arquivo direto (`file://`). Use um servidor local:

```sh
python3 -m http.server 8000
```

E abra `http://localhost:8000`.

## Estrutura

| Arquivo | Para que serve |
| --- | --- |
| `index.html` | O app inteiro: página, estilos e script |
| `sw.js` | Service worker que guarda os arquivos para uso offline |
| `manifest.webmanifest` | Nome, ícone e cores do app instalado |
| `icons/` | Ícones do app; `icon.svg` é o original, os PNG são gerados a partir dele |
| `fonts/` | Fonte [Recursive](https://www.recursive.design/) (licença OFL), guardada no projeto para funcionar offline |

## Ao alterar o app

O celular usa a cópia guardada pelo service worker e busca a versão nova em segundo plano, então uma mudança aparece na **segunda** abertura depois de publicada.

Se adicionar um arquivo novo que o app use (imagem, CSS, fonte), inclua o caminho na lista `ARQUIVOS` em `sw.js` e aumente a versão em `CACHE` (por exemplo, de `enxaqueca-v2` para `enxaqueca-v3`). Assim o celular descarta a cópia antiga e baixa tudo de novo.
