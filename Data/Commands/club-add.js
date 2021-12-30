const Command = require('../../Classes/Command.js');
const Club = require('../../Classes/Club.js');
const { isModerator, modRoleId, updateClub, clubInviteBuilder } = require("../../helpers.js");
const { clubInstructionsText } = require('./club-instructions.js');

let options = [{ type: "User", name: "club-leader", description: "The user to set as club leader", required: true, choices: {} }]
module.exports = new Command("club-add", "(moderator) Set up a text and voice channels for a club", options);

module.exports.execute = (interaction) => {
	// Create a new club including a text and voice channel in the receiving channel's category and set the mentioned user as host
	if (isModerator(interaction.user.id)) {
		let host = interaction.options.getUser("club-leader");
		let channelManager = interaction.guild.channels;
		let categoryId = interaction.channel.parentId;

		channelManager.create("new-club-text", {
			parent: categoryId,
			permissionOverwrites: [
				{
					id: channelManager.client.user,
					allow: ["VIEW_CHANNEL"]
				},
				{
					id: modRoleId,
					allow: ["VIEW_CHANNEL"],
					type: 0
				},
				{
					id: interaction.guildId,
					deny: ["VIEW_CHANNEL"],
					type: 0
				},
				{
					id: host,
					allow: ["VIEW_CHANNEL", "MANAGE_MESSAGES"]
				},
				{
					id: "536330483852771348",
					allow: ["VIEW_CHANNEL"],
					type: 1
				}
			],
			type: "GUILD_TEXT"
		}).then(textChannel => {
			channelManager.create("New Club Voice", {
				parent: categoryId,
				permissionOverwrites: [
					{
						id: channelManager.client.user,
						allow: ["VIEW_CHANNEL"]
					},
					{
						id: modRoleId,
						allow: ["VIEW_CHANNEL"],
						type: 0
					},
					{
						id: interaction.guildId,
						deny: ["VIEW_CHANNEL"],
						type: 0
					},
					{
						id: host,
						allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS"]
					}
				],
				type: "GUILD_VOICE"
			}).then(voiceChannel => {
				let club = new Club();
				club.title = "new club";
				club.hostID = host.id;
				club.channelID = textChannel.id;
				club.voiceChannelID = voiceChannel.id;
				textChannel.send({ content: clubInstructionsText(host) });
				let { embed, buttonRow } = clubInviteBuilder(club, false);
				textChannel.send({ content: "When invites are sent with \`/club-invite\`, the invitee will be shown the following embed:", embeds: [embed], components: [buttonRow], fetchReply: true }).then(detailSummaryMessage => {
					detailSummaryMessage.pin();
					club.detailSummaryId = detailSummaryMessage.id;
					updateClub(club, interaction.guild.channels);
				})
				interaction.reply({ content: "The new club has been created.", ephemeral: true });
			}).catch(console.error);
		})
	} else {
		interaction.reply({ content: `Creating new clubs is restricted to Moderators.`, ephemeral: true })
			.catch(console.error);
	}
}
