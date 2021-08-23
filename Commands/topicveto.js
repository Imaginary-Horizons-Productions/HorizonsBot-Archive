const Command = require('../Classes/Command.js');
const { isModerator, getPetitions, setPetitions, updateList } = require('../helpers.js');

var command = new Command(["TopicVeto"], // aliases
	"Veto a petition", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot TopicVeto (channel name)`"]); // texts (must match number of headings)

command.data.addStringOption(option => option.setName("topic").setDescription("The petition to close").setRequired(true));

command.execute = (receivedMessage, state) => {
	// Remove the given petition from the petition list
	if (isModerator(receivedMessage.author.id)) {
		let vetoedPetition = state.messageArray.join(' ');
		let petitions = getPetitions();
		let petitionersIDs = petitions[vetoedPetition];
		if (petitionersIDs) {
			receivedMessage.channel.send(`${petitionersIDs.length} server member(s) have petitioned for ${vetoedPetition}.\nReally veto? :white_check_mark: for yes, :no_entry_sign: for no.`).then(async message => {
				await message.react("✅");
				await message.react("🚫");
				let collector = message.createReactionCollector((reaction, user) => { return user.id == receivedMessage.author.id && (reaction.emoji.name == "🚫" || reaction.emoji.name == "✅") }, { "max": 1 });

				collector.on("collect", (reaction) => {
					console.log("collect emitted");
					if (reaction.emoji.name == "🚫") {
						message.edit(`Petition veto cancelled.`)
							.catch(console.error);
					} else if (reaction.emoji.name == "✅") {
						delete petitions[vetoedPetition];
						setPetitions(petitions);
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

command.executeInteraction = (interaction) => {
	// Remove the given petition from the petition list
	if (isModerator(interaction.user.id)) {
		let vetoedPetition = interaction.options.getString('topic');
		let petitions = getPetitions();
		let petitionersIDs = petitions[vetoedPetition];
		if (petitionersIDs) {
			delete petitions[vetoedPetition];
			setPetitions(petitions);
			updateList(interaction.guild.channels, "topics");
			interaction.reply(`The petition for ${vetoedPetition} has been vetoed.`)
				.catch(console.error);
		} else {
			interaction.reply(`There doesn't seem to be an open petition for ${vetoedPetition}.`)
				.catch(console.error);
		}
	} else {
		interaction.reply("Vetoing petitions is restricted to Moderators.")
			.catch(console.error);
	}
}

module.exports = command;
