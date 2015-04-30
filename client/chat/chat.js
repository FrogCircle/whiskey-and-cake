var getId = function() {
  return Session.get('currentRoomId');
};
var roomId = getId() || null;

Template.chatBox.helpers({
  "messages": function() {
    var x = Session.get('currentRoomId');
    var room = Messages.findOne({roomId: x});
    scroll();
    return room;
  }
});


var subscribedUsers = {};

Template.chatMessage.helpers({
  "user": function() {
    if(this.userId == 'me') {
      return "me";
    } else if(this.userId) {
      var username = Session.get('user-' + this.userId);
      if(username) {
        return username;
      } else {
        getUsername(this.userId);
      }
    } else {
      return this.subscriptionId;
    }
  }
});

Template.chatBox.events({
  "click #send": function () {
    sendChat();
  },
  "keypress #chat-message": function(e) {
    if(e.which === 13 ) {
      sendChat();
    }
  }
});

function sendChat() {
  var message = $('#chat-message').val();
  Meteor.call('addMessageForRoom', getId(), message, function(data) {
    //message data is returned via a server emit
  });
  $('#chat-message').val('');
}

function scroll() {
  setTimeout(function () {
   //force chat messages to scroll to bottom
    var chatBox = $('#messages');
    var height = chatBox[0].scrollHeight;
    chatBox.scrollTop(height);
  }, 200);
}


function getUsername(id) {
  Meteor.subscribe('user-info', id);
  Deps.autorun(function() {
    var user = Meteor.users.findOne(id);
    if(user) {
      Session.set('user-' + id, user.username);
    }
  });
}