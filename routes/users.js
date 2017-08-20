var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var fs         = require('fs');
var router     = express.Router();
var bcrypt     = require('bcrypt');

const saltRounds = 10;



app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function  isUserInStorage(id, arrOfUsers){
    var inStorage = false;
    for (var i = 0; i < arrOfUsers.length; i++) {
        if(arrOfUsers[i].id === id){
            inStorage  = true;
        }
    }
    return inStorage;
}

function getUserById(id, users) {
    for (var i = 0; i < users.length; i++) {
        if(users[i].id === id){
            return users[i];
        }
    }
}

router.route('/')

    .get(function (req, res) {
        fs.readFile('storage.data', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            var  users = JSON.parse(data);
            console.log(users);
            var dataToShow = users;
            for (var i = 0; i < dataToShow.length; i++) {
                delete dataToShow[i].password;
            }
            if(dataToShow.length ===0) {
                console.log('arr is empty')
            }
            res.send(JSON.stringify(dataToShow, null, 2));
        });

    })

    .post(function (req, res) {
        var _id =  parseInt(req.body.id, 10),
            _username = req.body.username,
            _email = req.body.email,
            _password = req.body.password;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(_password, salt, function(err, hash) {
                fs.readFile('storage.data', 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    var users = JSON.parse(data);
                    console.log(users);

                    if (!isUserInStorage(_id, users)){
                        res.sendStatus(201);

                        users.push(
                            {
                                id: _id,
                                username: _username,
                                email: _email,
                                password: hash
                            }
                        );
                        console.log(JSON.stringify(users, null, 2));
                        fs.writeFile('storage.data', JSON.stringify(users, null, 2),  'utf8', function (err) {
                            if (err) throw err;
                            console.log('The file has been saved!');
                        });
                        console.log(users);
                    } else {
                        res.sendStatus(409);
                        console.log('User exist');
                    }
                });
                console.log(typeof _id);
            });
        });
    });

router.route('/:id')

    .get(function (req, res) {
        fs.readFile('storage.data', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            var users = JSON.parse(data);
            console.log(users);
            var dataToShow = users;
            for (var i = 0; i < dataToShow.length; i++) {
                delete dataToShow[i].password;
            }
            var _id = parseInt(req.params.id, 10);
            console.log(_id);
            if(isUserInStorage(_id, dataToShow)){
                res.send(JSON.stringify(getUserById(_id,dataToShow), null, 2));
                console.log('user with '+_id +' exist');
            } else {
                res.send(404);
                console.log('user has been not found');
            }
        });
    })

    .put(function (req, res) {
        var _id = parseInt(req.params.id,10),
            _username = req.body.username,
            _email = req.body.email,
            _password = req.body.password;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(_password, salt, function(err, hash) {
                fs.readFile('storage.data', 'utf8', function (err,data) {
                    if (err) {
                        return console.log(err);
                    }
                    var users = JSON.parse(data);
                    if(isUserInStorage(_id, users)){
                        users[_id-1] = {
                            id: _id,
                            username: _username,
                            email: _email,
                            password: hash
                        };

                        res.send(JSON.stringify(users[_id-1], null, 2));
                        fs.writeFile('storage.data', JSON.stringify(users, null, 2),  'utf8', function (err) {
                            if (err) throw err;
                            console.log('The file has been saved!');
                        });
                        console.log('user with '+_id +' has been updated');
                    } else {
                        res.send(404);
                        console.log('user has been not found');
                    }
                });
            });
        });
    })

    .delete(function (req, res) {
        fs.readFile('storage.data', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            var users = JSON.parse(data);
            console.log(users);

            var _id = parseInt(req.params.id,10);
            console.log(_id);
            if(isUserInStorage(_id, users)){
                users.splice(_id-1, 1);
                res.send(JSON.stringify({"message": "User has been successfully removed."}, null, 2));
                fs.writeFile('storage.data', JSON.stringify(users, null, 2),  'utf8', function (err) {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
                console.log('user with '+_id +' has been deleted');
            } else {
                res.send(404);
                console.log('user has been not found');
            }
        });

    });

module.exports = router;