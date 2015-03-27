Template.home.helpers({
  createRoom: function(){
    console.log("createRoom fcn called");
    console.log('Session.get(roomId) is ', Session.get('roomId'));
    return Session.get('roomId');
  }
});

// player-hand-view.html template event listeners
Template.home.events({
  "click #createCardsRoom": function(){
    Meteor.call('CreateCardsRoom', function(error, room){
      //room.room = '/cardsagainstsobriety/' + room.room;
      //room = [room];
      console.log("room is ", room);
      Session.set('roomId', room);
      console.log('Session is ', Session);
    });
    console.log("create room clicked");
  }
});