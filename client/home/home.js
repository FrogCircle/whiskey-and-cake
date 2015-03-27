Template.home.helpers({
/*
  createRoom: function(){
    console.log("createRoom fcn called");
    console.log('Session.get(roomId) is ', Session.get('roomId'));
    return Session.get('roomId');
  },
*/
  getRooms: function(roomType) {
    //code here to get rooms for a room type
  },
  loadRooms: function(){
    console.log('CardsRoom.find().fetch is ', CardsRoom.find().fetch());
    var array = CardsRoom.find().fetch();
    var result = [];
    for (var i = 0, size = array.length; i < size; i++) {
      result.push({room: {room: array[i]._id}});
    }
    console.log('result is ', result);
    return result;
  }
});

var holder = [];
// player-hand-view.html template event listeners
Template.home.events({

  "click #createCardsRoom": function(){
    Meteor.call('CreateCardsRoom', function(error, room){
      console.log('room is ', room);
      holder.push(room);
      Session.set('roomId', holder);
      console.log('Session is ', Session);
    });
    console.log("create room clicked");
  },

  "click .joinNewRoom": function() {
    var userObj = Meteor.user();
    userObj.cards = [];
    console.log('this is', this);
    var roomId = this.room;
    Meteor.call('JoinCardsRoom', roomId, userObj, function(error, result) {
      console.log('inside joinCardsRoom ', result);
    });
  },
  "click .joinExistingRoom": function() {
    var userObj = Meteor.user();
    console.log('this is', this);
    var roomId = this.room.room;
    Meteor.call('JoinCardsRoom', roomId, userObj, function(error, result) {
      console.log('inside joinCardsRoom ', result);
    });
  }
});