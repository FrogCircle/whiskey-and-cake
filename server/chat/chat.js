chatStream = new Meteor.Stream('chat');

chatStream.permissions.write(function() {
  return true;
});

chatStream.permissions.read(function() {
  return true;
});

Meteor.methods({
  getMessagesForRoom: function(roomId) {
    Messages.find({roomId: roomId}, function (err, room) {
      if (err) console.log('there was an error retrieving room chat messages: ', room);
      else if (!room) {
        return 'room does not exist';
      }
      else {
        var begin = room.messages.length <= 100? 0: room.messages.length - 100;
        return room.messages.slice(begin, room.messages.length - 1);
      }
    });
  },
  addMessageForRoom: function(roomId, message) {
    //check if Messages already created for this room, create document if not
    //add message to document
    //console.log('Meteor.user() is ', Meteor.user());
    var newMessage = {
      createdById: (Meteor.user()._id),
      createdByName: (Meteor.user().username),
      createdAt: new Date(),
      message: message
    };
    //  var status = Messages.update({roomId: roomId}, {$push: {messages: newMessage}});
    //  console.log('status is ', status);
    //  if( status === 1) {
    //    chatStream.emit(roomId, 'testing testing testing ' + message);
    //  }
    //}
  }
});