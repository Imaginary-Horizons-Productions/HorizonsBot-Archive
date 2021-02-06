const Command = require('../Classes/Command.js');
const { getManagedChannels, getCampaignList, updateCampaign } = require('../helpers.js');

var command = new Command(["Leave"], // aliases
	"Leave an opt-in channel or TRPG campaign", // description
	"Must be used from an opt-in channel or campaign channel", // requirements
	["Example"], // headings
	["`@HorizonsBot Leave`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Remove visibility of receiving channel from author
	if (getManagedChannels().includes(receivedMessage.channel.id)) {
		let userID = receivedMessage.author.id;
		let campaign = getCampaignList()[receivedMessage.channel.id];
		if (campaign) {
			if (userID == campaign.hostID) {
				receivedMessage.author.send(`If a campaign's host leaves, the campaign will be deleted. Really leave? :white_check_mark: for yes, :no_entry_sign: for no.`).then(message => {
					message.react("✅");
					message.react("🚫");
					let collector = message.createReactionCollector((reaction, user) => { return user.id == receivedMessage.author.id }, { "max": 1 });

					collector.on("collect", (reaction) => {
						if (reaction.emoji.name == "🚫") {
							message.edit(`Campaign leave cancelled.`)
								.catch(console.error);
						} else if (reaction.emoji.name == "✅") {
							message.edit(`Campaign left.`)
								.catch(console.error);
							receivedMessage.channel.delete("Host of campaign left")
								.catch(console.error);
						}
					})
				})
			} else {
				campaign.userIDs = campaign.userIDs.filter(id => id != userID);
				receivedMessage.channel.permissionOverwrites.get(userID).delete("HorizonsBot leave used")
					.catch(console.error);
				receivedMessage.guild.channels.resolve(campaign.voiceChannelID).permissionOverwrites.get(userID).delete("HorizonsBot leave used")
					.catch(console.error);
				updateCampaign(campaign);
			}
		} else {
			receivedMessage.channel.permissionOverwrites.get(userID).delete("HorizonsBot leave used")
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Please use the \`leave\` command from a topic or campaign channel.`)
			.catch(console.error);
	}
}

module.exports = command;
