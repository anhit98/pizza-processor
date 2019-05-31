const Kafka = require("node-rdkafka");
const Joi = require('joi');

const kafkaConf = {
  "group.id": "cloudkarafka-example",
  "metadata.broker.list": process.env.CLOUDKARAFKA_BROKERS.split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSl",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": process.env.CLOUDKARAFKA_USERNAME,
  "sasl.password": process.env.CLOUDKARAFKA_PASSWORD
};
const prefix = process.env.CLOUDKARAFKA_TOPIC_PREFIX;
const topics = `${prefix}.updateStatus`;
console.log(topics)

// Connect to the broker manually

const validatePayload = {
  status: Joi.string().max(100).required()
 } 
 const sendMes = function(req, reply){
  const producer = new Kafka.Producer(kafkaConf);
  producer.connect();
   const id = req.params.id;
   const status = req.payload.status;

// Wait for the ready event before proceeding
producer.on('ready', function() {
  try {
    producer.produce(
      // Topic to send the message to
      topics,
      // optionally we can manually specify a partition for the message
      // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
      -1,
      // Message to send. Must be a buffer
      Buffer.from(JSON.stringify({_id: id, status: status}))
    );
    // console.error({_id: id, status: status});
  } catch (err) {
    console.error('A problem occurred when sending our message');
    console.error(err);
  }

});

// Any errors we encounter, including connection errors
producer.on('event.error', function(err) {
  console.error('Error from producer');
  console.error(err);
})

return null;
 }
 module.exports = {
  sendMes,
  validatePayload
 }
