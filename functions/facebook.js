const login = require("facebook-chat-api");
var fs = require("fs");
//var friend = "Ami Ihm";

const config = require('./credentials');
//var friend_id = "100025801723082";

var birthday = false;
var friendsCount = 0;
var lastMessage = '';

//obtenir l'anniv de quelqu'un grâce �  son ID:
exports.birthday = function (friend) {
    login({email: config.mail, password: config.passwd}, (err,api) => {
	if(err) return console.error(err);

	api.setOptions({
            forceLogin: true
	});

	api.getFriendsList((err, data) => {
            if(err) return console.error(err);
	    
	    for(var prop in data) {
		if(data[prop].fullName === friend) {
		    var friend_id = data[prop].userID;
		    api.getUserInfo(friend_id, (err, ret) => {
			if(err) return console.error(err);

			for(var prop in ret) {
			    if(ret.hasOwnProperty(prop) && ret[prop].isBirthday) {
					birthday = true;
			    } else {
					birthday = false;
			    }
			}
		    });
		}
	    }
	});
    })
	return birthday;
}



//Pour obtenir la liste de tous ses amis
exports.get_friends = function () {
    login({email: config.mail, password: config.passwd}, (err,api) => {
	if(err) return console.error(err);
	
	api.setOptions({
            forceLogin: true
	});
	api.getFriendsList((err, data) => {
            if(err) return console.error(err);
		friendsCount = data.length;
	    /*for(var prop in data) {
			console.log(data[prop].fullName)
	    }*/
	});
    })
	return friendsCount;
}



//Pour envoyer un message �  l'utilisateur qui a l'ID friend_id
exports.send_msg = function (friend) {
    login({email: config.mail, password: config.passwd}, (err,api) => {
	if(err) return console.error(err);

	api.setOptions({
            forceLogin: true
	});
	api.getFriendsList((err, data) => {
            if(err) return console.error(err);
	    
	    for(var prop in data) {
		if(data[prop].fullName === friend) {
		    var friend_id = data[prop].userID;
		    var msg = {body: "Hello."};
		    api.sendMessage(msg,friend_id);
		}
	    }
	});
    })
}



//écouter les messages qu'on reçoit pendant que l'appli tourne
function listen_msg() {
    login({email: config.mail, password: config.passwd}, (err,api) => {
	if(err) return console.error(err);
	
	api.setOptions({
            forceLogin: true
	});
	var stopListening = api.listen((err,message) => {
            if(err) return console.error(err);
	    api.getFriendsList((err, data) => {
		if(err) return console.error(err);

		for(var prop in data) {
		    if(data[prop].userID === message.senderID) {
			console.log(data[prop].fullName+":");
		    }
		}
	    });
	    console.log(message.body);
	    api.markAsRead(message.threadID, (err) => {
		if(err) console.log(err);
		return stopListening();
            });
	    
	})
    })
}


//Lire le dernier message reçu par friend
exports.read_last_msg = function (friend) {
    login({email: config.mail, password: config.passwd}, (err,api) => {
	if(err) return console.error(err);

	api.setOptions({
            forceLogin: true
	});

	api.getFriendsList((err, data) => {
            if(err) return console.error(err);
	    
	    for(var prop in data) {
		if(data[prop].fullName === friend) {
		    var friend_id = data[prop].userID;
		    api.getThreadHistory(friend_id,1,undefined,(err,history) => {
			console.log(history.length);
			console.log(history[0].body);
		    });
		}
	    }
	});
    })
}
