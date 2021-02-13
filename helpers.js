const fs = require('fs');
const { Collection, MessageEmbed, GuildEmoji } = require('discord.js');
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
    let emojiName = emoji.name;
    if (emoji instanceof GuildEmoji) {
        emojiName = `<:${emoji.name}:${emoji.id}>`;
    }
if (exports.getTopicByEmoji(emojiName) != -1) {
        exports.removeTopicEmoji(channelID)
    }
    topicEmoji.set(emojiName, channelID);
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

// {textChannelID: Campaign}
let campaignList = require('./data/campaignList.json');
exports.getCampaignList = function () {
    return campaignList;
}

exports.updateCampaign = function (campaign) {
    campaignList[campaign.channelID] = campaign;
    exports.saveObject(campaignList, 'campaignList.json');
}

exports.removeCampaign = function (id) {
    delete campaignList[id];
    exports.saveObject(campaignList, 'campaignList.json');
}

// Functions
exports.getManagedChannels = function () {
    return exports.getTopicList().concat(Object.keys(exports.getCampaignList()));
}

exports.updateList = function (channelManager, listType) {
    let messageData = exports.listMessages[listType];
    if (messageData) {
        return channelManager.resolve(messageData.channelID).messages.fetch(messageData.messageID).then(message => {
            if (listType == "topics") {
                exports.topicListBuilder(channelManager).then(embed => {
                    message.edit(embed);
                    exports.getTopicEmoji().forEach(async emoji => {
                        await message.react(emoji);
                    })
                }).catch(console.error);
            } else {
                exports.campaignListBuilder(channelManager).then(embed => {
                    message.edit(embed);
                }).catch(console.error)
            }
            return message;
        });
    }
}

exports.topicListBuilder = function (channelManager) {
    let description = "Here's a list of the opt-in topic channels for the server, their IDs, and associated emoji. Join one by typing `@HorizonsBot Join (channel ID)` or by reacting with their emoji.\n";
    let topics = exports.getTopicList();

    for (let i = 0; i < topics.length; i += 1) {
        let id = topics[i];
        let channel = channelManager.resolve(id);
        if (channel) {
            let channelEmote = "";
            if (Object.values(topics).includes(id)) {
                channelEmote = exports.getEmojiByChannelID(id);
            }
            description += `\n__${channel.name}__ (Channel ID: *${channel.id}*${channelEmote ? `, or react with ${channelEmote} to join` : ""})`;
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
        return new Promise((resolve, reject) => {
            let fileText = description;
            if (petitions.length > 0) {
                fileText += `\n\n${petitionText}`
            }

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
        return new Promise((resolve, reject) => {
            let embed = new MessageEmbed()
                .setAuthor("Click here to visit our Patreon", channelManager.guild.iconURL(), "https://www.patreon.com/imaginaryhorizonsproductions")
                .setTitle("Topic Channels")
                .setDescription(description)
                .setFooter("Please do not make bounties to vote for your petitions.")
                .setTimestamp();

            if (petitions.length > 0) {
                embed.addField("Petitioned Channels", petitionText)
            }
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

exports.campaignListBuilder = function (channelManager) {
    let description = "Here's a list of the TRPG campaigns for the server. Learn more about one by typing `@HorizonsBot CampaignDetails (campaign ID)`.\n";
    let campaigns = exports.getCampaignList();

    Object.keys(campaigns).forEach(id => {
        let campaign = campaigns[id];
        description += `\n__**${campaign.title}**__ (${campaign.userIDs.length}${campaign.seats != 0 ? `/${campaign.seats}` : ""} Players)\n**ID**: ${campaign.channelID}\n**Host**: <@${campaign.hostID}>\n**Timeslot**: ${campaign.timeslot}\n`;
    })

    if (description.length > 2048) {
        return new Promise((resolve, reject) => {
            let fileText = description;
            fs.writeFile("data/CampaignChannels.txt", fileText, "utf8", error => {
                if (error) {
                    console.log(error);
                }
            });
            resolve();
        }).then(() => {
            return {
                files: [{
                    attachment: "data/CampaignChannels.txt",
                    name: "CampaignChannels.txt"
                }]
            }
        })
    } else {
        return new Promise((resolve, reject) => {
            resolve(new MessageEmbed()
                .setAuthor("Click here to visit our Patreon", channelManager.guild.iconURL(), "https://www.patreon.com/imaginaryhorizonsproductions")
                .setTitle("TRPG Campaigns")
                .setDescription(description)
                .setTimestamp());
        })
    }
}

exports.pinCampaignsList = function (channelManager, channel) {
    exports.campaignListBuilder(channelManager).then(embed => {
        channel.send(embed).then(message => {
            exports.listMessages.campaigns = {
                "messageID": message.id,
                "channelID": message.channel.id
            }
            message.pin();
            exports.saveObject(exports.listMessages, "listMessageIDs.json");
        })
    }).catch(console.log);
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
            exports.updateList(channelManager.guild.channels, "topics");
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
            } else if (Object.keys(exports.getCampaignList()).includes(channelID)) {
                let campaign = exports.getCampaignList()[channelID];
                if (campaign.seats == 0 || campaign.userIDs.length < campaign.seats) {
                    if (campaign.hostID != user.id && !campaign.userIDs.includes(user.id)) {
                        campaign.userIDs.push(user.id);
                        channel.createOverwrite(user, {
                            "VIEW_CHANNEL": true
                        }).then(() => {
                            channel.guild.channels.resolve(campaign.voiceChannelID).createOverwrite(user, {
                                "VIEW_CHANNEL": true
                            })
                            channel.send(`Welcome to ${channel.name}, ${user}!`);
                        })
                        exports.updateCampaign(campaign);
                        updateList(channel.guild.channels, "campaigns");
                    } else {
                        user.send(`You are already in ${campaign.title}.`)
                            .catch(console.error);
                    }
                } else {
                    user.send(`${campaign.title} is already full on players.`)
                        .catch(console.error);
                }
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
