const Discord = require("discord.js");
const ytdl =  require('ytdl-core');
const client = new Discord.Client();
const config = require("./config.json");

var server = config.testserver;
var musicFile = config.musicfile;
var voiceChannel = null;
var ytAudioQueue = [];
var playingAudio = false; 

//obj array that is for login and logout audio clips
const squeezeUsers = require("./squeezeUsers.json");
const attackStrats = require("./attackStrats.json");
const defenseStrats = require("./defenseStrats.json");

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

// client.on('voiceStateUpdate', (oldMember, newMember) => {
//     let newUserChannel = newMember.voiceChannel;
//     let oldUserChannel = oldMember.voiceChannel;
//     var newUserName = newMember.user.username;
//     var oldUserName = oldMember.user.username;

//     if (playingAudio === false) {
// 	if(oldUserChannel === undefined && newUserChannel !== undefined && newUserName !== 'SqueezeBot') {
// 	    // User Joins a voice channel
//             //play introLink
//             let user = returnUser(newUserName);
//             newMember.voiceChannel.join()
//             playAudioFromYoutube(client.voiceConnections.first(), user.introLink, newMember.voiceChannelID);
// 	} else if(newUserChannel === undefined){
// 	    // User leaves a voice channel
// 	    //oldMember.voiceChannel.leave();
// 	}
//     }
// });

client.on("message", async message => {
    if(message.author.bot || message.content.indexOf(config.prefix) !== 0)
	return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch(command) {
    case "horn":
	message.member.voiceChannel.join();
	playAudioFromYoutube(client.voiceConnections.first(), "https://www.youtube.com/watch?v=UaUa_0qPPgc", message.member.voiceChannelID, 'yes');
	break;
    case "join":
	message.member.voiceChannel.join();
	break;
    case "stop":
	message.member.voiceChannel.leave();
	break;
    case "ping":
	const m = await message.channel.send("Ping?");
	m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
	break;
    case "play":
	const link = args.join(" ");
	playAudioFromYoutube(client.voiceConnections.first(), link, message.member.voiceChannelID, 'yes');
	break;
    case "strat":
	const position = args.join(" ");
	message.channel.send(stratRoulette(position));
	break;
    }
});

client.login(config.token);

//get new user
function returnUser(userName) {
    return squeezeUsers.find(su => su.userName === userName);
}

function stratRoulette(position) {
    // Getting random number. This seems really complicated but its what the internet told me to do
    var min = 1;
    var max = 0;
    console.log(position);
    if (position === "attack") {
	max = 21;
    } else if (position === "defense") {
	max = 32;
    }
    console.log(max);
    var random = Math.floor(Math.random() * (+max - +min)) + +min;
    let strat = "";
    console.log(random);
    if (position === "attack") {
	strat = attackStrats[random];
	console.log(strat);
    } else if (position === "defense") {
	strat = defenseStrats[random];
    }
    console.log(strat.name);
    return strat.name;
}

// async function playAudioFromYoutube(connection, link, channelId, isCommand) {
//     console.log("IN YT");
//     if (playingAudio === true && isCommand === 'yes') {
// 	console.log("IF");
// 	ytAudioQueue.push(link);
//     } else {
// 	console.log("ELSE");
// 	console.log(isCommand);
// 	if (isCommand === 'yes') {
// 	    ytAudioQueue.push(link);
// 	}
// 	console.log("Before stream");
// 	console.log(ytAudioQueue[0]);
// 	let stream = ytdl(ytAudioQueue[0], { filter: 'audioonly' });
// 	console.log(stream);
// 	let streamOptions = { seek: 0, volume: 1 };
// 	broadcast.playStream(stream);
// 	console.log("dispatcher");
// 	console.log(connection);
// 	//let dispatcher = await connection.playStream(stream, streamOptions);
// 	const dispatcher = connection.playBroadcast(broadcast);
// 	console.log("after dis");
// 	playingAudio = true;
	
// 	dispatcher.on("end", end => {
// 	    console.log("in end");
// 	    ytAudioQueue.shift();
// 	    if (ytAudioQueue.length >= 1) {
// 		playAudioFromYoutube(connection, ytAudioQueue[0], channelId, 'no');
// 	    } else {
// 		//connection.disconnect();
// 		playingAudio = false;
// 	    }
// 	})
//     }
// }
