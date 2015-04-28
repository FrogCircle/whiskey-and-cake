Template.leadeboard.helpers({
  players: function(){
    if (Session.get('gameData')){
      return Session.get('gameData').scoreBoard;
    }
    return;
  },

  lastWinner: function(){
    if (Session.get('gameData')){
      return Session.get('gameData').roundInfo.lastWinner;
    }
    return;
  },

  roundNum: function(){
    if (Session.get('gameData')){
      return Session.get('gameData').roundInfo.roundNum;
    }
    return;
  }
});