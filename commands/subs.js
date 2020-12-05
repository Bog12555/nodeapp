const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
	name: 'subs',
	description: 'Search channel subscribers',
	execute(message, args, g_token) {
	message.delete();	  
    const Embed = new Discord.MessageEmbed().setTitle('Youtube Subscriber Count').setTimestamp().setFooter(`${message.author.username}#${message.author.discriminator}`);
    //if (typeof args[0]==='undefined') 
    async function runCommand() {
	let ch_id='undefined';
	let ch_name='undefined';
	let subs=-1;
	let sub;
	
	const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=${args[0]}&access_token=${g_token}`)
	ch_id=response.data.items[0].id.channelId;
    ch_name=response.data.items[0].snippet.title;
	console.log("Ch_ID: "+`${ch_id}`);
	console.log("Ch_name: "+`${ch_name}`);
	const response2 = await axios.get(`https://www.googleapis.com/youtube/v3/channels?id=${ch_id}&part=statistics&fields=items/statistics/subscriberCount&access_token=${g_token}`)
	subs=response2.data.items[0].statistics.subscriberCount;
	if (subs>=100000 && subs <=999999) sub=(sub/100000) +" K"
    else if (subs>1000000) sub=(subs/1000000)+" M";
	else sub=subs;
	console.log(`Subs: ${sub}`);
	Embed.setColor('#123456');
	Embed.addField("Channel Name",`${ch_name}`);
	Embed.addField("Channel ID",`[${ch_id}](https://www.youtube.com/channel/${ch_id})`);
    Embed.addField("Subscribers",`${sub}`).setThumbnail(response.data.items[0].snippet.thumbnails['medium'].url);
    //return ({'Name':`${ch_name}`,'ID':`${ch_id}`,'Subs':`${sub}`});
    }
    async function load()
    {   
        const output=await runCommand();
        //console.log(`Output: ${output}`);
        message.channel.send(Embed)
        .then(msg => {
            msg.delete({ timeout: 15000 });
          })
        .catch(error => console.err(error));     
        }
    load();
    }
}