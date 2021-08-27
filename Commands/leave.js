const Command = require('../Classes/Command.js');
const { getManagedChannels, getClubs, updateClub } = require('../helpers.js');

var command = new Command("leave", "Leave an opt-in channel or club");

command.execute = (interaction) => {
	let userID = interaction.user.id;
	var channelID = interaction.channel.id;
	if (getManagedChannels().includes(channelID)) {
		let club = getClubs()[channelID];
		if (club) {
			if (userID == club.hostID) {
				interaction.user.send(`If a club's host leaves, the club will be deleted. Really leave? :white_check_mark: for yes, :no_entry_sign: for no.`).then(async message => {
					await message.react("✅");
					await message.react("🚫");
					let collector = message.createReactionCollector((reaction, user) => { return user.id == userID }, { "max": 1 });

					collector.on("collect", (reaction) => {
						if (reaction.emoji.name == "🚫") {
							message.edit(`Club leave cancelled.`)
								.catch(console.error);
						} else if (reaction.emoji.name == "✅") {
							message.edit(`Club left.`)
								.catch(console.error);
							interaction.guild.channels.resolve(channelID).delete("Host of club left")
								.catch(console.error);
						}
					})
				})
			} else {
				club.userIDs = club.userIDs.filter(id => id != userID);
				interaction.channel.permissionOverwrites.get(userID).delete("HorizonsBot leave used")
					.catch(console.error);
				interaction.guild.channels.resolve(club.voiceChannelID).permissionOverwrites.get(userID).delete("HorizonsBot leave used")
					.catch(console.error);
				updateClub(club, interaction.guild.channels);
			}
		} else {
			interaction.channel.permissionOverwrites.delete(interaction.user, "HorizonsBot leave used")
				.catch(console.error);
		}
		interaction.reply(`${interaction.user} has left this channel.`)
			.catch(console.error);
	} else {
		interaction.reply(`Could not find a topic or club channel associated with ${channelID}.`)
			.catch(console.error);
	}
}

module.exports = command;
