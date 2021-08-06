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
    intents: ['DIRECT_MESSAGES', 'GUILD_MEMBERS', 'GUILD_INVITES', 'GUILD_MESSAGES', 'GUILD_EMOJIS_AND_STICKERS']
});

client.login(require('./auth.json').token)
    .catch(console.error);

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}\n`);

    client.guilds.fetch(helpers.guildID).then(guild => {
        // Update pinned lists
        let channelManager = guild.channels;
        if (helpers.listMessages.topics) {
            helpers.updateList(channelManager, "topics").then(message => {
                helpers.createJoinCollector(message);
            });
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

client.on('guildMemberRemove', member => {
    let clubs = Object.values(helpers.getClubs());
    let memberID = member.id;
    for (var club of clubs) {
        if (memberID == club.hostID) {
            member.guild.channels.resolve(club.channelID).delete("Club host left server");
        } else if (club.userIDs.includes(memberID)) {
            club.userIDs = club.userIDs.filter(id => id != memberID);
            helpers.updateList(member.guild.channels, "clubs");
        }
    }
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
