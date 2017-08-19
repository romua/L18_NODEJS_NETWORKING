require('../handlers/auxiliary');
module.exports = function (app) {
    app.post('/users', function (req, res) {
        var _id =  parseInt(req.body.id, 10),
            _username = req.body.username,
            _email = req.body.email,
            _password = req.body.password;
        console.log(typeof _id);

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
            console.log(users);
        } else {
            res.sendStatus(409);
            console.log('User exist');
        }
    });
};