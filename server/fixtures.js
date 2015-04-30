//Cmd line if meteor running on port 3000 already.
//kill -9 `ps ax | grep node | grep meteor | awk '{print $1}'`
/**
 /* DECK INSTANTIATION */

Meteor.methods({
  CreateCardsRoom: function(roomName) {
    console.log('roomName is ', roomName);
    var WhiteDeck = [];
    var BlackDeck = [];
// in-place shuffle algorithm for BlackCards
// cards are shuffled prior to instantiating the database
    for (var i = 0; i < BlackCards.length; i++) {
      var j = Math.floor(Math.random() * i);
      var hole = BlackCards[i];
      BlackCards[i] = BlackCards[j];
      BlackCards[j] = hole;
    }

// instantiate databases with shuffled data
    for (var i = 0; i < BlackCards.length; i++) {
      BlackDeck.push({
        text: BlackCards[i]["text"],
        expansion: BlackCards[i]["expansion"],
        no: i
      });
    }

    for (var i = 0; i < WhiteCards.length; i++) {
      WhiteDeck.push({
        text: WhiteCards[i]["text"],
        expansion: WhiteCards[i]["expansion"]
      });
    }
    //var returnRoom = {};
    var returnRoom = CardsRoom.insert({
      createdBy: (Meteor.userId()),
      createdAt: new Date(),
      roomName: roomName,
      WhiteDeck: WhiteDeck,
      BlackDeck: BlackDeck,
      RoundInfo: {},
      PlayerHand: [],
      GameBoard: [],
      users: []
    }, function(err, roomInserted) {
      console.log('roomInserted is ', roomInserted);
      returnRoom = roomInserted;
    });
    Messages.insert({
      createdById: (Meteor.user()._id),
      createdByName: (Meteor.user().username),
      createdAt: new Date(),
      roomId: returnRoom,
      messages: []
    }, function (err, messageInserted) {
      console.log('messageInserted is ', messageInserted);
      if( err ) {
        console.log('error while creating doc in messages collection');
      }
    });

    console.log('returnRoom is ', returnRoom);
    return {room: returnRoom};
  },

  JoinCardsRoom: function(roomId, userObj) {
    var gameInfo = CardsRoom.findOne({_id: roomId});
    console.log('Join cards room called');
    var userArray = gameInfo.users;
    var userFound = false;
    for( var i = 0, len = userArray.length; i < len; i++ ) {
      if ( userArray[i]._id === userObj._id ) {
        console.log('UserFound', userFound);
        userFound = true;
      }
    }
    if( !userFound ) {
      CardsRoom.update({_id: roomId}, {$push: {'users': userObj }});
    }
    return CardsRoom.find({_id: roomId}).fetch();
  },
  deleteRoom: function(roomId, userId, collection){
    //check if user has rights to delete this room, i.e. created the room
    var room = collectionNames[collection].findOne({_id: roomId});
    var roomOwner = room.createdBy;
    if( roomOwner === userId ) {
      var removeRoomCheck = collectionNames[collection].remove({_id: roomId});
      var removeMessagesCheck = Messages.remove({roomId: roomId});
    }
  }
});

// fields added to Meteor.user on instantiation
Accounts.onCreateUser(function(options, user) {
  user.score = 0;
  user.judge = false;
  return user;
});

/* PUBLISHING */

Meteor.publish("CardsRoom", function() {
  return CardsRoom.find();
});
Meteor.publish("WhiteDeck", function(roomID) {
  return CardsRoom.find({}, {WhiteDeck: 1});
});
Meteor.publish("BlackDeck", function() {
  return CardsRoom.find({}, {BlackDeck: 1});
});
Meteor.publish("User", function() {
  return CardsRoom.find({}, {User: 1});
});
Meteor.publish("GameBoard", function() {
  return CardsRoom.find({}, {GameBoard: 1});
});
Meteor.publish("RoundInfo", function() {
  return CardsRoom.find({}, {RoundInfo: 1});
});
Meteor.publish("user-info", function(id) {
  return Meteor.users.find({_id: id}, {fields: {username: 1}});
});
Meteor.publish("MovieRooms", function() {
  return MovieRooms.find();
});
Meteor.publish("TimesHistorianRoom", function() {
  return TimesHistorianRoom.find();
});

var collectionNames = {
  'TH': TimesHistorianRoom,
  'MC': MovieRooms,
  'CAS': CardsRoom
}