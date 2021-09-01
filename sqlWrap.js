'use strict'

const sql = require('sqlite3');
const util = require('util');


// old-fashioned database creation code 

// creates a new database object, not a 
// new database. 
const db = new sql.Database("./activities.db");
//const userdb = new sql.Database("./user.db");

// check if database exists
let cmd = " SELECT name FROM sqlite_master WHERE type='table' ";

/* let cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='ActivityTable' "; */

/* let cmd2 = " SELECT name FROM sqlite_master WHERE type='table' AND name='ProfileTable' " */

db.get(cmd, function (err, val) {
  if (val == undefined) {
        console.log("No database file - creating one");
        createActivityTable();
        createProfileTable();
        console.log("ActivityTable and ProfileTable created");
  } else {
        console.log("Database file found");
        //createActivityTable();
        //test();
  }
});

/* async function test() {
  let result = await db.run("select * from ActivityTable");
  console.log("db.run result: ", result);
} */

/* db.get(cmd2, function (err, val) {
  if (val == undefined) {
    console.log("No user database file - creating one");
    createProfileTable();
  } else {
    console.log("User database file found");
  }
}); */

// called to create table if needed
function createActivityTable() {
  // explicitly declaring the rowIdNum protects rowids from changing if the 
  // table is compacted; not an issue here, but good practice
  const cmd = 'CREATE TABLE ActivityTable (rowIdNum INTEGER PRIMARY KEY, userId TEXT, activity TEXT, date INTEGER, amount FLOAT)';
  db.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
  });
}

function createProfileTable() {
  const cmd = 'CREATE TABLE ProfileTable (userId TEXT, givenName TEXT)';

  db.run(cmd, function(err, val) {
    if (err) {
      console.log("User database creation failure",err.message);
    } else {
      console.log("Created user database");
    }
  });
}

// wrap all database commands in promises
db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

/* userdb.run = util.promisify(userdb.run);
userdb.get = util.promisify(userdb.get);
userdb.all = util.promisify(userdb.all); */

// empty all data from db
db.deleteEverything = async function() {
  await db.run("delete from ActivityTable");
  db.run("vacuum");
}

// allow code in index.js to use the db object
module.exports = db;
//module.exports = userdb;