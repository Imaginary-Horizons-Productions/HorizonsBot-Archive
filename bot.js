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
    }
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

        if (helpers.listMessages.campaigns) {
            helpers.updateList(channelManager, "campaigns");
        }

        // Generate topicNames
        helpers.getTopics().forEach(id => {
            helpers.topicNames[guild.channels.resolve(id).name] = id;
        })
    })
})

let topicBuriedness = 0;
let campaignBuriedness = 0;

client.on('message', receivedMessage => {
    // Count messages for pin bumping
    if (helpers.listMessages.topics && receivedMessage.channel.id === helpers.listMessages.topics.channelID) {
        topicBuriedness += 1;
        if (topicBuriedness > 19) {
            receivedMessage.channel.messages.fetch(helpers.listMessages.topics.messageID).then(oldMessage => {
                oldMessage.delete({ "reason": "bump topics pin" });
            })
            helpers.pinTopicsList(receivedMessage.guild.channels, receivedMessage.channel);
            topicBuriedness = 0;
        }
    }
    if (helpers.listMessages.campaigns && receivedMessage.channel.id == helpers.listMessages.campaigns.channelID) {
        campaignBuriedness += 1;
        if (campaignBuriedness > 19) {
            receivedMessage.channel.messages.fetch(helpers.listMessages.campaigns.messageID).then(oldMessage => {
                oldMessage.delete({ "reason": "bump campaigns pin" });
            })
            helpers.pinCampaignsList(receivedMessage.guild.channels, receivedMessage.channel);
            campaignBuriedness = 0;
        }
    }

    // Publish stream notifications
    if (receivedMessage.author.id == "368105370532577280" && receivedMessage.channel.id == "572197893201592328" && receivedMessage.content.includes("Arcane_ish")) {
        receivedMessage.crosspost();
        return;
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
            if (messageArray.length == 0 || (firstWord != client.user.id && (helpers.roleIDs.permissions == "" || firstWord != helpers.roleIDs.permissions))) {
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
    let campaigns = Object.values(helpers.getCampaigns());
    let memberID = member.id;
    for (campaign of campaigns) {
        if (memberID == campaign.hostID) {
            member.guild.channels.resolve(campaign.channelID).delete("Campaign host left server");
        } else if (campaign.userIDs.includes(memberID)) {
            campaign.userIDs = campaign.userIDs.filter(id => id != memberID);
            helpers.updateList(member.guild.channels, "campaigns");
        }
    }
})

client.on('channelDelete', channel => {
    let channelID = channel.id;
    let topics = helpers.getTopics();
    let campaigns = helpers.getCampaigns();
    if (topics && topics.includes(channelID)) {
        helpers.removeTopicEmoji(channelID);
        helpers.setTopicList(topics.filter(id => id != channelID))
        helpers.updateList(channel.guild.channels, "topics");
    } else if (campaigns) {
        if (Object.values(campaigns).map(campaign => { return campaign.voiceChannelID; }).includes(channelID)) {
            for (campaign of Object.values(campaigns)) {
                if (campaign.voiceChannelID == channelID) {
                    let textChannel = channel.guild.channels.resolve(campaign.channelID);
                    if (textChannel) {
                        textChannel.delete();
                        helpers.removeCampaign(campaign.channelID);
                    }
                    break;
                }
            }
        } else if (Object.keys(campaigns).includes(channelID)) {
            let voiceChannel = channel.guild.channels.resolve(campaigns[channelID].voiceChannelID);
            if (voiceChannel) {
                voiceChannel.delete();
                helpers.removeCampaign(channelID);
            }
        } else {
            return;
        }
        helpers.updateList(channel.guild.channels, "campaigns");
    }
})
