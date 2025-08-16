const { perf_map_v2 } = require('../config/flags');
let client = null;

if (perf_map_v2) {
  const redis = require('redis');
  client = redis.createClient({ url: process.env.REDIS_URL });
  client.on('error', err => console.error('Redis error', err));
  client.connect().catch(err => console.error('Redis connection error', err));
}

module.exports = client;
