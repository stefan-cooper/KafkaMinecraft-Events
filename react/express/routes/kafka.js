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
let deathNotifs = []
let disconnectNotifs = []
let chatNotifs = []
consumer.connect()
consumer.subscribe({ topic: 'motion' })
consumer.subscribe({ topic: 'login' })
consumer.subscribe({ topic: 'ring' })
consumer.subscribe({ topic: 'death' })
consumer.subscribe({ topic: 'disconnect' })
consumer.subscribe({ topic: 'chat' })
consumer.run({ eachMessage: async ({ topic, partition, message }) => { 
  console.log(topic, message)
  if (topic === 'motion') motionNotifs.push({value: message.value.toString(), time: new Date().getTime()}); 
  else if (topic === 'login') loginNotifs.push({value:message.value.toString(), time: new Date().getTime()});
  else if (topic === 'ring') ringNotifs.push({value: message.value.toString(), time: new Date().getTime()});
  else if (topic === 'death') deathNotifs.push({value:message.value.toString(), time: new Date().getTime()});
  else if (topic === 'disconnect') disconnectNotifs.push({value: message.value.toString(), time: new Date().getTime()});
  else if (topic === 'chat') chatNotifs.push({value:message.value.toString(), time: new Date().getTime()});
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

router.get("/kafka_death", (req, res) => {
  if (req.query.time) {
    res.json(deathNotifs.filter(notif => notif.time > req.query.time).map(notif => notif.value))
  } else {
    res.sendStatus(400)
  }
});

router.get("/kafka_disconnect", (req, res) => {
  if (req.query.time) {
    res.json(disconnectNotifs.filter(notif => notif.time > req.query.time).map(notif => notif.value))
  } else {
    res.sendStatus(400)
  }
});

router.get("/kafka_chat", (req, res) => {
  if (req.query.time) {
    res.json(chatNotifs.filter(notif => notif.time > req.query.time).map(notif => notif.value))
  } else {
    res.sendStatus(400)
  }
});

module.exports = router;
