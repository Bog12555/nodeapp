//
const mysql = require('mysql');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const googleAuth = require('google-auth-library');
const moment = require('moment');
let axios = require('axios');
const privatekey = require("./privatekey.json");
const wait = require('util').promisify(setTimeout);

///
///

const Discord = require('discord.js');
require('dotenv').config();
let prefix;
const client = new Discord.Client();
client.commands = new Discord.Collection();
let cooldowns = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const sql_info={
	host: process.env.MYSQL_HOST,
	port: process.env.MYSQL_PORT,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASS,
	database: process.env.MYSQL_DB
  }
var pool= mysql.createPool(sql_info);
module.exports.pool = pool;
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}
let stream_status=`Now with ${Math.floor(Math.random()*100)}% more bananas...`;
let invites = {};


client.on('ready', () => {
 client.user.setActivity(stream_status);
console.log("[Discord] API Successfully connected!");
});
wait(2000);

 exports.update = ((arg0,arg1='PLAYING',arg2='online', arg3) => {console.log(`1:${arg0}, 2:${arg1}, 3:${arg2}, 4:${arg3}`);

if (arg3!==undefined) {client.user.setPresence({ activity: { name: `${arg0}`,type: `${arg1}`,url:`${arg3}` }, status: `${arg2}` });}
else {client.user.setPresence({ activity: { name: `${arg0}`,type: `${arg1}`}, status: `${arg2}` });}

});

async function loginDiscord()
{
const login = new Promise ((resolve,reject) =>
{
	client.login(process.env.DISCORD_KEY).then(res => resolve(res)).catch(error => reject(error));
})
}
///
let google_token;

let jwtClient = new google.auth.JWT(
	privatekey.client_email,
	null,
	privatekey.private_key,
	['https://www.googleapis.com/auth/youtube.readonly']);
function getkey()
{
//authenticate request
const token = new Promise ((resolve,reject) =>
{
	jwtClient.authorize((err, tokens) => {
 	if (err) {
   	console.log(err);
   	reject(err);
 } else {
	resolve(tokens.access_token);
    }
 })})
 return token;
}
 function refreshKey(){

 jwtClient.refreshAccessToken((err, tokens) => {
 if (err) {console.error(err);}
 else{
google_token=tokens.access_token;
console.log("[Google] API Key refreshed!");
}
});
}
function days(today,days)
        {
		  if (moment(today.parsedOnString, "YYYY-MM-DD").subtract(days, 'days').format("YYYY-MM-DD")=="2020-11-07") return "2018-11-07";
          else return moment(today.parsedOnString, "YYYY-MM-DD").subtract(days, 'days').format("YYYY-MM-DD");
        }

