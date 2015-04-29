Template.home.helpers({
  loadRooms: function(){
    var array = CardsRoom.find().fetch();
    console.log('Roomsarray on homepage is ', array);
    var result = [];
    for (var i = 0, size = array.length; i < size; i++) {
      result.push({room: {room: array[i]._id, roomName: array[i].roomName, owner: array[i].createdBy}});
    }
    return result.reverse();
  },
  roomOwner: function(){
    console.log('this is ', this);
    if( this.room.owner === Meteor.user()._id ) {
      return true;
    } else {
      return false;
    }

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
    if( newRoomName.length === 0 ) {
      alert('Your room needs a name, come on!');
    } else {
      Meteor.call('CreateCardsRoom', newRoomName, function(error, room){
        holder.push(room);
        Session.set('roomId', holder);
      });
      //show createRoomButton
      $('.create-room-btn').css('display', 'block');
      $('.create-room-name').css('display', 'none');
    }
  },

  "click .joinNewRoom": function() {
    var userObj = Meteor.user();
    userObj.judge = false;
    userObj.cards = [];
    var roomId = this.room;
    Meteor.call('JoinCardsRoom', roomId, userObj, function(error, result) {
    });
  },
  "click .joinExistingRoom": function() {
    var userObj = Meteor.user();
    userObj.judge = false;
    var roomId = this.room.room;
    Session.set('roomUrl', roomId);
    Meteor.call('JoinCardsRoom', roomId, userObj, function(error, result) {
    });
  },
  "click .delete-room-link": function(e) {
    //var x = $(this).closest('li').find('a');
    var checkDelete = confirm('Are you sure you want to delete this room?');
    if ( checkDelete ) {
      var x = $(this);
      var roomId = x[0].room.room;
      var userId = Meteor.user()._id;
      //call delete room
      Meteor.call('deleteRoom', roomId, userId);
    }
  }
});