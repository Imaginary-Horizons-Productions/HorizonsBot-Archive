const fs = require('fs');
const { Collection, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
exports.guildID = require('./data/auth.json').guildID;

// [userID]
let moderatorIDs = require('./data/moderatorIDs.json');
exports.isModerator = function (id) {
    return moderatorIDs.userIds.includes(id);
}

exports.addModerator = function (id) {
    moderatorIDs.userIds.push(id);
    exports.saveObject(moderatorIDs, "moderatorIDs.json");
}

exports.removeModerator = function (removedID) {
    moderatorIDs.userIds = moderatorIDs.userIds.filter(id => id != removedID);
    exports.saveObject(moderatorIDs, "moderatorIDs.json");
}

exports.getModRoleID = function () {
    if (!moderatorIDs.roleId) console.error("./data/moderatorIDs.json/roleId not defined");
    return moderatorIDs.roleId;
}

// {messageID: channelID}
exports.customEmbeds = require('./data/embedsList.json');

// {type: {messageID: number, channelID: number}}
exports.listMessages = require('./data/listMessageIDs.json');

// Collection <channelID, channelName>
let topics = new Collection();

exports.getTopicIDs = function () {
    return Array.from(topics.keys());
}

exports.getTopicNames = function () {
    return Array.from(topics.values());
}

exports.findTopicID = function (channelName) {
    return topics.findKey(checkedName => checkedName === channelName);
}

exports.addTopic = function (id, channelName) {
    topics.set(id, channelName);
}

exports.removeTopic = function (channel) {
    topics.delete(channel.id);
    exports.saveObject(exports.getTopicIDs(), 'topicList.json');
    exports.updateList(channel.guild.channels, "topics");
}

// {name: [petitioner IDs]}
let petitions = require('./data/petitionList.json');
exports.getPetitions = function () {
    return petitions;
}

exports.setPetitions = function (petitionListInput, channelManager) {
    petitions = petitionListInput;
    exports.saveObject(petitions, 'petitionList.json');
}

// {textChannelID: Club}
let clubs = require('./data/clubList.json');
exports.getClubs = function () {
    return clubs;
}

exports.updateClub = function (club, channelManager) {
    clubs[club.channelID] = club;
    exports.updateList(channelManager, "clubs");
    exports.saveObject(clubs, 'clubList.json');
}

exports.removeClub = function (id) {
    delete clubs[id];
    exports.saveObject(clubs, 'clubList.json');
}

// Functions
exports.getManagedChannels = function () {
    return exports.getTopicIDs().concat(Object.keys(exports.getClubs()));
}

exports.updateList = function (channelManager, listType) {
    let messageData = exports.listMessages[listType];
    if (messageData) {
        return channelManager.fetch(messageData.channelID).then(channel => {
            return channel.messages.fetch(messageData.messageID).then(message => {
                if (listType == "topics") {
                    exports.topicListBuilder(channelManager).then(embed => {
                        var rows = [];

                        var topicNames = exports.getTopicNames();
                        var topicIds = exports.getTopicIDs();
                        if (topicNames.length > 0) {
                            var topicSelect = [];
                            for (var i = 0; i < topicNames.length; i += 1) {
                                topicSelect.push({
                                    label: topicNames[i],
                                    description: "",
                                    value: topicIds[i]
                                })
                            }
                            rows.push(new MessageActionRow().addComponents(
                                new MessageSelectMenu()
                                    .setCustomId("topicListSelect")
                                    .setPlaceholder("Select a topic...")
                                    .addOptions(topicSelect)))
                        }

                        var petitionSelect = [];
                        for (var petition of Object.keys(exports.getPetitions())) {
                            petitionSelect.push({
                                label: petition,
                                description: "",
                                value: petition
                            })
                        }
                        if (petitionSelect.length > 0) {
                            rows.push(new MessageActionRow().addComponents(
                                new MessageSelectMenu()
                                    .setCustomId("petitionListSelect")
                                    .setPlaceholder("Select a petition...")
                                    .addOptions(petitionSelect)))
                        }
                        message.edit({ embeds: [embed], components: rows });
                    }).catch(console.error);
                } else {
                    exports.clubListBuilder(channelManager).then(embed => {
                        message.edit({ embeds: [embed] });
                    }).catch(console.error)
                }
                return message;
            });
        })
    }
}

exports.topicListBuilder = function (channelManager) {
    let description = "Here's a list of the opt-in topic channels for the server. Join them by typing `@HorizonsBot Join (channel names)` or by using the select menu under this message (jump to message in pins).\n";
    let topics = exports.getTopicIDs();

    for (let i = 0; i < topics.length; i += 1) {
        let id = topics[i];
        let channel = channelManager.resolve(id);
        if (channel) {
            description += `\n__${channel.name}__ ${channel.description}`;
        }
    }

    let petitionNames = Object.keys(petitions);
    let petitionText = `Here are the topic channels that have been petitioned for. They will automatically be added when reaching **${Math.ceil(channelManager.guild.memberCount * 0.05)} petitions** (5% of the server). You can sign onto an already open petition with the select menu under this message (jump to message in pins).\n`;
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
        channel.send({ embeds: [embed] }).then(message => {
            exports.listMessages.topics = {
                "messageID": message.id,
                "channelID": message.channel.id
            }
            exports.saveObject(exports.listMessages, "listMessageIDs.json");
            message.pin();
        })
    }).catch(console.log);
}

