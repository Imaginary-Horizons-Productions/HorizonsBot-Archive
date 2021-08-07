const Command = require('../Classes/Command.js');
const { joinChannel, getPetitions, setPetitions, guildID, getTopicNames, findTopicID, checkPetition } = require('../helpers.js');

var command = new Command(["Petition"], // aliases
	"Petition for a topic", // description
	"N/A", // requirements
	["Example - replace ( ) with your settings"], // headers
	[`@HorizonsBot Petition (topic name)`]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Record a user's petition for a text channel, create channel if sufficient number of petitions
	let topicName = state.messageArray.join('-').toLowerCase();
	if (getTopicNames().includes(topicName)) {
		let channelID = findTopicID(topicName);
		receivedMessage.client.guilds.fetch(guildID).then(guild => {
			joinChannel(guild.channels.resolve(channelID), receivedMessage.author);
		})
	} else {
		let petitions = getPetitions();
		if (!petitions[topicName]) {
			petitions[topicName] = [];
		}
		if (!petitions[topicName].includes(receivedMessage.author.id)) {
			receivedMessage.client.guilds.fetch(guildID).then(guild => {
				petitions[topicName].push(receivedMessage.author.id);
				let petitionComplete = checkPetition(guild, topicName);
				if (!petitionComplete) {
					receivedMessage.author.send(`Your petition for ${topicName} has been recorded.`)
						.catch(console.error)
					setPetitions(petitions, guild.channels);
				}
			});
		} else {
			receivedMessage.author.send(`You have already petitioned for ${topicName}.`)
				.catch(console.error)
		}
	}
}

module.exports = command;
