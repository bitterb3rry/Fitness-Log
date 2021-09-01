'use strict'

// using a Promises-wrapped version of sqlite3
const db = require('./sqlWrap.js');

// SQL commands for ActivityTable
const insertDB = "insert into ActivityTable (userId, activity, date, amount) values (?, ?,?,?)"
const allDB = "select * from ActivityTable";
const amountDB = "select * from ActivityTable where userId = ? and amount = ?";
const deleteOneDB = "delete from ActivityTable where userId = ? and date = ? and amount = -1"
const deleteAllDateDB = "delete from ActivityTable where userId = ? and date = ? and amount = -1"

const pastActivityDB = "select * from ActivityTable where userId = ? and activity = ? and amount != ?";

async function testDB () {

  // for testing, always use today's date
  const today = new Date().getTime();

  // all DB commands are called using await

  // empty out database - probably you don't want to do this in your program
  await db.deleteEverything();

  // call it in index.js and use then and catch
  await db.run(insertDB,["running",today,2.4]);
  await db.run(insertDB,["walking",today,1.1]);
  await db.run(insertDB,["walking",today,2.7]);
  
  console.log("inserted two items");

  // look at the item we just inserted
  let result = await db.get(getOneDB,["running",today,2.4]);
  console.log(result);

  // get multiple items as a list
  result = await db.all(allDB,["walking"]);
  console.log(result);
}

async function clearDB () {
  await db.deleteEverything();
}

async function insertItem(dataList) {
  console.log("\n------------------\n! in insertItem !");

  // insert data into database
  await db.run(insertDB, dataList);

  console.log("inserted one item");

  let result = await db.all(allDB);
  console.log("\n------------------\nall results: ", result);

}

/* takes in the userid */
async function getAmount(id) {
  //console.log("before amount");
  
  let amount = await db.all(amountDB,[id, -1]); // list of all future plans
  //console.log("after amount");
  //console.log("amount result: ", amount);
  return amount;
}

// removes all past future logs up to and excluding the most recent date
// mostRecent is in milliseconds
async function removeOldFuture(mostRecent, id) {
  let database = await db.all(allDB);
  for (let i=0; i<database.length; i++) {
    if(database[i].date < mostRecent) {
      // delete all from the table that matches this date
      console.log("current entry: ", database[i]);
      await db.all(deleteOneDB, [id, database[i].date])
    }
  }

  console.log("what's left: ");
  console.log(await db.all(allDB));
}

// removes record of current reminder when user says yes and they complete the task
// rename to remove current most recent
async function removeCurrentMostRecent(mostRecent, id) {
  await db.all(deleteAllDateDB, [id, mostRecent]);
}

// returns all past entries associated with a given activity and week (given the date milliseconds)
async function getPastActivity(activity, date, id) {

  let validData = [];

  // turn the string of milliseconds into an int
  let requestedDate = new Date(parseInt(date));
  
  let data = await db.all(pastActivityDB, [id, activity, -1]);
  console.log("all past logs", data);

  for (let i=0; i<data.length; i++) {
    let entryDate = new Date(data[i].date);
    //console.log("entryDate: ", entryDate)
    //console.log("requestedDate: ", requestedDate)
    //console.log("entryDate-requestedDate: ", (requestedDate-entryDate))
    //console.log(entryDate <= requestedDate, " ", requestedDate - entryDate < 604800000)
    if (entryDate <= requestedDate && (requestedDate - entryDate) < 604800000 ) {
      validData.push(data[i]);
    }
  }

  console.log("valid data:", validData)
  return validData;
}

async function printAll() {
  console.log(await db.all(allDB));
}

module.exports.testDB = testDB;
module.exports.clearDB = clearDB;
module.exports.printAll = printAll;

module.exports.insertItem = insertItem;
module.exports.getAmount = getAmount;
module.exports.removeOldFuture = removeOldFuture;
module.exports.removeCurrentMostRecent = removeCurrentMostRecent;

module.exports.getPastActivity = getPastActivity;