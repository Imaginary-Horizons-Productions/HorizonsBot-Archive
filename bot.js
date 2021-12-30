const { Client } = require('discord.js');
const { getButton } = require('./Data/Buttons/_buttonDictionary.js');
const { getCommand } = require('./Data/Commands/_commandDictionary.js');
const { getSelect } = require('./Data/Selects/_selectDictionary.js');
const { guildId, listMessages, updateList, addTopic, getClubs, setClubReminderTimeout, pinTopicsList, pinClubsList, getPetitions,
	setPetitions, checkPetition, getTopicIDs, removeTopic, removeClub } = require('./helpers.js');

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

	client.guilds.fetch(guildId).then(guild => {
		// Update pinned lists
		let channelManager = guild.channels;
		if (listMessages.topics) {
			updateList(channelManager, "topics");
		}

		if (listMessages.clubs) {
			updateList(channelManager, "clubs");
		}

		// Generate topic collection
		require('./Config/topicList.json').forEach(id => {
			channelManager.fetch(id).then(channel => {
				addTopic(id, channel.name);
			})
		})

		// Begin checking for club reminders
		for (let club of Object.values(getClubs())) {
			setClubReminderTimeout(club, channelManager);
		}
	})
})

let topicBuriedness = 0;
let clubBuriedness = 0;

client.on('messageCreate', receivedMessage => {
	// Count messages for pin bumping
	if (listMessages.topics && receivedMessage.channelId === listMessages.topics.channelID) {
		topicBuriedness += 1;
		if (topicBuriedness > 9) {
			receivedMessage.channel.messages.fetch(listMessages.topics.messageID).then(oldMessage => {
				oldMessage.delete();
			})
			pinTopicsList(receivedMessage.guild.channels, receivedMessage.channel);
			topicBuriedness = 0;
		}
	}
	if (listMessages.clubs && receivedMessage.channelId == listMessages.clubs.channelID) {
		clubBuriedness += 1;
		if (clubBuriedness > 9) {
			receivedMessage.channel.messages.fetch(listMessages.clubs.messageID).then(oldMessage => {
				oldMessage.delete();
			})
			pinClubsList(receivedMessage.guild.channels, receivedMessage.channel);
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
	for (let club of Object.values(getClubs())) {
		if (memberId == club.hostID) {
			guild.channels.resolve(club.channelID).delete("Club host left server");
		} else if (club.userIDs.includes(memberId)) {
			club.userIDs = club.userIDs.filter(id => id != memberId);
			updateList(guild.channels, "clubs");
		}
	}

	// Remove member from petitions and check if member leaving completes any petitions
	let petitions = getPetitions();
	for (let topicName in petitions) {
		petitions[topicName] = petitions[topicName].filter(id => id != memberId);
		setPetitions(petitions, guild.channels);
		checkPetition(guild, topicName);
	}
})

client.on('channelDelete', channel => {
	let channelID = channel.id;
	let topics = getTopicIDs();
	let clubs = getClubs();
	if (topics && topics.includes(channelID)) {
		removeTopic(channel);
	} else if (clubs) {
		if (Object.values(clubs).map(club => club.voiceChannelID).includes(channelID)) {
			for (var club of Object.values(clubs)) {
				if (club.voiceChannelID == channelID) {
					let textChannel = channel.guild.channels.resolve(club.channelID);
					if (textChannel) {
						textChannel.delete();
						removeClub(club.channelID);
					}
					break;
				}
			}
		} else if (Object.keys(clubs).includes(channelID)) {
			let voiceChannel = channel.guild.channels.resolve(clubs[channelID].voiceChannelID);
			if (voiceChannel) {
				voiceChannel.delete();
				removeClub(channelID);
			}
		} else {
			return;
		}
		updateList(channel.guild.channels, "clubs");
	}
})
