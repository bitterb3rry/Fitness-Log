let currentReminderDate;

/* let clearDB = document.getElementById("clearDBButton");
clearDB.addEventListener("click", clearData); */

let bar =  document.getElementById("reminderHide");

let yes = document.getElementById("yesButton");
yes.addEventListener("click", activateYesButton);

let no = document.getElementById("noButton");
no.addEventListener("click", closeBar);

fetch('/reminder', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
})
.then(response => response.json())
.then(data => {
  console.log('Reminder Success:', data);

  // get the index of the database where the most recent future plan is
  let entryIn = getRecentFutureActivity(data);
  

  if (entryIn != -1) {
    // show reminder bar
    bar.style.display = "block";

    // building reminder question
    let insertVerb = document.getElementById("reminderVerb");
    let insertAct = document.getElementById("reminderActivity");
    let insertDay = document.getElementById("reminderDay");

    let currentReminderActivity = data.data[entryIn].activity;
    
    insertVerb.textContent = getVerb(currentReminderActivity);

    insertAct.textContent = currentReminderActivity;
    
    currentReminderDate = data.data[entryIn].date;
    console.log("date of the current reminder: ", new Date(currentReminderDate));
    insertDay.textContent = dayOfWeek(new Date(currentReminderDate));

    removeOldFutureActivities(currentReminderDate);
  } else {
    // report to brower (for testing purposes) no reminder to be made
    console.log("there is no reminder to be made");
  }
})
.catch((error) => {
  console.log("there is no reminder to be made", error);
});

/* fetch for username */
fetch('/name', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
})
.then(response => response.json())
.then(data => {
  let username = document.getElementById("username");
  username.textContent = data.data;
  console.log("data.data:  ", data.data);
})
.catch((error) => {
  console.log("/name error: ", error);
});

/* when user answers yes to reminder, the database is updated and the bar goes away */
function activateYesButton() {
  removeCurrentReminder(currentReminderDate);
  closeBar();
  add_past_activity_onclick();
}

function closeBar() {
  bar.style.display = "none";
}

function getVerb(activity) {
  if (activity == 'Yoga') {
    return 'do';
  } else if (activity == 'Soccer' || activity == 'Basketball') {
    return 'play';
  } else {
    return '';
  }
}

/*
  finds the most recent relevant past activity
  returns -1 if the most recent date is invalid
*/
function getRecentFutureActivity(actDB) {
  let today = new Date().toLocaleDateString();
  let todayMil = new Date(today).getTime();
  
  let mostRecentDate = 0;
  let mostRecentEntry = 0;
  
  for (let i=0; i<actDB.data.length; i++) {
      // if data entry is !>= to today's date and that its more recent than the one we have on record so far
      console.log("this future plan logged for ", new Date(actDB.data[i].date));
      // make sure this date can be a recent past future plan
      if (actDB.data[i].date != todayMil && actDB.data[i].date < todayMil) {
        // check if we a record yet so we can make a comparison
        if (mostRecentDate != 0) {
            if ( actDB.data[i].date > mostRecentDate) {
              // update max date and the index of that entry
              mostRecentDate = actDB.data[i].date;
              mostRecentEntry = i;
            }
        } else { // no record, record
          mostRecentDate = actDB.data[i].date;
          mostRecentEntry = i;
        }
      } 
  }

  // error checking make sure the most recent date not more than 7 days ago
  if ( new Date() - new Date(mostRecentDate) > 604800000
        || mostRecentDate == 0 ) {
    return -1;
  } else {
    console.log("date: ", mostRecentDate, " entry: ", mostRecentEntry);
    return mostRecentEntry;
  }
}

/* 
  compares current date and another date 
  returns 'yesterday' or a day of the week
  takes in a js data object
*/
function dayOfWeek(date) {
  let today = new Date().getDay();
  let diff = today-date.getDay();

  if (diff == 1 || diff == -6) {
    return 'yesterday';
  } else {
    switch(date.getDay()) {
    case 0:
      return 'on Sunday'
    case 1:
      return 'on Monday';
    case 2: 
      return 'on Tuesday';
    case 3:
      return 'on Wednesday';
    case 4:
      return 'on Thursday';
    case 5:
      return 'on Friday';
    case 6:
      return 'on Saturday';
    }
  }
}

/* 
  POST request to remove future log activies that anymore older than the most recent
*/
function removeOldFutureActivities(date) {
  fetch(`/oldFutureRemoval`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([date]) // most recent date
  }).then(
    console.log('removeOldFutureActivities Success:')
  ).catch((error) => {
    console.error('removeOldFutureActivities Error:', error);
  });
}

/* 
  POST request to update database after user clicks 'yes' on the reminder bar
*/
function removeCurrentReminder(date) {
  fetch(`/removeCurrentMostRecent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([date]) // most recent date
  }).then(
    console.log('Most recent reminder Success:')
  ).catch((error) => {
    console.error('Most recent reminder Error:', error);
  });
}

/*
  POST request to clear the database for testing purposes
*/
function clearData() {
  fetch(`/clear`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(
    console.log('Clear DB Success')
  )
  .catch((error) => {
    console.error('Clear DB Error:', error);
  });
}