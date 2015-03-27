Template.home.helpers({
  createRoom: Meteor.call('CreateRoom', function(){
    console.log("in helpers");
  })
});

// player-hand-view.html template event listeners
Template.home.events({
  "click #createRoom": function(){
    Meteor.call('CreateRoom', function(){
      console.log("in events");
    });
    console.log("create room clicked");
  }
});