
function formatMessage(username, text) {
    var newText = text.replace(':)', '&#128512;');
    newText = newText.replace(':(', '&#128550;');
    newText = newText.replace(':o', '&#x1F62E;');
    newText = newText.replace('<3', '&#128151;');
  return (getTime() + formatUsername(username) + newText);
}
function getTime()  {
    var currDate = new Date();
    var today = currDate.toLocaleDateString('en-GB', {  
        day : 'numeric',
        month : 'short',
        year : 'numeric'
    });
    return (currDate.toLocaleDateString() + ', ');
}

function formatUsername(username)  {
    return (username + ': <br>');
}

module.exports = formatMessage;