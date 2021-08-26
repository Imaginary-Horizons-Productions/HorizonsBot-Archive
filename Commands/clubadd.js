const Command = require('../Classes/Command.js');
const Club = require('../Classes/Club.js');
const { isModerator, getModRoleID, updateClub } = require("../helpers.js");

var command = new Command("club-add", "Set up a text and voice channels for a club");

command.data.addUserOption(option => option.setName("clubleader").setDescription("The user to set as club leader").setRequired(true));

command.execute = (interaction) => {
	// Create a new club including a text and voice channel in the receiving channel's category and set the mentioned user as host
	if (isModerator(interaction.user.id)) {
		let host = interaction.options.getUser("clubleader");
		let channelManager = interaction.guild.channels;
		let categoryId = interaction.channel.parentId;

		interaction.guild.roles.fetch(interaction.guild.id).then(everyoneRole => {
			interaction.guild.roles.fetch(getModRoleID()).then(modRole => {
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
						updateClub(club, interaction.guild.channels);
						textChannel.send(`Welcome to your new club text channel ${host}! As club host, you can pin and delete messages in this channel. Also, you can use the following commands from this channel to add more details about it in the listing:\nClub**Rename**\nClub**SetSeats**\nClub**SetDescription**\nClub**SetSystem**\nClub**SetTimeSlot**\nClub**SetImage**`);
						interaction.reply({ content: "The new club has been created.", ephemeral: true });
					}).catch(console.error);
				})
			})
		})
	} else {
		interaction.reply({ content: `Creating new clubs is restricted to Moderators.`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
