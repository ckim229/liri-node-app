require("dotenv").config();

// Load required Node Modules
let fs = require('fs-extra');
var request = require("request-promise");
//let spotify = require('spotify');
let Twitter = require('twitter');
// Load twitter keys
let keys = require('./keys.js')
let twitterKeys = keys.twitter

// command line
let argument = process.argv;
let liriCommand = argument[2];
console.log(liriCommand)

let liriArg = '';
for (var i = 3; i < argument.length; i++) {
    liriArg += argument[i] + ' ';
}

// twitter function
function tweeting () {
    var client = new Twitter(twitterKeys);
      
    var params = {screen_name: 'cyk229', count: 20};
    // Retrieve the last 20 tweets
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            var tweetStr = ""
          for(var i = 0; i<tweets.length; i++){
              tweetStr += 'Created on: ' + tweets[i].created_at + '\n' + "@cyk229: " + tweets[i].text + '\n' + "----------------------" + '\n';
          }
          fs.appendFile('./log.txt', tweetStr + '\n', (err) => {
              if (err) throw err;
              console.log(tweetStr);
          })
        }
        else {
			var errorStr = 'ERROR: Retrieving user tweets -- ' + error;

			// Append the error string to the log file
			fs.appendFile('./log.txt', errorStr, (err) => {
				if (err) throw err;
				console.log(errorStr);
			});
			return;
        }
      });      
}

function omdb () {
    var movieName;
    if (liriArg === ''){
        movieName = "Mr. Nobody"
    }
    else {
        movieName = liriArg
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=plot=short&tomatoes=true&apikey=26bbde9e";
        request(queryUrl)
        .then(response => {
            movieName = liriArg.split(" ").join("+")
            let data = JSON.parse(response);
            let movieStr =
             "----------------------\n" +
            "Title: " + data.Title + "\n" + 
            "Year: " + data.Released + "\n" + 
            "IMDB Rating: " + data.imdbRating + "\n" + 
            "Rotten Tomato Rating: " + data.Ratings[1].Value + "\n" + 
            "Country produced: " + data.Country + "\n" +
            "Main language: " + data.Language + "\n" + 
            "Plot description: " + data.Plot + "\n" + 
            "Actors: " + data.Actors + "\n" + 
            "----------------------\n"
            fs.appendFile('./log.txt', movieStr + '\n', (err) => {
                if (err) throw err;
                console.log(movieStr);
            })
        })
    }

if (liriCommand === 'movie-this'){
    omdb();
}
if (liriCommand === 'my-tweets'){
    tweeting();
}