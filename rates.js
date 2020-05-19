const axios = require('axios');
const md5 = require('md5');
const qs = require('qs');

const { getRedisClient } = require('./redisConnect');

const { RATE_BASE_URL, TTL } = process.env;

const getRatesFromCache = async (req, res, next) => {
  const queryString = qs.stringify(req.query);
  try {
    const data = await getRedisClient().getAsync(md5(queryString));
    if (data) {
      res.json(JSON.parse(data));
      return;
    }
  } catch (err) {
    console.error(err);
  }
  next();
};

const getRates = async (req, res) => {
  try {
    const queryString = qs.stringify(req.query);
    const { data } = await axios.get(`${RATE_BASE_URL}/get-services-prices-and-availability?${queryString}`);
    try {
      await getRedisClient().setexAsync(md5(queryString), TTL, JSON.stringify(data));
    } catch (err) {
      console.log("Failed setting data to cache");
      console.error(err);
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

module.exports = {
  getRatesFromCache,
  getRates
};