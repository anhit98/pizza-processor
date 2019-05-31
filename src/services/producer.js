const Kafka = require("node-rdkafka");

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

const prefix = process.env.CLOUDKARAFKA_TOPIC_PREFIX;
const topic = `${prefix}.test`;
const producer = new Kafka.Producer(kafkaConf);
const maxMessages = 20;

const genMessage = i => new Buffer(`Kafka example, message number ${i}`);
producer.on('delivery-report', function(err, report) {
  if (err) {
      console.error('Delivery report: Failed sending message ' + JSON.stringify(report));
      console.error(err);
      // We could retry sending the message or store it locally
  } else {
      console.log('Message produced, offset: ' + report.offset);
  }
});
producer.on("ready", function(arg) {
  console.log(`producer ${arg.name} ready.`);
  Buffer.from(JSON.stringify({_id: "id", status: "status"}))
});
// Register delivery report listener

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
