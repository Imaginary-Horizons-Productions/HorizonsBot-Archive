const Command = require('../../Classes/Command.js');

const options = [
	{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
	{ type: "String", name: "text", description: "The text to put in the author field", required: true, choices: {} },
	{ type: "String", name: "icon-url", description: "The image url for the author icon", required: false, choices: {} },
	{ type: "String", name: "url", description: "Where clicking the author takes the user", required: false, choices: {} }
];
const subcomands = [];
module.exports = new Command("embed-set-author", "(moderator) Assign a custom embed's author", options, subcomands);

let customEmbeds, isModerator;
module.exports.initialize = function(helpers) {
	({ customEmbeds, isModerator } = helpers);
}

module.exports.execute = (interaction) => {
	// Set the author for the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("message-id");
		if (customEmbeds[messageID]) {
			let name = interaction.options.getString("text");
			var urlRegex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,})/, 'gi');
			let iconURL = interaction.options.getString("icon-url");
			var validIcon = urlRegex.test(iconURL);
			let url = interaction.options.getString("url");
			var validURL = urlRegex.test(url);
			interaction.guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
				let embed = message.embeds[0].setAuthor({
					name,
					iconURL: validIcon ? iconURL : "",
					url: validURL ? url : ""
				}).setTimestamp();
				message.edit({ embeds: [embed] });
				interaction.reply({ content: `The author field has been updated. Link: ${message.url}`, ephemeral: true });
				interaction.followUp({ content: `${validIcon ? "" : "Your input for iconurl does not appear to be a url."}\n${validURL ? "" : "Your input for url does not appear to be a url."}`, ephemeral: true });
			}).catch(console.error);
		} else {
			interaction.reply({ content: `The embed you provided for a \`${interaction.commandName}\` command could not be found.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `You must be a Moderator to use the \`${interaction.commandName}\` command.`, ephemeral: true })
			.catch(console.error);
	}
}
