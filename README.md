# TM Network Analysis Serice

> RESTful/gRPC api with Domain Driven Design

## Development Environment Setup

1.  Make sure you have `nvm`, node `v12.18.3` or `LTS` version of node installed
2.  Install `yarn` - `npm install -g yarn`.

## Documentation

1. Visit [http://localhost:30041/rest-api] for REST docs
2. gRPC documentation should be added at the bottom of this readme. It can be access by visiting [http://localhost:30041/readme](http://localhost:30041/readme)
3. This template documentation can be access by running `yarn serve:docs` then visit [http://localhost:3000](http://localhost:3000)

## Docker support

**Prerequisites**

1. [Docker](https://www.docker.com/products/docker-engine) Community Edition v17 or higher

```sh
$ docker build -t tm-network-analysis-service  .
$ docker run -p 30041:30041 -p 30042:30042 --env-file=.env  tm-network-analysis-service
```

Access `http://localhost:<PORT>` and you're ready to go!

> http://localhost:30041/

## Quick Start

1. Clone the repository with `git clone --recursive https://github.com/YouverifyHQ/raw-template.git`
2. Install the dependencies with [Yarn](https://yarnpkg.com/en/docs/install/)
3. Run local Jaeger for distributed tracing `yarn start:jaeger:dev`
4. Run the application in development mode with `yarn start:dev:rs`
5. Access `http://localhost:<PORT>` and you're ready to go!
   > http://localhost:30007

## Overview

- uses Node.js > v9
- written using ES6
- uses Yarn for package dependency management
- uses [Airbnb JavaScript Style](https://github.com/airbnb/javascript)
- uses `Mongoose` as ODM
- Filename convention - `camelCase`

## CLI Tools

- `yarn build` - build codebase for production
- `yarn start:dev` - start the application in development mode
- `yarn start:dev:rs` - start the application in development mode with nodemon for automatic server restart on code change
- `yarn test` - run Unit tests
- `yarn lint` - lint codebase using Airbnb style
- `yarn lint:fix` - fix code according to Airbnb style
- `yarn build:docs` - generate Rest API, Readme & JSDC documenation
- `yarn update:stub` - update submodules
- `yarn start:jaeger:dev` - start a local Jaeger server and serve
- `yarn stop:jaeger:dev` - stop a local Jaeger container

### Databases & Messaging

- [Mongodb](https://www.mongodb.com) - Main datastore
- [Redis](https://redis.io/) - In-memory datastore for caching
- [Elasticsearch](https://www.elastic.co/elasticsearch/) - Elasticsearch is a distributed, RESTful search and analytics engine
- [RabbitMq](https://www.rabbitmq.com/) - Message Broker

## Some Tech

- [Express](https://expressjs.com/) - Node Framweork
- [Awilix](https://github.com/jeffijoe/awilix) - dependency resolution support powered by `Proxy`
- [Nodemon](https://nodemon.io/) - Use for development file reload.
- [CORS](https://github.com/expressjs/cors) - a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
- [Compression](https://github.com/expressjs/compression) - Node.js compression middleware.
- [Http-status](https://github.com/adaltas/node-http-status) - Utility to interact with HTTP status code.
- [Winston](https://github.com/winstonjs/winston) - A multi-transport async logging library for node.js.
- [Morgan](https://github.com/expressjs/morgan) - HTTP request logger middleware for node.js
- [Lodash](https://lodash.com/) - A modern JavaScript utility library delivering modularity, performance & extras
- [Mongoose](https://mongoosejs.com/) - Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.
- [Chance](https://chancejs.com/) - generate massive amounts of fake data in the browser and node.js

- [Moment](https://momentjs.com/) - Parse, validate, manipulate, and display dates and times in JavaScript.
- [Moment-timezone](https://momentjs.com/timezone/) - Parse and display dates in any timezone.

- [APIdocjs](https://apidocjs.com/)- Inline Documentation for RESTful web APIs

### Logging & Tracing

- [Fluentd](https://www.fluentd.org/) - Data collector for unified logging layer..
- [Jaeger](https://www.jaegertracing.io/) - end-to-end distributed tracing.
  Monitor and troubleshoot transactions in complex distributed systems

### Tests

- [mocha](https://mochajs.org/) - JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun
- [chai](http://chaijs.com/) - a BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework.
- [supertest](https://github.com/visionmedia/supertest) - HTTP assertions made easy via superagent.
- [cross-env](https://github.com/kentcdodds/cross-env) - makes it so you can have a single command without worrying about setting or using the environment variable properly for the platform
  - We mainly use this so **mocha** can use the absolute path of files

### Pre-commit

Adding `pre-commit` to your project can be helpful to encourage consistency and quality of your code repository.

- [pre-commit](https://github.com/observing/pre-commit) - **pre-commit** is a pre-commit hook installer for `git`. It will ensure that your `yarn lint` (or other specified scripts) passes before you can commit your changes. This all conveniently configured in your `package.json`.
- [lint-staged](https://github.com/okonet/lint-staged) - Linting makes more sense when running before committing your code. By doing that you can ensure no errors are going into repository and enforce code style. But running a lint process on a whole project is slow and linting results can be irrelevant. Ultimately you only want to lint files that will be committed.

## gRPC Documentation

- gRPC Documentations here

```javascript
const config = {
  httpPort: {
    doc: "The rest port to bind",
    format: "port",
    default: 30007,
    env: "HTTP_PORT",
    sensitive: false,
  },
  grpcPort: {
    doc: "The grpc port to bind",
    format: "port",
    default: 30015,
    env: "GRPC_PORT",
    sensitive: false,
  },
  env: {
    doc: "The application environment",
    format: ["production", "development", "test", "qa", "staging", "local"],
    default: "local",
    env: "NODE_ENV",
    sensitive: false,
  },
};

exports.app = config;
```

## Contributing

This boilerplate is open to suggestions and contributions, documentation contributions are also important! :)

## Acknowledgments

This boilerplate is forked and modified from [node-api-boilerplate](https://github.com/talyssonoc/node-api-boilerplate) - [Talysson de Oliveira Cassiano](https://github.com/talyssonoc) :clap:

## License

MIT License - fork, modify and use however you want.
