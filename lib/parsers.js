var qs = require('querystring');
var _ = require('underscore');
var moment = require('moment-timezone');

var parsers = {
	ncaaf: parser('ncf'),
	mlb: parser('mlb'),
	nfl: parser('nfl'),
	nhl: parser('nhl')
}

function parser(str){
	return function ncaaf(string){
		var count = parseInt(string.match(/left[\d]+/g).pop().match(/[\d]+/));
		var games = [];
		var obj = qs.parse(string);
		for (var i = 1; i < count; i++){
			games.push(parseGame(obj[str + '_s_left' + i], obj[str + '_s_url' + i]))
		}
		return games;
	}
}

function parseGame(left, url){
	var game = {};
	game.gameId = url.match(/[\d]+/) ? url.match(/[\d]+/)[0] : undefined;
	game.url = url;
	game.status = left.match(/\([a-z0-9\:\,\s\-]+\)/ig).pop().replace(/[\(\)]+/g, '');
	left = left.replace('(' + game.status + ')', '').trim();
	var t1 = /\sat\s/.test(left) ? left.split(' at ')[0] : left.split('   ')[0];
	var t2 = /\sat\s/.test(left) ? left.split(' at ')[1] : left.split('   ')[1];
	game.team1 = parseTeam(t1);
	game.team2 = parseTeam(t2);
	game.started = !/\sET/.test(game.status);
	game.finished = /FINAL/.test(game.status);

	if (!game.started){
		game.date = parseDate(game.status);
	}

	function parseTeam(string){
		var obj = {};
		obj.rank = string.match(/\([\d]+\)/) ? string.match(/\([\d]+\)/)[0].match(/[\d]+/)[0] : undefined;
		string = string.replace(/\([\d]+\)/, '');
		obj.name = string.match(/[\D]+/) ? string.match(/[\D]+/)[0].trim().replace('^', '') : undefined;
		obj.score = string.match(/[\d]+/) ? parseInt(string.match(/[\d]+/)[0].trim().replace('^', '')) : undefined;
		return obj;
	}
	return game;
}

function parseDate(string){
	var thisYear = _.range(Number(moment().format('MM')), 13).map(function (e){return moment(e, 'MM').format('MMM').toUpperCase()});
	var arr = string.split(' ').slice(1,5);
	arr.splice(2, 0, Number(moment().format('YYYY')) + (_.contains(thisYear, arr[0]) ? 0 : 1));
	return moment.tz(arr.join('-'), 'MMM-DD-YYYY-hh:mm-A', 'America/New_York').toDate();
}

module.exports = parsers;