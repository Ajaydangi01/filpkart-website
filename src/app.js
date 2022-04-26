const cors = require("cors")
const express = require('express');
const route = require('./routes/routes');
const rateLimit = require('express-rate-limit');
const { userRouter, addressRouter, sellerProRouter, productRouter, cartRouter, orderRouter, reviewRouter } = require("./middleware/routefile")
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { logger } = require('./shared/logger');
const { connection } = require('./config/db');
const app = express();
const { port, host } = require('./config/index');
const hbs = require('hbs');

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200
}

// app.use(cors(corsOptions));
app.use(cors('*'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// const createAccountLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 hour
//   max: 15,
//   message: 'Too many attempts , try again after 1 hour"',
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false
// })
//  res.status(400).json({ status: 400, message: " success: false })

// app.use(createAccountLimiter)
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
app.use('/', route);
app.use('/', userRouter);
app.use('/', addressRouter);
app.use('/', sellerProRouter);
app.use('/', productRouter);
app.use('/', cartRouter);
app.use('/', orderRouter);
app.use('/', reviewRouter);



const specs = swaggerJsDoc(option);
app.use('/apiDoc', swaggerUI.serve, swaggerUI.setup(specs));

app.use(function (req, res) {
  var err = new Error('Not Found');
  res.status(404).json({ status: 404, message: err.message });
});


connection()
  .then(() => {
    app.listen(port, () => {
      logger.info('Connected to database');
    });
  })
  .catch(() => {
    logger.info('Database not connected');
  });



  // const random = Math.floor(Math.random()*(6-3)+3)
  // console.log(random)




