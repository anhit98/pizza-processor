    
const Kafka = require("node-rdkafka");
const Joi = require('joi');
const Boom = require('boom');
require('dotenv').config();
const kafkaConf = {
  "group.id": "cloudkarafka-example",
  "metadata.broker.list": process.env.CLOUDKARAFKA_BROKERS.split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": process.env.CLOUDKARAFKA_USERNAME,
  "sasl.password": process.env.CLOUDKARAFKA_PASSWORD,
  "debug": "generic,broker,security"
};


const validatePayload = {
    status: Joi.string().valid(["submitted", "processed", "delivered", "cancelled"]).required(),
  }
const sendMes = function(req, reply){
    return new Promise(function(resolve, reject) {
    try {
        const prefix = process.env.CLOUDKARAFKA_TOPIC_PREFIX;
        const topic = `${prefix}.updateOrderStatus`;
        const producer = new Kafka.Producer(kafkaConf);
        
        const sentMessage ={
            id: req.params.id,
            status: req.payload.status
        };

        producer.on("ready", function(arg) {
          console.log(`producer ${arg.name} ready.`);
            producer.produce(topic, -1, sentMessage);
          setTimeout(() => producer.disconnect(), 0);
        });
        
        producer.on("disconnected", function(arg) {
          process.exit();
        });
        
        producer.on('event.error', function(err) {
          throw Boom.badRequest(err);
          process.exit(1);
        });
        producer.on('event.log', function(log) {
          console.log(log);
        });
        producer.connect();
    }
    catch(e) {
    console.log(e);
    }
});
}

module.exports = {
    sendMes,
    validatePayload
  }