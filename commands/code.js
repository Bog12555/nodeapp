const Discord = require('discord.js');
module.exports = {
	name: 'code',
	description: 'Shows link to bot code',
	execute(message, args) { 
        const Embed=new Discord.MessageEmbed().setColor('#ff00ff').setTitle('Code').setDescription('[Click here to see bot source code](https://github.com/bog12555/nodeapp/tree/atestat)').setTimestamp().setFooter(`${message.author.username}#${message.author.discriminator}`);
        message.delete();
        message.channel.send(Embed)
        .then(msg => {
            msg.delete({ timeout: 7000 });
          })
        .catch(error => console.err(error));
    }
}