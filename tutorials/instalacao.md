# Instalação e Uso

## Pré-requisitos

- Navegador moderno (Chrome, Firefox, Edge ou Safari)
- [Node.js](https://nodejs.org/) v18 ou superior — apenas para testes e documentação

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/Josue-Bravo/previsao-tempo.git
cd previsao-tempo
```

### 2. Inicie um servidor local

Por utilizar ES Modules (`import/export`), a aplicação **precisa ser servida por um servidor local** — não funciona ao abrir o `index.html` diretamente pelo sistema de arquivos.

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

## Instalando as dependências de desenvolvimento

```bash
npm install
```

---

## Rodando os testes

```bash
npm test
```

---

## Gerando a documentação

```bash
npm run docs
```

Abra o arquivo gerado no navegador:

```
/docs/index.html
```
