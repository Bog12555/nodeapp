const ytdl = require("ytdl-core");
const axios = require('axios');
const main = require("../index.js");
  
module.exports = {
	name: 'play',
	description: 'Play music',
	 execute(message, args) {
     let queue=main.queue;
     let g_token=main.g_token;
        const serverQueue = queue.get(message.guild.id);
        execute(message, serverQueue);
        async function google (title)
        {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${title}&access_token=${g_token}`)
        console.log(`VT: ${title}`);
        console.log(`VID: ${response.data.items[0].id.videoId}`)
          return `https://www.youtube.com/watch?v=${response.data.items[0].id.videoId}`;
        }
        
        async function execute(message, serverQueue) {

            const args = message.content.split(" ");
          
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel)
              return message.channel.send(
                "You need to be in a voice channel to play music!"
              );
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
              return message.channel.send(
                "I need the permissions to join and speak in your voice channel!"
              );
            }
            let songInfo;
            if (!(args[1].startsWith("https://"))) {
             const googleparse= await google(args.slice(1).join(' '));
            songInfo = await ytdl.getInfo(googleparse);
            }
            else  {songInfo = await ytdl.getInfo(args[1]);}
            const song = {
              title: songInfo.videoDetails.title,
              url: songInfo.videoDetails.video_url
            };
          
            if (!serverQueue) {
              const queueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
              };
          
              queue.set(message.guild.id, queueContruct);
          
              queueContruct.songs.push(song);
          
              try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                play(message.guild, queueContruct.songs[0]);
              } catch (err) {
                console.log(err);
                queue.delete(message.guild.id);
                return message.channel.send(err);
              }
            } else {
              serverQueue.songs.push(song);
              return message.channel.send(`**${song.title}** has been added to the queue!`);
            }
          }
          
          function play(guild, song) {
            const serverQueue = queue.get(guild.id);
            if (!song) {
              //serverQueue.voiceChannel.leave();
              queue.delete(guild.id);
              return;
            }
          
            const dispatcher = serverQueue.connection
              .play(ytdl(song.url))
              .on("finish", () => {
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
              })
              .on("error", error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(`Start playing: **${song.title}**`);
          }
}
};