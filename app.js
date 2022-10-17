const express = require('express');
const expresslayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');

const mysql = require('mysql');
const con = require('./models/db');

const bodyParser = require('body-parser');

const app = express();
const PORT = 1337;

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))

app.use(expresslayouts);
app.set('view engine', 'ejs')

app.use(bodyParser.json()) //NEW
app.use(bodyParser.urlencoded({ extended: true })); //NEW 

app.use('/', indexRouter)

app.listen(PORT, () => console.log("listening on port: " + PORT));
if (process.env.NODE_ENV === 'production')
    console.log('PRODCUTION MODE')
else
    console.log('DEVELOPEMENT MODE')