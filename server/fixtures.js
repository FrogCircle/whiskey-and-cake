//Cmd line if meteor running on port 3000 already.
//kill -9 `ps ax | grep node | grep meteor | awk '{print $1}'`
/**
/* DECK INSTANTIATION */

// on meteor start, clear current decks
var PlayerHand = {};
var GameBoard = {};
var RoundInfo = {};

Meteor.methods ({
  CreateRoom: function() {
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
      expansion: BlackCards[i]["expansion"]
    });
  }

  for (var i = 0; i < WhiteCards.length; i++) {
    WhiteDeck.push({
      text: WhiteCards[i]["text"],
      expansion: WhiteCards[i]["expansion"]
    });
  }

  Room.insert({
    createdBy:(Meteor.userId()),
    createdAt: new Date(),
    WhiteDeck: WhiteDeck,
    BlackDeck: BlackDeck,
    RoundInfo: {},
    PlayerHand: [],
    GameBoard: [],
    users: []
  });

  return Room._id;
}});

// var CreateRoom = function() {
//   var WhiteDeck = [];
//   var BlackDeck = [];
// // in-place shuffle algorithm for BlackCards
// // cards are shuffled prior to instantiating the database
//   for (var i = 0; i < BlackCards.length; i++) {
//     var j = Math.floor(Math.random() * i);
//     var hole = BlackCards[i];
//     BlackCards[i] = BlackCards[j];
//     BlackCards[j] = hole;
//   }

// // instantiate databases with shuffled data
//   for (var i = 0; i < BlackCards.length; i++) {
//     BlackDeck.push({
//       text: BlackCards[i]["text"],
//       expansion: BlackCards[i]["expansion"]
//     });
//   }

//   for (var i = 0; i < WhiteCards.length; i++) {
//     WhiteDeck.push({
//       text: WhiteCards[i]["text"],
//       expansion: WhiteCards[i]["expansion"]
//     });
//   }

//   Room.insert({
//     createdBy:(Meteor.userId()),
//     createdAt: new Date(),
//     WhiteDeck: WhiteDeck,
//     BlackDeck: BlackDeck,
//     RoundInfo: {},
//     PlayerHand: [],
//     GameBoard: [],
//     users: []
//   });
// };

// fields added to Meteor.user on instantiation
Accounts.onCreateUser(function(options, user) {
  user.score = 0;
  user.judge = false;
  return user;
});

/* PUBLISHING */

Meteor.publish("Room", function() {
  return Room.find();
});
Meteor.publish("WhiteDeck", function(roomID) {
  return Room.find( {}, { WhiteDeck: 1 } );
});
Meteor.publish("BlackDeck", function() {
  return Room.find( {}, { BlackDeck: 1 } );
});
Meteor.publish("User", function() {
  return Room.find( {}, { User: 1 } );
});
Meteor.publish("GameBoard", function() {
  return Room.find( {}, { GameBoard: 1 } );
});
Meteor.publish("RoundInfo", function() {
  return Room.find( {}, { RoundInfo: 1 } );
});
Meteor.publish("user-info", function(id) {
  return Meteor.users.find({_id: id}, {fields: {username: 1}});
});
