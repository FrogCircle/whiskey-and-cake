
Meteor.subscribe('MovieRoundData');

var options = [];

Template.movieCloudHand.helpers({
  getOptions: function(){
    return options;
  }
});




Template.movieCloud.helpers({

});

// player-hand-view.html template event listeners
Template.movieCloud.events({
    "click .movieButton": function (event) {
      Meteor.call('getMovieData', function(err, id){

        options = [];

        // now loading the data into options
        console.log(id);
        var data = MovieRoundData.findOne(id);
        console.log(data);
        for (var i = 0; i < data.choices.length; i++){
          options.push({'text':data.choices[i]});
        }
        console.log(options);
      });
    }


});