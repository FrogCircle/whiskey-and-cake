chatStream = new Meteor.Stream('chat');
chatCollection = new Meteor.Collection(null);

var getId = function() {
  console.log('555currentRoomId in chat.js ', Session.get('currentRoomId'));
  return Session.get('currentRoomId');
};
var roomId = getId() || null;


chatStream.on(getId(), function(message) {
  console.log('MYMSG IS ', message);
});

Template.chatBox.helpers({
  "messages": function() {
    var roomMessages = Messages.findOne({roomId: getId()});
    console.log('roomMessages in chatBox helpers is ', roomMessages);
    return roomMessages.messages;
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
  "click #send": function() {
    var message = $('#chat-message').val();
    //chatCollection.insert({
    //  userId: 'me',
    //  message: message
    //});
    Meteor.call('addMessageForRoom', getId(), message, function(data) {
      //message data is returned via a server emit
    });
    //chatStream.emit('chat', roomId, message);
    //$('#chat-message').val('');
  }
});

function getUsername(id) {
  Meteor.subscribe('user-info', id);
  Deps.autorun(function() {
    var user = Meteor.users.findOne(id);
    if(user) {
      Session.set('user-' + id, user.username);
    }
  });
}