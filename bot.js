const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
     console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
     client.user.setActivity('u play with ur stick', { type: 'WATCHING' });
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});


client.on('message', async message => {
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) !== 0) return;
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  	const command = args.shift().toLowerCase();
	if(command === "ping") {
		const m = await message.channel.send("Ping?");
		const pingy = m.createdTimestamp - message.createdTimestamp
		m.edit(`**Pong!** ***${pingy}ms***`);
	 }
	 if(command === "kick") {
   	 if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
     	 return message.reply("GO AWAY");
    	 let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    	 if(!member)
      	 return message.reply("MENTION SOMEONE FFS");
	 if(message.author.tag === member.user.tag) 
	 return message.reply("U CAN'T KICK URSELF NOOBERNOOB");
   	 if(!member.kickable) 
      	 return message.reply("CAN'T KICK ERROR ABORT ABORT");
   	 let reason = args.slice(1).join(' ');
    	 if(!reason) reason = "No reason provided";
    	 await member.kick(reason)
      	 .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    	 message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
	 }
	 if(command === "ban") {
    	 if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      	 return message.reply("GO AWAY");
    	 let member = message.mentions.members.first();
    	 if(!member)
      	 return message.reply("MENTION SOMEONE FFS");
         if(message.author.tag === member.user.tag) 
	 return message.reply("U CAN'T BAN URSELF NOOBERNOOB");
    	 if(!member.bannable)
      	 return message.reply("CAN'T BAN ERROR ABORT ABORT");
	 let reason = args.slice(1).join(' ');
    	 if(!reason) reason = "No reason provided";
    	 await member.ban(reason)
      	 .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    	 message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  	 }
	 if(command === "unban") {
    	 message.channel.send("idk how to do this leave me alone ;-;")
  	 }
	 if(command === "purge") {
	 if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      	 return message.reply("GO AWAY");
    	 const deleteCount = parseInt(args[0], 10) + 1;
	 if(deleteCount === 1)
    	 message.channel.bulkDelete(99)
    	 if(!deleteCount || deleteCount < 1 || deleteCount > 101)
      	 return message.reply("Please provide a number between 1 and 100 for the number of messages to delete");
    	 const fetched = await message.channel.fetchMessages({limit: deleteCount});
    	 message.channel.bulkDelete(fetched)
	 }
});

client.on('error', console.error);

client.login(config.token);