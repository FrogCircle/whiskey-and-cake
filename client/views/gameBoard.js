Template.gameBoard.helpers({

  // Returns all online users
  //CHANGE THIS TO FIND ONLY USERS IN THIS GAME
  users: function(){
    return Meteor.users.find({'status.online': true});
  },

  // Returns the black question card currently on the GameBoard
  question: function(){
    return GameBoard.find({black: true});
  },

  // Returns the white answer cards currently on the GameBoard  
  answers: function(){
    return GameBoard.find({black: false});
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
    return GameBoard.find({black: false}).count()
  },

  // Returns a count of the cards still needed to be played for the round
  cardsLeft: function(){
    var count = Meteor.users.find({'status.online': true}).count();
    return Math.max(0, (count - 1) - GameBoard.find({black: false}).count());
  },

  // Returns true if all of the cards have been played, which signifies that the round is over
  allCardsPlayed: function(){
    var players = (Meteor.users.find().count() - 1);
    var played = GameBoard.find({black: false}).count();
    return players - played === 0;
  },

  // Returns true if the judge has chosen the winning card. 
  // When true, the game-board-view.html will display a button that starts the next round
  winnerChosen: function(){
    var round = RoundInfo.findOne({});
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
    var cardOwner = this.owner;

    // calls incrementScore from decks.js
    Meteor.call('incrementScore', cardOwner, function(err, id) {
      if (err) {
        throw err;
      }
    });

    // stores the winning card
    var answer = GameBoard.findOne({owner: cardOwner});
    // stores the question card
    var question = GameBoard.findOne({black: true});

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
    Meteor.call("drawBlack", function(err, res){
      if(err){
        throw err;
      } 
    })
  }

});



