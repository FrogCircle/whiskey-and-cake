Template.home.helpers({
  createRoom: function(){
    console.log("createRoom fcn called");
    console.log('Session.get(roomId) is ', Session.get('roomId'));
    return Session.get('roomId');
  },
  getRooms: function(roomType) {
    //code here to get rooms for a room type
  }
});
var holder = [];
// player-hand-view.html template event listeners
Template.home.events({
  "click #createCardsRoom": function(){
    Meteor.call('CreateCardsRoom', function(error, room){
      //room.room = '/cardsagainstsobriety/' + room.room;
      holder.push(room);
      console.log("holder is ", holder);
      Session.set('roomId', holder);
      console.log('Session is ', Session);
    });
    console.log("create room clicked");
  },
  "click .roomToJoin": function() {
    var userObj = Meteor.user();
    console.log('userObj is ', userObj);
    var roomId = this.room;
    Meteor.call('JoinCardsRoom', roomId, userObj, function(error, result) {
      console.log('indie joinCardsRoom ', result);
    });
  }
});