var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var fs         = require('fs');
var port       = process.env.PORT || 3000;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(require('./routes'));

// START THE SERVER
// ============================================================================
app.listen(port, function () {
    console.log('Приклад застосунку, який прослуховує 3000-ий порт!');
});