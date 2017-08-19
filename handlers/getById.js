

module.exports = function (app) {
    app.get('/users/:id', function (req, res) {
        var _id = parseInt(req.params.id, 10);
        console.log(_id);
        if(isUserInStorage(_id, users)){
            res.send(JSON.stringify(getUserById(_id,users), null, 2));
            console.log('user with '+_id +' exist');
        } else {
            res.send(404);
            console.log('user has been not found');
        }
    });
};