const bluebird = require('bluebird');
const redis = require('redis');
const { REDIS_PORT } = process.env;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let client;

const connect = () => {
  client = redis.createClient(REDIS_PORT);
};

const getRedisClient = () => {
  return client;
};

module.exports = { connect, getRedisClient };