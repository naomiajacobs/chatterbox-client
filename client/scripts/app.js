$(document).ready(function() {
  // YOUR CODE HERE:
  var app = {};
  app.server = 'https://api.parse.com/1/classes/chatterbox';
  app.user = "";
  app.selectedRoom = "";
  app.rooms = [];
  app.messages = [];

  app.init = function() {
    var nameStartIndex = window.location.search.lastIndexOf('=');
    app.user = window.location.search.slice(nameStartIndex + 1);

    Comment below code out to stop hacking
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

  // // Ajax call to retrieve all room values
  // app.fetchRoomOtions = function() {

  // };

  // // Ajax call to retrieve messages by room
  // app.fetchByRoom = function(room) {

  // };

  app.fetch = function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/JSON',
      success: function (data) {
        console.log('chatterbox: Messages retrieved');
        app.messages = data['results'];
        generateRooms(app.messages);
        renderRoomOptions(app.rooms);
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
    var ampersand = /&/g; escapes.push([ampersand, "&#38;"]);
    // var tick = /`/g; escapes.push([tick, "&#96;"]);
    // var bang = /!/g; escapes.push([bang, "&#33;"]);
    // var at = /@/g; escapes.push([at, "&#64;"]);
    // var equals = /=/g; escapes.push([equals, "&61;"]);
    var percent = /%/g; escapes.push([percent, "&#37;"]);

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
    app.clearMessages();
    _.each(messages, function(message) {
      if (message["roomname"] && message["text"] && message["username"]) {
        // if ($("#roomOptions").val() === all || $("#roomOptions").val === )
        $("#chats").append('<div class="tweet"><li class="room">' 
          + escape(message["roomname"]) 
          + '</li><li class="username">' 
          + escape(message["username"]) 
          + '</li><li class="message">' 
          + escape(message["text"]) 
          + '</li></div>');
      }
    });
    filterMessagesForRoom();
  };

  var generateRooms = function(messages) {
    app.rooms = [];
    app.rooms.push('New room...');
    //TODO: let user add new room
    _.each(messages, function (message) {
      if (message["roomname"]) {
        app.rooms.push(escape(message["roomname"]));
      }
    });
    app.rooms = _.uniq(app.rooms);
  };

  var renderRoomOptions = function(rooms) {
    $("#roomOptions").empty();
    _.each(rooms, function(room) {
      $("#roomOptions").append("<option value=" + room + ">" + room + "</option>");
    });
  };

  app.clearMessages = function() {
    $("#chats").empty();
  };

  $("#sendMessage").on('click', function () {
    console.log('clicked!');
    var message = {
      username:    app.user,
      text:        $("#textMessage").val(),
      roomname:    $("#roomOptions").val()
    };
    $("#textMessage").val("");
    app.send(message);
  });

  $("#roomOptions").change(function () {
    app.selectedRoom = $("#roomOptions").val();
    filterMessagesForRoom();
    console.log($(this).val());
  });

  var filterMessagesForRoom = function () {
    app.selectedRoom = $("#roomOptions").val();

    _.each($(".tweet"), function(tweet) {
      if ($(tweet).find(".room").text() === app.selectedRoom) {
        $(tweet).show();
      } else {
        $(tweet).hide();
      }
    });
  };

  // TODO: Change 'enter' key to send messages
  $('#messegeForm').on('keypress', function (e) {
    if (e.which == 13) {
      $('#sendMessage').click();
    }
    return false;  
  });

  app.init();
});

// TODO: Create new rooms
// TODO: Make username's clickable to add to friend's list
// TODO: Display all friend's messages in bold
// TODO: Let the user create a new room
// TODO: Create a cleaner function to apply to the returned Ajax values
// TODO: Split the jquery event handlers to another file