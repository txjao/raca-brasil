# MCP — Sistema Raca Brasil
Contexto geral para agentes de IA atuando como assistentes no desenvolvimento do backend.

---

# Objetivo do Sistema
Desenvolver um sistema para gestão de semi-joias que controla:

- Proprietários
- Lojas
- Produtos
- Romaneios
- Itens de romaneio
- Usuários e autenticação
- Permissão por nível de acesso (RBAC)

O backend é implementado em:
- Node.js
- Express
- TypeScript
- MySQL (mysql2/promise)

Arquitetura em camadas:
- routes
- controllers
- services
- repositories
- database
- middlewares
- utils

---

# Banco de Dados

## Entidades

### Proprietario
- id INT PK
- cpf VARCHAR(11)
- nome VARCHAR(150)
- endereco VARCHAR(255)
- cep VARCHAR(8)
- contato VARCHAR(50)

### Loja
- id INT PK
- id_proprietario FK → proprietario(id)
- cnpj VARCHAR(14)
- nome VARCHAR(150)
- endereco
- cep
- contato

### User (autenticação)
- id INT PK
- nome
- email
- senha (hash bcrypt)
- role ENUM('ADMIN','GERENTE','VENDEDOR','USER')
- ativo BOOLEAN

### Produto
- id INT PK
- ref
- nome
- preco
- categoria
- foto

### Romaneio
- id INT PK
- id_loja FK → loja(id)
- id_user FK → user(id)
- tipo ENUM('PRATA','DOURADO')
- forma_pagamento ENUM('DINHEIRO','PIX','DEBITO','CREDITO','OUTRO')
- qtd_produtos
- valor_total

### Item_Romaneio
- id INT PK
- id_romaneio FK → romaneio(id)
- id_produto FK → produto(id)
- quantidade
- valor_unitario
- valor_total_item

---

# Autenticação
Autenticação usando:
- JWT
- bcryptjs para hashing de senha
- Middleware authenticate para validar token
- Middleware authorize para validar roles:

Roles possíveis:
- ADMIN
- GERENTE
- VENDEDOR
- USER

---

# Arquitetura Backend

## Conceitos
- **Routes** → definem endpoints e chamam controladores  
- **Controllers** → conversão req/res, chamam serviços  
- **Services** → regras de negócio  
- **Repositories** → queries SQL  
- **Middleware** → autenticação, autorização, validações  
- **Utils** → recursos auxiliares  

---

# 🧩 Regras de Negócio Essenciais

- Romaneio só pode ser criado por usuário autenticado
- Romaneio vincula sempre ao user.id
- Produtos são globais para uma loja (não por usuário)
- Cada romaneio contém vários itens
- somente ADMIN pode remover registros sensíveis
- GERENTE pode criar e editar produtos e romaneios
- VENDEDOR pode criar romaneios, mas não apagar produtos

---

# 📐 Padrões de Desenvolvimento
- Sempre usar TypeScript strict mode
- Sempre finalizar linhas com ponto-e-vírgula (;)
- Padronizar formatação via ESLint + Prettier
- Controllers sem regras de negócio
- Services sem lógica de transporte HTTP
- Repositories sem lógica de negócios

---

# 🚀 Instruções para o agente IA
Você é um assistente especializado no projeto “Raca Brasil”.

Sempre:
- gerar código em TypeScript
- seguir a arquitetura acima
- respeitar o ERD apresentado
- garantir boas práticas de segurança
- priorizar clareza e escalabilidade

Nunca:
- colocar lógica de negócio na rota
- retornar senha em responses
- ignorar roles de acesso
- duplicar código existindo um service

---

# 🏁 Final
Este documento descreve todo o contexto necessário para que um agente inteligente auxilie no desenvolvimento do sistema Raca Brasil.
