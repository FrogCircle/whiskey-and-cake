Template.leadeboard.helpers({
  players: function(){
    return Session.get('gameData').scoreBoard;
  },

  lastWinner: function(){
    return Session.get('gameData').roundInfo.lastWinner;
  },

  roundNum: function(){
    return Session.get('gameData').roundInfo.roundNum;
  }
});