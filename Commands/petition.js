const Command = require('../Classes/Command.js');
const { getPetitions, setPetitions, addChannel, updateList } = require('../helpers.js');

var command = new Command(["Petition"], // aliases
	"Petition for a topic channel to be created", // description
	"None", // requirements
	["Example - replace ( ) with your settings"], // headers
	[`@HorizonsBot Petition (topic name)`]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Record a user's petition for a text channel, create channel if sufficient number of petitions
	let topicName = state.messageArray.join('-').toLowerCase();
	let petitions = getPetitions();
	if (!petitions[topicName]) {
		petitions[topicName] = [];
	}
	if (!petitions[topicName].includes(receivedMessage.author.id)) {
		petitions[topicName].push(receivedMessage.author.id);
		let memberCount = 70;
		if (petitions[topicName].length > memberCount * 0.05) {
			let petitionersIDs = petitions[topicName];
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
			delete petitions[topicName];
		}
		updateList(receivedMessage.guild.channels, "topics");
		setPetitions(petitions);
		receivedMessage.author.send(`Your petition for ${topicName} has been recorded.`)
			.catch(console.error)
	} else {
		receivedMessage.author.send(`You have already petitioned for ${topicName}.`)
			.catch(console.error)
	}
}

module.exports = command;
