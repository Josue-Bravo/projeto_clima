# 🌤️ Previsão do Tempo

Aplicação web para consulta meteorológica em tempo real, desenvolvida com foco em simplicidade, performance e experiência do usuário, utilizando exclusivamente tecnologias nativas do navegador (sem frameworks).

---

## 📖 Descrição

Este projeto permite ao usuário buscar uma cidade e visualizar:

* Clima atual (temperatura, vento e umidade)
* Condição climática com ícone e descrição
* Previsão dos próximos 6 dias (excluindo o dia atual)

A aplicação consome APIs públicas do Open-Meteo e implementa boas práticas de desenvolvimento frontend, incluindo validação de dados, tratamento de erros, testes unitários e documentação automatizada.

---

## 🚀 Funcionalidades

* 🔍 Busca de cidade com validação de entrada
* 📍 Conversão automática de nome para coordenadas geográficas
* 🌡️ Exibição de temperatura, vento e umidade (baseada nos dados horários da API)
* 📅 Previsão dos próximos 6 dias
* 🎨 Temas dinâmicos baseados no clima e temperatura
* ⏳ Indicador de carregamento (spinner)
* ⚠️ Tratamento de erros com feedback ao usuário
* 📱 Layout responsivo
* ⌨️ Suporte à tecla Enter
* ♿ Acessibilidade com `aria-label` e `.visually-hidden`

---

## 🛠️ Tecnologias

* HTML5
* CSS3
* JavaScript (ES6+)
* Jest (testes)
* JSDoc (documentação)

> Nenhuma dependência de produção — aplicação 100% client-side.

---

## 📁 Estrutura do Projeto

```
previsao-tempo/
│
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── icons/
│   │   └── weather/
│   └── js/
│       ├── api.js
│       ├── script.js
│       └── index.js
│
├── tests/
│   └── api.test.js
│
├── docs/
├── tutorials/
│   └── instalacao.md
│
├── index.html
├── package.json
├── jsdoc.config.json
└── README.md
```

---

## ⚙️ Pré-requisitos

* Navegador moderno com suporte à Fetch API
* Node.js v18+ (para testes e documentação)

---

## ▶️ Como executar o projeto

Devido ao uso de ES Modules (`import/export`), é necessário rodar a aplicação em um servidor local.

### 1. Clone o repositório

```bash
git clone https://github.com/Josue-Bravo/previsao-tempo.git
cd previsao-tempo
```

### 2. Inicie um servidor local

Você pode usar:

```bash
npx serve .
```

ou a extensão **Live Server** do VS Code.

### 3. Acesse no navegador

```
http://localhost:3000
```

---

## 🧪 Testes

O projeto possui testes unitários utilizando Jest.

### Executar os testes

```bash
npm install
npm test
```

### Cobertura

* Validação de entrada
* Requisições à API
* Tratamento de erros
* Casos extremos (falha de rede, status 429, JSON inválido)
* Funções auxiliares (`getTempTheme`, `getWeatherInfo`)

---

## 🌐 APIs Utilizadas

A aplicação utiliza APIs públicas do Open-Meteo (sem necessidade de autenticação).

### Geocoding API

Converte o nome da cidade em coordenadas:

```
https://geocoding-api.open-meteo.com/v1/search
```

### Weather API

Retorna dados meteorológicos:

```
https://api.open-meteo.com/v1/forecast
```

---

## 💡 Exemplo de uso

1. Digite o nome de uma cidade (ex: `Rio de Janeiro`)
2. Clique em **Buscar** ou pressione **Enter**
3. Visualize:

   * Temperatura atual
   * Condição do clima
   * Vento e umidade
   * Previsão para os próximos dias

---

## 📖 Documentação

A documentação do código é gerada automaticamente com JSDoc.

### Gerar documentação

```bash
npm run docs
```

Abra:

```
/docs/index.html
```

---

## 🔐 Boas práticas aplicadas

