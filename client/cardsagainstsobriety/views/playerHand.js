var path = document.location.pathname;
var _roomId = path.split('/');
_roomId = _roomId[_roomId.length-1];
console.log('_roomId is ', _roomId);

// Helper functions for player-hand-view.html
Meteor.subscribe('CardsRoom');

Template.playerHand.helpers({
  //
  playsHand: function(){
    var user = Meteor.user();
    // displays hand to user, filtered by username.
    var usersArray = CardsRoom.find({ '_id': _roomId}).fetch()[0].users;
  console.log('usersArray is ', usersArray);
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
    var user = Meteor.user();

    // if user is the judge, he cannot play a white card
    if (user.judge) {
      console.log('YOU DA JUDGE BRO, NO PLAYING CARDS');
      return;
    }
    
    // each user can only play one white card per round
    if(GameBoard.find({owner: user._id}).fetch().length > 0){
      console.log("Yo, you've already played a card!");
      return;
    }

    // refer to decks.js for playCard function
    Meteor.call('playCard', this, function(err, id) {
      //console.log('card being played');
      if (err) {
        throw err;
      }
    });

    // refer to decks.js for drawWhite function
    Meteor.call('drawWhite', function(err, id){
      if(err){
        throw err;
      }
    });

  },

  "click #clearBoard": function(){
    // clear out white cards
    // redraw blackCard
    // choose new judge
    Meteor.call("drawBlack", function(err, res){
      if(err){
        throw err;
      } else {
        //console.log('Board Cleared');
      }
    })
  },

  "click #dealHand": function(){
    var roomId = Router.current().params.room;
    var user = Meteor.user();
    console.log(user, 'this is the user');
    var numHandCards = CardsRoom.find({_id: roomId, 'users._id': user._id }, {'users.cards': 1}).count();
    //var numHandCards = PlayerHand.find({owner: user._id}).count();
    if(numHandCards >= 10){
      console.log('You already have ', numHandCards, ' why not try using them?');
      return;
    }

    // refer to decks.js for dealHand function
    Meteor.call("dealHand", roomId, function(err, res){
      console.log('called Meteor.call dealHand');
      if(err){
        throw err;
      } else {
        //console.log('Hand Dealt');
        //console.log('Result object - ', res);
      }
    });

    // refer to decks.js for drawBlack function
    Meteor.call("drawBlack", roomId, function(err, res){
      if(err){
        throw err;
      } else {
        //console.log('Board Cleared');
      }
    })
  }

});


