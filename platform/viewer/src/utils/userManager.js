import axios from 'axios';

class UserManager {
  constructor(settings = {}) {
    this._settings = settings;
  }

  get settings() {
    return this._settings;
  }
}

export default UserManager;
