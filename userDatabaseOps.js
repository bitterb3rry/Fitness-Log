'use strict'

// using a Promises-wrapped version of sqlite3
const userdb = require('./sqlWrap.js');

const insertUserDB = "insert into ProfileTable (userId, givenName) values (?, ?)";
const allUserDB = "select * from ProfileTable";
const findUserId = "select * from ProfileTable where userId = ?";

async function insertUserInfo(id, name) {
  console.log("\n------------------\n! in insertItem !");

  let user = await userdb.get(findUserId, [id]);
  console.log("user result: ", user);

  if (user == undefined) {
    await userdb.run(insertUserDB, [id, name]);
  }

  let result = await userdb.all(allUserDB);
  console.log("\n------------------\nall results: ", result);
}

async function getUsername(id) {
  let username = await userdb.get(findUserId, [id]);
  //console.log("id parameter: ", id);
  console.log("username in udo ", username);
  return username.givenName;
}

module.exports.insertUserInfo = insertUserInfo;
module.exports.getUsername = getUsername;