Template.leadeboard.helpers({
  players: function(){
    if (Session.get(Session.get('currentRoomId'))){
      return Session.get(Session.get('currentRoomId')).scoreBoard;
    }
    return;
  },

  lastWinner: function(){
    if (Session.get(Session.get('currentRoomId'))){
      return Session.get(Session.get('currentRoomId')).roundInfo.lastWinner;
    }
    return;
  },

  roundNum: function(){
    if (Session.get(Session.get('currentRoomId'))){
      return Session.get(Session.get('currentRoomId')).roundInfo.roundNum;
    }
    return;
  }
});