* Validação de entrada do usuário
* Tratamento de erros de API
* Separação de responsabilidades (API vs UI)
* Código modular (ES Modules)
* Testes automatizados
* Acessibilidade básica
* Sem exposição de chaves (API pública)

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

---
## 🔒 Privacidade

### 🔐 Relatório de Segurança e Privacidade

#### 1. Armazenamento de dados

* Não utiliza `localStorage`, `sessionStorage` ou cookies
* Nenhum dado do usuário é persistido

✔ Risco: **baixo**

---

#### 2. Comunicação com APIs

* Requisições realizadas via HTTPS
* Uso de API pública (Open-Meteo)
* Sem necessidade de autenticação ou uso de chaves

✔ Risco: **baixo**

---

#### 3. Entrada de dados

* Validação de entrada implementada
* Uso de `encodeURIComponent` para sanitização de parâmetros

✔ Risco: **baixo**

---

#### 4. Manipulação do DOM

* Uso seguro de manipulação de elementos (sem uso de `innerHTML` em pontos críticos)
* Dados exibidos na interface são controlados ou tratados previamente

✔ Risco: **baixo**

---

#### 5. Privacidade do usuário

* A aplicação não coleta dados pessoais
* Não há rastreamento, cookies ou armazenamento local
* As consultas (nomes de cidades) são enviadas diretamente à API externa

✔ Risco: **baixo**

---

### 🛠️ Correções aplicadas

* Remoção do uso de `innerHTML` em renderizações dinâmicas
* Ajuste de caminhos relativos para melhor compatibilidade em ambientes de produção
* Inclusão de seção de privacidade no README
* Melhoria na transparência sobre uso de dados
* Content Security Policy (CSP) implementada para restringir fontes de scripts, estilos e conexões externas

---

### ⚠️ Riscos identificados

| Risco                           | Impacto | Mitigação                            |
| ------------------------------- | ------- | ------------------------------------ |
| Dependência de API externa      | Médio   | Tratamento de erros implementado     |
| Indisponibilidade da API        | Médio   | Feedback ao usuário em caso de falha |
| Exposição de consultas (cidade) | Baixo   | Nenhum dado pessoal é armazenado     |

---

### 🔒 Recomendações para produção

* Garantir execução apenas em **HTTPS**
* Monitorar disponibilidade da API Open-Meteo
* Evitar inserção direta de HTML dinâmico no futuro
* Manter dependências de desenvolvimento atualizadas

---

### 📊 Classificação final

* Segurança: **Boa**
* Privacidade: **Boa**
* Risco geral: **Baixo**

---

### ✅ Conclusão

A aplicação atende às boas práticas de segurança para projetos frontend, sendo segura para uso público. Não foram identificadas vulnerabilidades críticas, e os riscos existentes são baixos e controlados.

### 📌 Visão geral

A aplicação foi analisada com foco em segurança e privacidade, considerando boas práticas para aplicações frontend que consomem APIs externas.

Após as correções aplicadas, o sistema apresenta **baixo risco de segurança**, não manipulando dados sensíveis nem utilizando autenticação.

---

### Atribuição

Os dados meteorológicos são fornecidos por Open-Meteo, sob licença:

* Creative Commons Attribution 4.0 (CC BY 4.0)

---

## 👤 Autor

**Josué Bravo**

* GitHub: https://github.com/Josue-Bravo
* LinkedIn: https://linkedin.com/in/josue-bravo

---

## 📌 Observações

Este projeto foi desenvolvido como parte de estudos em desenvolvimento web, com foco em boas práticas de código, organização e consumo de APIs.

### Atribuições obrigatórias

Este projeto utiliza dados meteorológicos fornecidos pela Open-Meteo,
licenciados sob Creative Commons Attribution 4.0 (CC BY 4.0).

Os créditos apropriados são mantidos conforme exigido pela licença.

Consulte o arquivo NOTICE.md para mais detalhes.
