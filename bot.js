const { Client } = require('discord.js');
const { getCommand } = require('./Data/Commands/_commandDictionary.js');
var helpers = require('./helpers.js');

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

client.login(require('./Config/auth.json').token)
	.catch(console.error);

client.on('ready', () => {
	console.log(`Connected as ${client.user.tag}\n`);

	client.guilds.fetch(helpers.guildID).then(guild => {
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
		setInterval(() => {
			let thisHour = new Date();
			Object.values(helpers.getClubs()).forEach(club => {
				let dayBefore = (club.timeslot[0] - 1 + 7) % 7;
				if (thisHour.getDay() === dayBefore && thisHour.getHours() === club.timeslot[1]) {
					channelManager.fetch(club.channelID).then(textChannel => {
						textChannel.send(`@here ${club.timeslot[2] ? club.timeslot[2] : "Reminder: this club meets in 24 hours"}`);
					})
				}
			})
		}, 3600000);
	})
})

let topicBuriedness = 0;
let clubBuriedness = 0;

client.on('messageCreate', receivedMessage => {
	// Count messages for pin bumping
	if (helpers.listMessages.topics && receivedMessage.channel.id === helpers.listMessages.topics.channelID) {
		topicBuriedness += 1;
		if (topicBuriedness > 9) {
			receivedMessage.channel.messages.fetch(helpers.listMessages.topics.messageID).then(oldMessage => {
				oldMessage.delete();
			})
			helpers.pinTopicsList(receivedMessage.guild.channels, receivedMessage.channel);
			topicBuriedness = 0;
		}
	}
	if (helpers.listMessages.clubs && receivedMessage.channel.id == helpers.listMessages.clubs.channelID) {
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
		if (interaction.customId === "topicListSelect") {
			interaction.values.forEach(channelID => {
				interaction.guild.channels.fetch(channelID).then(channel => {
					helpers.joinChannel(channel, interaction.user);
				})
			})
			interaction.update("\u200B");
		} else if (interaction.customId === "petitionListSelect") {
			interaction.values.forEach(petition => {
				helpers.checkPetition(interaction.guild, petition, interaction.user);
			})
			interaction.update("\u200B");
		} else if (interaction.customId === "clubListSelect") {
			interaction.values.forEach(channelID => {
				helpers.clubInvite(interaction, channelID, interaction.user);
			})
		}
	} else if (interaction.isCommand()) {
		getCommand(interaction.commandName).execute(interaction);
	} else if (interaction.isButton()) {
		var buttonArguments = interaction.customId.split("-");
		switch (buttonArguments[0]) {
			case "join":
				interaction.client.guilds.fetch(helpers.guildID).then(guild => {
					guild.channels.fetch(buttonArguments[1]).then(channel => {
						helpers.joinChannel(channel, interaction.user);
					})
				})
				interaction.message.edit({ components: [] });
				break;
			case "delete":
				interaction.guild.channels.fetch(buttonArguments[1]).then(channel => channel.delete("Club leader left"));
				break;
		}
	}
})

client.on('guildMemberRemove', member => {
	let memberId = member.id;
	let guild = member.guild;

	// Remove member's clubs
	let clubs = Object.values(helpers.getClubs());
	for (var club of clubs) {
		if (memberId == club.hostID) {
			guild.channels.resolve(club.channelID).delete("Club host left server");
		} else if (club.userIDs.includes(memberId)) {
			club.userIDs = club.userIDs.filter(id => id != memberId);
			helpers.updateList(guild.channels, "clubs");
		}
	}

	// Remove member from petitions and check if member leaving completes any petitions
	let petitions = helpers.getPetitions();
	Object.keys(helpers.getPetitions()).forEach(topicName => {
		petitions[topicName] = petitions[topicName].filter(id => id != memberId);
		helpers.setPetitions(petitions, guild.channels);
		helpers.checkPetition(guild, topicName);
	})
})

client.on('channelDelete', channel => {
	let channelID = channel.id;
	let topics = helpers.getTopicIDs();
	let clubs = helpers.getClubs();
	if (topics && topics.includes(channelID)) {
		helpers.removeTopic(channel);
	} else if (clubs) {
		if (Object.values(clubs).map(club => { return club.voiceChannelID; }).includes(channelID)) {
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
