# Indigo API REST
    Construção da API de uma rede social para a disciplina Projeto de Interface Web (2018.1).

## Atributos das Entidades
* User
    * id
    * name
    * email
    * password
* Post
    * id
    * text
    * likes
    * uid

## Endpoints

| HTTP METHOD |      POST      |      GET      |      PUT      |      DELETE      |
|-------------|----------------|---------------|---------------|------------------|
| /api/users  | Recebe usuário e armazena | Retorna todos usuários | Recebe usuário e ​modifica usuário logado | Remove usuário logado |
| /api/users/:id | ERROR | Retorna usuário com id :id | ERROR | ERROR |
| /api/users/:id/posts | ERROR | Retorna todos posts de um usuário | ERROR | ERROR |
| /api/posts/ | Recebe novo post e o armazena com uid do usuário logado | Retorna todo os posts | ERROR | ERROR |
| /api/posts/:id |  | Retorna post com id :id | Recebe post com id :id e o ​modifica | Delete post com id :id |
