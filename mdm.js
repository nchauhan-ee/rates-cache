const md5 = require('md5');
const axios = require('axios');
const { getRedisClient } = require('./redisConnect');

const { MDM_BASE_URL, TTL } = process.env;

const getMdmDataFromCache = async (req, res, next) => {
  try {
    const data = await getRedisClient().getAsync(md5(JSON.stringify(req.body)));
    if (data) {
      res.json(JSON.parse(data));
      return;
    }
  } catch (err) {
    console.error(err);
  }
  next();
};

const getMdmData = async (req, res) => {
  try {
    const body = req.body;
    const token = req.headers.authorization;
    const { data } = await axios.post(MDM_BASE_URL, body, {
      headers: {
        authorization: token,
      }
    });
    try {
      await getRedisClient().setexAsync(md5(JSON.stringify(body)), TTL, JSON.stringify(data));
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
  getMdmDataFromCache,
  getMdmData
};