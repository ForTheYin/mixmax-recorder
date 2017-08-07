// Abstract persistence class. Implement this class if you want to use a custom persistence.
class AbstractPersistence {
  constructor(callback) {
    if (new.target === AbstractPersistence) {
      throw AssertionError('AbstractPersistence is an abstract class. Cannot construct abstract instances.');
    }
  }

  insert(tag, file, callback) {
    throw AssertionError('Method insert(tag, file, callback) must be implemented.');
  }

  find(tag, callback) {
    throw AssertionError('Method find(tag, callback) must be implemented.');
  }

  remove(tag, callback) {
    throw AssertionError('Method remove(tag, callback) must be implemented.');
  }
}

module.exports = AbstractPersistence;
