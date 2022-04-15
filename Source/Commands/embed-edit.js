const Command = require('../../Classes/Command.js');

const options = [];
const subcomands = [
	{
		name: "add-field",
		description: "(moderator) Add a field to the embed",
		optionsInput: [
			{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
			{ type: "String", name: "header", description: "The header text", required: true, choices: {} },
			{ type: "String", name: "text", description: "The body text", required: true, choices: {} },
			{ type: "Boolean", name: "inline", description: "Whether to show the field in-line with previous embed fields", required: false, choices: {} }
		]
	},
	{
		name: "author",
		description: "(moderator) Assign a custom embed's author",
		optionsInput: [
			{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
			{ type: "String", name: "text", description: "The text to put in the author field", required: true, choices: {} },
			{ type: "String", name: "icon-url", description: "The image url for the author icon", required: false, choices: {} },
			{ type: "String", name: "url", description: "Where clicking the author takes the user", required: false, choices: {} }
		]
	},
	{
		name: "color",
		description: "(moderator) Assign a custom embed's color",
		optionsInput: [
			{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
			{ type: "String", name: "color", description: "Use hexcode format", required: true, choices: {} }
		]
	},
	{
		name: "description",
		description: "(moderator) Assign a custom embed's description",
		optionsInput: [
			{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
			{ type: "String", name: "text", description: "The description text", required: true, choices: {} }
		]
	},
	{
		name: "image",
		description: "(moderator) Set an custom embed's image",
		optionsInput: [
			{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
			{ type: "String", name: "url", description: "The picture url for the image field", required: true, choices: {} }
		]
	},
	{
		name: "message",
		description: "(moderator) Set a custom embed's message content",
		optionsInput: [
			{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
			{ type: "String", name: "text", description: "The text to put in the message (above the embed)", required: true, choices: {} }
		]
	},
	{
		name: "thumbnail",
		description: "(moderator) Set a custom embed's thumbnail",
		optionsInput: [
			{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
			{ type: "String", name: "url", description: "The picture url for the thumbnail", required: true, choices: {} },
		]
	},
	{
		name: "title",
		description: "(moderator) Set a custom embed's title",
		optionsInput: [
			{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
			{ type: "String", name: "title", description: "The title text", required: true, choices: {} }
		]
	},
	{
		name: "url",
		description: "(moderator) Set a custom embed's title url",
		optionsInput: [
			{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
			{ type: "String", name: "url", description: "Where clicking the title takes the user", required: true, choices: {} }
		]
	},
	{
		name: "splice-fields",
		description: "(moderator) Remove fields from a custom embed (replace unsupported)",
		optionsInput: [
			{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
			{ type: "Integer", name: "index", description: "The field number to start removing from (count starts from 0)", required: true, choices: {} },
			{ type: "String", name: "count", description: "The number of fields to remove", required: true, choices: {} }
		]
	}
];
module.exports = new Command("embed-edit", "(moderator) Edit an existing embed", options, subcomands);

let customEmbeds, isModerator;
module.exports.initialize = function (helpers) {
	({ customEmbeds, isModerator } = helpers);
}

const URL_REGEXP = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,})/, 'gi');

module.exports.execute = (interaction) => {
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("message-id");
		if (customEmbeds[messageID]) {
			interaction.deferReply({ ephemeral: true }).then(() => {
				return interaction.guild.channels.fetch(customEmbeds[messageID])
			}).then(channel => {
				return channel.messages.fetch(messageID)
			}).then(message => {
				switch (interaction.options.getSubcommand()) {
					case "add-field":
						message.edit({
							embeds: [
								message.embeds[0].addField(interaction.options.getString("header"), interaction.options.getString("text"), interaction.options.getBoolean("inline")).setTimestamp()
							]
						});
						interaction.editReply({ content: `A field has been added to the embed. Link: ${message.url}` })
						break;
					case "author":
						let iconURL = interaction.options.getString("icon-url");
						const validIcon = URL_REGEXP.test(iconURL);
						let authorURL = interaction.options.getString("url");
						const validURL = URL_REGEXP.test(authorURL);
						message.edit({
							embeds: [
								message.embeds[0].setAuthor({
									name: interaction.options.getString("text"),
									iconURL: validIcon ? iconURL : "",
									url: validURL ? authorURL : ""
								}).setTimestamp()
							]
						});
						interaction.editReply({ content: `The author field has been updated. Link: ${message.url}${!iconURL || validIcon ? "" : "\n\nYour input for iconurl does not appear to be a url."}${!authorURL || validURL ? "" : "\n\nYour input for url does not appear to be a url."}` });
						break;
					case "color":
						let colorCode = interaction.options.getString("color");
						if (colorCode.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)) {
							message.edit({
								embeds: [
									message.embeds[0].setColor(colorCode).setTimestamp()
								]
							});
							interaction.editReply({ content: `The embed's color has been updated. Link: ${message.url}` });
						} else {
							interaction.editReply({ content: `Please provide color in hex code format (#000000).` })
								.catch(console.error);
						}
						break;
					case "description":
						message.edit({
							embeds: [
								message.embeds[0].setDescription(interaction.options.getString("text")).setTimestamp()
							]
						});
						interaction.editReply({ content: `The embed's description has been updated. Link: ${message.url}` })
						break;
					case "image":
						let imageURL = interaction.options.getString("url");
						if (URL_REGEXP.test(imageURL)) {
							message.edit({
								embeds: [
									message.embeds[0].setImage(imageURL).setTimestamp()
								]
							});
							interaction.editReply({ content: `The embed's image has been updated. Link: ${message.url}` });
						} else {
							interaction.editReply({ content: `Your input for url does not appear to be a url.` })
								.catch(console.error);
						}
						break;
					case "message":
						message.edit({ content: interaction.options.getString("text") });
						interaction.editReply({ content: `The embed's message has been updated. Link: ${message.url}` })
						break;
					case "thumbnail":
						let thumbnailURL = interaction.options.getString("url");
						if (URL_REGEXP.test(thumbnailURL)) {
							message.edit({
								embeds: [
									message.embeds[0].setThumbnail(thumbnailURL).setTimestamp()
								]
							});
							interaction.editReply({ content: `The embed's thumbnail has been updated. Link: ${message.url}` })
						} else {
							interaction.editReply({ content: `Your input for url does not appear to be a url.` })
								.catch(console.error);
						}
						break;
					case "title":
						message.edit({
							embeds: [
								message.embeds[0].setTitle(interaction.options.getString("title")).setTimestamp()
							]
						});
						interaction.editReply({ content: `The embed's title has been updated. Link: ${message.url}` })
						break;
					case "url":
						let embedURL = interaction.options.getString("url");
						if (URL_REGEXP.test(embedURL)) {
							message.edit({
								embeds: [
									message.embeds[0].setURL(embedURL).setTimestamp()
								]
							});
							interaction.editReply({ content: `The embed's url has been updated. Link: ${message.url}` });
						} else {
							interaction.editReply({ content: `Your input for url does not appear to be a url.` })
								.catch(console.error);
						}
						break;
					case "splice-fields":
						message.edit({
							embeds: [
								message.embeds[0].spliceFields(interaction.options.getInteger("index"), interaction.options.getInteger("count")).setTimestamp()
							]
						});
						interaction.editReply({ content: `The fields have been removed. Link: ${message.url}` })
						break;
				}
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
