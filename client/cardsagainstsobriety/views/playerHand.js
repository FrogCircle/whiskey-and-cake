var getId = function() {
  return Session.get('currentRoomId');
};
// Helper functions for player-hand-view.html
Meteor.subscribe('CardsRoom');

Template.playerHand.helpers({
  //
  playsHand: function(){
    var user = Meteor.user();
    var _roomId = Session.get('roomUrl') || getId();
    // displays hand to user, filtered by username.
    var usersArray = CardsRoom.find({ '_id': _roomId}).fetch()[0].users;
    console.log('usersArray+++ is ', usersArray);
    var result;
    for( var i = 0; i < usersArray.length; i++ ) {
      if( usersArray[i]._id === user._id ) {
        result = usersArray[i].cards;
      }
    }
    //return PlayerHand.find({owner: user._id});
    return result;
  }

});

// player-hand-view.html template event listeners
Template.playerHand.events({

  // user clicks on a white card
  "click .playCard": function(){
    var card = this;
    var user = Meteor.user();
    var isJudge;
    var _roomId = Session.get('roomUrl') || getId();
    var gameInformation = CardsRoom.findOne({_id: _roomId}, {users: 1});   // returns all users for that room
    var userArray = gameInformation.users;
    // if user is the judge, he cannot play a white card
    for( var i = 0, len = userArray.length; i < len; i++) {
      if ( userArray[i]._id === user._id ) {
        if( userArray[i].judge ) {
          isJudge = true;
          console.log('YOU DA JUDGE BRO, NO PLAYING CARDS');
          return;
        }
      }
    }

    // each user can only play one white card per round
    //CardsRoom.find({_id: _roomId}).fetch()[0].GameBoard;
      var board = CardsRoom.find({_id: _roomId}).fetch()[0].GameBoard;
      for( var i = 0, len = board.length; i < len; i++ ) {
        if( board[i].owner === user._id ) {
          console.log("Yo, you've already played a card!");
          return;
        }
      }

    // refer to decks.js for playCard function
    Meteor.call('playCard', card, _roomId, function(err, id) {
      console.log('card being played');
      console.log('card is ', card);
      if (err) {
        throw err;
      }
    });

    // refer to decks.js for drawWhite function
    Meteor.call('drawWhite', _roomId, function(err, id){
      if(err){
        throw err;
      }
    });

  },

  "click #clearBoard": function(){
    // clear out white cards
    // redraw blackCard
    // choose new judge
    var _roomId = Session.get('roomUrl') || getId();
    Meteor.call("drawBlack", _roomId, function(err, res){
      if(err){
        throw err;
      } else {
        console.log('Board Cleared');
      }
    })
  },

  "click #dealHand": function(){
    var user = Meteor.user();
    var _roomId = Session.get('roomUrl') || getId();
    console.log(user, 'this is the user');
    var gameInformation = CardsRoom.findOne({_id: _roomId}, {users: 1});   // returns all users for that room
    var userArray = gameInformation.users;
    var numHandCards;
    for ( var  i = 0, size = userArray.length; i < size; i++) {
      if ( userArray[i]._id === user._id ) {
        numHandCards = userArray[i].cards === undefined? 0: userArray[i].cards.length;
        if( numHandCards >= 10 ){
          console.log('You already have ', numHandCards, ' why not try using them?');
          //return;
        }
      }
    }

    // refer to decks.js for dealHand function
    Meteor.call("dealHand", _roomId, function(err, res){
      console.log('called Meteor.call dealHand');
      if(err){
        throw err;
      } else {
        //console.log('Hand Dealt');
        //console.log('Result object - ', res);
      }
    });

    // refer to decks.js for drawBlack function
    Meteor.call("drawBlack", _roomId, function(err, res){
      if(err){
        throw err;
      } else {
        console.log('drawBlack called');
      }
    })
  }

});


