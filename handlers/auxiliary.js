function  isUserInStorage(id, arrOfUsers){
    var inStorage = false;
    for (var i = 0; i < arrOfUsers.length; i++) {
        if(arrOfUsers[i].id === id){
            inStorage  = true;
        };
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

module.exports = isUserInStorage;
module.exports = getUserById;