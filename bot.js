const { Client } = require('discord.js');
const { getCommand } = require('./Commands/CommandsList.js');
var helpers = require('./helpers.js');

const client = new Client({
    retryLimit: 5,
    presence: {
        activity: {
            name: "@HorizonsBot help",
            type: "LISTENING"
        }
    },
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INVITES', 'GUILD_MESSAGES', 'DIRECT_MESSAGES']
});

client.login(require('./auth.json').token)
    .catch(console.error);

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}\n`);

    client.guilds.fetch(helpers.guildID).then(guild => {
        // Update pinned lists
        let channelManager = guild.channels;
        if (helpers.listMessages.topics) {
            helpers.updateList(channelManager, "topics");
        }

        if (helpers.listMessages.clubs) {
            helpers.updateList(channelManager, "clubs");
        }

        // Generate topic collection
        require('./data/topicList.json').forEach(id => {
            guild.channels.fetch(id).then(channel => {
                helpers.addTopic(id, channel.name);
            })
        })
    })
})

let topicBuriedness = 0;
let clubBuriedness = 0;

client.on('messageCreate', receivedMessage => {
    // Count messages for pin bumping
    if (helpers.listMessages.topics && receivedMessage.channel.id === helpers.listMessages.topics.channelID) {
        topicBuriedness += 1;
        if (topicBuriedness > 9) {
            receivedMessage.channel.messages.fetch(helpers.listMessages.topics.messageID).then(oldMessage => {
                oldMessage.delete();
            })
            helpers.pinTopicsList(receivedMessage.guild.channels, receivedMessage.channel);
            topicBuriedness = 0;
        }
    }
    if (helpers.listMessages.clubs && receivedMessage.channel.id == helpers.listMessages.clubs.channelID) {
        clubBuriedness += 1;
        if (clubBuriedness > 9) {
            receivedMessage.channel.messages.fetch(helpers.listMessages.clubs.messageID).then(oldMessage => {
                oldMessage.delete();
            })
            helpers.pinClubsList(receivedMessage.guild.channels, receivedMessage.channel);
            clubBuriedness = 0;
        }
    }

    // Process commands
    if (receivedMessage.author.bot) {
        return;
    }

    var messageArray = receivedMessage.content.split(" ").filter(element => {
        return element != "";
    });

    let command;
    if (messageArray.length > 0) {
        let firstWord = messageArray.shift();
        if (receivedMessage.guild) {
            // Message from guild
            firstWord = firstWord.replace(/\D/g, ""); // bot mention required
            if (messageArray.length == 0 || (firstWord != client.user.id && (helpers.roleIDs.permissions == "" || firstWord != receivedMessage.guild.me.roles.botRole.id))) {
                return;
            }
            command = messageArray.shift();
        } else {
            // Message from private message
            if (firstWord.replace(/\D/g, "") == client.user.id) {
                command = messageArray.shift();
            } else {
                command = firstWord;
            }
        }

        let state = {
            "command": command.toLowerCase(),
            "messageArray": messageArray,
        }
        let usedCommand = getCommand(state.command);
        if (usedCommand) {
            usedCommand.execute(receivedMessage, state);
        } else {
            receivedMessage.author.send(`**${state.command}** does not appear to be a HorizonsBot command. Please check for typos!`)
                .catch(console.error);
        }
    }
})

client.on("interactionCreate", interaction => {
    if (interaction.isSelectMenu()) {
        if (interaction.customId === "topicListSelect") {
            interaction.guild.channels.fetch(interaction.values[0]).then(channel => {
                helpers.joinChannel(channel, interaction.user);
            }).then(() => {
                interaction.update("\u200B");
            })
        } else if (interaction.customId = "petitionListSelect") {
            helpers.checkPetition(interaction.guild, interaction.values[0], interaction.user);
            interaction.update("\u200B");
        }
    }
})

client.on('guildMemberRemove', member => {
    let memberId = member.id;
    let guild = member.guild;

    // Remove member's clubs
    let clubs = Object.values(helpers.getClubs());
    for (var club of clubs) {
        if (memberId == club.hostID) {
            guild.channels.resolve(club.channelID).delete("Club host left server");
        } else if (club.userIDs.includes(memberId)) {
            club.userIDs = club.userIDs.filter(id => id != memberId);
            helpers.updateList(guild.channels, "clubs");
        }
    }

    // Remove member from petitions and check if member leaving completes any petitions
    Object.keys(helpers.getPetitions()).forEach(topicName => {
        petitions[topicName] = petitions[topicName].filter(id => id != memberId);
        helpers.setPetitions(petitions, guild.channels);
        helpers.checkPetition(guild, topicName);
    })
})

client.on('channelDelete', channel => {
    let channelID = channel.id;
    let topics = helpers.getTopicIDs();
    let clubs = helpers.getClubs();
    if (topics && topics.includes(channelID)) {
        helpers.removeTopic(channel);
    } else if (clubs) {
        if (Object.values(clubs).map(club => { return club.voiceChannelID; }).includes(channelID)) {
            for (var club of Object.values(clubs)) {
                if (club.voiceChannelID == channelID) {
                    let textChannel = channel.guild.channels.resolve(club.channelID);
                    if (textChannel) {
                        textChannel.delete();
                        helpers.removeClub(club.channelID);
                    }
                    break;
                }
            }
        } else if (Object.keys(clubs).includes(channelID)) {
            let voiceChannel = channel.guild.channels.resolve(clubs[channelID].voiceChannelID);
            if (voiceChannel) {
                voiceChannel.delete();
                helpers.removeClub(channelID);
            }
        } else {
            return;
        }
        helpers.updateList(channel.guild.channels, "clubs");
    }
})
