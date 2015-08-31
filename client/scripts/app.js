// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.messages = [];

app.init = function() {
  app.messages;

  // Comment below code out to stop hacking
  var hackerReactor = {
    username: 'byebye',
    text: '<img src="lol.png" onerror=window.location.replace("http://lmgtfy.com/?q=how+to+protect+myself+from+XSS");>',
    roomname: 'hell'
  };
  app.send(hackerReactor);

  app.fetch();
  setInterval(app.fetch, 5000); 
};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/JSON',
    success: function (data) {
      console.log('chatterbox: Message sent');
      app.fetch();
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message');
    }
  })
};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    contentType: 'application/JSON',
    success: function (data) {
      console.log('chatterbox: Messages retrieved');
      app.messages = data['results'];
      renderMessage(app.messages);
    },
    error: function(data) {
      console.error('chatterbox: Failed to retrieve messages');
    }
  });
};

var escape = function(message) {
  var escapes = [];
  var lessThan = /</g; escapes.push([lessThan, "&lt;"]);
  var greaterThan = />/g; escapes.push([greaterThan, "&gt;"]);
  var apostrophe = /'/g; escapes.push([apostrophe, "&#39;"]);
  var doubleClose = /"/g; escapes.push([doubleClose, "&#34;"]);
  // var ampersand = /&/g; escapes.push([ampersand, "&#38;"]);
  // var tick = /`/g; escapes.push([tick, "&#96;"]);
  // var bang = /!/g; escapes.push([bang, "&#33;"]);
  // var at = /@/g; escapes.push([at, "&#64;"]);
  // var equals = /=/g; escapes.push([equals, "&61;"]);
  // var percent = /%/g; escapes.push([percent, "&#37;"]);

  // var openPar = /(/g; escapes.push([openPar, "&lpar;"]);
  // var closePar = /)/g; escapes.push([closePar, "&rpar;"]);
  // var money = /$/g; escapes.push([money, "&#36;"]);
  // var openCurl = /{/g; escapes.push([openCurl, "&lcub;"]);
  // var closeCurl = /}/g; escapes.push([closeCurl, "&rcub;"]);
  // var openBrace = /[/g; escapes.push([openBrace, "&lsqb;"]);
  // var closeBrace = /]/g; escapes.push([closeBrace, "&rsqb;"]);
  var returnMessage = message.toString();
  _.each(escapes, function(escapee) {
    returnMessage = returnMessage.replace(escapee[0], escapee[1]);
  });
  return returnMessage;
};

var renderMessage = function(messages) {
  $("#chats").empty();
  _.each(messages, function(message) {
    if (message["roomname"] && message["text"] && message["username"]) {
      $("#chats").append('<div class="tweet"><li class="room">' 
        + escape(message["roomname"]) 
        + '</li><li class="username">' 
        + escape(message["username"]) 
        + '</li><li class="message">' 
        + escape(message["text"]) 
        + '</li></div>');
    }
  });
};

app.init();