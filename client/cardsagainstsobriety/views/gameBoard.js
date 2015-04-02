var getId = function() {
  var path = document.location.pathname;
  var _roomId = path.split('/');
  _roomId = _roomId[_roomId.length-1];
  console.log('getId called');
  return _roomId;
};

Template.gameBoard.helpers({

  // Returns all online users
  //CHANGE THIS TO FIND ONLY USERS IN THIS GAME
  users: function(){
    //var _roomId = getId();
    var _roomId = Session.get('roomUrl') || getId();
    console.log('room id in users is', _roomId);
    //returns an array of user objects
    var gameInformation = CardsRoom.findOne({_id: _roomId}, {users: 1});   // returns all users for that room
    var userArray = gameInformation.users;

    console.log('tesing', userArray);
    return userArray;
    // return Meteor.users.find({'status.online': true});
  },

  currentUser: function() {
    var user = Meteor.user();
    var _roomId = Session.get('roomUrl') || getId();
    var gameInformation = CardsRoom.findOne({_id: _roomId}, {users: 1});   // returns all users for that room
    var userArray = gameInformation.users;
    // if user is the judge, he cannot play a white card
    for( var i = 0, len = userArray.length; i < len; i++) {
      if ( userArray[i]._id === user._id ) {
        if( userArray[i].judge ) {
          return userArray[i];
        }
      }
    }
  },

  // Returns the black question card currently on the GameBoard
  question: function(){
    var _roomId = Session.get('roomUrl') || getId();
    //return GameBoard.find({black: true});
    var board = CardsRoom.find({_id: _roomId}).fetch()[0].GameBoard;
    var result = [];
    for(var i = 0, size = board.length; i < size; i++) {
      if (board[i].black) {
        result.push(board[i]);
      }
    }
    return result;
  },

  // Returns the white answer cards currently on the GameBoard
  answers: function(){
    var _roomId = Session.get('roomUrl') || getId();
    // return GameBoard.find({black: false});
    var board = CardsRoom.find({_id: _roomId}).fetch()[0].GameBoard;
    var result = [];
    for(var i = 0, size = board.length; i < size; i++) {
      if (!board[i].black) {
        result.push(board[i]);
      }
    }
    return result;
  },

  // Returns the total number of online players
  numPlayers: function(){
    var _roomId = Session.get('roomUrl') || getId();
    console.log('_roomId is ', _roomId);
    //get number of users in room
    var gameInformation = CardsRoom.findOne({_id: _roomId}, {users: 1});   // returns all users for that room
    var userArray = gameInformation.users;
    var numberPlayers = userArray.length;
    if ( numberPlayers === 0 ) {
      return 'NO';
    } else {
      return numberPlayers;
    }
    //if (Meteor.users.find({'status.online': true}).count() === 0) {
    //  return 'NO';
    //} else {
    //  return Meteor.users.find({'status.online': true}).count();
    //}
  },

  playersInRoom: function() {
    var _roomId = Session.get('roomUrl') || getId();
    var players = CardsRoom.find({_Id: _roomId}, {_id: 1, username: 1}).fetch()[0].users;
    return players;
  },

  // Returns a count of all played cards on the board
  cardsPlayed: function(){
    var _roomId = Session.get('roomUrl') || getId();
    // return GameBoard.find({black: false}).count();
    var board = CardsRoom.find({_id: _roomId}).fetch()[0].GameBoard;
    var result = 0;
    for(var i = 0, size = board.length; i < size; i++) {
      if (!board[i].black) {
        result++;
      }
    }
    return result;
  },

  // Returns a count of the cards still needed to be played for the round
  cardsLeft: function(){
    var _roomId = Session.get('roomUrl') || getId();
    //var count = Meteor.users.find({'status.online': true}).count();
    var gameInformation = CardsRoom.findOne({_id: _roomId}, {users: 1});   // returns all users for that room
    var userArray = gameInformation.users;
    var count = userArray.length;
    var board = gameInformation.GameBoard;
    var result = 0;
    for(var i = 0, size = board.length; i < size; i++) {
      if (!board[i].black) {
        result++;
      }
    }
    return result;
    return Math.max(0, (count - 1) - result);
  },

  // Returns true if all of the cards have been played, which signifies that the round is over
  allCardsPlayed: function(){
    var _roomId = Session.get('roomUrl') || getId();
    //count players in room, subtract one so judge not included
    var gameInformation = CardsRoom.findOne({_id: _roomId}, {users: 1});   // returns all users for that room
    var userArray = gameInformation.users;
    var players = userArray.length - 1;
    //var players = (Meteor.users.find().count() - 1);
    var board = CardsRoom.find({_id: _roomId}).fetch()[0].GameBoard;
    var played = 0;
    for ( var i = 0, size = board.length; i < size; i++ ) {
      if ( !board[i].black ) { played++; }
    }
    //var played = GameBoard.find({black: false}).count();
    return players - played === 0;
  },

  // Returns true if the judge has chosen the winning card.
  // When true, the game-board-view.html will display a button that starts the next round
  winnerChosen: function(){
    var _roomId = Session.get('roomUrl') || getId();
    var round = CardsRoom.find({_id: _roomId}).fetch()[0].RoundInfo;
    //var round = RoundInfo.findOne({});
    return round.roundOver;
  }

});


Template.gameBoard.events({
  "click .answerCards": function (event) {
    console.log('this in answerCards ', this);
    event.stopPropagation();
    var _roomId = getId();
    // calls endRound from deck.js, which sets roundOver to true for the winnerChosen helper above
    Meteor.call('endRound', _roomId, function(err, res){
      if(err){
        throw err;
      }
    });

    // store click context to pass into method call
    console.log(this, "this in gameboard event");
    var cardOwner = this.owner;

    // calls incrementScore from decks.js
    Meteor.call('incrementScore', _roomId, cardOwner, function(err, id) {
      if (err) {
        throw err;
      }
    });

    // stores the winning card
    var board = CardsRoom.find({_id: _roomId}).fetch()[0].GameBoard;
    var answer, question;
    for (var i = 0, size = board.length; i < size; i++) {
      if (board[i].cardOwner === cardOwner) {
        answer = board[i];
      }
      if (board[i].black) {
        question = board[i];
      }
    }
    // var answer = GameBoard.findOne({owner: cardOwner});
    // // stores the question card
    // var question = GameBoard.findOne({black: true});

    // calls clearLosers from decks.js, which clears the GameBoard, then inserts
    // the winning card along with the card it answered into GameBoard
    Meteor.call("clearLosers", _roomId, answer, question, function(err, result){
      if(err) {
        throw err;
      }
    });

  },

  // Event listener tied to the 'Let's play another, you smarmy wench' button
  // which is only shown if the judge has chosen the winning card.
  "click #nextRound": function(){
    var _roomId = getId();
    // calls newRound which removes round data
    Meteor.call('newRound', _roomId, function(err, result){
      if(err) {
        throw err;
      }
    })

    // remove cards from GameBoard
    Meteor.call('clearGameBoard', _roomId, function (err, result) {
      if (err) {
        throw err;
      }
    })

    // pass 'judgeship' to next user
    Meteor.call('toggleJudge', _roomId, function (err, result) {
      if (err) {
        throw err;
      }
    })

    // draw next black card
    Meteor.call("drawBlack", _roomId, function(err, res){
      if(err){
        throw err;
      }
    })
  }

});



