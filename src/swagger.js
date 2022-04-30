const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
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

const specs = swaggerJsDoc(option);
app.use('/apiDoc', swaggerUI.serve, swaggerUI.setup(specs));