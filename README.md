# LifeShots API

LifeShots API é o backend responsável por gerenciar todas as funcionalidades da plataforma LifeShots, sendo uma simples rede social, criada por GuiSebastião, é focada no compartilhamento de publicações e stories, oferecendo recursos essenciais para interações sociais.

## Funcionalidades Principais

 - **Autenticação JWT:** Garante o acesso seguro à plataforma;
 - **Gerenciamento de Usuários:** Cadastro, atualização, e remoção de perfis;
 - **Interações Sociais:** Sistema de curtidas, comentários e seguidores;
 - **Controle de Conteúdo:** Publicação e gerenciamento de stories e publicações;

## Tecnologias Utilizadas
 - **Linguagem:** NodeJS;
 - **Framework:** Express;
 - **ORM:** Sequelize;
 - **Banco de Dados:** MySQL;
 - **Autenticação:** JSON Web Tokens;

## Requisitos de Software

#### Os requisitos para executar a API estão detalhados no seguinte documento:

 - [**Requisito de Software** - Planilhas google](https://docs.google.com/spreadsheets/d/1QJFa9XAJZ71S60j33F-zQGeuuOFSNE8Ui19YimdNXh8/edit?usp=sharing)

## Estrutura do Banco de Dados

#### O diagrama ERM (Entidade-Relacionamento) está disponível em:

  - [**Diagrama ERD** - Lucidchart](https://lucid.app/lucidchart/3cdde976-4140-400b-80e0-819269004e3d/edit?invitationId=inv_ee62d169-0647-45f8-9896-b8704642e30c)

## Documentação da API

#### A documentação completa da API, incluindo exemplos de uso e endpoints, pode ser acessada pelo Postman:

 - [**Documentação API** - Postman](https://documenter.getpostman.com/view/34937794/2sAYQZGrZT)

## Como Executar o Projeto

1. Clone o repositório:

```bash
  > git clone https://github.com/guisebastiao/lifeshots-api.git
  > cd lifeshots-api
```

2. Instale as dependências:
   
```bash
  > npm install
```

3. Configure as variáveis de ambiente:
   
 > `Crie um arquivo .env baseado no .env.example fornecido no repositório.`

4. Crie a database:

 > `Crie uma database em seu MySQL Workbench com o nome de lifeshots.`

5. Execute as migrações do banco de dados:

```bash
  > npx sequelize-cli db:migrate
```

6. Inicie o servidor:

```bash
  > npm run dev
```

7. A API estará disponível em:

 > `http://localhost:3333/`