let today, historicalData, jud, cov_str, c_out, cdf=0;
async function update(){
	await axios.get('https://datelazi.ro/latestData.json').then(response2 => {
	  c_out=response2.data;
		  today=c_out["currentDayStats"];
		historicalData = c_out["historicalData"];
	})
		  .then( () => {
			try{
						jud=today.incidence;
						cdf=today.numberInfected-historicalData[days(today,1)].numberInfected;
						cov_str=`Cazuri: ${today.numberInfected}`;	
					
		}
			catch(error){
				console.error(error);
				};
			})		
	.catch(error => {
		console.error(error);
	  refreshKey();
	});
	setTimeout(UpdateStatus, 3000);
	//
	}
	async function load()
	{
		google_token= await getkey();
		const loginDiscord = await loginDiscord();
		console.log("[Google] API Successfully connected!");
		exports.g_token = google_token;
		exports.client= client;
		update();
	}
	load();
	pool.on('error', err =>
	{
		console.log(`[SQL] : ${err}`)
	});
	const queue = new Map();
	exports.queue = queue;
	client.on('message', async message => {
		const date = new Date;
		let sql;
		if (message.mentions.has(client.user.id)) prefix = " <@!476441249738653706>";
		else{
		pool.getConnection(function(err, con) {
		if  (message.guild!==null){
		sql = `SELECT * FROM bot WHERE SERVERID = ${message.guild.id}`;}
		else {sql = `SELECT * FROM bot WHERE SERVERID = 'DM'`;}
		con.query(sql, function (err, result) {
			con.release();
			if (err)
				throw err;
			else 
			{
				prefix = result[0]['PREFIX'];
		const args = message.content.slice(prefix.length).split(/ +/);
		let command = args.shift().toLowerCase();
		if (!client.commands.has(command)) return;
try {
	if (message.content.substr(0,1)!==prefix && !(message.mentions.has(client.user.id))) {return;};
	
	if (cooldowns.has(message.author.id)){return;}
	else cooldowns.set(message.author.id, Date.now());
	setTimeout(() => cooldowns.delete(message.author.id), 3000);
	if  (message.guild!==null){
		 client.commands.get(command).execute(message, args);
	console.log(`[Bot] triggered with "${message.content}" by ${message.author.username}#${message.author.discriminator} (#${message.channel.name} on ${message.guild.name}) at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} `);
}
	else {message.reply('Bot commands are unavailable on DMs').then(msg => {
		msg.delete({ timeout: 7000 });
	  })
	.catch(error => console.err(error));
	 console.log(`[Bot] triggered with "${message.content}" by ${message.author.username}#${message.author.discriminator} (DM) at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);}
} catch (error) {
	console.error(error);
	message.reply('there was an error trying to execute that command!');
}
}});})
}});

function UpdateStatus(){
	//console.log(client.guilds.cache)
	for (let i=0;i<client.guilds.cache.size;i=i+1)
	{
		let sql = `SELECT * FROM bot WHERE SERVERID = ${Array.from(client.guilds.cache)[i][0]}`;
		
			  pool.query(sql, function (err, result) {
				if (err) throw err;
				else if(result[0]['COVCHID']!=null) {
					client.channels.fetch(result[0]['COVCHID']).then(channel => channel.setName(cov_str)).catch(error => console.error(error));
					client.channels.fetch(result[0]['COVNEWID']).then(channel => channel.setName(`Noi: ${cdf}`)).catch(error => console.error(error));
					if (result[0]['COVJUDID']!=null  && result[0]['COVJUD'] !=null)
					{client.channels.fetch(result[0]['COVJUDID']).then(channel => channel.setName(`${result[0]['COVJUD']}: ${jud[result[0]['COVJUD']]}`)).catch(error => console.error(error));}

			  }});
	}
}	
	client.on('guildCreate', guild =>
	{
		let sql = `INSERT INTO bot (SERVERID, SERVERNAME, JOINTIME) VALUES (${guild.id}, ${con.escape(guild.name)},${Date.now()})`;
		pool.query(sql, function (err, result) {
				if (err) throw err;
				console.log(`[Bot] Joined ${guild.name} (${guild.id})`); })
});
client.on('guildUpdate', (oldGuild, newGuild) =>
	{
		let sql = `UPDATE bot SET SERVERNAME = ${con.escape(newGuild.name)} WHERE bot.SERVERID = ${oldGuild.id};`;
		pool.query(sql, function (err, result) {
				if (err) throw err;
				console.log(`[Bot] Server name changed: \nOld: ${oldGuild.name} \nNew: ${newGuild.name} \nID: ${oldGuild.id}`);
})});

	client.on('guildDelete', guild =>
	{
		let sql = `DELETE FROM bot WHERE bot.SERVERID = ${guild.id}`;
		pool.query(sql, function (err, result) {
				if (err) throw err;
				console.log(`[Bot] Left ${guild.name} (${guild.id})`);
})});		
	process.on('unhandledRejection', error => console.error('Caught Promise Rejection', error));
	process.on('SIGINT',function(){
	client.destroy();
	connection.end(function(err) {
		console.error(err);
	  });
});
	process.on('SIGUSR1',function (){
		console.log('Goodbye!');
		client.destroy();
		connection.end(function(err) {
			console.error(err);
		  });
	});
	process.on('SIGUSR2',function (){
		console.log('Goodbye!');
		connection.end(function(err) {
			console.error(err);
		  });
		client.destroy();
	});
	process.on('exit', function (){
		console.log('Goodbye!');
		connection.end(function(err) {
			console.error(err);
		  });
		client.destroy();
	});