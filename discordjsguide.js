const config = require("./config.json");
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const client = new Discord.Client();

const queue = {
    songList: [],
    isPlaying: false
};

//const queue = [];
const playingMusic = false;

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('message', message => {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.channel.type !== 'text') {
        return;
    }

    const link = args.join(" ");
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
        //return message.reply('please join a voice channel first!');
    }

    switch (command) {
        case 'play':
            //youtube
            queue.isPlaying ? queue.songList.push(link) : playYoutube(voiceChannel, link);
            break;
        case "skip":
            skipSong(voiceChannel);
            break;
        case "stop":
            stopMusic(voiceChannel);
            break;
	default:
	    break;
    }

});

playYoutube = (voiceChannel, link) => {
    queue.isPlaying = true;
    voiceChannel.join().then(connection => {
        const stream = ytdl(link, { quality: 'highestaudio', volume: '.75', highWaterMark: 1 }); //filter: 'audioonly', 
        voiceChannel.dispatcher = connection.play(stream); //1024 * 1024 * 10

        voiceChannel.dispatcher.on('end', () => {
            queue.songList.length > 0 ? playYoutube(voiceChannel, queue.songList.shift()) : stopMusic(voiceChannel);
        });
    });
};

stopMusic = (voiceChannel) => {
    queue.isPlaying = false;
    voiceChannel.leave();
};

skipSong = (voiceChannel) => {
    voiceChannel.dispatcher.end();
};

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

client.login(config.token);
