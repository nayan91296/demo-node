var http = require('http'); 
var express = require('express')
var app = express()
const userRoute=require('./routes/index')
var bodyParser = require('body-parser')
const sequelize = require('./config/database');

app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use("/user",userRoute)

app.listen(5000, async ()  => {
  console.log(`Server listening on port 5000`)
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})

