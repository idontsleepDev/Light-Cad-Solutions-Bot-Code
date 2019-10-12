/* eslint-disable no-mixed-spaces-and-tabs */
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();
const { prefix, token } = require('./config.json');

const { Permissions } = require('discord.js');

const permissions = new Permissions([
	'MANAGE_CHANNELS',
	'EMBED_LINKS',
	'ATTACH_FILES',
	'READ_MESSAGE_HISTORY',
	'MANAGE_ROLES',
]);

bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	bot.commands.set(command.name, command);
}

bot.on('ready', () => {
	console.log(`Ready! Logged in as: ${bot.user.tag}`);
	bot.user.setActivity(`$help | Prefix: ${prefix}`);
});

bot.on('message', message => {
	if (message.content.startsWith(prefix) || message.author.bot) {
		return;
	}

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	console.log(message.content);
	if (command === `${prefix}ping`) {
		bot.commands.get('ping').execute(message);
	}
	if (command === `${prefix}help`) {
		message.channel.send('Command is work in progress, we will let you know when this command and new commands are available.');
	}
	if (command === `${prefix}test`) {
		message.channel.send('This is a test command.');
	}
	if (command === `${prefix}purge-all`) {
	    if (permissions.has('KICK_MEMBERS')) {
	        message.channel.bulkDelete(100);
			message.channel.bulkDelete(100);
			message.channel.bulkDelete(100);
			message.channel.bulkDelete(100);
			message.channel.bulkDelete(100);
			message.channel.bulkDelete(100);
			message.channel.bulkDelete(100);
			message.channel.bulkDelete(100);
			message.channel.bulkDelete(100);
			message.channel.bulkDelete(100);
			message.channel.send(`:white_check_mark: 1000 messages deleted! :white_check_mark:\nMessages deleted by ${message.author.tag}`);
		}
		else {
			message.channel.send('Insufficient permissions.\nRequired permissions: `MANAGE_MESSAGES` or `ADMINISTRATOR`');
		}
	}


	if (command === 'purge') {
		if (permissions.has('MANAGE_MESSAGES')) {
			const amount = parseInt(args[0]);

		    if (isNaN(amount)) {
			    return message.reply('that doesn\'t seem to be a valid number.');
		    }
		    else if (amount < 2 || amount > 100) {
			    return message.reply('you need to input a number between 2 and 100.');
		    }
		    else {
			    message.channel.bulkDelete(amount);
			    message.channel.send('Messages deleted!\nAmount: ' + amount + '.', '\n', 'Deleter: ' + `${message.author.username}`);
		    }

		}
		// ...
	}
	if (command === 'avatar') {
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: <${message.author.displayAvatarURL}>`);
		}

		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: <${user.displayAvatarURL}>`;
		});

		// send the entire array of strings as a message
		// by default, discord.js will `.join()` the array with `\n`
		message.channel.send(avatarList);
	}
});


bot.on('guildMemberAdd', member => {
	// Send the message to a designated channel on a server:
	const channel = member.guild.channels.find(ch => ch.name === 'welcome');
	// Do nothing if the channel wasn't found on this server
	if (!channel) return;
	// Send the message, mentioning the member
	channel.send(`Welcome to Light Cad Solutions, ${member}. Please read the Terms of Service, if your interested in purchasing/, located inside of the <#630638537993224202>.`);
});

bot.login(token);