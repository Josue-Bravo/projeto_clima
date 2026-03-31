# 🌤️ Previsão do Tempo

Aplicação web para consulta meteorológica em tempo real, desenvolvida com foco em simplicidade, performance e experiência do usuário, utilizando exclusivamente tecnologias nativas do navegador — sem frameworks ou dependências de produção.

---

## 📖 Descrição

Este projeto permite ao usuário buscar uma cidade e visualizar:

- Clima atual com ícone, temperatura, vento e umidade
- Condição climática com descrição textual
- Previsão dos próximos 6 dias

A aplicação consome APIs públicas do Open-Meteo e implementa boas práticas de desenvolvimento frontend, incluindo validação de dados, tratamento de erros, testes unitários e documentação automatizada.

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Como Executar](#-como-executar)
- [APIs Utilizadas](#-apis-utilizadas)
- [Testes](#-testes)
- [Documentação](#-documentação)
- [Boas Práticas](#-boas-práticas-aplicadas)
- [Segurança e Privacidade](#-segurança-e-privacidade)
- [Licença e Atribuições](#-licença-e-atribuições)
- [Autor](#-autor)

---

## ✅ Funcionalidades

- 🔍 Busca de cidade com validação de entrada
- 📍 Conversão automática de nome para coordenadas geográficas
- 🌡️ Exibição de temperatura atual, vento e umidade
- 📅 Previsão dos próximos 6 dias com ícone e descrição
- 🎨 Temas visuais dinâmicos baseados no clima e na temperatura
- ⏳ Indicador de carregamento (spinner)
- ⚠️ Tratamento de erros com feedback ao usuário
- 📱 Layout responsivo compatível com desktop e mobile
- ⌨️ Suporte à busca via teclado (tecla Enter)
- ♿ Acessibilidade com `aria-label`, `role="alert"` e `.visually-hidden`

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura semântica da página |
| CSS3 | Estilização, variáveis, temas e animações |
| JavaScript ES6+ | Lógica, requisições e manipulação do DOM |
| Jest 29.x | Testes unitários |
| JSDoc 4.x | Geração de documentação |

> Nenhuma dependência de produção — a aplicação roda com JavaScript puro no navegador.

---

## 📁 Estrutura do Projeto

```
previsao-tempo/
│
├── assets/
│   ├── css/
│   │   └── style.css           # Estilos, variáveis e temas
│   ├── icons/
│   │   ├── favicon.svg
│   │   └── weather/            # Ícones SVG dos tipos de clima
│   └── js/
│       ├── api.js              # Módulo de comunicação com as APIs
│       ├── script.js           # Módulo de interface e eventos do DOM
│       └── index.js            # Documentação global da aplicação
│
├── tests/
│   └── api.test.js             # Testes unitários do módulo api.js
│
├── tutorials/
│   └── instalacao.md           # Tutorial de instalação e uso (JSDoc)
│
├── docs/                       # Documentação gerada pelo JSDoc
│
├── index.html                  # Página principal da aplicação
├── jsdoc.config.json           # Configuração do JSDoc
├── package.json                # Dependências e scripts do projeto
├── NOTICE.md                   # Atribuições de terceiros
├── LICENSE.txt                 # Licença MIT
└── README.md                   # Este arquivo
```

---

## ⚙️ Pré-requisitos

- Navegador moderno com suporte à Fetch API (Chrome, Firefox, Edge ou Safari)
- [Node.js](https://nodejs.org/) v18 ou superior _(apenas para testes e documentação)_

---

## ▶️ Como Executar

Por utilizar ES Modules (`import/export`), a aplicação precisa ser servida por um servidor local.

### 1. Clone o repositório

```bash
git clone https://github.com/Josue-Bravo/previsao-tempo.git
cd previsao-tempo
```

### 2. Inicie um servidor local

**Opção A — Live Server (recomendado para desenvolvimento):**

Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no VS Code e clique em **Go Live**.

**Opção B — via terminal:**

```bash
npx serve .
```

### 3. Acesse no navegador

```
http://localhost:3000
```

---

## 🌐 APIs Utilizadas

A aplicação utiliza APIs públicas do [Open-Meteo](https://open-meteo.com) — sem necessidade de autenticação ou chave de API.

### Geocoding API

Converte o nome da cidade em coordenadas geográficas:

```
GET https://geocoding-api.open-meteo.com/v1/search?name={cidade}&count=1&language=pt
```

### Weather Forecast API

Retorna dados meteorológicos com base em coordenadas:

```
GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&hourly=relativehumidity_2m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7
```

**Parâmetros utilizados:**

| Parâmetro | Descrição |
|---|---|
| `current_weather` | Temperatura, vento e código do clima atual |
| `hourly=relativehumidity_2m` | Umidade relativa do ar por hora |
| `daily=weathercode,...` | Previsão diária de clima e temperaturas |
| `timezone=auto` | Fuso horário automático da cidade |
| `forecast_days=7` | Retorna 7 dias de previsão |

---

## 🧪 Testes

O projeto possui **20 testes unitários** utilizando Jest, organizados em 5 grupos.

### Instalando as dependências

```bash
npm install
```

### Executando os testes

```bash
npm test
```

### Grupos de testes

| Grupo | Descrição |
|---|---|
| 3.6 — Testes Básicos | Fluxo principal: cidade válida, inexistente, entrada vazia e falha de API |
| 3.7 — Casos Extremos | Status 429, falha de rede e JSON inesperado |
| 3.8 — fetchWeather | Resposta completa, campos ausentes e falhas de rede no clima |
| 3.9 — validateCity | Entradas válidas, números e todos os tipos falsy |
| 3.10 — getWeatherInfo e getTempTheme | Mapeamento de códigos, boundary values e fallbacks |

### Resultado esperado

```
Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
Time:        ~1s
```

---

## 📖 Documentação

A documentação técnica é gerada automaticamente pelo [JSDoc](https://jsdoc.app/).

### Gerando a documentação

```bash
npm run docs
```

Abra o arquivo gerado no navegador:

```
/docs/index.html
```

### Módulos documentados

| Módulo | Descrição |
|---|---|
| `api.js` | Validação, geocoding e busca meteorológica |
| `script.js` | Eventos, renderização e temas do DOM |
| `index.js` | Visão geral da aplicação |

---

## 🔐 Boas Práticas Aplicadas

- Validação de entrada do usuário antes de qualquer requisição
- Tratamento de erros de API com feedback ao usuário
- Separação de responsabilidades (`api.js` vs `script.js`)
- Código modular com ES Modules (`import/export`)
- Testes automatizados com mocks e boundary values
- Acessibilidade com `aria-label`, `role="alert"` e `.visually-hidden`
- Content Security Policy (CSP) implementada
- Uso de `encodeURIComponent` para sanitização de parâmetros de URL
- Sem exposição de chaves de API (API pública)

---

## 🔒 Segurança e Privacidade

### Visão Geral

A aplicação foi analisada com foco em segurança e privacidade para aplicações frontend que consomem APIs externas. Após as verificações realizadas, o sistema apresenta **baixo risco**, não manipulando dados sensíveis nem utilizando autenticação.

### Análise de Risco

| Área | Detalhe | Risco |
|---|---|---|
| Armazenamento de dados | Sem uso de `localStorage`, `sessionStorage` ou cookies | ✅ Baixo |
| Comunicação com APIs | HTTPS, API pública sem autenticação | ✅ Baixo |
| Entrada de dados | Validação implementada com `encodeURIComponent` | ✅ Baixo |
| Manipulação do DOM | Sem uso de `innerHTML` em pontos críticos | ✅ Baixo |
| Privacidade do usuário | Nenhum dado pessoal coletado ou armazenado | ✅ Baixo |

### Riscos Identificados

| Risco | Impacto | Mitigação |
|---|---|---|
| Dependência de API externa | Médio | Tratamento de erros implementado |
| Indisponibilidade da API | Médio | Feedback ao usuário em caso de falha |
| Exposição de consultas (cidade) | Baixo | Nenhum dado pessoal é armazenado |

### Recomendações para Produção

- Garantir execução apenas em **HTTPS**
- Monitorar disponibilidade da API Open-Meteo
- Manter dependências de desenvolvimento atualizadas

### Classificação Final

| Critério | Avaliação |
|---|---|
| Segurança | ✅ Boa |
| Privacidade | ✅ Boa |
| Risco geral | ✅ Baixo |

---

## 📄 Licença e Atribuições

Este projeto está licenciado sob a [MIT License](LICENSE.txt) — livre para uso, modificação e distribuição.

### Atribuição Obrigatória

Os dados meteorológicos são fornecidos por [Open-Meteo](https://open-meteo.com), licenciados sob [Creative Commons Attribution 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

Conforme exigido pela licença CC BY 4.0, os créditos são mantidos no rodapé da aplicação e detalhados no arquivo [NOTICE.md](NOTICE.md).

### Dependências de Desenvolvimento

| Pacote | Licença |
|---|---|
| [Jest](https://jestjs.io/) | MIT |
| [JSDoc](https://jsdoc.app/) | Apache 2.0 |

---

## 👤 Autor

**Josué Bravo**

- GitHub: [@Josue-Bravo](https://github.com/Josue-Bravo)
- LinkedIn: [linkedin.com/in/josue-bravo](https://www.linkedin.com/in/josue-bravo)

---

*Projeto desenvolvido como parte de estudos em desenvolvimento web, com foco em boas práticas de código, organização e consumo de APIs.*
