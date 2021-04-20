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
exports.customEmbeds = require('./data/embedsList.json');

// {type: {messageID: number, channelID: number}}
exports.listMessages = require('./data/listMessageIDs.json');

// Collection <channelName, channelID>
let topics = new Collection();

exports.getTopicIDs = function () {
    return topics.keyArray();
}

exports.getTopicNames = function () {
    return topics.array();
}

exports.findTopicID = function (channelName) {
    return topics.findKey(checkedName => checkedName === channelName);
}

exports.addTopic = function (id, channelName) {
    topics.set(id, channelName);
}

exports.removeTopic = function (channel) {
    topics.delete(channel.id);
    exports.removeTopicEmoji(channel.id);
    exports.saveObject(topics.keyArray(), 'topicList.json');
    helpers.updateList(channel.guild.channels, "topics");
}

// Collection <emoji, channelID>
let topicEmoji = new Collection(require("./data/topicEmoji.json"));
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
        let channel = message.guild.channels.resolve(exports.getTopicByEmoji(emojiString(reaction.emoji)));
        exports.joinChannel(channel, user);
    })
}

exports.getTopicEmoji = function () {
    return topicEmoji.keyArray();
}

exports.addTopicEmoji = function (emoji, channelID) {
    let emojiName = emojiString(emoji);
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
let petitions = require('./data/petitionList.json');
exports.getPetitions = function () {
    return petitions;
}

exports.setPetitions = function (petitionListInput) {
    petitions = petitionListInput;
    exports.saveObject(petitions, 'petitionList.json');
}

// {textChannelID: Campaign}
let campaigns = require('./data/campaignList.json');
exports.getCampaigns = function () {
    return campaigns;
}

exports.updateCampaign = function (campaign, channelManager) {
    campaigns[campaign.channelID] = campaign;
    exports.updateList(channelManager, "campaigns");
    exports.saveObject(campaigns, 'campaignList.json');
}

exports.removeCampaign = function (id) {
    delete campaigns[id];
    exports.saveObject(campaigns, 'campaignList.json');
}

// Functions
function emojiString(emoji) {
    if (emoji instanceof GuildEmoji) {
        return `<:${emoji.name}:${emoji.id}>`;
    } else {
        return emoji.name;
    }
}

exports.getManagedChannels = function () {
    return exports.getTopicIDs().concat(Object.keys(exports.getCampaigns()));
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
    let description = "Here's a list of the opt-in topic channels for the server and their associated emoji. Join them by typing `@HorizonsBot Join (channel names)` or by reacting with their emoji.\n";
    let topics = exports.getTopicIDs();

    for (let i = 0; i < topics.length; i += 1) {
        let id = topics[i];
        let channel = channelManager.resolve(id);
        if (channel) {
            let channelEmote = "";
            if (Object.values(topics).includes(id)) {
                channelEmote = exports.getEmojiByChannelID(id);
            }
            description += `\n__${channel.name}__${channelEmote ? ` (React with ${channelEmote} to join)` : ""}`;
        }
    }

    let petitionNames = Object.keys(petitions);
    let petitionText = `Here are the topic channels that have been petitioned for. They will automatically be added when reaching **${Math.ceil(channelManager.guild.memberCount * 0.05)} petitions** (5% of the server).\n`;
    if (petitionNames.length > 0) {
        petitionNames.forEach(topicName => {
            petitionText += `\n${topicName}: ${petitions[topicName].length} petitioner(s) so far`;
        })
    }

    if (description.length > 2048 || petitionText.length > 1024) {
        return new Promise((resolve, reject) => {
            let fileText = description;
            if (petitionNames.length > 0) {
                fileText += `\n\n${petitionText}`;
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
            let embed = new MessageEmbed().setColor("#6b81eb")
                .setAuthor("Click here to visit our Patreon", channelManager.guild.iconURL(), "https://www.patreon.com/imaginaryhorizonsproductions")
                .setTitle("Topic Channels")
                .setDescription(description)
                .setFooter("Please do not make bounties to vote for your petitions.")
                .setTimestamp();

            if (petitionNames.length > 0) {
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
            exports.getTopicEmoji().forEach(async emoji => {
                await message.react(emoji);
            })
            exports.createJoinCollector(message);
            message.pin();
            exports.saveObject(exports.listMessages, "listMessageIDs.json");
        })
    }).catch(console.log);
}

exports.campaignListBuilder = function (channelManager) {
    let description = "Here's a list of the TRPG campaigns for the server. Learn more about one by typing `@HorizonsBot CampaignDetails (campaign ID)`.\n";
    let campaigns = exports.getCampaigns();

    Object.keys(campaigns).forEach(id => {
        let campaign = campaigns[id];
        description += `\n__**${campaign.title}**__ (${campaign.userIDs.length}${campaign.seats != 0 ? `/${campaign.seats}` : ""} Players)\n**ID**: ${campaign.channelID}\n**Host**: <@${campaign.hostID}>**Game**: ${campaign.system}\n**Timeslot**: ${campaign.timeslot}\n`;
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
            resolve(new MessageEmbed().setColor("#f07581")
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

exports.addChannel = function (channelManager, topicName) {
    return channelManager.guild.members.fetch("536330483852771348").then(bountyBot => { // Creating permissionOverwrites by string doesn't seem to be working at time of writing
        return channelManager.create(topicName, {
            "parent": "581886288102424592",
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
            exports.addTopic(channel.id, channel.name);
            exports.updateList(channelManager.guild.channels, "topics");
            exports.saveObject(topics.keyArray(), 'topicList.json');
            return channel;
        }).catch(console.log);
    })
}

exports.joinChannel = function (channel, user) {
    if (!user.bot) {
        let channelID = channel.id;
        let permissionOverwrite = channel.permissionOverwrites.get(user.id);
        if (!permissionOverwrite || !permissionOverwrite.deny.has("VIEW_CHANNEL", false)) {
            if (exports.getTopicIDs().includes(channelID)) {
                channel.createOverwrite(user, {
                    "VIEW_CHANNEL": true
                }).then(() => {
                    channel.send(`Welcome to ${channel.name}, ${user}!`);
                }).catch(console.log);
            } else if (Object.keys(exports.getCampaigns()).includes(channelID)) {
                let campaign = exports.getCampaigns()[channelID];
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
                        exports.updateCampaign(campaign, channel.guild.channels);
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
