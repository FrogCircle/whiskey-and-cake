// Helper functions for player-hand-view.html

Template.timesHistorian.helpers({


});

// player-hand-view.html template event listeners
Template.timesHistorian.events({
    "click .timesButton": function (event) {
      Meteor.call('getTimesData', function(err, id){
        console.log(id, 'resultId');
      });
    }
});


