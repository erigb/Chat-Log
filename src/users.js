const users = [];

function userJoin(id) {
  var username = makeUsername();
  var color = '#000000';
  const user = { id, username, color};

  users.push(user);

  return user;
}

function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getUsers()  {
    var userList = [];
    for (var i = 0; i < users.length; i ++)  {
        userList.push([users[i].username, users[i].color]);
    }
    return userList;
}

function makeUsername() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 7; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    for (var i = 0; i < users.length; i ++)  {
        if (result === users[i].username)  {
            result = makeUsername();
        }
    }
    return result;
 }

 function checkExistingUsernames(u)  {
    for (var i = 0; i < users.length; i ++)  {
        if (u === users[i].username)  {
            return true;
        }
    }

    return false;
 }

 function changeName(id, msg)  {
    const index = users.findIndex(user => user.id === id);
    newMsg = msg.replace('/name ', '');
    if (!checkExistingUsernames(newMsg))  {
        users[index].username = newMsg;
    }
 }

 function changeColor(id, msg)  {
    const index = users.findIndex(user => user.id === id);
    var newMsg = msg.replace('/color ', '');
    newMsg = newMsg.replace(' ', '');
    var regex = /^[0-9a-fA-Z]+$/;
    if (regex.test(newMsg))  {
        if (newMsg.length == 6)  {
            users[index].color = '#' + newMsg;
        }
    }
 }

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getUsers,
  changeName,
  changeColor
};