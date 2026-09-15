# 🐾 Flooty Pet

Sistema de gestão desenvolvido para centralizar e otimizar as operações de um pet shop, com foco em clientes, pets, agendamentos e processos internos.

O projeto está sendo desenvolvido a partir de necessidades reais da empresa, evoluindo continuamente conforme novos processos e funcionalidades são identificados.

> 🚧 **Projeto em desenvolvimento ativo.**

### Tela de Login

<img width="1918" height="908" alt="Tela de Login" src="https://github.com/user-attachments/assets/5186e988-0cc0-4df1-9b0e-7144335d0432" />

### Profile Dropdown

<img width="388" height="230" alt="Profile Dropdown" src="https://github.com/user-attachments/assets/7955982d-15b0-48f2-91a9-573b49ad2ded" />

### CRUD de Clientes

<img width="1919" height="909" alt="CRUD de Clientes" src="https://github.com/user-attachments/assets/7e6de88a-ebec-4980-9414-13879dac0950" />

---

## 📋 Sobre o Projeto

O Flooty Pet surgiu a partir da necessidade de substituir controles manuais utilizados na rotina do pet shop por uma solução centralizada.

A proposta é reunir, em um único sistema, informações e processos relacionados a clientes, pets, agendamentos, serviços e operações administrativas, tornando o acesso aos dados mais rápido e reduzindo tarefas repetitivas.

Por ser um projeto de uso interno, seu desenvolvimento acompanha as necessidades reais da empresa. Novas funcionalidades são implementadas e aprimoradas continuamente conforme os processos são analisados e novas demandas surgem.

---

## ✨ Funcionalidades

### ✅ Implementadas

* Cadastro e gerenciamento de clientes
* Cadastro e gerenciamento de pets
* Perfil individual do cliente
* Associação entre clientes e pets
* Listagem e consulta de clientes
* Sistema de autenticação por sessão
* Proteção de rotas através de middleware
* Validação de dados nas rotas da API
* Página de atualizações (Changelog)
* Interface desenvolvida com React

### 🚧 Em desenvolvimento

* Agenda e gerenciamento de agendamentos
* Histórico de atendimentos
* Controle financeiro
* Controle de estoque
* Relatórios gerenciais
* Dashboard administrativo
* Controle de permissões e cargos
* Notificações e automações via WhatsApp
* Integrações com serviços externos

---

## 🛠️ Tecnologias

### Frontend

* React.js
* React Router
* Sonner
* CSS

### Backend

* Node.js
* Express.js

### Banco de Dados

* SQLite3

---

## 🏗️ Estrutura do Projeto

```text
flooty-pet/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── middlewares/
│   ├── database/
│   └── server.js
│
└── README.md
```

---

## 🚀 Executando Localmente

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd flooty-pet
```

### 2. Instale as dependências

No frontend:

```bash
cd frontend
npm install
```

No backend:

```bash
cd ../backend
npm install
```

### 3. Inicie o backend

```bash
node server.js
```

### 4. Inicie o frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

---

## 🔐 Segurança

O backend possui mecanismos para controlar o acesso às funcionalidades do sistema, incluindo:

* Autenticação baseada em sessão
* Middleware para proteção de rotas
* Verificação de acesso no backend
* Validação dos dados recebidos pela API

---

## 📸 Demonstrações

A documentação visual do projeto será atualizada conforme novas funcionalidades forem implementadas.

Entre as funcionalidades demonstradas estarão:

* Dashboard
* Gerenciamento de clientes
* Gerenciamento de pets
* Perfil do cliente
* Agenda e agendamentos
* Financeiro
* Controle de estoque

---

## 📈 Roadmap

* [x] Sistema de autenticação
* [x] Cadastro de clientes
* [x] Cadastro de pets
* [x] Perfil de clientes
* [x] Página de atualizações
* [ ] Agenda
* [ ] Histórico de atendimentos
* [ ] Financeiro
* [ ] Estoque
* [ ] Relatórios
* [ ] Dashboard administrativo
* [ ] WhatsApp
* [ ] Controle de cargos e permissões
* [ ] Integrações externas

---

## 👨‍💻 Desenvolvedor

**Rafael Lopes**

Desenvolvedor de Software

---

## 📌 Status

🚧 **Em desenvolvimento ativo**

O Flooty Pet continua recebendo novas funcionalidades, melhorias e ajustes com base nas necessidades identificadas durante seu uso e desenvolvimento.
