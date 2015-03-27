Template.home.helpers({
  createRoom: Meteor.call('CreateRoom', function(){
    console.log("in helpers");
  })
});

// player-hand-view.html template event listeners
Template.home.events({
  "click #createCardsRoom": function(){
    Meteor.call('CreateCardsRoom', function(room){
      console.log("room ", room);
    });
    console.log("create room clicked");
  }
});