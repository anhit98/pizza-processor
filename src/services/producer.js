const Kafka = require("node-rdkafka");
const Joi = require('joi');
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
  status: Joi.string().valid(["submitted", "processed", "delivered", "cancelled"]).required()
 }
const prefix = process.env.CLOUDKARAFKA_TOPIC_PREFIX;
const topic = `${prefix}updateOrder`;
const sendMes = function (req, reply){
  console.log("sfsdf")
const producer = new Kafka.Producer(kafkaConf);

// const maxMessages = 1;

// const genMessage = i => new Buffer(`Kafka example, message number ${i}`);
const status = req.payload.status;
const id = req.params.id;
producer.on("ready", function(arg) {
  console.log(`producer ${arg.name} ready.`);
    producer.produce(topic, -1, new Buffer.from(JSON.stringify({_id: id, status: status})), 2);
});

producer.on("disconnected", function(arg) {
  process.exit();
});

producer.on('event.error', function(err) {
  console.error(err);
  process.exit(1);
});
// producer.on('event.log', function(log) {
//   console.log(log);
// });
producer.connect();
return "Message sent successfully!"
}
module.exports = {
  sendMes, validatePayload
}