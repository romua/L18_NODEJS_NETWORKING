var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var fs         = require('fs');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var port = process.env.PORT || 3000;

// var users = [
//     {
//         "id": 1,
//         "username": "johndoe",
//         "email": "john.doe@myownserver.com",
//         "password": "q8xowdnaxitf3g3ffjjl"
//     },
//     {
//         "id": 2,
//         "username": "johndoesfriend",
//         "email": "friend.of.john.doe@myownserver.com",
//         "password": "2a1cgv7e0be2d26my8g9"
//     }
// ];
// fs.readFile('storage.data.json', 'utf8', function (err,data) {
//     if (err) {
//         return console.log(err);
//     }
//     _data = data;
//     console.log(_data);
// });


app.get('/', function (req, res) {
    res.send('Hi');
});

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
app.post('/users', function (req, res) {
    var _id =  parseInt(req.body.id, 10),
        _username = req.body.username,
        _email = req.body.email,
        _password = req.body.password;

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
                    password: _password
                }
            );
            console.log(JSON.stringify(users, null, 2));
            fs.writeFile('storage.data', JSON.stringify(users, null, 2),  'utf8', function (err) {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            console.log(users);
            return
        } else {
            res.sendStatus(409);
            console.log('User exist');
        };
    });

    console.log(typeof _id);


});

app.get('/users', function (req, res) {
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

});

app.get('/users/:id', function (req, res) {
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
});

app.put('/users/:id', function (req, res) {
    fs.readFile('storage.data', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var users = JSON.parse(data);
        console.log(users);

        var _id = parseInt(req.params.id,10),
            _username = req.body.username,
            _email = req.body.email,
            _password = req.body.password
        console.log(_id);
        if(isUserInStorage(_id, users)){
            users[_id-1] = {
                id: _id,
                username: _username,
                email: _email,
                password: _password
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

app.delete('/users/:id', function (req, res) {
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

// START THE SERVER
// ============================================================================
app.listen(port, function () {
    console.log('Приклад застосунку, який прослуховує 3000-ий порт!');
});