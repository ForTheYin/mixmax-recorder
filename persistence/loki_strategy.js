const Loki = require('lokijs');
const DB_NAME = 'localdb.json';
const COLLECTION_NAME = 'files';

class LokiPersistence {
  constructor(callback) {
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
    const result = this.collection.find({ tag });

    callback(result);
    return result;
  }

  remove(tag, callback) {
    callback = callback || (() => {});
    const result = this.collection.findAndRemove({ tag });

    callback(result);
    return result;
  }
}

module.exports = LokiPersistence;
