const { perf_map_v2 } = require('../config/flags');

module.exports = function mapTiming(req, res, next) {
  if (!perf_map_v2) return next();
  const reqId = Math.random().toString(36).slice(2);
  req.reqId = reqId;
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const totalMs = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(`[mapTiming] reqId=${reqId} path=${req.originalUrl} totalMs=${totalMs.toFixed(1)} params=${JSON.stringify(req.query)}`);
  });
  next();
};
