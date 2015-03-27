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
