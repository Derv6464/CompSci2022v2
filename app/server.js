// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.static("views"));
// init sqlite db
const dbFile = "./database2.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

//handler functions
app.get("/getAllData",(request,response)=>{
  console.log("calling getAlldata on the server")
  db.all("SELECT * FROM pics;",(err,rows)=>{
    response.send(JSON.stringify(rows));
    console.log(rows)
  });
});



// endpoint to add a dream to the database
app.post("/addData", (request, response) => {
  console.log(`add to data ${request.body}`);

  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
    const cleansedField = cleanseString(request.body.field);
    const cleansedValue = cleanseString(request.body.value);
    console.log(cleansedField)
    console.log(cleansedValue)
    db.run(`INSERT INTO pics (time,date) VALUES (?,?)`, [cleansedField,cleansedValue], error => {
      if (error) {
        console.log(error)
        response.send({ message: "error!" });
      } else {
        response.send({ message: "success" });
      }
    });
  }
});

// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

