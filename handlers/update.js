module.exports = function (app) {
    app.put('/users/:id', function (req, res) {
        var _id = parseInt(req.params.id,10),
            _username = req.body.username,
            _email = req.body.email;
        console.log(_id);
        if(isUserInStorage(_id, users)){
            users[_id-1] = {
                id: _id,
                username: _username,
                email: _email
            };
            res.send(JSON.stringify(users[_id-1], null, 2));
            console.log('user with '+_id +' has been updated');
        } else {
            res.send(404);
            console.log('user has been not found');
        }
    });
};