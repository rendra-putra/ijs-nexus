// src/models/userModel.js

export default class UserModel {
  constructor({ id, username, fullname, roles = [] }) {
    this.id = id;
    this.username = username;
    this.fullname = fullname;
    this.roles = roles;
  }

  // Optional: helper to check role
  hasRole(role) {
    return this.roles.includes(role);
  }

  // Optional: convert from decoded JWT payload
  static fromJwt(decoded) {
    return new UserModel({
      id: decoded.id,
      username: decoded.username,
      fullname: decoded.fullname,
      roles: decoded.authorities?.map(a => a.authority) || []
    });
  }
}
