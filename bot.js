const { Client } = require('discord.js');
const { getButton } = require('./Source/Buttons/_buttonDictionary.js');
const { getCommand, initializeCommands } = require('./Source/Commands/_commandDictionary.js');
const { getSelect } = require('./Source/Selects/_selectDictionary.js');
const helpers = require('./helpers.js');
const fsa = require("fs").promises;
const versionData = require('./Config/_versionData.json');

const client = new Client({
	retryLimit: 5,
	presence: {
		activities: [{
			name: "/commands",
			type: "LISTENING"
		}]
	},
	intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES']
});

client.login(require('./Config/_env.json').token)
	.catch(console.error);

client.on('ready', () => {
	console.log(`Connected as ${client.user.tag}\n`);

	initializeCommands(true, helpers);
	client.guilds.fetch(helpers.guildId).then(guild => {
		// Post version notes
		if (versionData.patchNotesChannelId) {
			fsa.readFile('./ChangeLog.md', { encoding: 'utf8' }).then(data => {
				let version = data.match(/(\d+.\d+.\d+)/)[0];
				if (versionData.lastPostedVersion < version) {
					helpers.versionEmbedBuilder(client.user.displayAvatarURL()).then(embed => {
						guild.channels.fetch(versionData.patchNotesChannelId).then(patchChannel => {
							patchChannel.send({ embeds: [embed] });
							versionData.lastPostedVersion = version;
							fsa.writeFile('./Config/_versionData.json', JSON.stringify(versionData), "utf-8");
						})
					}).catch(console.error);
				}
			});
		}

		// Update pinned lists
		let channelManager = guild.channels;
		if (helpers.listMessages.topics) {
			helpers.updateList(channelManager, "topics");
		}

		if (helpers.listMessages.clubs) {
			helpers.updateList(channelManager, "clubs");
		}

		// Generate topic collection
		require('./Config/topicList.json').forEach(id => {
			channelManager.fetch(id).then(channel => {
				helpers.addTopic(id, channel.name);
			})
		})

		// Begin checking for club reminders
		for (let club of Object.values(helpers.getClubs())) {
			helpers.setClubReminderTimeout(club, channelManager);
		}
	})
})

let topicBuriedness = 0;
let clubBuriedness = 0;

client.on('messageCreate', receivedMessage => {
	// Count messages for pin bumping
	if (helpers.listMessages.topics && receivedMessage.channelId === helpers.listMessages.topics.channelID) {
		topicBuriedness += 1;
		if (topicBuriedness > 9) {
			receivedMessage.channel.messages.fetch(helpers.listMessages.topics.messageID).then(oldMessage => {
				oldMessage.delete();
			})
			helpers.pinTopicsList(receivedMessage.guild.channels, receivedMessage.channel);
			topicBuriedness = 0;
		}
	}
	if (helpers.listMessages.clubs && receivedMessage.channelId == helpers.listMessages.clubs.channelID) {
		clubBuriedness += 1;
		if (clubBuriedness > 9) {
			receivedMessage.channel.messages.fetch(helpers.listMessages.clubs.messageID).then(oldMessage => {
				oldMessage.delete();
			})
			helpers.pinClubsList(receivedMessage.guild.channels, receivedMessage.channel);
			clubBuriedness = 0;
		}
	}
})

client.on("interactionCreate", interaction => {
	if (interaction.isSelectMenu()) {
		getSelect(interaction.customId).execute(interaction);
	} else if (interaction.isCommand()) {
		getCommand(interaction.commandName).execute(interaction);
	} else if (interaction.isButton()) {
		let buttonArguments = interaction.customId.split("-");
		getButton(buttonArguments.shift()).execute(interaction, buttonArguments);
	}
})

client.on('guildMemberRemove', member => {
	let memberId = member.id;
	let guild = member.guild;

	// Remove member's clubs
	for (let club of Object.values(helpers.getClubs())) {
		if (memberId == club.hostID) {
			guild.channels.resolve(club.channelID).delete("Club host left server");
		} else if (club.userIDs.includes(memberId)) {
			club.userIDs = club.userIDs.filter(id => id != memberId);
			helpers.updateList(guild.channels, "clubs");
		}
	}

	// Remove member from petitions and check if member leaving completes any petitions
	let petitions = helpers.getPetitions();
	for (let topicName in petitions) {
		petitions[topicName] = petitions[topicName].filter(id => id != memberId);
		helpers.setPetitions(petitions, guild.channels);
		helpers.checkPetition(guild, topicName);
	}
})

client.on('channelDelete', channel => {
	let channelID = channel.id;
	let topics = helpers.getTopicIDs();
	let clubs = helpers.getClubs();
	if (topics && topics.includes(channelID)) {
		helpers.removeTopic(channel);
	} else if (clubs) {
		if (Object.values(clubs).map(club => club.voiceChannelID).includes(channelID)) {
			for (var club of Object.values(clubs)) {
				if (club.voiceChannelID == channelID) {
					let textChannel = channel.guild.channels.resolve(club.channelID);
					if (textChannel) {
						textChannel.delete();
						helpers.removeClub(club.channelID);
					}
					break;
				}
			}
		} else if (Object.keys(clubs).includes(channelID)) {
			let voiceChannel = channel.guild.channels.resolve(clubs[channelID].voiceChannelID);
			if (voiceChannel) {
				voiceChannel.delete();
				helpers.removeClub(channelID);
			}
		} else {
			return;
		}
		helpers.updateList(channel.guild.channels, "clubs");
	}
})
