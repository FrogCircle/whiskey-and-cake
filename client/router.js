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
  onBeforeAction: function() {
    Session.set('currentRoomId', this.params.room);
    this.next();
  },
  waitOn: function () {
    // subscibe only to the messages for this room
    Meteor.subscribe('roomMessages', this.params.room);
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
  //see controller below
  controller: 'CASController'
});

Router.route('/moviecloud/:room', {
  // this template will be rendered until the subscriptions are ready
  //loadingTemplate: 'layout',
  onBeforeAction: function() {
    Session.set('currentRoomId', this.params.room);
    console.log('Session.get(currentRoomId is ', Session.get('currentRoomId'));
    Meteor.subscribe('MovieRooms', this.params.room);
    Meteor.subscribe('roomMessages', this.params.room);
    this.next();
  },
  waitOn: function () {
    console.log(111);
    // return one handle, a function, or an array
    //Meteor.subscribe('roomMessages', this.params.room);
    //Meteor.subscribe('MovieRooms', this.params.room);
  },
  action: function () {
    //var movieRoom = this.params.room;
    //Session.set('gameName', this.params.room);
    //serveGame('movieCloud', movieRoom);
    this.render('timesHistorian', {to: 'show'});
  },
  name: 'moviecloudroom'
});

CASController = RouteController.extend({
  unload: function() {
    var roomId = Session.get('currentRoomId');
    //remove user from CardsRoom when they click away from room
    var userId = Meteor.user()._id;
    var gameInformation = CardsRoom.update({_id: roomId}, {$pull: {users: {'_id': userId}}});
    //TODO: remove user if they close webpage or browser (disconnect)
  }
});
