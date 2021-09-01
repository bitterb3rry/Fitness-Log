import barchart from './barchart.js'

let displayData = [
    {
        'date': 1617624000000,
        'value': 3.2,
    },
    {
        'date': 1617710400000,
        'value': 4.5,
    },
    {
        'date': 1617796800000,
        'value': 0,
    },
    {
        'date': 1617883200000,
        'value': 1.2,
    },
    {
        'date': 1617969600000,
        'value': 3.4,
    },
    {
        'date': 1618056000000,
        'value': 5.4,
    },
    {
        'date': 1618142400000,
        'value': 3,
    },
]

let go = document.getElementById("goButton");
go.addEventListener("click", getPastActivityLog);

// weekEndingDate is a date in milliseconds
// data is a list of entries from the database
/*
  builds a chart using barchart functions from given data
*/
function buildChartDataArray(weekEndingDate, data) {
  let oneDay = 86400000; 
  let chartData = displayData;
  let lastDate = weekEndingDate;

  //console.log("building chart for week ending in: ", new Date(weekEndingDate));

  // starting from the last day of the week
  for (let i = 6; i >= 0; i--) {
    chartData[i].date = lastDate;
    //console.log("bar date: ", new Date(lastDate));
    chartData[i].value = 0;

    //console.log("data: ", data)
    //console.log("datalength: ", data.data.length)

    // find matching data for the date
    if (data.data.length != 0) {
      for (let j = 0; j < data.data.length; j++) {
        if (data.data[j].date == lastDate) {
          chartData[i].value = data.data[j].amount;
          console.log("amount: ", data.data[j].amount);
        }
      }
    }

    // moving on to the previous day
    lastDate -= oneDay;
  }

  console.log("chartData: ", chartData)
  return chartData;
}

/*
  date in milliseconds
  activity of the data
  GET request to get all the data needed for the week ending in the user requested date for a certain activity
*/
function getPastActivityLog() {
  let activity = document.getElementById("viewActivityFor");
  let dateIn = document.getElementById("weekEndingDate");

  let dateMil = new Date(reformat_date(dateIn.value)).getTime();
  let todayMil = new Date(new Date().toLocaleDateString()).getTime();

  console.log("inputted date: ", dateIn.value);
  console.log("milliseconds of inputted date: ", dateMil);
  console.log(dateMil, ">=", todayMil);
  //console.log(new Date(dateMil).toLocaleDateString() >= new Date().toLocaleDateString());
  // check if the requested week is is to0 late
  // 
  if (dateMil >= todayMil) {
    alert("This week has not ended yet. Please enter a past week.")
    return -1;
  } else {
    let fetchurl = '/week?date=' + dateMil.toString() + '&activity=' + activity.value;
    //console.log(dateMil);
    fetch(fetchurl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log('getPastActivityLog Success:', data);
        if (data.data.length == 0) { // debuggin purpose
          console.log("We didn't find anything for this week");
        }
        // build and display chart with data from response
        // an array of data with 0's will be built in case no data is found
        displayData = buildChartDataArray(dateMil, data);
        //console.log("new displayData: ", displayData);
        barchart.render(displayData);
      })
      .catch((error) => {
      console.log("getPastActivityLog Error: ", error);
    })
  }
}

export default displayData;