var open = 0
// define variables that reference elements on our page
//const choiceForm = document.forms[0];
const picPlace = document.getElementById("photo");
const select = document.getElementById("dateSelect");
//const newFieldInput = choiceForm.elements["newField"];
//const newValueInput = choiceForm.elements["newValue"];

// initialise the results lists
let timeList =[];
let fieldList =[];
let dateList=[];
var Plotly
let dateCounts=[];
let uniqueDate=[];
var chosenPic;
//holds the db results
let dbresults;

function hamToX(x) {
    x.classList.toggle("change");
    console.log(open)
    if (open%2==0){
        openNav()
        
    } else{
        closeNav()
        
    }
    open = open +1
}

function openNav(){
    console.log("open nav")
    document.getElementById("myNav").style.width = "50%";
}

function closeNav(){
    console.log("close nav")
    document.getElementById("myNav").style.width = "0%";
}

// listen for the form to be submitted
window.onload = event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  // reset the results section ready for current results
  //resultsList.innerHTML = "";
   
  //alert("here")
  // Call the appropriate handler function
  getAllData()
  choosePhoto()

};

function getAllData(){
  console.log("All Fields handler function")
  //request the data from the database
  let requestMsg = new XMLHttpRequest();
  requestMsg.addEventListener("load",displayAllData);
  requestMsg.open('get', '/getAllData');
  requestMsg.send();
};

function displayAllData(){
  console.log("Display All Fields function");
  // parse our response to convert JSON
  dbresults = JSON.parse(this.responseText);
  //iterate through the results
  dbresults.forEach(function(row){
    console.log(row)
    idList.push(row['id']);
    timeList.push(row['time']);
    dateList.push(row['date']);
  });
  uniqueDate = [...new Set(dateList)];
  console.log(uniqueDate);
  
  for (let i = 0;i < uniqueDate.length; i++){
   let count = 0;
   console.log(uniqueDate,i);
   for (let j = 0;j<dateList.length;j++){
     
     console.log(count,uniqueDate[i],i)
     if (uniqueDate[i] == dateList[j]){
          count = count + 1;
          
     };
   
   };
   dateCounts.push(count)
  };
  console.log(dateCounts);
  drawPlotly()
};

// event-handler functions
function drawPlotly(){
  console.log("drawing graph")
  let dataValues = {
    x:uniqueDate,
    y:dateCounts,
    mode:'lines+markers',
    type:'bar'
  }
  let data = [dataValues];
  let layout={
    title:'Graph',
    autosize: true,
    xaxis:{title:'date'},
    yaxis:{title:'amount of times triggered'}
  };
  //console.log(Plotly)
  
  Plotly.newPlot('plotlyGraph',data,layout);

};
function choosePhoto(){
  nameList = [];
  // parse our response to convert JSON
  dbresults = JSON.parse(this.responseText);
  //iterate through the results
  dbresults.forEach(function(row){
    console.log(row)
    nameList.push(row['date']+row['time'])
  });
  
  for(let i = 0;i<nameList.length;i++){
    var opt = document.createElement("option");
    opt.textContent = nameList[i];
    opt.value = nameList[i];
    select.appendChild(opt)
  }  
};

function showPhoto(){
  pic  = '<iframe src="https://drive.google.com/file/d/' + idList[chosenPic] + '/preview" width="640" height="480" allow="autoplay"></iframe>';
  picPlace.appendChild(pic);

};