const fs = require('fs');
const { MessageEmbed } = require('discord.js');
exports.serverID = "353575133157392385";
exports.roleIDs = require('./roleIDs.json');

exports.moderatorIDs = require('./data/moderatorIDs.json');
// messageID: channelID
exports.embedsList = require('./data/embedsList.json');
// type: {messageID: number, channelID: number}
exports.listMessages = require('./data/listMessageIDs.json');
// [channelID]
exports.topicList = require('./data/topicList.json');
// channelID: Campaign
exports.campaignList = require('./data/campaignList.json');

exports.topicListBuilder = function (channelManager) {
    let embed = new MessageEmbed()
        .setTitle("Topic Channels")
        .setDescription("Here's a list of the opt-in topic channels for the server. Join one by typing: `@HorizonsBot Join (channel ID)`")
        .setTimestamp();

    let loops = Math.min(exports.topicList.length, 25);
    if (loops > 0) {
        for (let i = 0; i < loops; i += 1) {
            let id = exports.topicList[i];
            let channel = channelManager.resolve(id);
            embed.addField(`${channel.name}`, `Channel ID: ${channel.id}`);
        }
    }

    return embed;
}

exports.campaignListBuilder = function () {

}

exports.deleteChannel = function (channel) {
	let channelID = channel.id;
	if (exports.topicList.includes(channelID)) {
		exports.topicList = exports.topicList.filter(id => id != channelID);
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
