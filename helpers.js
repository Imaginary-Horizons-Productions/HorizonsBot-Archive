const fs = require('fs');
const { Collection, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
exports.guildId = require('./Config/_env.json').guildId;

exports.timeConversion = function (value, startingUnit, resultUnit) {
	let unknownUnits = [];
	let msPerStartUnit = 1;
	switch (startingUnit.toLowerCase()) {
		case "w":
			msPerStartUnit *= 7;
		case "d":
			msPerStartUnit *= 24;
		case "h":
			msPerStartUnit *= 60;
		case "m":
			msPerStartUnit *= 60;
		case "s":
			msPerStartUnit *= 1000;
		case "ms":
			msPerStartUnit *= 1;
			break;
		default:
			unknownUnits.push(startingUnit);
	}

	let msPerResultUnit = 1;
	switch (resultUnit.toLowerCase()) {
		case "w":
			msPerResultUnit *= 7;
		case "d":
			msPerResultUnit *= 24;
		case "h":
			msPerResultUnit *= 60;
		case "m":
			msPerResultUnit *= 60;
		case "s":
			msPerResultUnit *= 1000;
		case "ms":
			msPerResultUnit *= 1;
			break;
		default:
			unknownUnits.push(resultUnit);
	}
	if (!unknownUnits.length) {
		return value * msPerStartUnit / msPerResultUnit;
	} else {
		throw new Error(`Unknown unit used: ${unknownUnits.join(", ")} (allowed units: ms, s, m, h, d, w)`)
	}
}

//#region moderation
let moderatorIds = require('./Config/modData.json').modIds; // [userId]

exports.saveModData = function () {
	let noAts = exports.noAts;
	exports.saveObject({ modIds: moderatorIds, noAts }, "modData.json");
}

exports.isModerator = function (id) {
	return moderatorIds.includes(id);
}

exports.addModerator = function (id) {
	moderatorIds.push(id);
	exports.saveModData();
}

exports.removeModerator = function (removedID) {
	moderatorIds = moderatorIds.filter(id => id != removedID);
	exports.saveModData();
}

exports.modRoleId = require("./Config/_env.json").modRoleId;

exports.noAts = require("./Config/modData.json").noAts; // [userId]

exports.atIds = new Set(); // contains userIds
//#endregion

// {messageID: channelID}
exports.customEmbeds = require('./Config/embedsList.json');

// {type: {messageID: number, channelID: number}}
exports.listMessages = require('./Config/listMessageIDs.json');

// Collection <channelID, channelName>
let topics = new Collection();

exports.getTopicIDs = function () {
	return Array.from(topics.keys());
}

exports.getTopicNames = function () {
	return Array.from(topics.values());
}

exports.findTopicID = function (channelName) {
	return topics.findKey(checkedName => checkedName === channelName);
}

exports.addTopic = function (id, channelName) {
	topics.set(id, channelName);
}

exports.removeTopic = function (channel) {
	topics.delete(channel.id);
	exports.saveObject(exports.getTopicIDs(), 'topicList.json');
	exports.updateList(channel.guild.channels, "topics");
}

// {name: [petitioner IDs]}
let petitions = require('./Config/petitionList.json');
exports.getPetitions = function () {
	return petitions;
}

exports.setPetitions = function (petitionListInput, channelManager) {
	petitions = petitionListInput;
	exports.saveObject(petitions, 'petitionList.json');
	exports.updateList(channelManager, "topics");
}

// {textChannelID: Club}
let clubs = require('./Config/clubList.json');
exports.getClubs = function () {
	return clubs;
}

exports.updateClub = function (club, channelManager) {
	clubs[club.channelID] = club;
	exports.updateList(channelManager, "clubs");
	exports.saveObject(clubs, 'clubList.json');
}

exports.removeClub = function (id) {
	delete clubs[id];
	exports.saveObject(clubs, 'clubList.json');
}

// {textChannelId: timeout}
exports.reminderTimeouts = {};

// Functions
exports.embedTemplateBuilder = function (color = "#6b81eb") {
	return new MessageEmbed().setColor(color)
		.setAuthor({
			name: "Click here to visit HorizonsBot's GitHub",
			iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png",
			url: "https://github.com/Imaginary-Horizons-Productions/HorizonsBot"
		})
		.setTimestamp();
}

exports.getManagedChannels = function () {
	return exports.getTopicIDs().concat(Object.keys(exports.getClubs()));
}

exports.updateList = function (channelManager, listType) {
	let messageData = exports.listMessages[listType];
	if (messageData) {
		return channelManager.fetch(messageData.channelID).then(channel => {
			return channel.messages.fetch(messageData.messageID).then(message => {
				var builder = listType == "topics" ? exports.topicListBuilder : exports.clubListBuilder;
				builder(channelManager).then(messageOptions => {
					message.edit(messageOptions);
					if (messageOptions.files.length == 0) {
						message.removeAttachments();
					}
				}).catch(console.error);
				return message;
			});
		})
	}
}

function listSelectBuilder(listType) {
	var selectCutomId = "";
	var placeholderText = "";
	var disableSelect = false;
	var entries = [];

	if (listType === "topics") {
		var topicNames = exports.getTopicNames();
		var topicIds = exports.getTopicIDs();
		for (var i = 0; i < topicNames.length; i += 1) {
			entries.push({
				label: topicNames[i],
				description: "",
				value: topicIds[i]
			})
		}

		selectCutomId = "topicList";
	} else if (listType === "petitions") {
		for (var petition of Object.keys(exports.getPetitions())) {
			entries.push({
				label: petition,
				description: "",
				value: petition
			})
		}
		selectCutomId = "petitionList";
	} else {
		entries = Object.values(exports.getClubs()).map(club => {
			return {
				label: club.title,
				description: `${club.userIDs.length}${club.seats !== -1 ? `/${club.seats}` : ""} Members`,
				value: club.channelID
			}
		})
		selectCutomId = "clubList";
	}

	if (entries.length < 1) {
		entries.push({
			label: "no entries",
			description: "",
			value: "no entries"
		})
		disableSelect = true;
	}

	switch (listType) {
		case "topics":
			placeholderText = disableSelect ? "No topics yet" : "Select a topic...";
			break;
		case "petitions":
			placeholderText = disableSelect ? "No open petitions" : "Select a petition...";
			break;
		case "clubs":
			placeholderText = disableSelect ? "No clubs yet" : "Get club details...";
			break;
	}

	return new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId(selectCutomId)
			.setPlaceholder(placeholderText)
			.setDisabled(disableSelect)
			.addOptions(entries)
			.setMinValues(1)
			.setMaxValues(entries.length)
	);
}

