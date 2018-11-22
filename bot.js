var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    //logger.info(channelID);
    if (message.substring(0, 1) == '#') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
            bot.sendMessage({
                to: channelID,
                message: 'Pong!'
            });
            break;
            // Just add any case commands if you want to..
	    case 'Jordan':
	    bot.sendMessage({
		to: channelID,
		message: 'PS4 Pleb'
	    });
	    break;
	    case 'John':
	    bot.sendMessage({
		to: channelID,
		message: 'MY LEG!'
	    });
	    break;
	    case 'Tanner':
	    bot.sendMessage({
		to: channelID,
		message: 'Oh captain my captain'
	    });
	    break;
	    case 'Zach':
	    bot.sendMessage({
		to: channelID,
		message: 'SHHHHHHHHHHHHHHHHHHHHHHHHHHHHH!!!!'
	    });
	    break;
	    case 'Stefan':
	    bot.sendMessage({
		to: channelID,
		message: '#Bitch'
	    });
	    break;
         }
     }
});

bot.on('voiceStateUpdate', (oldMember, newMember) => {
    logger.info('Voice Status Update');
    //logger.info(oldMember);
    logger.info(oldMember.d.channel_id);
    if(oldMember.d.member.user.username == 'YaBoiSqueeze') {
	bot.sendMessage({
	    to: '514572092386312206', //test channel
	    //to: '392520644274683916', //squeese spam channel
	    message: 'The Main Squeeze has arrived'
	});	
    }

    
    
    // let newUserChannel = newMember.voiceChannelID
    // let oldUserChannel = oldMember.voiceChannelID
    
    
    // if(oldUserChannel === undefined && newUserChannel !== undefined) {
	
    // 	// User Joins a voice channel
    // 	bot.sendMessage({
    // 	    to: channelID,
    // 	    message: 'enter'
    // 	});
	
    // } else if(newUserChannel === undefined){
	
    // 	// User leaves a voice channel
    // 	bot.sendMessage({
    // 	    to: channelID,
    // 	    message: 'exit'
    // 	});
	
    // }
});

bot.on('typingStart', function (channel, user) {
    logger.info("Started Typing" + " | " + channel.id + " | " + user);
});
