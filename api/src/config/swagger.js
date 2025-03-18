const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Warrity API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Warrity Warranty Management System',
      contact: {
        name: 'Warrity Support',
        url: 'https://warrity.yourdomain.com/support',
        email: 'support@warrity.yourdomain.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server'
      },
      {
        url: 'https://api.warrity.yourdomain.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  // Path to the API docs
  apis: [
    './src/routes/*.js',
    './src/models/*.js',
    './src/swagger/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Warrity API Documentation'
  }),
  spec: swaggerSpec
};