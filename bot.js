const Discord = require("discord.js");
const ytdl =  require('ytdl-core');
const client = new Discord.Client();
const config = require("./config.json");

var server = config.testserver;
var musicFile = config.musicfile;

//obj array that is for login and logout audio clips
const squeezeUsers = require("./squeezeUsers.json");

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;

    var newUserName = newMember.user.username;
    var oldUserName = oldMember.user.username;

    if(oldUserChannel === undefined && newUserChannel !== undefined) {
	    // User Joins a voice channel
        //play introLink
        let user = returnUser(newUserName);
        newMember.voiceChannel.join()
            .then(connection => {
                playAudioFromYoutube(connection, user.introLink);
            });

	    //client.channels.get(server).send(newUserName + ' joined');

	    //newMember.voiceChannel.join();
	    // .then(connection => {
	    // 	console.log('Connected');
	    // 	const dispatcher = connection.playFile(musicFile);
	    // })
	    // .catch(console.log);

    } else if(newUserChannel === undefined){
	// User leaves a voice channel
	//client.channels.get(server).send(newUserName + ' left');

	//oldMember.voiceChannel.leave();
    }
});

client.on("message", async message => {
    if(message.author.bot)
	    return;
    
    if(message.content.indexOf(config.prefix) !== 0)
	    return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "play") {
	    console.log(message.member.voiceChannel);
	    const link = args.join(" ");
	    console.log(link);
	    if (link === "demo") {
	        message.member.voiceChannel.join()
		    .then(connection => {
		        const dispatcher = connection.playFile(musicFile);
		    })
		    .catch(console.log);
	    } else if (link !== "") {
	        //YouTube
	    
	        console.log(link);
	        message.member.voiceChannel.join()
		    .then(connection => {
	     	   // const stream = ytdl(link, {filter: 'audioonly'});
		        //const streamOptions = {seek: 0, volume: 1};
		        //const dispatcher = connection.playStream(stream, streamOptions);
                playAudioFromYoutube(connection, link);
	     	})
	     	.catch(console.log);
	    
	    }
    }
    
    if(command === "stop") {
	    message.member.voiceChannel.leave()
    }
    
    if(command === "ping") {
	    const m = await message.channel.send("Ping?");
	    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }
    
    if(command === "say") {
	    const sayMessage = args.join(" ");
	    message.delete().catch(O_o=>{}); 
	    message.channel.send(sayMessage);
    }
    
    if(command === "purge") {
	    const deleteCount = parseInt(args[0], 10);
	
	if(!deleteCount || deleteCount < 2 || deleteCount > 100)
	    return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

	const fetched = await message.channel.fetchMessages({limit: deleteCount});
	message.channel.bulkDelete(fetched)
	    .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }
});

client.login(config.token);


//get new user
function returnUser(userName) {
    return squeezeUsers.find(su => su.userName === userName);
}
//play audio clip from youtube
function playAudioFromYoutube(connection, link) {
    const stream = ytdl(link, { filter: 'audioonly' });
    const streamOptions = { seek: 0, volume: 1 };
    const dispatcher = connection.playStream(stream, streamOptions);
}

