Template.home.helpers({
  loadCardRooms: function(){
    var array = CardsRoom.find().fetch();
    var result = [];
    for (var i = 0, size = array.length; i < size; i++) {
      result.push({room: {room: array[i]._id, roomName: array[i].roomName, owner: array[i].createdBy}});
    }
    console.log('loadCardRooms is ', result);
    return result.reverse();
  },
  roomOwner: function(){
    if( this.room.owner === Meteor.user()._id ) {
      return true;
    } else {
      return false;
    }
  },
  loadMovieRooms: function(){
    var movieRooms = MovieRooms.find().fetch();
    var result = movieRooms.map(function(elem, index){
      return {room: {room: elem._id, roomName: elem.roomName, owner: elem.createdBy}};
    }).reverse();
    console.log('loadMovieRooms result is ', result);
    return result;
  },
  loadTimesRooms: function(){
    var TimesHistorianRooms = TimesHistorianRoom.find().fetch();
    var result = TimesHistorianRooms.map(function(elem, index){
      return {room: {room: elem._id, roomName: elem.roomName, owner: elem.createdBy}};
    }).reverse();
    console.log('loadMovieRooms result is ', result);
    return result;

  }
});

var holder = [];
// player-hand-view.html template event listeners
Template.home.events({
  "click #createRoomName": function(e){
    //hide createRoomName button and show createRoomDiv
    //$('.create-room-btn').css('display', 'none');
    //$('.create-room-name').css('display', 'block');
    var $this = $(e.target);
    $this.closest('.create-room-btn').css('display', 'none');
    $this.parent().parent().find('.create-room-name').css('display', 'block');

  },

  "click #createMovieRoomName": function(e){
    //hide createRoomName button and show createRoomDiv
    var $this = $(e.target);
    $this.closest('.create-room-btn').css('display', 'none');
    $this.parent().parent().find('.create-room-name').css('display', 'block');
  },

  "click .cancel": function(e) {
    var $this = $(e.target);
    //$('.create-room-btn').css('display', 'block');
    //$('.create-room-name').css('display', 'none');
    $this.closest('.well').find('.create-room-btn').css('display', 'block');
    $this.parent().parent().find('.create-room-name').css('display', 'none');

  },

  "click #createCardsRoom": function(e){
    console.log('createCardsRoom called ');
    var $this = $(e.target);
    var newRoomName = $('#cardsRoomName').val();
      $('#cardsRoomName').val('aa');
    if( newRoomName.length === 0 ) {
      alert('Your room needs a name, come on!');
    } else {
      $this.closest('.well').find('.create-room-btn').css('display', 'block');
      $this.closest('.well').find('.create-room-name').css('display', 'none');
      Meteor.call('CreateCardsRoom', newRoomName, function(error, room){
        holder.push(room);
        Session.set('roomId', holder);
      });
      //show createRoomButton
      $this.parent().parent().find('.create-room-btn').css('display', 'block');
      $this.parent().parent().find('.create-room-name').css('display', 'none');
    }
  },

  "click #createMovieRoom": function(e){
    console.log('createMovieRoom called ');
    var userId = Meteor.user()._id;
    var username = Meteor.user().username;
    var $this = $(e.target);
    var newRoomName = $('#movieRoomName').val();
    console.log('newRoomName is ', newRoomName);
    if( newRoomName.length === 0 ) {
      alert('Your room needs a name, come on!');
    } else {
      Meteor.call('createMovieOrTimesRoom', MovieRooms, newRoomName, userId,  username,  function(err, room){
        holder.push(room);
        Session.set('roomId', holder);
      });
      //show createRoomButton and hide the div with input box for room name
      $this.parent().parent().find('.create-room-btn').css('display', 'block');
      $this.parent().parent().find('.create-room-name').css('display', 'none');
      //clear out input
      $('#movieRoomName').val('');
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
    var checkDelete = confirm('Are you sure you want to delete this room?');
    if ( checkDelete ) {
      var x = $(this);
      var roomId = x[0].room.room;
      var userId = Meteor.user()._id;
      //call delete room
      Meteor.call('deleteCardsRoom', roomId, userId);
    }
  },
  "click .delete-movie-room-link": function(e) {
    var checkDelete = confirm('Are you sure you want to delete this room?');
    if ( checkDelete ) {
      var x = $(this);
      var roomId = x[0].room.room;
      var userId = Meteor.user()._id;
      //call delete room
      Meteor.call('deleteMovieRoom', roomId, userId);
    }
  }
});