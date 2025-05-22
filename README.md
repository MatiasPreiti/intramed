<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Proyecto realizado por Matias Preiti en <a href="http://nodejs.org" target="_blank">Nest JS</a> para Intramed.</p>
    <p align="center">
<a href="https://www.linkedin.com/in/matias-oscar-preiti/" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Linkedin Matias Preiti" /></a>
</p>

## Description

Proyecto en Nest Js creado por Matias Preiti como challenge tecnico para Intramed

## Project setup

Este comando es muy importante ejecutarlo con el flag --legacy-peer-deps, en virtud de evitar errores con inconsistencia de versiones de dependencias que no tengan el mismo versionado a nivel global en su setup.

```bash
$ npm install --legacy-peer-deps
```

### Importante

Luego de esto es indespensable, crear el archivo `[.env]`en el root del proyecto, se creo un archivo .env.example como ejemplo el cual sirve como guia de las variables a agregar o se pueden utilizar las ya creadas si corresponden con su configuracion.

## Compile and run the project

Antes de compilar el proyecto es muy importante tener postgreSQL levantado en el puerto y host especificado. No es necesario crear las tablas o base de datos, con tener una instancia de postgre en funcionamiento el propio proyecto creara la DB y las tablas necesarias para su funcionamiento.

1. ejecutar comando:

```bash
$ npm run start:dev
```

Al ejecutar este comando luego de correr el install se creara automanticamente las tablas de la base de datos, tambien se injectaran datos en esta para ejecutar las pruebas de forma mas dinamica.

2. Ejecutar comando de test

```
$ npm run test:cov
```

```## Cobertura de Tests

* **Cobertura total de líneas:** 98.63%
* **Declaraciones:** 98.78%
* **Funciones:** 100%
* **Ramificaciones:** 91.42%

Test Suites: 14 passed, 14 total
Tests:       79 passed, 79 total
```

## Use of the project

En primera instancia de deja en el root del proyecto una coleccion en formato Json para importar en postman o cualquier otra herramienta, si le es de utilidad.

Es sumamente importante que verifique la URL del proyecto y la baseURL que posee configurada en su Postman / Insomnia para que funcione correctamente.

Asimismo se documento el proyecto en Swager y puede utilizarse desde alli con el proyecto corriendo desde el Link:

```
Swagger: http://localhost:3000/api
obtener Json: http://localhost:3000/api-json
```

# Utilizacion del proyecto

Para tener en cuenta no es posible crear usuarios Admin en esta aplicacion, por lo que para facilitar pruebas eh creado un registro que se crea en DB una cuenta con rol Admin.

### Actualizacion e implementación API StarWars

Se ha creado un modulo starwars, el cual posee un cron asociado configurado en dos etapas. Primeramente este se corre cuando se inicializa el proyecto, siempre que el modulo starwars se inicialice procedera a correr la funcion correspondiente a la obtencion de las peliculas y en caso que estan no existan en la DB actualizarla.
En segunda instancia se creo un cron recurrente el cual se inicializa cada 60 minutos, el cual es completamente configurable a gusto.

```
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    await this.fetchFilms();
  }
```

Este modulo al encontrar actualizaciones utiliza el modulo de dominio, Movies el cual actualiza la DB segun sus parametros. La idea de esta funcionalidad separada es que el Modulo Movies pueda ser escalable a cualquier otra API o servicio para la actualizar de la DB.

### Guía de Endpoints de la API

Esta sección detalla los endpoints disponibles en la API, su propósito, cómo utilizarlos y los requisitos de autenticación/autorización.

#### Autenticación y Gestión de Usuarios

Estos endpoints permiten a los usuarios registrarse y obtener tokens de acceso para interactuar con las funcionalidades protegidas de la API.

```
POST /auth/register - Registro de Nuevo Usuario
```

Descripción: Permite crear una nueva cuenta de usuario en el sistema.
Acceso: Público (no requiere autenticación).

#### Request Body (JSON):

```
{
  "email": "string",       // Ejemplo: "user@example.com"
  "account": "string",     // Ejemplo: "myAccountName"
  "password": "string"     // Ejemplo: "strongPassword123"
}
```

Respuestas:
201 Created: Usuario creado exitosamente.
400 Bad Request: Datos inválidos o usuario ya existente.
Notas: Al registrarse, el role por defecto del usuario será 'user'.

---

```
POST /auth/login - Inicio de Sesión y Obtención de Token JWT
```

Descripción: Autentica a un usuario existente y, si las credenciales son correctas, devuelve un token de acceso JWT. Este token debe ser utilizado en los Headers de futuras solicitudes a endpoints protegidos.
Acceso: Público (no requiere autenticación).

#### Request Body (JSON):

```
{
  "email": "string",       // Ejemplo: "user@example.com"
  "password": "string"     // Ejemplo: "strongPassword123"
}
```

Respuestas:
200 OK: Login exitoso, devuelve el token JWT.
JSON

