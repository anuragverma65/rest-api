# REST API

This is a simple REST API for credit card application built using Node.js, Express, SQLite3, and Knex.js. It is written in TypeScript, express and uses Jest for testing.

# Architecture

This project uses 3 layer architecture as shown in the diagram below.

- Router - passes requests to the corresponding controller
- Controller - Handles HTTP stuff and dealing with requests and responses for the endpoints
- Service - The business layer
- DAL (Data access layer) - handles database

![alt text](/assets/api-architecture.png)

# Prerequisites

Node v14 or higher

# Getting Started

Clone the repository

```
git clone https://github.com/anuragverma65/rest-api.git
```

Install the dependencies

```
yarn install
```

Start the development server

```
yarn dev
```

Running the tests

```
yarn test
```

Built With

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [SQLite3](https://www.sqlite.org/index.html)
- [Knex.js](https://knexjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)

# API Documentation

[Postman Collection](https://documenter.getpostman.com/view/25563665/2s935soN5A)

# Test Coverage

Nyc has been set to provide coverage on test runs. Current coverage stands at

```
| % Stmts | % Branch | % Funcs | % Lines |
|---------|----------|---------|---------|
|   100   |    100   |   100   |   100   |
```

# Author

[Anurag Verma](github.com/anuragverma65)

# License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the LICENSE.md file for details
