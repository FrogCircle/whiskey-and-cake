 Template.home.helpers({
  loadCardRooms: function(){
    var array = CardsRoom.find().fetch();
    var result = [];
    for (var i = 0, size = array.length; i < size; i++) {
      result.push({room: {room: array[i]._id, roomName: array[i].roomName, owner: array[i].createdBy}});
    }
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
    return result;
  },
  loadTimesRooms: function(){
    var TimesHistorianRooms = TimesHistorianRoom.find().fetch();
    var result = TimesHistorianRooms.map(function(elem, index){
      return {room: {room: elem._id, roomName: elem.roomName, owner: elem.createdBy}};
    }).reverse();
    return result;

  }
});

var holder = [];
// player-hand-view.html template event listeners
Template.home.events({
  "click #createRoomName": function(e){
    //hide createRoomName button and show createRoomDiv
    var $this = $(e.target);
    $this.closest('.create-room-btn').css('display', 'none');
    $this.parent().parent().find('.create-room-name').css('display', 'block');

  },
  "click .cancel": function(e) {
    var $this = $(e.target);
    $this.closest('.well').find('.create-room-btn').css('display', 'block');
    $this.parent().parent().find('.create-room-name').css('display', 'none');

  },

  "click #createCardsRoom": function(e){
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
    var userId = Meteor.user()._id;
    var username = Meteor.user().username;
    var $this = $(e.target);
    var newRoomName = $('#movieRoomName').val();
    if( newRoomName.length === 0 ) {
      alert('Your room needs a name, come on!');
    } else {
      MovieRooms.insert({
        "users": [],
        "scoreBoard": [],
        "answered": false,
        "gameBoard": {"result": [], "choices": [], "chosen": ""},
        "roundInfo": {"roundNum": 0, "lastWinner": ""},
        "createdAt": new Date(),
        "createdBy": userId,
        "roomName" : newRoomName
      }, function(err, roomInserted) {
        Messages.insert({
          createdById: userId,
          createdByName: username,
          createdAt: new Date(),
          roomId: roomInserted,
          messages: []
        }, function (err, messageInserted) {
          if( err ) {
            console.log('error while creating doc in messages collection');
          }
        });
      });
      $this.parent().parent().find('.create-room-btn').css('display', 'block');
      $this.parent().parent().find('.create-room-name').css('display', 'none');
    }
  },

  "click #createTimesRoom": function(e){
    var userId = Meteor.user()._id;
    var username = Meteor.user().username;
    var $this = $(e.target);
    var newRoomName = $('#timesRoomName').val();
    if( newRoomName.length === 0 ) {
      alert('Your room needs a name, come on!');
    } else {
      TimesHistorianRoom.insert({
        "users": [],
        "scoreBoard": [],
        "answered": false,
        "gameBoard": {"result": [], "choices": [], "chosen": ""},
        "roundInfo": {"roundNum": 0, "lastWinner": ""},
        "createdAt": new Date(),
        "createdBy": userId,
        "roomName" : newRoomName
      }, function(err, roomInserted) {
        Messages.insert({
          createdById: userId,
          createdByName: username,
          createdAt: new Date(),
          roomId: roomInserted,
          messages: []
        }, function (err, messageInserted) {
          if( err ) {
            console.log('error while creating doc in messages collection');
          }
        });
      });
      $this.parent().parent().find('.create-room-btn').css('display', 'block');
      $this.parent().parent().find('.create-room-name').css('display', 'none');
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
  "click .delete-room": function(e) {
    var checkDelete = confirm('Are you sure you want to delete this room?');
    if ( checkDelete ) {
      var roomId = $(this)[0].room.room;
      var userId = Meteor.user()._id;
      Meteor.call('deleteRoom', roomId, userId, e.target.name);
    }
  }

});


