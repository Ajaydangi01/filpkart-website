const http = require('http');
const cors = require("cors")
const express = require('express');
const route = require('./routes/routes');
const { userRouter, addressRouter, sellerProRouter, productRouter } = require("./middleware/routefile")
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { logger } = require('./shared/logger');
const { connection } = require('./config/db');
const app = express();
const { port, host } = require('./config/index');
const hbs = require('hbs');
app.use(cors('*'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

const option = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ECOMMERCE WEBSITE',
      version: '1.0.0',
      description: 'Ecommerce Project Apis',
    },
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
    servers: [
      {
        url: `http://${host}:${port}`,
      },
    ],
  },
  apis: [`${__dirname}/routes/*.js`],
};
app.use('/', route, userRouter, addressRouter, sellerProRouter, productRouter);

const specs = swaggerJsDoc(option);
app.use('/createApi', swaggerUI.serve, swaggerUI.setup(specs));

app.use(function (req, res) {
  var err = new Error('Not Found');
  res.status(404).json({ status: 404, message: err.message });
});


connection()
  .then((data) => {
    app.listen(port, () => {
      logger.info(`connection successfull ${host}:${port}`);
      logger.info('Database connected');
    });
  })
  .catch(() => {
    logger.info('Database not connected');
  });
