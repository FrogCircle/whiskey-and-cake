var path = document.location.pathname;
var _roomId = path.split('/');
_roomId = _roomId[_roomId.length-1];


Template.gameBoard.helpers({

  // Returns all online users
  //CHANGE THIS TO FIND ONLY USERS IN THIS GAME
  users: function(){
    return Meteor.users.find({'status.online': true});
  },

  // Returns the black question card currently on the GameBoard
  question: function(){
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
    if (Meteor.users.find({'status.online': true}).count() === 0) {
      return 'NO';
    } else {
      return Meteor.users.find({'status.online': true}).count();   
    }
  },

  // Returns a count of all played cards on the board
  cardsPlayed: function(){
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
    var count = Meteor.users.find({'status.online': true}).count();
    var board = CardsRoom.find({_id: _roomId}).fetch()[0].GameBoard;
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
    var players = (Meteor.users.find().count() - 1);
    var played = CardsRoom.find({_id: _roomId}).fetch()[0].GameBoard
    //var played = GameBoard.find({black: false}).count();
    return players - played === 0;
  },

  // Returns true if the judge has chosen the winning card. 
  // When true, the game-board-view.html will display a button that starts the next round
  winnerChosen: function(){
    var round = CardsRoom.find({_id: _roomId}).fetch()[0].RoundInfo;
    //var round = RoundInfo.findOne({});
    return round.roundOver;
  }

});


Template.gameBoard.events({
  "click .answerCards": function (event) {
    event.stopPropagation();

    // calls endRound from deck.js, which sets roundOver to true for the winnerChosen helper above
    Meteor.call('endRound', function(err, res){
      if(err){
        throw err;
      }
    });

    // store click context to pass into method call
    console.log(this, "this in gameboard event");
    var cardOwner = this.owner;

    // calls incrementScore from decks.js
    Meteor.call('incrementScore', cardOwner, function(err, id) {
      if (err) {
        throw err;
      }
    });

    // stores the winning card
    var board = CardsRoom.find({_id: _roomId}).fetch()[0].GameBoard;
    var answer, question;
    for (var i = 0, size = board.length; i < size; i++) {
      if (board[i].cardOwner === cardOwner) {
        answer = board[1];
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
    Meteor.call("clearLosers", answer, question, function(err, result){
      if(err) {
        throw err;
      }
    });

  },

  // Event listener tied to the 'Let's play another, you smarmy wench' button 
  // which is only shown if the judge has chosen the winning card.
  "click #nextRound": function(){

    // calls newRound which removes round data
    Meteor.call('newRound', function(err, result){
      if(err) {
        throw err;
      }
    })

    // remove cards from GameBoard
    Meteor.call('clearGameBoard', function (err, result) {
      if (err) {
        throw err;
      }
    })

    // pass 'judgeship' to next user
    Meteor.call('toggleJudge', function (err, result) {
      if (err) {
        throw err;
      }
    })

    // draw next black card
    Meteor.call("drawBlack", roomId, function(err, res){
      if(err){
        throw err;
      } 
    })
  }

});



