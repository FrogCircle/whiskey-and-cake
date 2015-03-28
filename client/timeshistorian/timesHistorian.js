Meteor.subscribe('TimesHistorianRoom');

Template.timesHistorianHand.helpers({
  getOptions: function(){
    console.log("in get options")
    var data = TimesHistorianRoom.find({"_id": "ABCD"}).fetch()[0].gameBoard.chosen;
    var result = TimesHistorianRoom.find({"_id": "ABCD"}).fetch()[0].gameBoard.result;
    console.log(data);
    var yearAnswer = '' + data.getFullYear();
    var temp = yearAnswer.split('');
    temp[3] = '0';
    var decade_answer = temp.join('');
    Session.set("answer", decade_answer);
    renderLines(result);
    return TimesHistorianRoom.find({"_id": "ABCD"}).fetch()[0].gameBoard.choices;
  }
});

var renderLines = function(articles){
  $('.articles').empty();
  for (var i = 0; i < articles.length; i++){
    $('.articles').append(articles[i] + "<br><br>");
  }
};

// player-hand-view.html template event listeners
Template.timesHistorian.events({
    "click .timesButton": function (event) {


      // Meteor.call('createRoomTimes', "ABCD", function(err, id){
      //   console.log(123);
      // });

      Meteor.call('getTimesData', "ABCD", function(err, id){
      });
    },

    "click .card": function (event){
      var data = TimesHistorianRoom.find({"_id": "ABCD"}).fetch()[0];
      if (this.text.split(' ').join('_')===Session.get('answer')){
        if (!data.answered){
          // I won
          data.answered = false;
          var me = Meteor.user().username;
          if (!data.scoreBoard[me]){
            data.scoreBoard[me] = 1;
          } else{
            data.scoreBoard[me] = data.scoreBoard[me] + 1;
          }
          data.roundInfo.lastWinner = me;
          data.roundInfo.roundNum = data.roundInfo.roundNum + 1;
          data.answered = true;
          Meteor.call('setWinnerTimes','ABCD', data, function(err, id){
          })
          alert('you won!');
          console.log(data.scoreBoard);
        }
      }
    },
});


