const fs = require('fs');
const { MessageEmbed } = require('discord.js');
exports.serverID;
exports.roleIDs = require('./roleIDs.json');

exports.moderatorIDs = require('./data/moderatorIDs.json');
// messageID: channelID
exports.embedsList = require('./data/embedsList.json');
// type: {messageID: number, channelID: number}
exports.listMessages = require('./data/listMessageIDs.json');
// [channelID]
exports.topicList = require('./data/topicList.json');
// name: [petitioner IDs]
exports.petitionList = require('./data/petitionList.json');
// channelID: Campaign
exports.campaignList = require('./data/campaignList.json');

exports.updateTopicList = function (channelManager) {
    let messageData = exports.listMessages.topics;
    if (messageData) {
        let message = channelManager.resolve(messageData.channelID).messages.resolve(messageData.messageID);
        message.edit(exports.topicListBuilder(channelManager))
            .catch(console.error);
    }
}

exports.topicListBuilder = function (channelManager) {
    let description = "Here's a list of the opt-in topic channels for the server. Join one by typing: `@HorizonsBot Join (channel ID)`\n\n";
    let embed = new MessageEmbed()
        .setTitle("Topic Channels")
        .setTimestamp();

    for (let i = 0; i < exports.topicList.length; i += 1) {
        let id = exports.topicList[i];
        let channel = channelManager.resolve(id);
        description += `${channel.name}: ${channel.id}`;
    }

    let petitions = Object.keys(exports.petitionList);
    if (petitions.length > 0) {
        let petitionText = "Here are the topic channels that have been petitioned for. They will automatically be added when 5% of the server petitions for them.\n";
        
        petitions.forEach(topicName => {
            petitionText += `\n${topicName}: ${exports.petitionList[topicName].length} petitioner(s) so far`;
        })
        embed.addField("Petitioned Channels", petitionText)
    }

    return embed.setDescription(description);
}

exports.campaignListBuilder = function () {

}

exports.addChannel = function (receivedMessage, topicName) {
	return receivedMessage.channel.clone({
		"name": topicName,
		"permissionOverwrites": [
			{
				"id": receivedMessage.client.user.id,
				"allow": ["VIEW_CHANNEL"]
			},
			{
				"id": receivedMessage.guild.id, // use the guild id for @everyone
				"deny": ["VIEW_CHANNEL"]
			},
			{
				"id": exports.roleIDs.moderator,
				"allow": ["VIEW_CHANNEL"]
			}
		]
	}).then(channel => {
		exports.topicList.push(channel.id);
		exports.updateTopicList(receivedMessage.guild.channels);
        exports.saveObject(exports.topicList, "topicList.json");
        return channel;
	})
}

exports.deleteChannel = function (channel, channelManager) {
    let channelID = channel.id;
    if (exports.topicList.includes(channelID)) {
        exports.topicList = exports.topicList.filter(id => id != channelID);
        exports.updateTopicList(channelManager);
    } else if (Object.keys(exports.campaignList).includes(channelID)) {
        //TODO implement for campaigns
    }
    channel.delete();
}

exports.saveObject = function (object, fileName) {
    var filePath = `./`;
    filePath += 'data/' + fileName;
    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
    }
    let textToSave = '';
    if (typeof object == 'object' || typeof object == 'number') {
        textToSave = JSON.stringify(object);
    } else {
        textToSave = object;
    }

    fs.writeFile(filePath, textToSave, 'utf8', (error) => {
        if (error) {
            console.log(error);
        }
    })
}
