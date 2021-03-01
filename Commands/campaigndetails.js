const Command = require('../Classes/Command.js');
const { MessageEmbed } = require('discord.js');
const { getCampaignList, joinChannel, guildID } = require('./../helpers.js');

var command = new Command(["CampaignDetails", "CampaignInvite"], // aliases
	"Provide full details on the given campaign", // description
	"None", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot CampaignDetails (campaign ID) [recepient(s)]`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Provide full details on the given campaign
	let campaign = getCampaignList()[state.messageArray[0]];
	let recipients = receivedMessage.mentions.users.array().filter(user => user.id != receivedMessage.client.user.id);
	if (campaign) {
		if (recipients.length == 0) {
			recipients.push(receivedMessage.author);
		}
		let embed = new MessageEmbed()
			.setAuthor("Click here to visit the Imaginary Horizons Patreon", receivedMessage.client.user.displayAvatarURL(), "https://www.patreon.com/imaginaryhorizonsproductions")
			.setTitle(`__**${campaign.title}**__ (${campaign.userIDs.length}${campaign.seats != 0 ? `/${campaign.seats}` : ""} Players)`)
			.setDescription(campaign.description)
			.addField("Campaign Host", `<@${campaign.hostID}>`)
			.addField("System", campaign.system)
			.addField("Time Slot", campaign.timeslot)
			.setImage(campaign.imageURL)
			.setFooter("React with 🎲 to join! (5 minute time limit)");
		recipients.forEach(recipient => {
			recipient.send(embed).then(async message => {
				await message.react("🎲");
				await message.react("🚫");
				let collector = message.createReactionCollector((reaction, user) => { return user.id != receivedMessage.client.user.id && reaction.emoji.name == "🚫" || reaction.emoji.name == "🎲" }, { "max": 1, "time": 300000 });

				collector.on("collect", (reaction) => {
					if (reaction.emoji.name == "🚫") {
						collector.stop();
					} else if (reaction.emoji.name == "🎲") {
						receivedMessage.client.guilds.fetch(guildID).then(guild => {
							joinChannel(guild.channels.resolve(campaign.channelID), recipient);
						});
					}
				})
			})
		})
	} else {
		receivedMessage.author.send(`The campaign you indicated could not be found. Please check for typos!`)
			.catch(console.error);
	}
}

module.exports = command;
