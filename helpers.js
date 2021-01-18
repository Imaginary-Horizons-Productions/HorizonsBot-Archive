const fs = require('fs');
const { MessageEmbed } = require('discord.js');
exports.guildID = require('./auth.json').guildID;
exports.roleIDs = require('./roleIDs.json');

// [userID]
let moderatorIDs = require('./data/moderatorIDs.json');
exports.isModerator = function (id) {
    return moderatorIDs.includes(id);
}

exports.addModerator = function (id) {
    moderatorIDs.push(id);
    exports.saveObject(moderatorIDs, "moderatorIDs.json");
}

exports.removeModerator = function (removedID) {
    moderatorIDs.filter(id => id != removedID);
    exports.saveObject(moderatorIDs, "moderatorIDs.json");
}

// {messageID: channelID}
exports.embedsList = require('./data/embedsList.json');

// {type: {messageID: number, channelID: number}}
exports.listMessages = require('./data/listMessageIDs.json');

// [channelID]
let topicList = require('./data/topicList.json');
exports.getTopicList = function () {
    return topicList;
}

exports.setTopicList = function (topicListInput) {
    topicList = topicListInput;
    exports.saveObject(topicList, 'topicList.json');
}

// {name: [petitioner IDs]}
exports.petitionList = require('./data/petitionList.json');
// {channelID: Campaign}
exports.campaignList = require('./data/campaignList.json');

exports.getManagedChannels = function () {
    return exports.getTopicList().concat(Object.keys(exports.campaignList));
}

exports.updateTopicList = function (channelManager) {
    let messageData = exports.listMessages.topics;
    if (messageData) {
        channelManager.resolve(messageData.channelID).messages.fetch(messageData.messageID).then(message => {
            exports.topicListBuilder(channelManager).then(embed => {
                message.edit(embed);
            }).catch(console.error);
        });
    }
}

exports.topicListBuilder = function (channelManager) {
    let description = "Here's a list of the opt-in topic channels for the server. Join one by typing: `@HorizonsBot Join (channel ID)`\n";
    let topicList = exports.getTopicList();

    for (let i = 0; i < topicList.length; i += 1) {
        let id = topicList[i];
        let channel = channelManager.resolve(id);
        description += `\n${channel.name}: ${channel.id}`;
    }

    let petitions = Object.keys(exports.petitionList);
    let petitionText = "Here are the topic channels that have been petitioned for. They will automatically be added when 5% of the server petitions for them.\n";
    if (petitions.length > 0) {
        petitions.forEach(topicName => {
            petitionText += `\n${topicName}: ${exports.petitionList[topicName].length} petitioner(s) so far`;
        })
    }

    if (description.length > 2048 || petitionText.length > 1024) {
        let fileText = description;
        if (petitions.length > 0) {
            fileText += `\n\n${petitionText}`
        }
        return new Promise((resolve, reject) => {
            fs.writeFile("data/TopicChannels.txt", fileText, "utf8", error => {
                if (error) {
                    console.log(error);
                }
            });
            resolve();
        }).then(() => {
            return {
                files: [{
                    attachment: "data/TopicChannels.txt",
                    name: "TopicChannels.txt"
                }]
            }
        })
    } else {
        let embed = new MessageEmbed()
            .setTitle("Topic Channels")
            .setDescription(description)
            .setTimestamp();

        if (petitions.length > 0) {
            embed.addField("Petitioned Channels", petitionText)
        }

        return new Promise((resolve, reject) => {
            resolve(embed);
        })
    }
}

exports.campaignListBuilder = function () {

}

exports.addChannel = function (receivedMessage, topicName) {
    return receivedMessage.channel.clone({
        "name": topicName,
        "permissionOverwrites": [
            {
                "id": receivedMessage.client.user.id,
                "allow": 268436480 // VIEW_CHANNEL and "Manage Permissions" set to true
            },
            {
                "id": exports.roleIDs.moderator,
                "allow": ["VIEW_CHANNEL"]
            },
            {
                "id": "536330483852771348", // BountyBot
                "allow": ["VIEW_CHANNEL"]
            },
            {
                "id": receivedMessage.guild.id, // use the guild id for @everyone
                "deny": ["VIEW_CHANNEL"]
            }
        ]
    }).then(channel => {
        exports.setTopicList(exports.getTopicList().concat([channel.id]));
        exports.updateTopicList(receivedMessage.guild.channels);
        return channel;
    })
}

exports.deleteChannel = function (channel, channelManager) {
    let channelID = channel.id;
    let topicList = exports.getTopicList();
    if (topicList.includes(channelID)) {
        exports.setTopicList(topicList.filter(id => id != channelID))
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
