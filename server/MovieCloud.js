var movieFiles = ['A_Beautiful_Mind.srt',
  'A_Clockwork_Orange.srt',
  'A_Few_Good_Men.srt',
  'Back_to_the_Future.srt',
  'City_of_God.srt',
  'Diehard.srt',
  'Fight_Club.srt',
  'Forrest_Gump.srt',
  'Gladiator.srt',
  'Good_Will_Hunting.srt',
  'Inception.srt',
  'Into_the_Wild.srt',
  'Memento.srt',
  'One_Flew_Over_the_Cuckoos_Nest.srt',
  'Pulp_Fiction.srt',
  'Raiders_of_the_Lost_Arc.srt',
  'Reservoir_Dogs.srt',
  'Return_of_the_King.srt',
  'Saving_Private_Ryan.srt',
  'Scarface.srt',
  'Schindlers_List.srt',
  'Se7en.srt',
  'Terminator.srt',
  'The_Dark_Knight.srt',
  'The_Departed.srt',
  'The_Empire_Strikes_Back.srt',
  'The_Godfather.srt',
  'The_Green_Mile.srt',
  'The_Lion_King.srt',
  'The_Matrix.srt',
  'The_Princess_Bride.srt',
  'The_Shawshank_Redemption.srt',
  'The_Silence_of_the_Lambs.srt',
  'Toy_Story.srt'];

var fs = Npm.require('fs');
var parser = Npm.require('subtitles-parser');
var commonWords = Assets.getText('stopwords.txt');

Meteor.methods({

  getMovieData: function() {
    // Reading from a file of common words to keep out of word cloud and putting into an object for quick lookup
    var commonWordsDic = {};
    _.each(commonWords.split("\n"), function(word) {
      commonWordsDic[word] = true;
    });

    // reading the movie directory and randomly selecting a file. We read that file using the srt parser and then
    // put the data into a Javascript dictionary
    randMovies = [];
    while (randMovies.length < 10) {
      var randN = Math.floor((Math.random() * movieFiles.length));
      var randMovie = movieFiles[randN].split('.')[0];
      if (randMovies.indexOf(randMovie) === -1) {
        randMovies.push(randMovie);
      }
    }

    var randN = Math.floor((Math.random() * randMovies.length));
    var randMovieFile = randMovies[randN] + '.srt';
    console.log(randMovies);

    console.log(randMovieFile);
    var srt = Assets.getText('Movies/' + randMovieFile);
    var data = parser.fromSrt(srt);

    // A function to read each line and count the usage of every word
    // We have to correct for common words and punctuation
    var data_convert = function(data, choices, chosen) {
      // initi storage object
      var tempObj = {};

      // Helper function to create a new 'word' object
      var newMovie = function(text) {
        var result = {};
        result['text'] = text;
        result['size'] = 1;
        tempObj[text] = result;
      };

      // Function to normalize the words. There is still a lot to do here.
      var splitString = function(input) {
        var result = [];
        wordList = input.split(" ");
        _.each(wordList, function(word) {
          word = word.replace(/\./g, "");
          word = word.replace(/\"/g, "");
          word = word.replace(/\'/g, "");
          word = word.replace(/\\/g, "");
          word = word.replace(/\-/g, "");
          word = word.replace(/\?/g, "");
          word = word.replace(/\,/g, "");
          word = word.replace(/\:/g, "");
          word = word.replace(/\!/g, "");
          word = word.replace(/\(/g, "");
          word = word.replace(/\)/g, "");
          word = word.replace(/\</g, "");
          word = word.replace(/\>/g, "");
          word = word.replace(/\//g, "");
          word = word.replace('=', "");
          word = word.replace('#', "");
          word = word.replace('font', "");
          word = word.replace('color', "");
          word = word.replace('<i>', "");
          word = word.replace('</i>', "");
          word = word.replace(/[0-9]/g, "");
          word = word.toLowerCase();
          word = word.toLowerCase();
          if (!commonWordsDic[word] && word != "") {
            result.push(word);
          }
        });
        return result;
      };

      // Getting a random 200 lines
      var randStart = Math.floor(Math.random() * (data.length - 201));
      var randEnd = randStart + 200;

      // for each line
      for (var i = randStart; i < randEnd; i++) {
        var movieLine = data[i];
        // for each word in the parsed string
        _.each(splitString(movieLine.text), function(word) {
          // if first occurance (not in tempObj) then create new word obj
          if (!tempObj[word]) {
            newMovie(word);
            // otherwise increment existing object
          } else {
            tempObj[word]['size']++;
          }
        });
      }

      // transform return object to an array
      var resultArray = [];
      for (key in tempObj) {
        tempObj[key].size = tempObj[key].size * 5;
        Math.floor(Math.random() * (data.length - 100));
        resultArray.push(tempObj[key]);
      }

      // At this point the data in the format that D3 word cloud expects so we stringify and write to file
      var stringResult = {'result': resultArray, 'choices': randMovies, 'chosen': chosen};
      return MovieRoundData.insert(stringResult);
    };

    return data_convert(data, randMovies, randMovieFile.split('.')[0]);
  }

});

Meteor.publish("MovieRoundData", function() {
  return MovieRoundData.find();
});
