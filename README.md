# MindUniversity_SecondChallenge_FullStackApp

[![CodeQL](https://github.com/JoshuaVM95/MindUniversity_SecondChallenge_FullStackApp/actions/workflows/codeql-analysis.yml/badge.svg?branch=master)](https://github.com/JoshuaVM95/MindUniversity_SecondChallenge_FullStackApp/actions/workflows/codeql-analysis.yml) [![CI Workflow](https://github.com/JoshuaVM95/MindUniversity_SecondChallenge_FullStackApp/actions/workflows/pull_request.yml/badge.svg)](https://github.com/JoshuaVM95/MindUniversity_SecondChallenge_FullStackApp/actions/workflows/pull_request.yml) ![GitHub repo size](https://img.shields.io/github/repo-size/JoshuaVM95/MindUniversity_SecondChallenge_FullStackApp) ![GitHub language count](https://img.shields.io/github/languages/count/JoshuaVM95/MindUniversity_SecondChallenge_FullStackApp) ![GitHub top language](https://img.shields.io/github/languages/top/JoshuaVM95/MindUniversity_SecondChallenge_FullStackApp) ![GitHub last commit](https://img.shields.io/github/last-commit/JoshuaVM95/MindUniversity_SecondChallenge_FullStackApp) ![GitHub issues](https://img.shields.io/github/issues-raw/JoshuaVM95/MindUniversity_SecondChallenge_FullStackApp) ![GitHub closed issues](https://img.shields.io/github/issues-closed/JoshuaVM95/MindUniversity_SecondChallenge_FullStackApp) ![GitHub pull requests](https://img.shields.io/github/issues-pr/JoshuaVM95/MindUniversity_SecondChallenge_FullStackApp) ![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/JoshuaVM95/MindUniversity_SecondChallenge_FullStackApp)

## Docker

You can run the project inside a docker container. You only need to:

1. Run `docker-compose build client` to create the images for the server, DB, and client.
2. Run `docker-compose up client` to start the container. These mounts the images of the server, MySQL DB for knex, and MySQL DB for the v2 schemas with Prisma and the client.

This will start the server in `localhost:3001`, and the client in `localhost:3000`, in the docker-compose file you will find the superuser credentials.

## Run locally

To run the project on your local machine you will need to have installed:

- Microsoft rush globally
- NodeJS
- MySql

1. Run `rush update` in the root folder to install the latest dependencies.
2. Run `rush rebuild` to do a clean build of every project in the repository.
3. Run `prisma generate` to build the types for the Prisma client.
4. Inside the server folder add a `.env` file with your DB variables and secrets:
   - `DATABASE_URL="mysql://<USERNAME>:<PASSWORD>@localhost:3306/<DBNAME>"` The prisma database url.
   - `SUPER_USER_EMAIL=<EMAIL>`
   - `SUPER_USER_PASSWORD=<PASSWORD>` Min 8 characters, 1 capital letter, 1 number, and 1 symbol.
   - `JWT_SECRET=<KEY>` The secret key for the JWT generator.
   #### The config for the knex DB
   - `DATABASE_HOST=<HOST>`
   - `DATABASE_USER=<USERNAME>`
   - `DATABASE_PASSWORD=<PASSWORD>`
   - `DATABASE_NAME=<DBNAME>`
5. After setting the environment variables for the server. Run the following commands inside the server folder, `npm run db`, and `npm run prisma`. This will run the migrations in your database, and generate the superuser inside the user's table.
6. After that you can run in the root folder `rush dev` to start the server in `localhost:3001` and the client in `localhost:3000`.

## Requerimientos tecnicos

- [x] Construir un Docker con las herramientas y configuraciones requeridas para montar
      un sitio web. (Dejar implementación al final)
- [x] Configurar una base de datos (SQL, MySql, Mongo)
- [ ] Construir un Web API RestFul (Net Core, Node, PHP)
  - [x] Implementar documentación (Swagger/OpenAPI)
  - [x] Implementar versionado del API
  - [x] Implementar seguridad JWT
  - [ ] Implementar un Log de errores
- [x] Construir Unit Test
  - [ ] Integrar herramienta de code coverage para ver el avance
- [x] Implementar ORM si el modelo de Base de datos lo permite
- [x] Construir un FrontEnd con una de las siguientes opciones (React, Angular, Vue, Rea
      ct Native, Android, IOS)
  - [x] Integrar validaciones en los campos (Campos vacíos o nulos)
  - [x] Integrar notificaciones de confirmación (Alertas al guardar, eliminar)
- [x] Se requiere entregar en un repositorio git el resultado de la implementación
- [ ] Evitar manejo variables fijas en el código(Configurarlas en algún archivo general y d
      ocumentadas

## Historias (Funcionalidad esperada)

- [x] Inicio de sesión
- [x] Cerrar sesión
- [x] Manejo de roles
- [x] Super user (Se crea directo en la base de datos)
- [x] Este usuario puede dar de alta admins o usuarios normales
- [x] Admin
- [x] Usuario normal

##### Role Admin y super admin puede hacer las siguientes tareas

- [x] Crud de usarios
  - Nombre
  - Correo
  - Contraseña encriptada
- [x] Crud de cuentas
  - Nombre de la cuenta
  - Nombre del cliente
  - Nombre del responsable de operación
  - Consulta de equipo
- [x] Movimiento de personas de los equipos
- [x] Debe poder agregar usuarios registrados
  - Fecha de inicio
  - Fecha de fin
  - El sistema debe mantener un log de movimientos de las personas
- [x] Consultar log de movimientos de personas entre equipos
  - Filtro
  - Por equipo
  - Por nombre
  - Por fecha de inicio y fecha de fin
- [x] Consultar información detalle de los usuarios

##### Role Usuario normal

- [x] Solo puede consultar su perfil
  - Nombre
  - Correo (No editable)
  - Nivel de inglés
  - Conocimientos técnicos (Campo de texto)
  - Link de CV (Google Doc) para manejar formato de arkus
