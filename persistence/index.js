const LokiPersistence = require('./loki_strategy');


// Use the Loki persistence strategy
const strategy = new LokiPersistence();
module.exports = strategy;
