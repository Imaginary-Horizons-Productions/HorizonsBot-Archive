const Button = require('../../Classes/Button.js');

module.exports = new Button("delete");

module.exports.execute = (interaction, args) => {
	// Delete a club, the leader left
	interaction.guild.channels.fetch(args[0]).then(channel => channel.delete("Club leader left"));
	// interaction.reply() not required due to channel being deleted
}
