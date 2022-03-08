const Button = require('../../Classes/Button.js');

module.exports = new Button("delete");

module.exports.execute = (interaction, [channelId]) => {
	// Delete a club, the leader left
	interaction.guild.channels.fetch(channelId).then(channel => channel.delete("Club leader left"));
	// interaction.reply() not required due to channel being deleted
}
