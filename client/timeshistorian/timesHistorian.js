// Helper functions for player-hand-view.html

Template.timesHistorianHand.helpers({
  getOptions: function(){
    return CardsRoom.find({"_id": "ABCD"}).fetch()[0].gameBoard.choices;
  }
});



// player-hand-view.html template event listeners
Template.timesHistorian.events({
    "click .timesButton": function (event) {


      var renderLines = function(articles){
        for (var i = 0; i < articles.length; i++){
          $('.articles').append(articles[i] + "<br><br>");
        }
      };


      Meteor.call('getTimesData', function(err, id){
        var options = [];
       // Meteor.call('createRoom', Session.get("roomId"), function(err, id){
        //   console.log(123);
        // });

        // There is a very weird bug I am working on here where the data isn't
        // showing up in mongo, even though it must as the id had been returned.
        // I used a shortcut for now and will finish debugging later.
        var data = id
        // console.log(id, TimesHistorianData.findOne(id));
        // console.log(TimesHistorianData.find({'_id':id}));
        // console.log(id, data);

        for (var i = 0; i < data.choices.length; i++){
          options.push({'text':data.choices[i]});
        }
        var yearAnswer = '' + data.chosen.getFullYear();
        var temp = yearAnswer.split('');
        temp[3] = '0';
        var decade_answer = temp.join('');
        Session.set('options', options);
        Session.set('answer', decade_answer);
        renderLines(data.results);
      });
    },

    "click .card": function (event){
      if (this.text===Session.get('answer')){
        alert("You Won");
      }
    }
});