exports.topicListBuilder = function (channelManager) {
	var messageOptions = {};

	// Select Menus
	messageOptions.components = [listSelectBuilder("topics"), listSelectBuilder("petitions")];

	// Generate Message Body
	let description = "Here's a list of the opt-in topic channels for the server. Join them by using `/join` or by using the select menu under this message (jump to message in pins).\n";
	let topics = exports.getTopicIDs();

	for (let i = 0; i < topics.length; i += 1) {
		let id = topics[i];
		let channel = channelManager.resolve(id);
		if (channel) {
			description += `\n__${channel.name}__${channel.topic ? ` ${channel.topic}` : ""}`;
		}
	}

	let petitionNames = Object.keys(petitions);
	let petitionText = `Here are the topic channels that have been petitioned for. Note that petitions will be converted to lowercase to match with Discord text channels being all lowercase. They will automatically be added when reaching **${Math.ceil(channelManager.guild.memberCount * 0.05)} petitions** (5% of the server). You can sign onto an already open petition with the select menu under this message (jump to message in pins).\n`;
	if (petitionNames.length > 0) {
		petitionNames.forEach(topicName => {
			petitionText += `\n${topicName}: ${petitions[topicName].length} petitioner(s) so far`;
		})
	}

	if (description.length > 2048 || petitionText.length > 1024) {
		return new Promise((resolve, reject) => {
			let fileText = description;
			if (petitionNames.length > 0) {
				fileText += `\n\n${petitionText}`;
			}

			fs.writeFile("data/TopicChannels.txt", fileText, "utf8", error => {
				if (error) {
					console.log(error);
				}
			});
			resolve(messageOptions);
		}).then(() => {
			messageOptions.embeds = [];
			messageOptions.files = [{
				attachment: "data/TopicChannels.txt",
				name: "TopicChannels.txt"
			}];
			return messageOptions;
		})
	} else {
		return new Promise((resolve, reject) => {
			let embed = exports.embedTemplateBuilder()
				.setTitle("Topic Channels")
				.setDescription(description)
				.setFooter({ text: "Please do not make bounties to vote for your petitions." });

			if (petitionNames.length > 0) {
				embed.addField("Petitioned Channels", petitionText)
			}
			messageOptions.embeds = [embed];
			messageOptions.files = [];
			resolve(messageOptions);
		})
	}
}

exports.pinTopicsList = function (channelManager, channel) {
	exports.topicListBuilder(channelManager).then(messageOptions => {
		channel.send(messageOptions).then(message => {
			exports.listMessages.topics = {
				"messageID": message.id,
				"channelID": message.channelId
			}
			exports.saveObject(exports.listMessages, "listMessageIDs.json");
			message.pin();
		})
	}).catch(console.log);
}

