var request = require('request');
var parsers = require('./lib/parsers.js');
var Bottomline = {};

var sports = {
	ncaaf: {
		url: 'http://espn.go.com/college-football/bottomline/scores',
		parser: parsers.ncaaf
	},
	mlb: {
		url: 'http://espn.go.com/mlb/bottomline/scores',
		parser: parsers.mlb
	},
	nfl: {
		url: 'http://espn.go.com/nfl/bottomline/scores',
		parser: parsers.nfl
	},
	nhl: {
		url: 'http://espn.go.com/nhl/bottomline/scores',
		parser: parsers.nhl
	}
}

for (sport in sports){
	Bottomline[sport] = (function(sport){
		return function (cb){
			request(sports[sport].url, function (error, response, body){
				if (error){
					console.error('Bottomline Error:', error);
				} else {
					cb(sports[sport].parser(body));
				}
			});
		}
	})(sport)
}

module.exports = Bottomline
