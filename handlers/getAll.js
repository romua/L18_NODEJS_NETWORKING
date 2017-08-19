

module.exports = function (app) {
    app.get('/users', function (req, res) {
        if(users.length ===0) {
            console.log('arr is empty')
        }
        res.send(JSON.stringify(users, null, 2));
    });
};