exports.clubListBuilder = function () {
	var messageOptions = {};

	messageOptions.components = [listSelectBuilder("clubs")];

	let description = "Here's a list of the clubs on the server. Learn more about one by typing `/club-invite (club ID)`.\n";
	let clubs = exports.getClubs();

	Object.keys(clubs).forEach(id => {
		let club = clubs[id];
		description += `\n__**${club.title}**__ (${club.userIDs.length}${club.seats !== -1 ? `/${club.seats}` : ""} Members)\n**ID**: ${club.channelID}\n**Host**: <@${club.hostID}>\n`;
		if (club.system) {
			description += `**Game**: ${club.system}\n`;
		}
		if (club.timeslot.nextMeeting) {
			description += `**Next Meeting**: <t:${club.timeslot.nextMeeting}>${club.timeslot.periodCount === 0 ? "" : ` repeats every ${club.timeslot.periodCount} ${club.timeslot.periodUnits === "w" ? "week(s)" : "day(s)"}`}\n`;
		}
	})

	if (description.length > 2048) {
		return new Promise((resolve, reject) => {
			let fileText = description;
			fs.writeFile("data/ClubChannels.txt", fileText, "utf8", error => {
				if (error) {
					console.log(error);
				}
			});
			resolve(messageOptions);
		}).then(messageOptions => {
			messageOptions.files = [{
				attachment: "data/ClubChannels.txt",
				name: "ClubChannels.txt"
			}];
			messageOptions.embeds = [];
			return messageOptions;
		})
	} else {
		return new Promise((resolve, reject) => {
			messageOptions.embeds = [
				exports.embedTemplateBuilder("#f07581")
					.setTitle("Clubs")
					.setDescription(description)
			];
			messageOptions.files = [];
			resolve(messageOptions);
		})
	}
}

exports.pinClubsList = function (channelManager, channel) {
	exports.clubListBuilder(channelManager).then(messageOptions => {
		channel.send(messageOptions).then(message => {
			exports.listMessages.clubs = {
				"messageID": message.id,
				"channelID": message.channelId
			}
			message.pin();
			exports.saveObject(exports.listMessages, "listMessageIDs.json");
		})
	}).catch(console.log);
}

exports.checkPetition = function (guild, topicName, author = null) {
	let petitions = exports.getPetitions();
	if (!petitions[topicName]) {
		petitions[topicName] = [];
	}
	if (author) {
		if (!petitions[topicName].includes(author.id)) {
			petitions[topicName].push(author.id);
		} else {
			author.send(`You have already petitioned for ${topicName}.`)
				.catch(console.error)
			return;
		}
	}
	if (petitions[topicName].length > guild.memberCount * 0.05) {
		exports.addTopicChannel(guild, topicName);
	} else {
		exports.setPetitions(petitions, guild.channels);
	}
	exports.updateList(guild.channels, "topics");
}

exports.addTopicChannel = function (guild, topicName) {
	return guild.channels.create(topicName, {
		parent: "581886288102424592",
		permissionOverwrites: [
			{
				id: guild.me,
				allow: ["VIEW_CHANNEL"],
				type: 1
			},
			{
				id: moderatorIds.roleId,
				allow: ["VIEW_CHANNEL"],
				type: 1
			},
			{
				id: guild.id,
				deny: ["VIEW_CHANNEL"],
				type: 0
			}
		],
		type: "GUILD_TEXT"
	}).then(channel => {
		var petitions = exports.getPetitions();
		if (!petitions[topicName]) {
			petitions[topicName] = [];
		}

		// Make channel viewable by petitioners, and BountyBot
		guild.members.fetch({
			user: petitions[topicName].concat(["536330483852771348"])
		}).then(allowedCollection => {
			allowedCollection.mapValues(member => {
				channel.permissionOverwrites.create(member.user, {
					"VIEW_CHANNEL": true
				});
			})

			if (petitions[topicName].length > 0) {
				channel.send(`This channel has been created thanks to: <@${petitions[topicName].join('> <@')}>`);
			}
			delete petitions[topicName];
			exports.addTopic(channel.id, channel.name);
			exports.saveObject(exports.getTopicIDs(), 'topicList.json');
			exports.setPetitions(petitions, guild.channels);
		})
		return channel;
	}).catch(console.log);
}

