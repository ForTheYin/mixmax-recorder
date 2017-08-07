const AbstractPersistence = require('./abstract_strategy.js');
const Loki = require('lokijs');

const DB_NAME = 'local';
const COLLECTION_NAME = 'files';


// Stores the audio files in memory using LokiJS
class LokiPersistence extends AbstractPersistence {
  constructor(callback) {
    super();

    callback = callback || (() => {});
    this.db = new Loki(DB_NAME);
    this.collection = this.db.getCollection(COLLECTION_NAME) || this.db.addCollection(COLLECTION_NAME);

    callback(this);
    return this;
  }

  insert(tag, file, callback) {
    callback = callback || (() => {});
    const result = this.collection.insert({ tag, file });

    callback(result);
    return result;
  }

  find(tag, callback) {
    callback = callback || (() => {});
    const results = this.collection.find({ tag });
    if (results && results.length == 1) {
      callback(results[0]);
      return results[0]
    } else if (results && results.length > 1) {
      throw AssertionError('Multiple entries found for tag ' + tag);
    }

    callback();
  }

  remove(tag, callback) {
    callback = callback || (() => {});
    const result = this.collection.findAndRemove({ tag });

    callback(result);
    return result;
  }
}

module.exports = LokiPersistence;
