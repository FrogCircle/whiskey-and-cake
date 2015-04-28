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
  loadingTemplate: 'layout',
  onBeforeAction: function() {
    Session.set('currentRoomId', this.params.room);
    console.log('currentRoomId is ', this.params.room);
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
  onStop: function() {
    //// Remove the user from the list of users.
    //var roomUserId = Session.get('userRoomId');
    //RoomUsers.remove({ _id : roomUserId });
    Session.set('currentRoomId', null);
  }
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
