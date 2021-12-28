const Command = require('../../Classes/Command.js');
const Club = require('../../Classes/Club.js');
const { isModerator, getModRoleID, updateClub, clubInviteBuilder } = require("../../helpers.js");

let options = [{ type: "User", name: "club-leader", description: "The user to set as club leader", required: true, choices: {} }]
module.exports = new Command("club-add", "(moderator) Set up a text and voice channels for a club", options);

module.exports.execute = (interaction) => {
	// Create a new club including a text and voice channel in the receiving channel's category and set the mentioned user as host
	if (isModerator(interaction.user.id)) {
		let host = interaction.options.getUser("club-leader");
		let channelManager = interaction.guild.channels;
		let categoryId = interaction.channel.parentId;

		interaction.guild.roles.fetch(interaction.guildId).then(everyoneRole => {
			interaction.guild.roles.fetch(getModRoleID()).then(modRole => {
				interaction.guild.members.fetch("536330483852771348").then(bountyBot => {
					channelManager.create("new-club-text", {
						parent: categoryId,
						permissionOverwrites: [
							{
								"id": channelManager.client.user,
								"allow": ["VIEW_CHANNEL"]
							},
							{
								"id": modRole,
								"allow": ["VIEW_CHANNEL"]
							},
							{
								"id": everyoneRole,
								"deny": ["VIEW_CHANNEL"]
							},
							{
								"id": host,
								"allow": ["VIEW_CHANNEL", "MANAGE_MESSAGES"]
							},
							{
								id: bountyBot,
								allow: ["VIEW_CHANNEL"]
							}
						],
						type: "GUILD_TEXT"
					}).then(textChannel => {
						channelManager.create("New Club Voice", {
							parent: categoryId,
							permissionOverwrites: [
								{
									"id": channelManager.client.user,
									"allow": ["VIEW_CHANNEL"]
								},
								{
									"id": modRole,
									"allow": ["VIEW_CHANNEL"]
								},
								{
									"id": everyoneRole,
									"deny": ["VIEW_CHANNEL"]
								},
								{
									"id": host,
									"allow": ["VIEW_CHANNEL", "MANAGE_CHANNELS"]
								}
							],
							type: "GUILD_VOICE"
						}).then(voiceChannel => {
							let club = new Club();
							club.title = "new club";
							club.hostID = host.id;
							club.channelID = textChannel.id;
							club.voiceChannelID = voiceChannel.id;
							textChannel.send(`Welcome to your new club text channel ${host}! As club host, you can pin and delete messages in this channel. Also, you can configure the club information with \`/club-config\`, \`/club-set-image\`, and \`/club-set-timeslot\`.`);
							let [embed, buttonComponents] = clubInviteBuilder(club, interaction.client.user.displayAvatarURL(), false);
							textChannel.send({ content: "You can send out invites with \`/club-invite\`. Prospective members will be shown the following embed:", embeds: [embed], components: buttonComponents }).then(detailSummaryMessage => {
								detailSummaryMessage.pin();
								club.detailSummaryId = detailSummaryMessage.id;
								updateClub(club, interaction.guild.channels);
							})
							interaction.reply("The new club has been created.");
						}).catch(console.error);
					})
				})
			})
		})
	} else {
		interaction.reply({ content: `Creating new clubs is restricted to Moderators.`, ephemeral: true })
			.catch(console.error);
	}
}
