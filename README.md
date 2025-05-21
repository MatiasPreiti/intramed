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

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

Este comando es muy importante ejecutarlo con el flag --legacy-peer-deps

```bash
$ npm install --legacy-peer-deps
```

Luego de esto es Indespensable, crear el archivo .env en el root del proyecto, se creo un archivo .env.example como ejemplo el cual sirve como guia de las variables a agregar o se pueden utilizar las ya creadas si corresponden con su configuracion.

## Compile and run the project

Antes de compilar el proyecto es muy importante tener postgreSQL levantado en el puerto y host especificado

```bash
$ npm run start:dev
```

Al ejecutar este comando luego de correr el install se creara automanticamente las tablas de la base de datos, tambien se injectaran datos en esta para ejecutar las pruebas de forma mas dinamica.

## Use of the project

En primera instancia de deja en el root del proyecto una coleccion postman para importar si le es de utilidad.

```
Es sumamente importante que verifique la URL del proyecto y la baseURL que posee configurada en su Postman / Insomnia para que funcione correctamente.
```

Asimismo se documento el proyecto en Swager y puede utilizarse desde alli con el proyecto corriendo desde el Link:

```
Swagger: http://localhost:3000/api
```

# Endpoints challenge

## Portfolio

La respuesta deberá devolver el valor total de la cuenta de un usuario, sus pesos disponibles para operar y el listado de activos que posee (incluyendo cantidad de acciones, el valor total monetario de la posición ($) y el rendimiento total (%)).

Curl:

```
curl -X 'GET' \
 'http://localhost:3000/portfolio/1' \
 -H 'accept: application/json'
```

ejemplo de respuesta:

```
{
  "userId": "1",
  "totalValue": "1798780",
  "availableCash": "1798780",
  "assets": [
    {
      "ticker": "BMA",
      "name": "Banco Macro S.A.",
      "size": 20,
      "price": "1540.00",
      "total_value": "30800.00",
      "total_return": "-1.14783752672257852300"
    },
    {
      "ticker": "BMA",
      "name": "Banco Macro S.A.",
      "size": 20,
      "price": "1540.00",
      "total_value": "30800.00",
      "total_return": "7.55217545100813583300"
    }
  ]
}
```

## Buscar activos

La respuesta deberá devolver el listado de activos similares a la busqueda realizada dentro del mercado (tiene que soportar busqueda por ticker y/o por nombre).

Curl:

```
curl -X 'GET' \
  'http://localhost:3000/instruments/search?keyword=Telecom' \
  -H 'accept: application/json'
```

Response ejemplo:

```
[
  {
    "id": 7,
    "ticker": "TECO2",
    "name": "Telecom",
    "type": "ACCIONES"
  },
  {
    "id": 73,
    "ticker": "TECO2",
    "name": "Telecom",
    "type": "ACCIONES"
  },
  {
    "id": 139,
    "ticker": "TECO2",
    "name": "Telecom",
    "type": "ACCIONES"
  },
]
```

## Enviar una orden al mercado

A traves de este endpoint se podrá enviar una orden de compra o venta del activo. Soportando dos tipos de ordenes: MARKET y LIMIT. Las ordenes MARKET no requieren que se envíe el precio ya que se ejecutara la orden con las ofertas del mercado, por el contrario, las ordenes limite requieren el envío del precio al cual el usuario quiere ejecutar la orden. La orden quedará grabada en la tabla orders con el estado y valores correspondientes.

Curl:

```
curl -X 'POST' \
  'http://localhost:3000/orders' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "instrumentid": 47,
  "userid": 1,
  "size": 50,
  "price": 930,
  "type": "MARKET",
  "side": "BUY",
  "investmentAmount": 46500
}'
```

Response ejemplo:

```
{
  "instrumentid": 47,
  "userid": 1,
  "size": 50,
  "price": "925.85",
  "type": "MARKET",
  "side": "BUY",
  "status": "FILLED",
  "datetime": "2025-04-01T21:28:24.721Z",
  "id": 89,
  "instrument": {
    "id": 47,
    "ticker": "PAMP",
    "name": "Pampa Holding S.A.",
    "type": "ACCIONES"
  }
}
```

## Stay in touch

- Author - [Matias Preiti](https://www.linkedin.com/in/matias-oscar-preiti/)
