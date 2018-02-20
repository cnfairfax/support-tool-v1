const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cors = require('./helpers/cors');
const monConfig = require('./helpers/mongo/config');

mongoose.connect(monConfig.uri);

var db = mongoose.connection;
    
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to Mongo');
});   


// Open up CORS
app.use(cors);
    
// Set up request body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./routes')(app);

app.listen(8082, console.log('listening on port 8082'));