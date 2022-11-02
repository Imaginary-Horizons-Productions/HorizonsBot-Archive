const { Client } = require('discord.js');
const { getButton } = require('./Source/Buttons/_buttonDictionary.js');
const { getCommand } = require('./Source/Commands/_commandDictionary.js');
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

	client.guilds.fetch(helpers.guildId).then(guild => {
		// Post version notes
		if (versionData.patchNotesChannelId) {
			fsa.readFile('./ChangeLog.md', { encoding: 'utf8' }).then(data => {
				let [currentFull, currentMajor, currentMinor, currentPatch] = data.match(/(\d+)\.(\d+)\.(\d+)/);
				let [_lastFull, lastMajor, lastMinor, lastPatch] = versionData.lastPostedVersion.match(/(\d+)\.(\d+)\.(\d+)/);

				if (currentMajor <= lastMajor) {
					if (currentMinor <= lastMinor) {
						if (currentPatch <= lastPatch) {
							return;
						}
					}
				}

				helpers.versionEmbedBuilder().then(embed => {
					guild.channels.fetch(versionData.patchNotesChannelId).then(patchChannel => {
						patchChannel.send({ embeds: [embed] });
						versionData.lastPostedVersion = currentFull;
						fsa.writeFile('./Config/_versionData.json', JSON.stringify(versionData), "utf-8");
					})
				}).catch(console.error);
			});
		}

		// Generate topic collection
		const channelManager = guild.channels;
		require('./Config/topicList.json').forEach(id => {
			channelManager.fetch(id).then(channel => {
				helpers.addTopic(id, channel.name);
			})
		})

		// Begin checking for club reminders
		for (let club of Object.values(helpers.getClubs())) {
			helpers.setClubReminder(club, channelManager);
			helpers.scheduleClubEvent(club, guild);
		}

		// Update pinned lists
		if (helpers.listMessages.topics) {
			helpers.updateList(channelManager, "topics");
		}

		if (helpers.listMessages.clubs) {
			helpers.updateList(channelManager, "clubs");
		}
	})
})

let topicBuriedness = 0;
let clubBuriedness = 0;

client.on('messageCreate', receivedMessage => {
	// Count messages for pin bumping
	if (helpers.listMessages.topics && receivedMessage.channelId === helpers.listMessages.topics.channelId) {
		topicBuriedness += 1;
		if (topicBuriedness > 9) {
			receivedMessage.channel.messages.fetch(helpers.listMessages.topics.messageId).then(oldMessage => {
				oldMessage.delete();
			})
			helpers.pinTopicsList(receivedMessage.guild.channels, receivedMessage.channel);
			topicBuriedness = 0;
		}
	}
	if (helpers.listMessages.clubs && receivedMessage.channelId == helpers.listMessages.clubs.id) {
		clubBuriedness += 1;
		if (clubBuriedness > 9) {
			receivedMessage.channel.messages.fetch(helpers.listMessages.clubs.messageId).then(oldMessage => {
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
		if (memberId == club.hostId) {
			guild.channels.resolve(club.id).delete("Club host left server");
		} else if (club.userIds.includes(memberId)) {
			club.userIds = club.userIds.filter(id => id != memberId);
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
	const { id, guild } = channel;
	let topics = helpers.getTopicIDs();
	let clubs = helpers.getClubs();
	if (topics && topics.includes(id)) {
		helpers.removeTopic(channel);
	} else if (clubs) {
		if (Object.values(clubs).map(club => club.voiceChannelId).includes(id)) {
			for (var club of Object.values(clubs)) {
				if (club.voiceChannelId == id) {
					let textChannel = guild.channels.resolve(club.id);
					if (textChannel) {
						textChannel.delete();
						helpers.removeClub(club.id);
					}
					break;
				}
			}
		} else if (Object.keys(clubs).includes(id)) {
			let voiceChannel = guild.channels.resolve(clubs[id].voiceChannelId);
			if (voiceChannel) {
				voiceChannel.delete();
				helpers.removeClub(id);
			}
		} else {
			return;
		}
		helpers.updateList(guild.channels, "clubs");
	}
})
