# Sistema Raca Brasil — Documentação Técnica

## 📌 Visão Geral do Projeto
Sistema desenvolvido em **Node.js + Express + TypeScript** com banco **MySQL**, destinado ao controle de:

- Lojas
- Proprietários
- Produtos
- Romaneios
- Itens de Romaneio
- Usuários (login + permissões)

Arquitetado para escalabilidade e segurança.

---

# 📊 1. Modelo Relacional (ERM)

### Entidades Principais:
- **proprietario**
- **loja**
- **produto**
- **romaneio**
- **item_romaneio**
- **user** (autenticação)

### Relacionamentos:
- 1 proprietário → N lojas  
- 1 loja → N romaneios  
- 1 romaneio → N itens  
- 1 produto → N itens de romaneio  
- 1 user → N romaneios  

### Diagrama previsto:

```

proprietario (1)
↓
loja (N)
↓
romaneio (N) ← user (1)
↓
item_romaneio (N) → produto (1)

````

---

# 🧱 2. Scripts SQL do Banco

## 2.1 Criação do banco
```sql
CREATE DATABASE IF NOT EXISTS semijoias
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE semijoias;
````

---

## 2.2 Tabela: user

```sql
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  role ENUM('ADMIN','GERENTE','VENDEDOR','USER') DEFAULT 'USER',
  ativo TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 2.3 Tabela: proprietario

```sql
CREATE TABLE proprietario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cpf VARCHAR(11) NOT NULL UNIQUE,
  nome VARCHAR(150) NOT NULL,
  endereco VARCHAR(255),
  cep VARCHAR(8),
  contato VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 2.4 Tabela: loja

```sql
CREATE TABLE loja (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_proprietario INT NOT NULL,
  cnpj VARCHAR(14) NOT NULL UNIQUE,
  nome VARCHAR(150) NOT NULL,
  endereco VARCHAR(255),
  cep VARCHAR(8),
  contato VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_loja_proprietario
    FOREIGN KEY (id_proprietario)
    REFERENCES proprietario(id)
    ON DELETE CASCADE
);
```

---

## 2.5 Tabela: produto

```sql
CREATE TABLE produto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ref VARCHAR(50) UNIQUE NOT NULL,
  nome VARCHAR(150) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(50),
  foto VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 2.6 Tabela: romaneio (com FK para user)

```sql
CREATE TABLE romaneio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_loja INT NOT NULL,
  id_user INT NOT NULL,
  tipo ENUM('PRATA','DOURADO') NOT NULL,
  forma_pagamento ENUM('DINHEIRO','PIX','DEBITO','CREDITO','OUTRO') NOT NULL,
  qtd_produtos INT DEFAULT 0,
  valor_total DECIMAL(10,2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_romaneio_loja
    FOREIGN KEY (id_loja)
    REFERENCES loja(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_romaneio_user
    FOREIGN KEY (id_user)
    REFERENCES user(id)
    ON DELETE CASCADE
);
```

---

## 2.7 Tabela: item_romaneio

```sql
CREATE TABLE item_romaneio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_romaneio INT NOT NULL,
  id_produto INT NOT NULL,
  quantidade INT NOT NULL,
  valor_unitario DECIMAL(10,2) NOT NULL,
  valor_total_item DECIMAL(10,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_itemromaneio_romaneio
    FOREIGN KEY (id_romaneio)
    REFERENCES romaneio(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_itemromaneio_produto
    FOREIGN KEY (id_produto)
    REFERENCES produto(id)
    ON DELETE CASCADE
);
```

---

# 🔐 3. Autenticação (JWT + Bcrypt)

### Fluxo:

1. Usuário envia email e senha
2. Backend busca o user no banco
3. Compara com bcrypt
4. Gera token JWT:

```json
{
  "id": 1,
  "nome": "Administrador",
  "role": "ADMIN"
}
```

5. Token é usado nas rotas protegidas

---

# 🛡️ 4. Middleware de Autorização (RBAC)

```ts
function authorize(roles: string[]) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Acesso negado." });
    }
    next();
  };
}
```

Uso:

```ts
router.post("/produto", authorize(["ADMIN", "GERENTE"]), ProdutoController.create);
```

---

# 🏗️ 5. Estrutura do Backend Node + TS

```
src/
  controllers/
  services/
  repositories/
  routes/
  middlewares/
  database/
  interfaces/
  utils/
  server.ts
```

### server.ts

* inicializa express
* importa middlewares
* carrega rotas
* conecta com banco
* sobe servidor

---

# 🧪 6. Criação do Primeiro Usuário (ADMIN)

### Gerar hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('admin123', 10))"
```

### Inserir no banco:

```sql
INSERT INTO user (nome, email, senha, role)
VALUES (
  'Administrador',
  'admin@raca.com',
  '$2b$10$SEUHASHAQUI',
  'ADMIN'
);
```

---

# 📦 7. Dependências Principais

```bash
npm install express mysql2 dotenv bcryptjs jsonwebtoken
```

### Dev:

```bash
npm install -D typescript ts-node-dev @types/node @types/express
```

---

# 🧹 8. ESLint + Prettier (Resumo)

### `.eslintrc.json`

```json
{
  "env": {
    "es2021": true,
    "node": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint", "prettier"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ]
}
```

---

# 🚀 Próximos passos sugeridos

* Implementar **CRUD de usuário**
* Criar rotas `/auth/login` e `/auth/register`
* Criar middleware `authenticate` (JWT)
* Criar CRUD de produtos
* Criar CRUD de romaneios
* Implementar auditoria

---

# 🏁 Fim do arquivo

Use este `.md` como base dentro do VS Code para continuar a evolução do projeto.

```

---

Se quiser, também posso gerar:

- Uma **versão em PDF**  
- Uma **versão comentada linha por linha**  
- Uma **versão focada só para desenvolvedores novos no projeto**  

Só pedir!
```
