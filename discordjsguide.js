const config = require("./config.json");
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const client = new Discord.Client();
const queue = new Map();

client.on("ready", () => {
    console.log('Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.');
    client.user.setActivity('Serving ${client.guilds.size} servers');
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
        return message.reply('please join a voice channel first!');
    }

    switch (command) {
        case 'play':
            //youtube
            voiceChannel.join().then(connection => {
                const stream = ytdl(link, { filter: 'audioonly', quality: 'highestaudio', volume: '.75' });
                const dispatcher = connection.play(stream);

                dispatcher.on('end', () => voiceChannel.leave());
            });
            break;
        case "skip":
            break;
        case "stop":
            voiceChannel.leave();
            break;
    }

});


process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

client.login(config.token);