exports.clubListBuilder = function (channelManager) {
    let description = "Here's a list of the clubs on the server. Learn more about one by typing `@HorizonsBot ClubDetails (club ID)`.\n";
    let clubs = exports.getClubs();

    Object.keys(clubs).forEach(id => {
        let club = clubs[id];
        description += `\n__**${club.title}**__ (${club.userIDs.length}${club.seats != 0 ? `/${club.seats}` : ""} Players)\n**ID**: ${club.channelID}\n**Host**: <@${club.hostID}>\n**Game**: ${club.system}\n**Timeslot**: ${club.timeslot}\n`;
    })

    if (description.length > 2048) {
        return new Promise((resolve, reject) => {
            let fileText = description;
            fs.writeFile("data/ClubChannels.txt", fileText, "utf8", error => {
                if (error) {
                    console.log(error);
                }
            });
            resolve();
        }).then(() => {
            return {
                files: [{
                    attachment: "data/ClubChannels.txt",
                    name: "ClubChannels.txt"
                }]
            }
        })
    } else {
        return new Promise((resolve, reject) => {
            resolve(new MessageEmbed().setColor("#f07581")
                .setAuthor("Click here to visit our Patreon", channelManager.guild.iconURL(), "https://www.patreon.com/imaginaryhorizonsproductions")
                .setTitle("Clubs")
                .setDescription(description)
                .setTimestamp());
        })
    }
}

exports.pinClubsList = function (channelManager, channel) {
    exports.clubListBuilder(channelManager).then(embed => {
        channel.send({ embeds: [embed] }).then(message => {
            exports.listMessages.clubs = {
                "messageID": message.id,
                "channelID": message.channel.id
            }
            message.pin();
            exports.saveObject(exports.listMessages, "listMessageIDs.json");
        })
    }).catch(console.log);
}

exports.checkPetition = function (guild, topicName, author = null) {
    let petitions = exports.getPetitions();
    if (!petitions[topicName]) {
        petitions[topicName] = [];
    }
    if (author) {
        if (!petitions[topicName].includes(author.id)) {
            petitions[topicName].push(author.id);
        } else {
            author.send(`You have already petitioned for ${topicName}.`)
                .catch(console.error)
            return;
        }
    }
    if (petitions[topicName].length > guild.memberCount * 0.05) {
        exports.addChannel(guild, topicName);
    } else {
        author.send(`Your petition for ${topicName} has been recorded.`)
            .catch(console.error)
        setPetitions(petitions, guild.channels);
    }
}

exports.addChannel = function (guild, topicName) {
    return guild.roles.fetch(guild.id).then(everyoneRole => {
        return guild.roles.fetch(moderatorIDs.roleId).then(moderatorRole => {
            return guild.channels.create(topicName, {
                parent: "581886288102424592",
                permissionOverwrites: [
                    {
                        id: guild.me,
                        allow: ["VIEW_CHANNEL"]
                    },
                    {
                        id: moderatorRole,
                        allow: ["VIEW_CHANNEL"]
                    },
                    {
                        id: everyoneRole,
                        deny: ["VIEW_CHANNEL"]
                    }
                ],
                type: "GUILD_TEXT"
            }).then(channel => {
                var petitions = exports.getPetitions();
                if (!petitions[topicName]) {
                    petitions[topicName] = [];
                }
            
                // Make channel viewable by petitioners, and BountyBot
                guild.members.fetch({
                    user: petitions[topicName].concat(["536330483852771348"])
                }).then(allowedCollection => {
                    allowedCollection.mapValues(member => {
                        channel.permissionOverwrites.create(member.user, {
                            "VIEW_CHANNEL": true
                        });
                    })
                }).then(() => {
                    if (petitions[topicName].length > 0) {
                        channel.send(`This channel has been created thanks to: <@${petitions[topicName].join('> <@')}>`);
                        delete petitions[topicName];
                        exports.setPetitions(petitions, guild.channels);
                    }
                    exports.addTopic(channel.id, channel.name);
                    exports.updateList(guild.channels, "topics");
                    exports.saveObject(exports.getTopicIDs(), 'topicList.json');
                })
                return channel;
            })
        })
    }).catch(console.log);
}

exports.joinChannel = function (channel, user) {
    if (!user.bot) {
        let channelID = channel.id;
        let permissionOverwrite = channel.permissionOverwrites.resolve(user.id);
        if (!permissionOverwrite || !permissionOverwrite.deny.has("VIEW_CHANNEL", false)) {
            if (exports.getTopicIDs().includes(channelID)) {
                channel.permissionOverwrites.create(user, {
                    "VIEW_CHANNEL": true
                }).then(() => {
                    channel.send(`Welcome to ${channel.name}, ${user}!`);
                }).catch(console.log);
            } else if (Object.keys(exports.getClubs()).includes(channelID)) {
                let club = exports.getClubs()[channelID];
                if (club.seats == 0 || club.userIDs.length < club.seats) {
                    if (club.hostID != user.id && !club.userIDs.includes(user.id)) {
                        club.userIDs.push(user.id);
                        channel.permissionOverwrites.create(user, {
                            "VIEW_CHANNEL": true
                        }).then(() => {
                            channel.guild.channels.resolve(club.voiceChannelID).permissionOverwrites.create(user, {
                                "VIEW_CHANNEL": true
                            })
                            channel.send(`Welcome to ${channel.name}, ${user}!`);
                        })
                        exports.updateClub(club, channel.guild.channels);
                    } else {
                        user.send(`You are already in ${club.title}.`)
                            .catch(console.error);
                    }
                } else {
                    user.send(`${club.title} is already full.`)
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
        Array.from(object.values).forEach(value => {
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
