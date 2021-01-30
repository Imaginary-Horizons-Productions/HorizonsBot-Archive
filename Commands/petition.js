const Command = require('../Classes/Command.js');
const { getPetitionList, setPetitionList, addChannel, updateTopicList, saveObject } = require('../helpers.js');

var command = new Command(["Petition"], // aliases
	"Petition for a topic channel to be created", // description
	"None", // requirements
	["__Example__ - replace ( ) with your settings"], // headers
	[`@HorizonsBot Petition (topic name)`]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Record a user's petition for a text channel, create channel if sufficient number of petitions
	let topicName = state.messageArray.join('-');
	let petitionList = getPetitionList();
	if (!petitionList[topicName]) {
		petitionList[topicName] = [];
	}
	if (!petitionList[topicName].includes(receivedMessage.author.id)) {
		petitionList[topicName].push(receivedMessage.author.id);
		let memberCount = 70;
		if (petitionList[topicName].length > memberCount * 0.05) {
			let petitionersIDs = petitionList[topicName];
			let unveilingText = "This channel has been created thanks to: ";
			addChannel(receivedMessage.guild.channels, receivedMessage.channel.parent.id, topicName).then(channel => {
				petitionersIDs.forEach(id => {
					unveilingText += `<@${id}> `;
					channel.createOverwrite(id, {
						"VIEW_CHANNEL": true
					});
				});
				channel.send(unveilingText);
			})
			delete petitionList[topicName];
		}
		updateTopicList(receivedMessage.guild.channels);
		setPetitionList(petitionList);
		receivedMessage.author.send(`Your petition for ${topicName} has been recorded.`)
			.catch(console.error)
	} else {
		receivedMessage.author.send(`You have already petitioned for ${topicName}.`)
			.catch(console.error)
	}
}

module.exports = command;
