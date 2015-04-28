Meteor.methods({

  createRoomTimes: function(roomID){
    var insertObj =
    { "_id": roomID,
      "users": [],
      "scoreBoard": [],
      "answered": false,
      "gameBoard": {"result": [], "choices": [], "chosen": ""},
      "roundInfo": {"roundNum": 0,  "lastWinner": ""}
    }
    TimesHistorianRoom.insert(insertObj);
  },

  getTimesData: function(roomID){

    // function to take a date and return it in the right string format
    var dateToString = function(inputDate){
      var year = inputDate.getFullYear();
      var month = ''+inputDate.getMonth();
      if (month.length === 1){
        month = '0' + month;
      }
      var day  = ''+inputDate.getDate();
      if (day.length === 1){
        day = '0' + day
      }
      return ''+year+month+day;
    };

    // generate a random date between start and end
    var genDate = function(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    // Get random decades for the choices
    var getRandDecades = function(chosenDate){
      var result = [];
      var randN;
      var decades = ['1850','1860','1870','1880','1890','1900','1910','1920','1930','1940','1950','1960','1970','1980','1990'];
      var year = '' + chosenDate.getFullYear();
      year = year.split('');
      year[3] = '0';
      result.push(year.join(''));
      while (result.length < 5){
        randN = Math.floor((Math.random() * decades.length));
        if (result.indexOf(decades[randN]) === -1){
          result.push(decades[randN]);
        }
      }
      return result.sort();
    };
    // function to get the articles
    var getArticles = function(cb){
      var startDate = new Date(1851, 8, 19);
      var endDate = new Date(1999,12,31);
      // getting random date
      var randDate = genDate(startDate, endDate);
      // converting to string
      var randomDate = dateToString(randDate);
      var parsedArticles = [];
      HTTP.get("http://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date="+randomDate+"&end_date="+randomDate+"&api-key=654452f497823c3cdae2119e3bdd6b4f:9:71687614",{}, function(err, data){
        for (var i = 0; i < data.data.response.docs.length; i++){
          if (data.data.response.docs[i].lead_paragraph && parsedArticles.length < 5){
            parsedArticles.push(data.data.response.docs[i].lead_paragraph);
          }
        }

        var temp = [];
        var decades = getRandDecades(randDate);
        for (var i = 0; i < decades.length; i++){
          temp.push({'text': decades[i]});
        }
        randDate = '' + randDate.getFullYear();
        randDate = randDate.split('');
        randDate[3] = '0';
        randDate = randDate.join('');
        var stringResult = {'result': parsedArticles, 'choices': temp, 'chosen': randDate};
        TimesHistorianRoom.update({"_id": roomID}, {$set: {'gameBoard': stringResult, 'answered': false}});
        cb(err, data);
      });
    };
    var result = Meteor.wrapAsync(getArticles)
    return result();

  }
});

Meteor.publish("TimesHistorianRoom", function() {
  return TimesHistorianRoom.find();
});
