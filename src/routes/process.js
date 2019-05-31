
const service = require('../services/producer.js');
const Joi = require('joi');

module.exports =[ 
  {

    method: 'POST',
    path: '/process/{id}',
    config: {
      tags: ['api'],
      handler: service.sendMes,
      validate: {
        params: {
            id: Joi.string().min(3).max(50),
        },
        payload: service.validatePayload
    },
        cors: {
          origin: ['*']
      }
    }
  }
]
