Template.timesHistorianHand.created = function () {
  // The created function and the ready function work together and
  // prever the template from looking for data before it is loaded,
  // which would throw a non-breaking error in browser.
  this.subscriptions = [
    Meteor.subscribe('TimesHistorianRoom')
  ];
};

Template.timesHistorianHand.destroyed = function () {
  _.each(this.subscriptions, function (sub) {
    sub.stop();
  });
};


Template.timesHistorianHand.helpers({
  getOptions: function(){
    return Session.get('gameData');
  },
  ready: function () {
    return _.all(Template.instance().subscriptions, function (sub) {
      return sub.ready();
    });
  }
});

var getAnswer = function(){
  // helper function to get the answer
  return Session.get('gameData').gameBoard.chosen;
};

// player-hand-view.html template event listeners
Template.timesHistorian.events({
    "click .timesButton": function (event) {
      // Create room populates the DB with the neccisarry document and doesn't
      // need to be called every time, only when you need to delete and recreate
      // document
      // Meteor.call('createRoomTimes', 'ABCD');
      // If there is no game or if the current game is over
      if (!Session.get('gameData') || Session.get('gameData').answered){
        // Calling a function on the server which will update the database
        Meteor.call('getTimesData', "ABCD", Meteor.user().username, function(err, id){
          // In the call back (which runs after the data is in the db), we set the
          // game data to session which triggers full stack reactivity, but we have
          // to manually call render SVG as it is not reactive
          Session.set('gameData', TimesHistorianRoom.findOne("ABCD"));
          renderLines(Session.get('gameData').gameBoard.result);
        });
      } else {
        alert("The current game is in progress and there is no winnder yet!")
      }
    },

    "click .card": function (event){
      var updateScoreBoard = function(playerName, data){
        // In order for Meteor to be able to use the data easily in the template
        // it needs to be in this format:
        // scoreboard = [{name: eddie, points: 2},{name: jonah, points: 1}]
        // this function gets the data into that format
        // This function would not exist if data looked like the following
        // {eddie: 2, jonah: 1}
        // But then we would have to convert data from that format to the
        // Meteoresque format every time the reactive data updates, which would be
        // inefficient. Full stack reactivity works best when the data is in teh right
        // format in the db.
        var exists = false;
        for (var i = 0; i < data.scoreBoard.length; i++){
          if (data.scoreBoard[i].name === playerName){
            exists = true;
            data.scoreBoard[i].points++;
          }
        }
        if (!exists){
          data.scoreBoard.push({name: playerName, points: 1});
        }
        return data;
      };


      // Getting the data from Session
      // Rather than making several updates to the DB we 'check out' the data
      // and only make 1 update
      var data = Session.get('gameData');
      // Checking to see if it is the right answer
      if (this.text.split(' ').join('_')===getAnswer()){
        // Checking to see if the round has already been won
        if (!data.answered){
          // Getting username
          var me = Meteor.user().username;
          // Updating score board is verbose due to data format so logic is delegated
          data = updateScoreBoard(me, data);
          data.roundInfo.roundNum += 1;
          data.roundInfo.lastWinner = me;
          // Signalling that the round is over
          data.answered = true;
          // When updating you can't update _id so it is deleted from data object
          delete data['_id'];
          // Checking data back into db
          TimesHistorianRoom.update("ABCD", {$set: data});
          // updating the Session - This will get re-set to exactlyt he same when Meteor
          // triggers the update from the server, so essentially this is latency compensation
          Session.set('gameData',TimesHistorianRoom.findOne("ABCD"));
          alert('You won!');
        } else{
          alert('You are right, but not the first one to answer')
        }
      } else{
        // This is here to slow players down, i.e. you can't click all buttons without thinking
        alert('Wrong answer')
      }
    }
});

var renderLines = function(articles){
  $('.articles').empty();
  for (var i = 0; i < articles.length; i++){
    $('.articles').append(articles[i] + "<br><br>");
  }
};

