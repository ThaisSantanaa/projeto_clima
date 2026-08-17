# 🌤️ Projeto Clima

Aplicação desenvolvida durante meus estudos de tecnologia com o objetivo de praticar **JavaScript, consumo de APIs, testes automatizados e desenvolvimento web**.

O projeto apresenta informações relacionadas ao clima — temperatura atual, sensação térmica, umidade, vento e previsão para os próximos 5 dias — e foi criado como parte da minha jornada de aprendizado em programação.

---

## 🚀 Sobre o projeto

O **Projeto Clima** é uma aplicação web que consulta a [API Open-Meteo](https://open-meteo.com/) para buscar informações meteorológicas de qualquer cidade do mundo e apresenta os dados de forma simples e visual para o usuário.

A aplicação funciona em duas etapas:

1. **Geocodificação** — o nome da cidade digitado é convertido em coordenadas (latitude/longitude) através da API de geocodificação da Open-Meteo.
2. **Consulta do clima** — com as coordenadas, a aplicação busca o clima atual e a previsão dos próximos 5 dias.

Além do desenvolvimento da aplicação, o projeto também utiliza **testes automatizados com Jest**, permitindo validar o funcionamento das funcionalidades desenvolvidas.

Este projeto está em constante evolução conforme avanço nos meus estudos.

---

## ✨ Funcionalidades

- 🔍 Busca de clima por nome de cidade
- 🌡️ Exibição da temperatura atual (com indicador visual em formato de gauge)
- 🤒 Sensação térmica, umidade, velocidade e direção do vento
- 📅 Previsão do tempo para os **próximos 5 dias**, com temperaturas **máxima e mínima** diárias
- 🌗 Tema visual dinâmico (dia/noite) de acordo com o horário local da cidade consultada
- ⚠️ Tratamento de erros (cidade não encontrada, falha de rede, API indisponível)
- ✅ Testes automatizados cobrindo as principais funções da aplicação

---

## 🎯 Objetivos

- Praticar JavaScript
- Trabalhar com consumo de APIs
- Manipular dados recebidos de APIs
- Desenvolver uma interface web
- Praticar testes automatizados
- Aprender a utilizar Jest
- Trabalhar com Git e GitHub
- Desenvolver boas práticas de organização de código

---

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (ES2017+)
- [Open-Meteo API](https://open-meteo.com/) (previsão do tempo e geocodificação)
- Node.js
- Jest + jsdom (testes automatizados)
- Git
- GitHub

---

## 📂 Estrutura do projeto

```text
projeto_clima/
│
├── tests/
│   └── projeto_clima.test.js
│
├── index.html
├── style.css
├── api.js
├── package.json
└── README.md
```

| Arquivo | Descrição |
|---|---|
| `index.html` | Estrutura da página (formulário de busca, seção de resultado e previsão) |
| `style.css` | Estilos visuais da aplicação |
| `api.js` | Lógica de consumo da API Open-Meteo e manipulação do DOM |
| `tests/projeto_clima.test.js` | Suíte de testes automatizados (Jest) |
| `package.json` | Dependências e scripts do projeto |

---

## ✅ Pré-requisitos

Para rodar o projeto localmente você precisa ter instalado:

- Um navegador web atualizado (Chrome, Firefox, Edge etc.)
- [Node.js](https://nodejs.org/) (versão 18 ou superior) e npm — necessários apenas para rodar os **testes automatizados**

> A aplicação em si (HTML/CSS/JS) não depende de Node.js para funcionar no navegador — ele é usado apenas para instalar e rodar o Jest.

---

## 📦 Instalação

Clone o repositório e acesse a pasta do projeto:

```bash
git clone https://github.com/seu-usuario/projeto_clima.git
cd projeto_clima
```

Instale as dependências (necessárias para rodar os testes):

```bash
npm install
```

---

## ▶️ Como executar a aplicação

Como o projeto é 100% front-end (HTML, CSS e JavaScript puro, sem build step), basta abrir o arquivo `index.html` diretamente no navegador:

```bash
# Linux
xdg-open index.html

# macOS
open index.html

# Windows
start index.html
```

**Alternativa recomendada:** usar um servidor local simples, para evitar eventuais restrições de CORS do navegador ao abrir arquivos via `file://`.

Com a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no VS Code, ou via linha de comando com Python:

```bash
# Python 3
python3 -m http.server 8080
```

Depois acesse [http://localhost:8080](http://localhost:8080) no navegador.

---

## 🧪 Como executar os testes

Os testes automatizados usam **Jest** com ambiente **jsdom**, simulando o DOM da página real (`index.html`) para validar as funções de consumo da API e renderização dos dados.

```bash
npm test
```

Saída esperada (resumo):

```text
PASS tests/projeto_clima.test.js
  degreesToCompass
    ✓ converte graus em pontos cardeais
  geocodeCity
    ✓ retorna o primeiro resultado em caso de sucesso
    ✓ lança erro quando a cidade não é encontrada
  fetchCurrentWeather
    ✓ retorna os dados do clima atual em caso de sucesso
  fetchForecast
    ✓ solicita a previsão para 5 dias
    ✓ retorna os dados diários em caso de sucesso
  renderForecast
    ✓ renderiza um item por dia na lista de previsão
    ✓ exibe corretamente a temperatura máxima e mínima de cada dia

Test Suites: 1 passed, 1 total
Tests:       XX passed, XX total
```

> Os testes fazem *mock* da função `fetch`, então **nenhuma chamada real** é feita à API durante a execução — os testes rodam de forma isolada e determinística.

---

## 💡 Exemplo de uso

1. Abra a aplicação no navegador.
2. Digite o nome de uma cidade no campo de busca (ex.: `São Paulo`, `Lisboa`, `Tóquio`).
3. Clique em **Buscar**.
4. A aplicação exibirá:
   - Temperatura atual e sensação térmica
   - Umidade, vento e coordenadas da cidade
   - Previsão de temperatura máxima e mínima para os próximos 5 dias

```text
> Buscar: "Lisboa"

Lisboa · Portugal
22°C — Parcialmente nublado
Sensação térmica: 21°C

Previsão · Próximos 5 dias
Hoje  Seg   Ter   Qua   Qui
23°   24°   22°   21°   23°
16°   17°   15°   14°   16°
```

---

## 🌐 Sobre a API utilizada

Este projeto consome a [Open-Meteo API](https://open-meteo.com/), uma API pública, gratuita e **sem necessidade de chave de acesso (API key)** para uso não comercial, o que a torna ideal para fins educacionais.

- Documentação oficial: [https://open-meteo.com/en/docs](https://open-meteo.com/en/docs)
- Geocodificação: [https://open-meteo.com/en/docs/geocoding-api](https://open-meteo.com/en/docs/geocoding-api)

---

## 🔒 Boas práticas de segurança

- Nenhuma chave de API é utilizada ou exposta no código, já que a Open-Meteo não exige autenticação para o uso implementado.
- Todas as chamadas à API são feitas via **HTTPS**.
- Entradas do usuário (nome da cidade) são tratadas como texto simples e enviadas como parâmetro de URL codificado pelo próprio navegador (`URLSearchParams`), sem manipulação direta de HTML a partir da entrada do usuário.
- Erros de rede, respostas inválidas e cidades não encontradas são tratados explicitamente, evitando falhas silenciosas.

---

## 🗺️ Roadmap / próximos passos

- [ ] Geolocalização automática (buscar clima pela localização do usuário)
- [ ] Histórico das últimas cidades pesquisadas
- [ ] Gráfico de temperatura ao longo do dia
- [ ] Modo offline com cache dos últimos dados consultados
- [ ] Internacionalização (i18n) da interface

---

## 🤝 Contribuindo

Este é um projeto pessoal de estudos, mas sugestões e feedback são bem-vindos!

1. Faça um fork do repositório
2. Crie uma branch para sua alteração (`git checkout -b minha-alteracao`)
3. Faça commit das mudanças (`git commit -m 'Descrição da alteração'`)
4. Envie para o seu fork (`git push origin minha-alteracao`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT** — sinta-se livre para usar, estudar e adaptar o código para fins de aprendizado.

```text
MIT License

Copyright (c) 2026 Seu Nome

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

> Lembre-se de substituir "Seu Nome" pelo seu nome (ou o do titular dos direitos) e adicionar um arquivo `LICENSE` na raiz do repositório com este mesmo texto.

---

## 🙋 Autor

Projeto desenvolvido por **[Thais Santana]** como parte dos estudos em desenvolvimento web e JavaScript.

- GitHub: [@seu-usuario](https://github.com/ThaisSantanaa)

---

## 🙏 Créditos

- Dados climáticos fornecidos por [Open-Meteo](https://open-meteo.com/)
- Ícones de clima por [Weather Icons](https://erikflowers.github.io/weather-icons/)
- Fontes por [Google Fonts](https://fonts.google.com/) (Fraunces, Space Grotesk, Space Mono)