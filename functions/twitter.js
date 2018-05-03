var fs = require("fs");
const config = require('./credentials');
const Twitter = require('twitter');
const twitterApi = new Twitter(config);

exports.defaultLogin = 'Ghirtor';
var followersCount = 0;
var lastTweetContent = '';

exports.postTweet = function (message) {
	twitterApi.post("statuses/update",{status: message}, function (err,data,res) {
	});
}

exports.getFollowersCount = function (login) {
	twitterApi.get('followers/ids', {screen_name: login}, function (err, data, response) {
		followersCount = data.ids.length;
	});
	return followersCount;
}

exports.getLastTweet = function (login, callback) {
	var params = {screen_name: login, count: 1};
	twitterApi.get('statuses/user_timeline', params, callback);
	return lastTweetContent;
}

exports.suppressLastTweet = function (err, data, response) {
	if (data.length > 0) {
		var params = {id: data[0].id_str};
		twitterApi.post('statuses/destroy', params, function (err, data, response) {
			lastTweetContent = data[0].text;
		});
	}
}

exports.readLastTweet = function (err, data, response) {
	if (data.length > 0) {
		lastTweetContent = data[0].text;
	}
}