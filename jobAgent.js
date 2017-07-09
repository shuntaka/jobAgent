import amqp from 'amqplib';

const MQExchange = 'jobExchange';
const bindKey = '101'

let channel;
let queue;

amqp.connect('amqp://localhost')
  .then(conn => conn.createChannel())
  .then((ch) => {
    channel = ch;
    return channel.assertExchange(MQExchange, 'direct', { durable: true });
  })
  .then(() => channel.assertQueue('', { exclusive: true }))
  .then((q) => {
    queue = q.queue;
    channel.bindQueue(queue, MQExchange, bindKey);
  })
  .then(() => channel.consume(queue, (msg) => {
    if (msg !== null) {
      console.log(msg.content.toString());
      channel.ack(msg);
    }
  }));
