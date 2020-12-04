const Discord = require('discord.js');
const moment = require('moment')
const axios = require('axios');
module.exports = {
	name: 'covid',
  description: 'Show Covid19 Case Numbers',
  usage: '<country> [timer]',
	execute(message, args) {
        let countdown= 20
        function days(today,days)
        {
		    if (moment(today.parsedOnString, "YYYY-MM-DD").subtract(days, 'days').format("YYYY-MM-DD")=="2020-11-07") return "2018-11-07";
        else return moment(today.parsedOnString, "YYYY-MM-DD").subtract(days, 'days').format("YYYY-MM-DD");
        }

        async function lol(ro, args)
        {
          try{
          if (args[1]!==undefined &&parseInt(args[1])!=='NaN'){countdown=parseInt(args[1]);}
          let response,today,historicalData;
          if (ro)
          {
            response = await axios.get(`https://datelazi.ro/latestData.json`);
            today=response.data["currentDayStats"];
            historicalData = response.data["historicalData"];
          }
          else 
          {
           response = await axios.get(`https://covid19-api.org/api/timeline/${args[0]}`);
          } 
          if (countdown>120)
          {
            countdown=120;
          }
          else if (countdown%5!=0)
          {
            countdown=Math.floor(args[1]/10)*10;
            if (args[1]%10>5) countdown=countdown+10;
          }
          const timeout=countdown*1000; 
          const data=response.data;
          let i=0;
          //console.log(`Timeout: ${timeout} | ${countdown} | ${args[1]}`);
          let cdf=0;
          //cdf=(Object.entries(c_out[c_out.length-1])[7][1])-(Object.entries(c_out[c_out.length-2])[7][1]);
          //console.log(`CDATA: ${data}`);
          //const result=`${Object.entries(data[data.length-1])[7][1]}`;
          let EmbedText;
          if (ro)
          {
           EmbedText = {title:`Covid19 RO`,color: '#ff0000', fields: [{name: '\u200B',value:'**Cases:**'},
          { name: 'Today', value: today.numberInfected-historicalData[days(today,1)].numberInfected ,inline: true},{name: 'Yesterday', value: historicalData[days(today,1)].numberInfected-historicalData[days(today,2)].numberInfected ,inline: true},{ name: 'Last week', value: today.numberInfected-historicalData[days(today,7)].numberInfected ,inline: true},
          { name: '2 Weeks', value: today.numberInfected-historicalData[days(today,14)].numberInfected ,inline: true},{ name: '\u200B', value: '\u200B',inline: true},{ name: 'All Time', value: today.numberInfected ,inline: true},
          { name: '\u200B', value: '\u200B'},{name: '\u200B',value:'**Deaths:**'},
          { name: 'Today', value: today.numberDeceased-historicalData[days(today,1)].numberDeceased ,inline: true},{ name: 'Last week', value: today.numberDeceased-historicalData[days(today,7)].numberDeceased ,inline: true},{ name: 'All Time', value: today.numberDeceased ,inline: true},
          { name: '\u200B', value: '\u200B'},
          { name: 'Last update', value:  moment(today.parsedOn*1000).format('lll')}],timestamp: new Date(),footer: { text: `${countdown} | ${message.author.username}#${message.author.discriminator}`},};
          }
          else  {
            do
          {
            i=i+1; 
            cdf=data[0]['cases']-data[i]['cases']
           
          }while (cdf==0);
            EmbedText = {title:`Covid19 ${data[0]['country']}`,color: '#ff0000', fields: [{name: '\u200B',value:'**Cases:**'},
          { name: 'Today', value: data[0]['cases']-data[i]['cases'] ,inline: true},{name: 'Yesterday', value: data[i]['cases']-data[i+1]['cases'] ,inline: true},{ name: 'Last week', value: data[0]['cases']-data[i+6]['cases'] ,inline: true},
          { name: '2 Weeks', value: data[0]['cases']-data[i+13]['cases'] ,inline: true},{ name: '\u200B', value: '\u200B',inline: true},{ name: 'All Time', value: data[0]['cases'] ,inline: true},
          { name: '\u200B', value: '\u200B'},{name: '\u200B',value:'**Deaths:**'},
          { name: 'Today', value: data[0]['deaths']-data[i]['deaths'] ,inline: true},{ name: 'Last week', value: data[0]['deaths']-data[i+6]['deaths'] ,inline: true},{ name: 'All Time', value: data[0]['deaths'] ,inline: true},
          { name: '\u200B', value: '\u200B'},
          { name: 'Last update', value:  data[0]['last_update']}],timestamp: new Date(),footer: { text: `${countdown} | ${message.author.username}#${message.author.discriminator}`},};}
        let Embed = new Discord.MessageEmbed(EmbedText);
        setTimeout(() =>
        {
        message.channel.send(Embed)
        .then(msg => {
            let timer = setInterval(() =>
            {
              if (countdown<=5) clearInterval(timer);
              else {countdown=countdown-5;
                if (ro){
                  EmbedText = {title:`Covid19 RO`,color: '#ff0000', fields: [{name: '\u200B',value:'**Cases:**'},
                  { name: 'Today', value: today.numberInfected-historicalData[days(today,1)].numberInfected ,inline: true},{name: 'Yesterday', value: historicalData[days(today,1)].numberInfected-historicalData[days(today,2)].numberInfected ,inline: true},{ name: 'Last week', value: today.numberInfected-historicalData[days(today,7)].numberInfected ,inline: true},
                  { name: '2 Weeks', value: today.numberInfected-historicalData[days(today,14)].numberInfected ,inline: true},{ name: '\u200B', value: '\u200B',inline: true},{ name: 'All Time', value: today.numberInfected ,inline: true},
                  { name: '\u200B', value: '\u200B'},{name: '\u200B',value:'**Deaths:**'},
                  { name: 'Today', value: today.numberDeceased-historicalData[days(today,1)].numberDeceased ,inline: true},{ name: 'Last week', value: today.numberDeceased-historicalData[days(today,7)].numberDeceased ,inline: true},{ name: 'All Time', value: today.numberDeceased ,inline: true},
                  { name: '\u200B', value: '\u200B'},
                  { name: 'Last update', value:  moment(today.parsedOn*1000).format('lll')}],timestamp: new Date(),footer: { text: `${countdown} | ${message.author.username}#${message.author.discriminator}`},};
                }
                else {
            EmbedText= {title:`Covid19 ${data[0]['country']}`,color: '#ff0000', fields: [{name: '\u200B',value:'**Cases:**'},
          { name: 'Today', value: data[0]['cases']-data[i]['cases'] ,inline: true},{name: 'Yesterday', value: data[i]['cases']-data[i+1]['cases'] ,inline: true},{ name: 'Last week', value: data[0]['cases']-data[i+6]['cases'] ,inline: true},
          { name: '2 Weeks', value: data[0]['cases']-data[i+13]['cases'] ,inline: true},{ name: '\u200B', value: '\u200B',inline: true},{ name: 'All Time', value: data[0]['cases'] ,inline: true},
          { name: '\u200B', value: '\u200B'},{name: '\u200B',value:'**Deaths:**'},
          { name: 'Today', value: data[0]['deaths']-data[i]['deaths'] ,inline: true},{ name: 'Last week', value: data[0]['deaths']-data[i+6]['deaths'] ,inline: true},{ name: 'All Time', value: data[0]['deaths'] ,inline: true},
          { name: '\u200B', value: '\u200B'},
          { name: 'Last update', value:  data[0]['last_update']}],timestamp: new Date(), footer: { text: `${countdown} | ${message.author.username}#${message.author.discriminator}`},};}
          Embed = new Discord.MessageEmbed(EmbedText);
          msg.edit(Embed);
      }
            },5000)
            msg.delete({ timeout: timeout });
          })
        .catch(error => console.error(error));
        },500)}
        catch(error)
        {
        console.error(error);
        }};
        async function incidence(args)
        {
          let today,historicalData,jud=args[1].toUpperCase();

        await axios.get(`https://datelazi.ro/latestData.json`).then(response => {
           today = response.data["currentDayStats"];
           historicalData = response.data["historicalData"];}).then(() =>{
          EmbedText = {title:`Covid19 RO`,color: '#ff0000', fields: [{name: '\u200B',value:`**Cases (${jud}) :**`},
          { name: 'Today', value: today.countyInfectionsNumbers[jud]-historicalData[days(today,1)].countyInfectionsNumbers[jud] ,inline: true},{name: 'Yesterday', value: historicalData[days(today,1)].countyInfectionsNumbers[jud]-historicalData[days(today,2)].countyInfectionsNumbers[jud] ,inline: true},{ name: 'Last week', value: today.countyInfectionsNumbers[jud]-historicalData[days(today,7)].countyInfectionsNumbers[jud] ,inline: true},
          {name: '\u200B',value:`**Incidence (${jud}) :**`},
          { name: 'Today', value: today.incidence[jud] ,inline: true},,{name: 'Yesterday', value: historicalData[days(today,1)].incidence[jud],inline: true},{ name: '7 days ago', value: historicalData[days(today,7)].incidence[jud] ,inline: true},
          //{ name: '\u200B', value: '\u200B',inline: true},{ name: '2 Weeks', value: historicalData[days(today,14)].incidence[jud] ,inline: true},{ name: '\u200B', value: '\u200B',inline: true},
          { name: 'Last update', value:  moment(today.parsedOn*1000).format('lll')}],timestamp: new Date(),footer: { text: `${message.author.username}#${message.author.discriminator}`},};
          let Embed = new Discord.MessageEmbed(EmbedText);
          message.channel.send(Embed).then(msg => {
            msg.delete({ timeout: 30000 });
          });
        })
       
        }
        message.delete();
        if (args[0].toUpperCase()=='INC') incidence(args);
        else if(args[0].toUpperCase()=='RO')lol(true ,args);
        else if(args[0].toUpperCase()!='UK'&&  args[0].length==2 && args[0].match(/[a-zA-Z]{2}/) && (typeof args[1]=='undefined'|| args[1]>5)) lol(false, args);
        else
        {
            const Embed= new Discord.MessageEmbed().setTitle("Error").setDescription("Invalid country or API not avaliable").setColor(`#ff0000`)
            .setTimestamp().setFooter(`${message.author.username}#${message.author.discriminator}`);
            message.channel.send(Embed)
            .then(msg => {
                msg.delete({ timeout: 7000 });
              })
            .catch(error => console.err(error));
        }   
    }
}