# Moodify

Moodify é um aplicativo web que recomenda músicas com base no seu sentimento atual, utilizando inteligência artificial (Google Gemini) para gerar sugestões personalizadas. As recomendações incluem links diretos para ouvir no Spotify e YouTube Music.

## Funcionalidades

- Recomendações de músicas baseadas em sentimentos informados pelo usuário.
- Sugestões exibidas em cartões com título, artista, gênero e botões para ouvir no Spotify ou YouTube Music.
- Interface responsiva e moderna, construída com Next.js, React e Tailwind CSS.
- Integração com a API Gemini da Google para geração de recomendações.

## Como usar

1. Instale as dependências:

   ```sh
   npm install
   ```

2. Crie um arquivo `.env.local` na raiz do projeto e adicione sua chave de API Gemini:

   ```
   _GNEXT_PUBLICEMINI_TOKEN=SEU_TOKEN_AQUI
   ```

3. Inicie o servidor de desenvolvimento:

   ```sh
   npm run dev
   ```

4. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do Projeto

```
src/
  app/
    layout.jsx
    page.jsx
    globals.css
  components/
    card.jsx
  lib/
    gemini.js
public/
  (imagens e ícones)
```

- As recomendações são geradas em [`src/app/page.jsx`](src/app/page.jsx).
- O componente de cartão de música está em [`src/components/card.jsx`](src/components/card.jsx).
- A integração com a API Gemini está em [`src/lib/gemini.js`](src/lib/gemini.js).

## Tecnologias

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Gemini API](https://ai.google.dev/)

## Licença

Este projeto é apenas para fins educacionais.
