var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var fs         = require('fs');
var router     = express.Router();
var bcrypt     = require('bcrypt');

const saltRounds = 10;



app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function  isUserInStorageById(id, arrOfUsers){
    var inStorage = false;
    if (arrOfUsers.length === 1){
        return (arrOfUsers[0].id === id) ? true: false;
    } else {
        for (var i = 0; i < arrOfUsers.length; i++) {
            if(arrOfUsers[i].id === id){
                inStorage  = true;
            }
        }
        return inStorage;
    }
}

function  isUserInStorageByName(username, arrOfUsers){
    var inStorage = false;
    for (var i = 0; i < arrOfUsers.length; i++) {
        if(arrOfUsers[i].username === username){
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
            if(data === '') {
                var user = new Array();
                res.status(200).send(JSON.stringify(user));
            } else {
                var  users = JSON.parse(data);
                console.log(users);
                var dataToShow = users;
                for (var i = 0; i < dataToShow.length; i++) {
                    delete dataToShow[i].password;
                }
                if(dataToShow.length ===0) {
                    console.log('arr is empty');
                }
                res.status(200).send(JSON.stringify(dataToShow, null, 2));
            };
        });

    })

    .post(function (req, res) {
        var _id,
            _password = req.body.password,
            _username = req.body.username,
            _email = req.body.email;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(_password, salt, function(err, hash) {
                fs.readFile('storage.data', 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }

                    if(data === '') {
                        var users = [];
                        _id = 1;

                    } else {
                        var  users = JSON.parse(data);
                        console.log(users);
                        _id = users[users.length-1].id+1;
                    }

                    if(typeof _username === 'string' && typeof _email === 'string' && typeof _password ==='string'){
                        if (!isUserInStorageByName(_username, users)){
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
                            res.sendStatus(201);
                        } else {
                            res.sendStatus(409);
                            console.log('User exist');
                        }
                    } else{
                        res.sendStatus(400);
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
            if(data === '') {
                var users = new Array();
            } else {
                var  users = JSON.parse(data);

            }
            var dataToShow = users;
            for (var i = 0; i < dataToShow.length; i++) {
                delete dataToShow[i].password;
            }
            var _id = parseInt(req.params.id, 10);
            console.log(_id);
            if(isUserInStorageById(_id, dataToShow)){
                res.status(200).send(JSON.stringify(getUserById(_id, dataToShow), null, 2));
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
                    if(data === '') {
                        var users = [];
                    } else{
                        var  users = JSON.parse(data);
                        console.log(users);
                    }
                    if(isUserInStorageById(_id, users)){
                        var userIdToShow = 0;
                        var dataToShow = {};
                        for (var i = 0; i < users.length; i++) {
                            if(users[i].id === _id){
                                users[i] = {
                                    id: users[i].id,
                                    username: _username,
                                    email: _email,
                                    password: hash
                                };
                                userIdToShow = i;
                                dataToShow = users[i];
                            }
                        }
                        delete dataToShow.password;

                    res.send(JSON.stringify(dataToShow, null, 2));
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
        var _id = parseInt(req.params.id,10);
        console.log(_id);
        if(isUserInStorageById(_id, users)){
            var indexToDelete = 0
            for (var i = 0; i < users.length; i++) {
                if(users[i].id === _id){
                    indexToDelete = i;
                }
            }
            users.splice(indexToDelete, 1);
            console.log('helllo',users);
            res.send('User has been successfully removed.');
            if(users.length ===0){
                fs.writeFile('storage.data', '',  'utf8', function (err) {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            } else {
                fs.writeFile('storage.data', JSON.stringify(users, null, 2),  'utf8', function (err) {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            }
            console.log('user with '+_id +' has been deleted');
        } else {
            res.send(404);
            console.log('user has been not found');
        }
    });
});

module.exports = router;