const fs = require('fs');
const { Collection, MessageEmbed } = require('discord.js');
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

// Collection <emoji, channelID>
let topicEmoji = new Collection(require("./data/topicEmoji.json"))
exports.getTopicByEmoji = function (emoji) {
    return topicEmoji.get(emoji);
}

exports.getEmojiByChannelID = function (id) {
    return topicEmoji.findKey(checkedID => checkedID === id);
}

exports.createJoinCollector = function (message) {
    let collector = message.createReactionCollector((reaction, user) => {
        return !user.bot && topicEmoji.keyArray().includes(reaction.emoji.name);
    });
    collector.on("collect", (reaction, user) => {
        let channel = message.guild.channels.resolve(exports.getTopicByEmoji(reaction.emoji.name));
        exports.joinChannel(channel, user);
    })
}

exports.getTopicEmoji = function () {
    return topicEmoji.keyArray();
}

exports.addTopicEmoji = function (emoji, channelID) {
    if (exports.getTopicByEmoji(emoji.name) != -1) {
        exports.removeTopicEmoji(channelID)
    }
    topicEmoji.set(emoji.name, channelID);
    exports.saveObject(topicEmoji, "topicEmoji.json");
}

exports.removeTopicEmoji = function (channelID) {
    topicEmoji.delete(exports.getEmojiByChannelID(channelID));
    exports.saveObject(topicEmoji, "topicEmoji.json");
}

// {name: [petitioner IDs]}
let petitionList = require('./data/petitionList.json');
exports.getPetitionList = function () {
    return petitionList;
}

exports.setPetitionList = function (petitionListInput) {
    petitionList = petitionListInput;
    exports.saveObject(petitionList, 'petitionList.json');
}

// {channelID: Campaign}
exports.campaignList = require('./data/campaignList.json');

exports.getManagedChannels = function () {
    return exports.getTopicList().concat(Object.keys(exports.campaignList));
}

exports.updateTopicList = function (channelManager) {
    let messageData = exports.listMessages.topics;
    if (messageData) {
        return channelManager.resolve(messageData.channelID).messages.fetch(messageData.messageID).then(message => {
            exports.topicListBuilder(channelManager).then(embed => {
                message.edit(embed);
                exports.getTopicEmoji().forEach(async emoji => {
                    await message.react(emoji);
                })
            }).catch(console.error);
            return message;
        });
    }
}

exports.topicListBuilder = function (channelManager) {
    let description = "Here's a list of the opt-in topic channels for the server, their IDs, and associated emoji. Join one by typing `@HorizonsBot Join (channel ID)` or by reacting with their emoji.\n";
    let topicList = exports.getTopicList();

    for (let i = 0; i < topicList.length; i += 1) {
        let id = topicList[i];
        let channel = channelManager.resolve(id);
        if (channel) {
            let channelEmote = "";
            if (Object.values(topicList).includes(id)) {
                channelEmote = exports.getEmojiByChannelID(id);
            }
            description += `\n${channelEmote ? channelEmote + " " : ""}${channel.name}: ${channel.id}`;
        }
    }

    let petitions = Object.keys(petitionList);
    let petitionText = "Here are the topic channels that have been petitioned for. They will automatically be added when 5% of the server petitions for them.\n";
    if (petitions.length > 0) {
        petitions.forEach(topicName => {
            petitionText += `\n${topicName}: ${petitionList[topicName].length} petitioner(s) so far`;
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

exports.pinTopicsList = function (channelManager, channel) {
    exports.topicListBuilder(channelManager).then(embed => {
        channel.send(embed).then(message => {
            exports.listMessages.topics = {
                "messageID": message.id,
                "channelID": message.channel.id
            }
            exports.getTopicEmoji().forEach(emoji => {
                message.react(emoji);
            })
            exports.createJoinCollector(message);
            message.pin();
            exports.saveObject(exports.listMessages, "listMessageIDs.json");
        })
    }).catch(console.log);
}

exports.campaignListBuilder = function () {

}

exports.addChannel = function (channelManager, categoryID, topicName) {
    return channelManager.guild.members.fetch("536330483852771348").then(bountyBot => { // Creating permissionOverwrites by string doesn't seem to be working at time of writing
        return channelManager.create(topicName, {
            "parent": categoryID,
            "permissionOverwrites": [
                {
                    "id": channelManager.client.user.id,
                    "allow": 268436480 // VIEW_CHANNEL and "Manage Permissions" set to true
                },
                {
                    "id": exports.roleIDs.moderator,
                    "allow": ["VIEW_CHANNEL"]
                },
                {
                    "id": bountyBot.id, // BountyBot
                    "allow": ["VIEW_CHANNEL"]
                },
                {
                    "id": channelManager.guild.id, // use the guild id for @everyone
                    "deny": ["VIEW_CHANNEL"]
                }
            ]
        }).then(channel => {
            exports.setTopicList(exports.getTopicList().concat([channel.id]));
            exports.updateTopicList(channelManager.guild.channels);
            return channel;
        }).catch(console.log);
    })
}

exports.joinChannel = function (channel, user) {
    if (!user.bot) {
        let channelID = channel.id;
        let permissionOverwrite = channel.permissionOverwrites.get(user.id);
        if (!permissionOverwrite || !permissionOverwrite.deny.has("VIEW_CHANNEL", false)) {
            if (exports.getTopicList().includes(channelID)) {
                channel.createOverwrite(user, {
                    "VIEW_CHANNEL": true
                }).then(() => {
                    channel.send(`Welcome to ${channel.name}, ${user}!`);
                }).catch(console.log);
            } else if (Object.keys(exports.campaignList).includes(channelID)) {
                //TODO implement with campaign tracking
            }
        } else {
            user.send(`You are currently banned from ${channel.name}. Speak to a Moderator if you believe this is in error.`)
                .catch(console.error);
        }
    }
}

exports.saveObject = function (object, fileName) {
    var filePath = `./`;
    filePath += 'data/' + fileName;
    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
    }
    let textToSave = '';
    if (object instanceof Collection) {
        textToSave = [];
        object.array().forEach(value => {
            textToSave.push([object.findKey(checkedValue => checkedValue === value), value]);
        })
        textToSave = JSON.stringify(textToSave);
    } else if (typeof object == 'object' || typeof object == 'number') {
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
