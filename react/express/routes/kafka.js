const { Router } = require("express");
const { Kafka } = require('kafkajs')
const router = Router();

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: Math.random().toString() })
let motionNotifs = []
let loginNotifs = []
let ringNotifs = []
consumer.connect()
consumer.subscribe({ topic: 'motion' })
consumer.subscribe({ topic: 'login' })
consumer.subscribe({ topic: 'ring' })
consumer.run({ eachMessage: async ({ topic, partition, message }) => { 
  console.log(topic)
  if (topic === 'motion') motionNotifs.push({value: message.value.toString(), time: new Date().getTime()}); 
  else if (topic === 'login') loginNotifs.push({value:message.value.toString(), time: new Date().getTime()});
  else if (topic === 'ring') ringNotifs.push({value:message.value.toString(), time: new Date().getTime()});
  return true } 
})

router.get("/kafka_motion", (req, res) => {
  if (req.query.time) {
    res.json(motionNotifs.filter(notif => notif.time > req.query.time).map(notif => notif.value))
  } else {
    res.sendStatus(400)
  }
});

router.get("/kafka_login", (req, res) => {
  if (req.query.time) {
    res.json(loginNotifs.filter(notif => notif.time > req.query.time).map(notif => notif.value))
  } else {
    res.sendStatus(400)
  }
});

router.get("/kafka_ring", (req, res) => {
  if (req.query.time) {
    res.json(ringNotifs.filter(notif => notif.time > req.query.time).map(notif => notif.value))
  } else {
    res.sendStatus(400)
  }
});

module.exports = router;