exports.joinChannel = function (channel, user) {
	if (!user.bot) {
		let channelID = channel.id;
		let permissionOverwrite = channel.permissionOverwrites.resolve(user.id);
		if (!permissionOverwrite || !permissionOverwrite.deny.has("VIEW_CHANNEL", false)) {
			if (exports.getTopicIDs().includes(channelID)) {
				channel.permissionOverwrites.create(user, {
					"VIEW_CHANNEL": true
				}).then(() => {
					channel.send(`Welcome to ${channel.name}, ${user}!`);
				}).catch(console.log);
			} else if (Object.keys(exports.getClubs()).includes(channelID)) {
				let club = exports.getClubs()[channelID];
				if (club.seats === -1 || club.userIDs.length < club.seats) {
					if (club.hostID != user.id && !club.userIDs.includes(user.id)) {
						club.userIDs.push(user.id);
						channel.permissionOverwrites.create(user, {
							"VIEW_CHANNEL": true
						}).then(() => {
							channel.guild.channels.resolve(club.voiceChannelID).permissionOverwrites.create(user, {
								"VIEW_CHANNEL": true
							})
							channel.send(`Welcome to ${channel.name}, ${user}!`);
						})
						exports.updateClubDetails(club, channel);
						exports.updateClub(club, channel.guild.channels);
					} else {
						user.send(`You are already in ${club.title}.`)
							.catch(console.error);
					}
				} else {
					user.send(`${club.title} is already full.`)
						.catch(console.error);
				}
			}
		} else {
			user.send(`You are currently banned from ${channel.name}. Speak to a Moderator if you believe this is in error.`)
				.catch(console.error);
		}
	}
}

exports.clubInviteBuilder = function (club, includeJoinButton) {
	// Generate Embed
	let embed = exports.embedTemplateBuilder()
		.setTitle(`__**${club.title}**__ (${club.userIDs.length}${club.seats !== -1 ? `/${club.seats}` : ""} Members)`)
		.setDescription(club.description)
		.addField("Club Host", `<@${club.hostID}>`)
		.setImage(club.imageURL);
	if (club.system) {
		embed.addField("Game", club.system);
	}
	if (club.timeslot.nextMeeting) {
		embed.addField("Next Meeting", `<t:${club.timeslot.nextMeeting}>${club.timeslot.periodCount === 0 ? "" : ` repeats every ${club.timeslot.periodCount} ${club.timeslot.periodUnits === "w" ? "week(s)" : "day(s)"}`}`);
	}
	if (club.color) {
		embed.setColor(club.color);
	}

	// Generate Components
	let buttons = [];
	if (includeJoinButton) {
		buttons.push(new MessageButton().setCustomId(`join-${club.channelID}`).setLabel(`Join ${club.title}`).setStyle("SUCCESS"));
	}
	let uiComponents = [];
	if (buttons.length > 0) {
		uiComponents.push(new MessageActionRow().addComponents(...buttons));
	}

	return { embed, uiComponents };
}

exports.clubInvite = function (interaction, clubId, recipient) {
	let club = exports.getClubs()[clubId];
	if (club) {
		if (!recipient) {
			recipient = interaction.user;
		}
		if (!recipient.bot) {
			if (recipient.id !== club.hostID && !club.userIDs.includes(recipient.id)) {
				let { embed, uiComponents } = exports.clubInviteBuilder(club, true);
				recipient.send({ embeds: [embed], components: uiComponents }).then(() => {
					interaction.reply({ content: "Club details have been sent.", ephemeral: true });
				}).catch(console.error);
			} else {
				interaction.reply({ content: "If the club details are not pinned, the club leader can have them reposted and pinned with `/club-details`.", ephemeral: true })
					.catch(console.error);
			}
		}
	} else {
		interaction.reply({ content: `The club you indicated could not be found. Please check for typos!`, ephemeral: true })
			.catch(console.error);
	}
}

exports.updateClubDetails = (club, channel) => {
	channel.messages.fetch(club.detailSummaryId).then(message => {
		let { embed, uiComponents } = exports.clubInviteBuilder(club, false);
		message.edit({ content: "You can send out invites with \`/club-invite\`. Prospective members will be shown the following embed:", embeds: [embed], components: uiComponents, fetchReply: true }).then(detailSummaryMessage => {
			detailSummaryMessage.pin();
			club.detailSummaryId = detailSummaryMessage.id;
			exports.updateClub(club, channel.guild.channels);
		});
	}).catch(error => {
		if (error.message === "Unknown Message") {
			// message not found
			let { embed, uiComponents } = exports.clubInviteBuilder(club, false);
			channel.send({ content: "You can send out invites with \`/club-invite\`. Prospective members will be shown the following embed:", embeds: [embed], components: uiComponents, fetchReply: true }).then(detailSummaryMessage => {
				detailSummaryMessage.pin();
				club.detailSummaryId = detailSummaryMessage.id;
				exports.updateClub(club, channel.guild.channels);
			});
		} else {
			console.error(error);
		}
	});
}

