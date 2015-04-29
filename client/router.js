Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function(){
  this.render('home', {to: 'show'});
});

Router.route('/cardsagainstsobriety', function(){
  this.render('cardsAgainstSobriety', {to: 'show'});
}, {
  name: 'cardsagainstsobriety'
});

Router.route('/moviecloud', function() {
  this.render('movieCloud', {to: 'show'});
}, {
  name: 'moviecloud'
});

Router.route('/timeshistorian', function() {
  this.render('timesHistorian', {to: 'show'});
}, {
  name: 'timeshistorian'
});


Router.route('/cardsagainstsobriety/:room', {
  // this template will be rendered until the subscriptions are ready
  //loadingTemplate: 'layout',
  onBeforeAction: function() {
    Session.set('currentRoomId', this.params.room);
    this.next();
  },
  waitOn: function () {
    // subscibe only to the messages for this room
    return Meteor.subscribe('roomMessages', this.params.room);
  },
  data: function () {
    var roomMessages = Messages.findOne({roomId: this.params.room});
    return {
      messages : roomMessages
    }
  },

  action: function () {
    this.render('cardsAgainstSobriety', {to: 'show'});
  },
  name: 'cardsagainstsobriety2',
  controller: 'CASController'
});

Router.route('/moviecloud/:_id', {
  // this template will be rendered until the subscriptions are ready
  loadingTemplate: 'layout',

  waitOn: function () {
    // return one handle, a function, or an array
    return Meteor.subscribe('MovieRoundData', this.params._id);
  },

  action: function () {
    this.render('movieCloudHand');
  }
});

CASController = RouteController.extend({
  unload: function() {
    var roomId = Session.get('currentRoomId');
    console.log('roomId987 is ', roomId);
    //remove user from CardsRoom
    var userId = Meteor.user()._id;
    console.log('userId is ', userId);
    var gameInformation = CardsRoom.update({_id: roomId}, {$pull:{users: {'_id': userId}}});
    console.log('gameInformation is ', gameInformation);
    var usersArray = CardsRoom.findOne({ '_id': roomId}).users;
    console.log('usersArray from Router111 is ', usersArray);
    //  , function(err, room) {
    //  var newUserArray = _.filter(room.users, function(elem, index) {
    //    if( elem._id !== userId ) return elem;
    //  });
    //  console.log('newUserArray is ', newUserArray);
    //  room.users = newUserArray;
    //  room.save();
    //});
    Session.set('currentRoomId', null);
  }

});
