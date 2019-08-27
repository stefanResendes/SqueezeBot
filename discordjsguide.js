const config = require("./config.json");
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const client = new Discord.Client();

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('message', message => {
    if (message.content === '!play') {
        if (message.channel.type !== 'text') return;
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.reply('please join a voice channel first!');
        }

        voiceChannel.join().then(connection => {
            const stream = ytdl('https://www.youtube.com/watch?v=Qkuu0Lwb5EM', { filter: 'audioonly' });
            const dispatcher = connection.play(stream);

            dispatcher.on('end', () => voiceChannel.leave());
        });
    }
});

client.login(config.token);