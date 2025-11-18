# Espaço Aline Mendes — Front-end

Site institucional premium (black + gold) em HTML, CSS e JavaScript.

## Estrutura

- `index.html`: Home com hero, destaques e preview do espaço
- `services.html`: Serviços por categoria com fotos, descrições e preços
- `professionals.html`: Cards dos profissionais com foto, nome e bio
- `about.html`: História, missão, visão, valores e diferenciais
- `products.html`: Grid de produtos com preço e CTAs
- `assets/css/styles.css`: Estilos globais, tema, responsivo e animações
- `assets/js/main.js`: Menu mobile, header sticky, reveal e carrossel

## Pré-visualização

Abra qualquer arquivo `.html` no navegador (clique duas vezes) ou use a extensão Live Server no VS Code.

## Personalização rápida

- Telefone/WhatsApp/Instagram: atualize os links no rodapé e botões `Agendar`.
- Endereço: altere o texto no rodapé.
- Fotos: substitua as URLs do Unsplash por suas imagens em `assets/img` (crie a pasta e ajuste os `src`/`background-image`).
- Preços: edite as tabelas em `services.html`.

## Notas de UI/UX

- Tipografia elegante: títulos com Playfair Display e textos com Poppins.
- Paleta luxuosa: fundo preto com detalhes em dourado metálico.
- Animações sutis: revelação ao rolar e carrossel hero com auto-play.
- Layout responsivo: grade fluida e navegação móvel com hambúrguer.

## Agendamentos no Google Calendar

Para registrar agendamentos na agenda do salão, há uma API mínima em Node.

1) Crie um projeto no Google Cloud e ative a Google Calendar API.
2) Crie uma Service Account e gere uma chave (JSON). Copie `client_email` e `private_key`.
3) Compartilhe a agenda do salão (Calendar) com a Service Account (permissão: "Fazer alterações em eventos").
4) Crie um `.env` com base no `.env.example` e preencha:
	- `GOOGLE_CLIENT_EMAIL` — e-mail da service account
	- `GOOGLE_PRIVATE_KEY` — chave privada (mantenha as quebras de linha como `\n`)
	- `GOOGLE_CALENDAR_ID` — ID da agenda (ex: `seuemail@dominio.com` ou ID da agenda compartilhada)
	- `PORT` — porta da API (3000 padrão)

Executando localmente:
```powershell
npm install
npm run dev:api
npm run dev:web
# API: http://localhost:3000  |  Site: http://localhost:5500
```

A página `agendar.html` envia POST para `/api/appointments`. Em produção, hospede o site e a API (ou use reverse proxy) e ajuste a URL no `assets/js/booking.js`.

Fallback: caso a API não esteja disponível, o site oferece link para adicionar o evento no Google Calendar do usuário.

---

Somente front-end. Não há back-end ou integração de pagamentos.