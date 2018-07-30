'use strict';

/**
 * db.js
 * db: sqlite3
 */

const sqlite3 = require('sqlite3').verbose();

class Db {
  constructor(file) {
    this.db = new sqlite3.Database(file);
    this.createTable();
  }

  createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS user (
      id integer PRIMARY KEY,
      name text,
      email text UNIQUE,
      user_pass text,
      is_admin integer)`;
    return this.db.run(query);
  }

  selectByEmail(email, callback) {
    const query = `SELECT * FROM user WHERE email = ?`;
    return this.db.get(query, [email], (err, row) => { callback(err, row) });
  }

  insertAdmin(user, callback) {
    const query = `INSERT INTO user (name,email,user_pass,is_admin) VALUES (?,?,?,?)`;
    return this.db.run(query, user, err => { callback(err) });
  }

  selectAll(callback) {
    const query = `SELECT * FROM user`;
    return this.db.all(query, (err, rows) => { callback(err, rows) });
  }

  insert(user, callback) {
    const query = `INSERT INTO user (name,email,user_pass) VALUES (?,?,?)`;
    return this.db.run(query, user, err => { callback(err) });
  }
}

module.exports = Db;
