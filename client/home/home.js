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
      result.push({room: {room: array[i]._id, roomName: array[i].roomName}});
    }
    console.log('result is ', result);
    return result;
  }
});

var holder = [];
// player-hand-view.html template event listeners
Template.home.events({
  "click #createRoomName": function(e){
    //hide createRoomName button and show createRoomDiv
    $('.create-room-btn').css('display', 'none');
    $('.create-room-name').css('display', 'block');
  },

  "click .cancel": function() {
    $('.create-room-btn').css('display', 'block');
    $('.create-room-name').css('display', 'none');
  },

  "click #createCardsRoom": function(){
    var newRoomName = $('#cardsRoomName').val();
    Meteor.call('CreateCardsRoom', newRoomName, function(error, room){
      console.log('room is ', room);
      holder.push(room);
      Session.set('roomId', holder);
      console.log('Session is ', Session);
    });
    console.log("create room clicked");
    //show createRoomButton
    $('.create-room-btn').css('display', 'block');
    $('.create-room-name').css('display', 'none');
  },

  "click .joinNewRoom": function() {
    var userObj = Meteor.user();
    userObj.judge = false;
    userObj.cards = [];
    console.log('userObj is ', userObj);
    var roomId = this.room;
    Meteor.call('JoinCardsRoom', roomId, userObj, function(error, result) {
      console.log('inside joinCardsRoom ', result);
    });
  },
  "click .joinExistingRoom": function() {
    var userObj = Meteor.user();
    userObj.judge = false;
    console.log('userObj is ', userObj);
    var roomId = this.room.room;
    Session.set('roomUrl', roomId);
    Meteor.call('JoinCardsRoom', roomId, userObj, function(error, result) {
      console.log('inside joinCardsRoom ', result);
    });
  }
});