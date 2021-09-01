/* let testerButton = document.getElementById("testerButton");
testerButton.addEventListener("click", printWholeDB); */

let openChart = document.getElementById('viewProgButton');
openChart.addEventListener('click', displayChart);

let closeChart = document.getElementById('exitButton');
closeChart.addEventListener('click', noShowChart);

let overlay = document.getElementById('overlayTransparent');

/* 
  show overlay for chart 
*/
function displayChart() {
  overlay.className = 'overlayShowing';
}

/*
  hides overlay for chart and resets the date input box
*/
function noShowChart() {
  overlay.className = 'overlayHidden';
  document.getElementById("weekEndingDate").value = "mm/dd/yyyy";
}