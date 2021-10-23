# MindUniversity_SecondChallenge_FullStackApp

## Docker

You can run the project inside docker, you only need to

1. Run docker-compose build to create the images for the server, db and client.
2. Run docker-compose up to start the containers. These are 4 containers, server, mysql db for knex, mysql db for the v2 schemas with prisma and the client.

This will start the server in localhost:3001 and the client in localhost:3000, in the docker-compose file you will find the super user credentials

## Run locally

In order to run the project in your local machine you will need to have installed:

- yarn/npm
- node
- MySql

1. Run yarn install in the root folder, after the install yarn will run a postinstall script which will install the packages dependencies... TODO add lerna or rush
2. Inside the server folder add a .env file with your DB variables and secrets
   ie
   - `DATABASE_URL="mysql://<USERNAME>:<PASSWORD>@localhost:3306/<DBNAME>"` The prisma database url
   - `SUPER_USER_EMAIL=<EMAIL>` This is needed to generate the super user in the seeds
   - `SUPER_USER_PASSWORD=<PASSWORD>` Min 8 characters, 1 capital letter, 1 number, 1 simbol
   - `JWT_SECRET=<KEY>` The secret key for the jwt generator
   #### The config for the knex DB
   - `DATABASE_HOST=<HOST>`
   - `DATABASE_USER=<USERNAME>`
   - `DATABASE_PASSWORD=<PASSWORD>`
   - `DATABASE_NAME=<DBNAME>`
3. Then run `yarn run db` and then `yarn run prisma` This will run some migrations in your database and generate the super user inside the users table
4. After that you can run in the root folder yarn run dev. This will start the server and client

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
