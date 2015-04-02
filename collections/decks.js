// create shuffled decks
CardsRoom = new Meteor.Collection('CardsRoom');

// MovieRoundData = new Meteor.Collection("MovieRoundData");
MovieRooms = new Meteor.Collection("MovieRooms");
TimesHistorianRoom = new Meteor.Collection("TimesHistorianRoom");
// create collection with all user hands

// create collection of all cards on the game table (one black card & all played white cards)

// Currently this collection provides a check for whether the round is over
// This is done by initializing a roundOver property of this collection when the judge picks a winner
// Then that property is deleted when a new round is started

//This is where we hold our methods that get called from the client side
Meteor.methods({
  // function deals a player hand at the beginning of the game
  dealHand: function(roomId) {
    //userArray holds an array of players that are logged in using the user-status package
    //var userArray = CardsRoom.find({ _id : roomId }, { users: 1 }).fetch();
    var gameInformation = CardsRoom.findOne({_id: roomId}, {users: 1});   // returns all users for that room
    //console.log('gameInformation is ', gameInformation);
    var userArray = gameInformation.users;
    //console.log('userArray is ', userArray);
    var judgeCounter = 0;
    for (var i = 0; i < userArray.length; i++) {
      if (userArray[i].judge === true) {
        judgeCounter++;
      }
    }
    //if the deal button was pushed and no judges are assigned already, assign one randomly
    if (judgeCounter === 0) {
      var rng = Math.round(Math.random() * (userArray.length - 1));
      var randomUserId = userArray[rng]._id;
      CardsRoom.update({_id: roomId, "users._id": randomUserId}, {$set: {'users.$.judge': true}});
      //GameBoard.update({_id: gameId}, {$set: {'judge': true}});
    }
    //if the deal button was pushed and there is 1 judge already, toggle that judge
    if (judgeCounter === 1) {
      Meteor.call("toggleJudge", function(err) { //function at the end of this file
        if (err) {
          throw err;
        }
      });
    }
    //iterate over all active players and insert up to 10 cards in their hand
    for (var j = 0; j < userArray.length; j++) {
      //adding .fetch() onto the end of the find method returns an array, thus we can use length
      console.log('userArray[j] is ', userArray[j]);
      if ( !userArray[j].cards || userArray[j].cards.length === 0 ) {//PlayerHand
        for (var i = 0; i < 10; i++) {
          var whiteDeck = CardsRoom.find({_id: roomId}).fetch()[0].WhiteDeck;
          var cardNumber = whiteDeck.length;
          var whiteCard = whiteDeck.pop();
          //var whiteCard = CardsRoom.find({_id: roomId}).fetch()[0].WhiteDeck.pop();
          CardsRoom.update({_id: roomId}, {$pop: {WhiteDeck: 1}});
          whiteCard.no = cardNumber;
          whiteCard.owner = userArray[j]._id;
          console.log('whiteCard is ', whiteCard);
          CardsRoom.update({_id: roomId, 'users._id': userArray[j]._id}, {$push: {'users.$.cards': whiteCard}});
        }
      }
    }
  },

  //var arrayUsers = CardsRoom.find({_id: roomId}, {'users': 1}).fetch();






  // replenishes white cards in the player's hand
  drawWhite: function(roomId) {
    var gameInformation = CardsRoom.findOne({_id: roomId}, {users: 1});   // returns all users for that room
    var userArray = gameInformation.users;
    //for (var i = 0; i < userArray.length; i++) {
    //  while (CardsRoom.find({_id: roomId, 'users._id': userArray[i]._id}, {'users.cards': 1}).length < 10) {
    //    var _entry = CardsRoom.update({_id: roomId}, {$pop: {WhiteDeck: 1}}).fetch();
    //    CardsRoom.update({_id: roomId, 'users._id': userArray[i]._id}, {$push: {'users.cards': _entry}});
    //  }
    //}
    for( var j = 0, len = userArray.length; j < len; j++ ) {
      if ( userArray[j].cards.length <= 10 ) {//PlayerHand
        var cardLeft = 10 - userArray[j].cards.length;
        for (var i = 0; i < cardLeft; i++) {
          var whiteCard = CardsRoom.find({_id: roomId}).fetch()[0].WhiteDeck.pop();
          CardsRoom.update({_id: roomId}, {$pop: {WhiteDeck: 1}});
          console.log('whiteCard is ', whiteCard);
          CardsRoom.update({_id: roomId, 'users._id': userArray[j]._id}, {$push: {'users.$.cards': whiteCard}});
        }
      }
    }
  },
  // adds card to game board with the user id and removes from playerhand
  playCard: function(card, roomId) {
    console.log('in deck.js playCard');
    console.log('car in deck.js playCard', card);
    var user = Meteor.user();
    var gameInformation = CardsRoom.findOne({_id: roomId}, {users: 1});   // returns all users for that room
    var userArray = gameInformation.users;
    for( var i = 0, len = userArray.length; i < len; i++ ) {
      if( userArray[i]._id === user._id ) {
        CardsRoom.update({_id: roomId, 'users._id': userArray[i]._id}, {$pull: {'users.$.cards': card.text}});
        console.log('card inside deck.js playCard is ', card);
/*        var cardObj = { "no": 1,
          "text": card.text,
          "expansion": card.expansion,
          "black": false,
          "owner": 'jonah'
        };*/
        var cardObj = { "no": card.no,
          "text": card.text,
          "expansion": card.expansion,
          "black": false,
          "owner": card.owner
        };
        console.log('roomId in deck.js ', roomId);
        CardsRoom.update({_id: roomId}, { $push:
          {"GameBoard": cardObj }
          }
        );
      }
    }
  },

  // this function starts a new hand by clearing the GameBoard and adding a black card
  drawBlack: function(roomId) {
    CardsRoom.update({_id: roomId}, {$set: {'GameBoard': []}});
    //fetches array of BlackCards from collection and pops off card. NOTE: unattached array
    var blackDeck = CardsRoom.find({_id: roomId}).fetch()[0].BlackDeck;
    var cardNum = blackDeck.length;
    var blackCard = blackDeck.pop();
    blackCard.no = cardNum;
    blackCard.black = true;
    blackCard.owner =

    //this line required to remove card from collection
    CardsRoom.update({_id: roomId}, {$pop: {BlackDeck: 1}});
    CardsRoom.update({_id: roomId}, {$push: {'GameBoard': blackCard}});
  },

  //increment score of card owner
  incrementScore: function(roomId, cardOwner) {
    var gameInformation = CardsRoom.findOne({_id: roomId}, {users: 1});   // returns all users for that room
    var userArray = gameInformation.users;
    for( var i = 0, len = userArray.length; i < len; i++ ) {
      if( userArray[i]._id === cardOwner ) {
        CardsRoom.update({_id: roomId, "users._id": cardOwner}, {$inc: {'users.$.score': 1}});
        Meteor.users.update({_id: cardOwner}, {$inc: {'score': 1}});
      }
    }
  },

  // signals the end of the inserting a roundOver property and setting it to true
  endRound: function(roomId) {
    CardsRoom.update({_id: roomId}, {$set: {'RoundInfo.roundOver': true}})
  },

  // resets the round by removing the roundOver property
  newRound: function(roomId) {
    var round = CardsRoom.update({_id: roomId}, {$set: {'RoundInfo.roundOver': false}});
    //var round = RoundInfo.findOne({});
    //RoundInfo.remove({_id: round._id});
  },

  // Clear losing cards from the gameboard by clearing the entire board
  // and then inserting the winning answer and corresponding question
  clearLosers: function(roomId, winnerCard, questionCard) {
    CardsRoom.update({_id: roomId}, {$set: {'GameBoard': []}});
    CardsRoom.update({_id: roomId}, {$push: {'GameBoard': winnerCard}});
    CardsRoom.update({_id: roomId}, {$push: {'GameBoard': questionCard}});
  },

  // clears gameboard & starts new round
  clearGameBoard: function(roomId) {
    CardsRoom.update({_id: roomId}, {$set: {'GameBoard': []}});
  },

  // rotates judge role after each round
  toggleJudge: function(roomId) {
    //var userArray = CardsRoom.find({_id: roomId}, {users: 1});
    var userArray = CardsRoom.find({_id: roomId}, {users: 1});

    //iterate through all active users
    for (var i = 0; i < userArray.length; i++) {
      //if that user is the judge
      if (userArray[i].judge === true) {
        //take his unique _.id
        var currentId = userArray[i]._id;
        //set his judge property to false
        CardsRoom.update({_id: roomId, "users._id": currentId}, {$set: {'users.$.judge': false}});
        //if that user is the final element in the array
        if (i === (userArray.length - 1)) {
          //set the judge property to true for the first position in the array
          CardsRoom.update({_id: roomId, "users._id": userArray[0]._id}, {$set: {'users.$.judge': true}});
          //break out
          break;
        } else {
          //for any other position make the next array index the judge
          CardsRoom.update({_id: roomId, "users._id": userArray[i + 1]._id}, {$set: {'users.$.judge': true}});
          //breakout
          break;
        }
      }
    }
  },

  newGame: function(roomId){
    CardsRoom.update({_id: roomId}, {$set: {'GameBoard': []}});
    CardsRoom.update({_id: roomId}, {$set: {'WhiteDeck': []}});
    CardsRoom.update({_id: roomId}, {$set: {'BlackDeck': []}});
    CardsRoom.update({_id: roomId}, {$set: {'RoundInfo': []}});
    var gameInformation = CardsRoom.findOne({_id: roomId}, {users: 1});   // returns all users for that room
    var userArray = gameInformation.users;
    for(var i = 0, len = userArray; i < len; i++) {
      CardsRoom.update({_id: roomId, "users._id": userArray[i]._id}, {$set: {'users.$.cards': []}});
    }
  }
});
