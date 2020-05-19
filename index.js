require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { connect, getRedisClient } = require('./redisConnect');
const { getRatesFromCache, getRates } = require('./rates');
const { getMdmDataFromCache, getMdmData } = require('./mdm');

const { SERVER_PORT } = process.env;

connect();

const app = express();
app.use(bodyParser.json());

app.get('/get-services-prices-and-availability', [getRatesFromCache, getRates]);

app.post('/mdm', [getMdmDataFromCache, getMdmData]);

app.get('/flush', (req, res) => {
  getRedisClient().flushall(() => {
    res.json({});
  })
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is ready on port ${SERVER_PORT}`);
});