```
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

401 Unauthorized: Credenciales inválidas.
Cómo usar el token: Incluye el token en el encabezado Authorization de tus solicitudes de la siguiente manera: Authorization: Bearer YOUR_JWT_TOKEN.
Endpoints de Salud del Servicio
Estos endpoints proporcionan información básica sobre el estado y la versión de la aplicación.

---

```
GET / - Health Check Básico
```

Descripción: Un endpoint simple para verificar si el servicio está operativo.
Acceso: Público.
Respuestas: 200 OK con un mensaje de "Ok".

---

```
GET /info - Información del Microservicio
```

Descripción: Muestra detalles sobre el microservicio, como autor, fecha, entorno y versión.
Acceso: Público.
Respuestas: 200 OK con un objeto HealthDto.
Gestión de Películas
Estos endpoints permiten interactuar con la información de las películas, con distintos niveles de acceso basados en el rol del usuario.

---

```
GET /movies - Obtener Todas las Películas
```

Descripción: Recupera una lista de todas las películas disponibles en el sistema.
Acceso: Protegido (requiere token JWT válido).
Respuestas:
200 OK: Lista de películas.
401 Unauthorized: Si el token no es válido o está ausente.

---

```
GET /movies/{id} - Obtener Detalles de una Película por ID
```

Descripción: Recupera los detalles de una película específica utilizando su ID.
Acceso: Solo "Usuarios Regulares" y "Administradores" (requiere token JWT válido con rol 'user' o 'admin').

#### Parámetros de Ruta:

```
 id (number, requerido): El ID de la película.
```

Respuestas:
200 OK: Detalles de la película.
401 Unauthorized: Si el token no es válido o está ausente.
403 Forbidden: Si el usuario no tiene el rol requerido ('user' o 'admin').
404 Not Found: Si la película no existe.

---

```
POST /movies - Crear una Nueva Película
```

Descripción: Permite a los administradores agregar una nueva película a la base de datos.
Acceso: Solo "Administradores" (requiere token JWT válido con rol 'admin').

#### Request Body (JSON):

```
{
  "title": "string",           // Título de la película (requerido)
  "director": "string",        // Director (opcional)
  "release_date": "string",    // Fecha de lanzamiento (opcional, formato: "YYYY-MM-DD")
  "description": "string",     // Descripción (opcional)
  "properties": {}             // Objeto JSON con propiedades adicionales (opcional)
}
```

Respuestas:
201 Created: Película creada exitosamente.
401 Unauthorized: Si el token no es válido o está ausente.
403 Forbidden: Si el usuario no es un administrador.
400 Bad Request: Datos inválidos.

---

```
PATCH /movies/{id} - Actualizar Información de una Película
```

Descripción: Permite a los administradores actualizar parcialmente la información de una película existente.
Acceso: Solo "Administradores" (requiere token JWT válido con rol 'admin').
Parámetros de Ruta:
id (number, requerido): El ID de la película a actualizar.

#### Request Body (JSON): Puede incluir cualquiera de los campos de CreateMovieDto para actualizar.

```
{
  "title": "string",           // Opcional
  "director": "string",        // Opcional
  // ... otros campos
}
```

Respuestas:
200 OK: Película actualizada exitosamente.
401 Unauthorized: Si el token no es válido o está ausente.
403 Forbidden: Si el usuario no es un administrador.
404 Not Found: Si la película no existe.
400 Bad Request: Datos inválidos.

---

```
DELETE /movies/{id} - Eliminar una Película
```

Descripción: Permite a los administradores eliminar una película del sistema.
Acceso: Solo "Administradores" (requiere token JWT válido con rol 'admin').

#### Parámetros de Ruta:

```
id (number, requerido): El ID de la película a eliminar.
```

Respuestas:
204 No Content: Película eliminada exitosamente (no devuelve contenido).
401 Unauthorized: Si el token no es válido o está ausente.
403 Forbidden: Si el usuario no es un administrador.
404 Not Found: Si la película no existe.

---

```
GET /users - Obtener Todos los Usuarios
```

Descripción: Recupera una lista de todos los usuarios registrados.
Acceso: (Según tu implementación, probablemente solo para administradores, aunque Swagger no lo especifica con security como en /movies).
Respuestas: 200 OK: Lista de usuarios.

---

```
GET /users/{id} - Obtener un Usuario por ID
```

Descripción: Recupera los detalles de un usuario específico por su ID.
Acceso: (Según tu implementación, probablemente solo para administradores o el propio usuario).

#### Parámetros de Ruta: id (number, requerido): El ID del usuario.

Respuestas: 200 OK: Detalles del usuario.

---

```
PUT /users/{id} - Actualizar un Usuario
```

Descripción: Actualiza los detalles de un usuario.
Acceso: (Según tu implementación, probablemente solo para administradores o el propio usuario).
Parámetros de Ruta: id (number, requerido): El ID del usuario a actualizar.

#### Request Body (JSON): Contiene los campos a actualizar del usuario.

```
{
  "email": "string",
  "account": "string"
}
```

Respuestas: 200 OK: Usuario actualizado exitosamente.

## Stay in touch

- Author - [Matias Preiti](https://www.linkedin.com/in/matias-oscar-preiti/)
