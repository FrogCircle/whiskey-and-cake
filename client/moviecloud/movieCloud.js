
Meteor.subscribe('MovieRoundData');


Template.movieCloudHand.helpers({
  getOptions: function(){
    return Session.get("id");
    }
});




Template.movieCloud.helpers({

});

// player-hand-view.html template event listeners
Template.movieCloud.events({
    "click .movieButton": function (event) {
      Meteor.call('getMovieData', function(err, id){
        var options = [];
        console.log('id ', id);
        for (var i = 0; i < id.id.choices.length; i++){
          options.push({text: id.id.choices[i]});
        }
        console.log(options);
        Session.set("id", options);

        //call redirect

        // now loading the data into options
/*        console.log(id);
        var data = MovieRoundData.findOne(id);
        console.log(data);
        for (var i = 0; i < data.choices.length; i++){
          options.push({'text':data.choices[i]});
        }
         Session.set("id", options);

         console.log(options);*/
      });
    }
});

