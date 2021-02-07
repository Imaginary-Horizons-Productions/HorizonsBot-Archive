const Command = require('../Classes/Command.js');
const { isModerator, getPetitionList, setPetitionList, updateList } = require('../helpers.js');

var command = new Command(["TopicVeto"], // aliases
	"Vetos an open petition", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot TopicVeto (channel name)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Remove the given petition from the petition list
	if (isModerator(receivedMessage.author.id)) {
		let vetoedPetition = state.messageArray.join('-');
		let petitionList = getPetitionList();
		let petitionersIDs = petitionList[vetoedPetition];
		if (petitionersIDs) {
			receivedMessage.channel.send(`${petitionersIDs.length} server member(s) have petitioned for ${vetoedPetition}.\nReally veto? :white_check_mark: for yes, :no_entry_sign: for no.`).then(message => {
				message.react("✅");
				message.react("🚫");
				let collector = message.createReactionCollector((reaction, user) => { return user.id == receivedMessage.author.id }, { "max": 1 });

				collector.on("collect", (reaction) => {
					if (reaction.emoji.name == "🚫") {
						message.edit(`Petition veto cancelled.`)
							.catch(console.error);
					} else if (reaction.emoji.name == "✅") {
						delete petitionList[vetoedPetition];
						setPetitionList(petitionList);
						updateList(receivedMessage.guild.channels, "topics");
						message.edit(`The petition for ${vetoedPetition} has been vetoed.`)
							.catch(console.error);
					}
				})
			})
		} else {
			receivedMessage.author.send(`There doesn't seem to be an open petition for ${vetoedPetition}.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send("Vetoing petitions is restricted to Moderators.")
			.catch(console.error);
	}
}

module.exports = command;
