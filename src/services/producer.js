    
const Kafka = require("node-rdkafka");
const Joi = require('joi');
const Boom = require('boom');
require('dotenv').config();
const kafkaConf = {
  "group.id": "cloudkarafka-example",
  "metadata.broker.list": process.env.CLOUDKARAFKA_BROKERS.split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_PLAINTEXT",
  "sasl.mechanisms": "PLAIN",
  "sasl.username": "anhngocdo3061998@gmail.com",
  "sasl.password": "doanh@12057",
  "debug": "generic,broker,security"
};
// console.log(kafkaConf)
const prefix = process.env.CLOUDKARAFKA_TOPIC_PREFIX;
const topic = `${prefix}.updateOrderStatus`;
const producer = new Kafka.Producer(kafkaConf);
const validatePayload = {
    status: Joi.string().valid(["submitted", "processed", "delivered", "cancelled"]).required(),
  }
const sendMes = function(req, reply){
    return new Promise(function(resolve, reject) {
      const prefix = process.env.CLOUDKARAFKA_TOPIC_PREFIX;
      const topic = `${prefix}.test`;
      const producer = new Kafka.Producer(kafkaConf);
      const maxMessages = 20;
      
      const genMessage = i => new Buffer(`Kafka example, message number ${i}`);
      
      producer.on("ready", function(arg) {
        console.log(`producer ${arg.name} ready.`);
        for (var i = 0; i < maxMessages; i++) {
          producer.produce(topic, -1, genMessage(i), i);
        }
        setTimeout(() => producer.disconnect(), 0);
      });
      
      producer.on("disconnected", function(arg) {
        process.exit();
      });
      
      producer.on('event.error', function(err) {
        console.error(err);
        process.exit(1);
      });
      producer.on('event.log', function(log) {
        console.log(log);
      });
      producer.connect();
});
}

module.exports = {
    sendMes,
    validatePayload
  }