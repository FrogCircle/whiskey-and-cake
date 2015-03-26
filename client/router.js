Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function(){
  this.render('home', {to: 'home'});
});

Router.route('/cardsagainstsobriety', function(){
  this.render('cardsAgainstSobriety', {to: 'cardsagainstsobriety'});
}, {
  name: 'cardsagainstsobriety'
});

Router.route('/moviecloud', function() {
  this.render('movieCloud', {to: 'moviecloud'});
}, {
  name: 'moviecloud'
});

Router.route('/timeshistorian', function() {
  this.render('timesHistorian', {to: 'timeshistorian'});
}, {
  name: 'timeshistorian'
});
