const Command = require('../Classes/Command.js');
const { petitionList, addChannel, updateTopicList, saveObject } = require('../helpers.js');

var command = new Command(["Petition"], // aliases
	"Petition for a topic channel to be created", // description
	"None", // requirements
	["__Example__ - replace ( ) with your settings"], // headers
	[`@HorizonsBot Petition (topic name)`]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Command specifications go here
	let topicName = state.messageArray.join('-');
	if (!petitionList[topicName]) {
		petitionList[topicName] = [];
	}
	if (!petitionList[topicName].includes(receivedMessage.author.id)) {
		petitionList[topicName].push(receivedMessage.author.id);
		let memberCount = 70;
		if (petitionList[topicName].length > memberCount * 0.05) {
			let petitionersIDs = petitionList[topicName];
			let unveilingText = "This channel has been created thanks to: ";
			addChannel(receivedMessage, topicName).then(channel => {
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
		saveObject(petitionList, 'petitionList.json');
	} else {
		receivedMessage.author.send(`Your petition for ${topicName} has been recorded.`)
			.catch(console.error)
	}
}

module.exports = command;
