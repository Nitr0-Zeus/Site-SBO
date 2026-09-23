# Site da SBO

Site institucional da **SBO Comércio de Peças e Equipamentos**, de Pinhais (PR). A empresa aluga máquinas, vende peças originais e multimarcas e faz assistência técnica para construção civil, indústria e infraestrutura na Região Metropolitana de Curitiba.

Site no ar: <https://sboaapa.com.br/>

## Estrutura

```
index.html          home
404.html            página de erro
pages/              produtos, serviços, locação, venda, contato e empresa
assets/css/         style.css (folha única do site todo)
assets/js/          main.js (comportamentos compartilhados)
assets/images/      logo, favicon e imagem de compartilhamento
fotospagina/        fotos da home
produtos/           imagens do catálogo
locacao/            imagens da frota de locação
serviços/           imagens da página de serviços
marcas/             logos das marcas parceiras
vendas/             imagem da página de venda
sitemap.xml         mapa do site para o Google
robots.txt          regras para robôs de busca
llms.txt            resumo do site para buscadores com IA
```

HTML, CSS e JavaScript puro. Sem framework, sem etapa de build, sem dependência para instalar. Dá para abrir o `index.html` direto no navegador, ou subir a pasta inteira em qualquer hospedagem estática.

## Páginas

| Arquivo | O que tem |
|---|---|
| `index.html` | Abertura, acesso rápido para produtos/serviços/locação/venda, história da empresa, missão e visão, marcas parceiras |
| `pages/produtos.html` | Categorias: compactação, concretagem, demolição, trabalho em altura, suprimentos, peças novas e usadas |
| `pages/servicos.html` | Locação, venda, peças, acessórios e manutenção |
| `pages/locacao.html` | Frota disponível para aluguel |
| `pages/venda.html` | Equipamentos novos e seminovos |
| `pages/contato.html` | WhatsApp, telefone, e-mail e endereço |
| `pages/empresa.html` | Conteúdo institucional extra (fora do sitemap de propósito) |

O caminho principal de conversão é o WhatsApp: os botões de orçamento já abrem a conversa com a mensagem preenchida (`wa.me` com texto pronto).

## Como foi feito

Começamos pelo conteúdo: o que a SBO faz, para quem, e o que precisa aparecer na home. A partir daí montamos o esqueleto das páginas e só depois o visual.

No código:

- **HTML semântico** com classes no padrão BEM (`header__nav-link`, `hero__title`, `footer__col`), do jeito que dá para achar qualquer elemento procurando no CSS.
- **CSS único** (`assets/css/style.css`), organizado por seção com comentários. Paleta em azul da marca (`#004080`), tipografia Barlow e Barlow Condensed carregada do Google Fonts.
- **JavaScript sem biblioteca** (`assets/js/main.js`), tudo dentro de uma IIFE. Faz cinco coisas: o header fica transparente sobre o hero e fica branco quando você rola; abre e fecha o menu mobile; marca no menu a página atual; rolagem suave nas âncoras; e revela os blocos na rolagem com `IntersectionObserver` (com fallback para navegadores mais novos que já suportam CSS scroll-driven animations, e sem animação para quem prefere reduzir movimento).
- **Responsivo** desde o começo. Em telas pequenas a navegação vira gaveta lateral com botão hambúrguer, fechável com ESC ou clicando fora.

No SEO e na indexação:

- Title, description, canonical, Open Graph e Twitter Card em cada página.
- `sitemap.xml` com as páginas públicas e `robots.txt` bloqueando a 404 e a `empresa.html`.
- `llms.txt` na raiz, com um resumo do site e do contato, no formato que buscadores com IA estão passando a ler.

## Rodando local

Só abrir o `index.html` no navegador. Se preferir um servidorzinho local:

```bash
python -m http.server 8000
# ou
npx serve .
```

Depois é acessar `http://localhost:8000`.

## Atualizando conteúdo

- Trocar fotos: substituir o arquivo na mesma pasta, com o mesmo nome, que o HTML continua apontando certo.
- Mudar telefone, WhatsApp ou endereço: procurar por `3667-1277`, `wa.me/554136671277` ou `contato@sboequipamentos.com.br` nos HTMLs. O número aparece no header, no rodapé e em todos os CTAs.
- Adicionar página nova: copiar a estrutura de uma existente (header e rodapé são os mesmos em todas), incluir no menu, no rodapé e no `sitemap.xml`.

## Deploy

É site estático: a pasta inteira vai para a hospedagem (ou para GitHub Pages apontando para a raiz do repositório). Não tem etapa de build para lembrar.