exports.clearClubReminder = async function (club, guild) {
	if (exports.reminderTimeouts[club.channelID]) {
		clearTimeout(exports.reminderTimeouts[club.channelID]);
		delete exports.reminderTimeouts[club.channelID];
	}

	if (club.timeslot.eventId) {
		guild.scheduledEvents.delete(club.timeslot.eventId);
		club.timeslot.eventId = "";
	}
}

exports.setClubReminderTimeout = async function (club, channelManager) {
	await exports.clearClubReminder(club, channelManager.guild);
	if (club.timeslot.nextMeeting) {
		if (club.timeslot.periodCount) {
			let event;
			if (club.userIDs.length < club.seats) {
				let voiceChannel = await channelManager.fetch(club.voiceChannelID);
				event = await channelManager.guild.scheduledEvents.create({
					name: club.title,
					scheduledStartTime: club.timeslot.nextMeeting * 1000,
					privacyLevel: 2,
					entityType: "VOICE",
					description: club.description,
					channel: voiceChannel
				})
				club.timeslot.eventId = event.id;
			}
			let msTimestamp = Date.now();
			let msToDayBeforeNextMeeting = (club.timeslot.nextMeeting * 1000) - exports.timeConversion(1, "d", "ms") - msTimestamp;
			let timeout = setTimeout((timeoutClub, eventURL) => {
				channelManager.fetch(timeoutClub.channelID).then(textChannel => { // Interested button not available for events in private channels
					textChannel.send(`@everyone ${timeoutClub.timeslot.message ? timeoutClub.timeslot.message : "Reminder: this club meets in about 24 hours"}${eventURL ? ` ${eventURL}` : ""}`);
				});
				timeoutClub.timeslot.nextMeeting = Number(timeoutClub.timeslot.nextMeeting) + Number(exports.timeConversion(timeoutClub.timeslot.periodCount, timeoutClub.timeslot.periodUnits, "s"));
				exports.setClubReminderTimeout(timeoutClub, channelManager);
			}, msToDayBeforeNextMeeting, club, await event?.createInviteURL());
			exports.reminderTimeouts[club.channelID] = timeout;
		}
		exports.updateClub(club, channelManager);
	}
}

exports.saveObject = function (object, fileName) {
	var filePath = `./`;
	filePath += 'Config/' + fileName;
	if (!fs.existsSync('./Config')) {
		fs.mkdirSync('./Config');
	}
	let textToSave = '';
	if (object instanceof Collection) {
		textToSave = [];
		Array.from(object.values).forEach(value => {
			textToSave.push([object.findKey(checkedValue => checkedValue === value), value]);
		})
		textToSave = JSON.stringify(textToSave);
	} else if (typeof object == 'object' || typeof object == 'number') {
		textToSave = JSON.stringify(object);
	} else {
		textToSave = object;
	}

	fs.writeFile(filePath, textToSave, 'utf8', (error) => {
		if (error) {
			console.log(error);
		}
	})
}

exports.versionEmbedBuilder = function (avatarURL) {
	return fs.promises.readFile('./ChangeLog.md', { encoding: 'utf8' }).then(data => {
		const dividerRegEx = /####/g;
		const changesStartRegEx = /\.\d+:/g;
		const knownIssuesStartRegEx = /### Known Issues/g;
		let titleStart = dividerRegEx.exec(data).index;
		changesStartRegEx.exec(data);
		let knownIssuesStart;
		let knownIssueStartResult = knownIssuesStartRegEx.exec(data);
		if (knownIssueStartResult) {
			knownIssuesStart = knownIssueStartResult.index;
		}
		let knownIssuesEnd = dividerRegEx.exec(data).index;

		let embed = exports.embedTemplateBuilder()
			.setTitle(data.slice(titleStart + 5, changesStartRegEx.lastIndex))
			.setURL('https://discord.gg/bcE3Syu')
			.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/734099622846398565/newspaper.png');

		if (knownIssuesStart && knownIssuesStart < knownIssuesEnd) {
			// Known Issues section found
			embed.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesStart))
				.addField(`Known Issues`, data.slice(knownIssuesStart + 16, knownIssuesEnd))
		} else {
			// Known Issues section not found
			embed.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesEnd));
		}

		return embed.addField(`Become a Sponsor`, `Chip in for server costs or commission your own bot by sponsoring [HorizonsBot on GitHub](https://github.com/Imaginary-Horizons-Productions/HorizonsBot)`);
	})
}
