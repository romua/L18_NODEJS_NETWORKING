

module.exports = function (app) {
    app.delete('/users/:id', function (req, res) {
        var _id = parseInt(req.params.id,10);
        console.log(_id);
        if(isUserInStorage(_id, users)){
            users.splice(_id-1, 1);
            res.send(JSON.stringify({"message": "User has been successfully removed."}, null, 2));
            console.log('user with '+_id +' has been deleted');
        } else {
            res.send(404);
            console.log('user has been not found');
        }
    });
};