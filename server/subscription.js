/**
 * All chat rooms are public so publish all of them
 */
Meteor.publish('allRooms', function() {
  return CardsRoom.find();
});

/**
 * Publish messages by roomId
 */
Meteor.publish('roomMessages', function (roomId) {
  return Messages.find({roomId: roomId});
});
/**
 * Allow messages to be added
 */
Messages.allow({
  'insert': function() {
    return true;
  }
});




