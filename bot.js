const { Client } = require('discord.js');
const { getCommand } = require('./Commands/CommandsList.js');
var helpers = require('./helpers.js');

const client = new Client();

login();

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}\n`);
    client.user.setActivity(`"@HorizonsBot help"`)
        .catch(console.error);

    // Update pinned lists
    client.guilds.fetch(helpers.guildID).then(guild => {
        let channelManager = guild.channels;
        helpers.updateList(channelManager, "topics").then(message => {
            helpers.createJoinCollector(message);
        });
        helpers.updateList(channelManager, "campaigns");
    })
})

let topicBuriedness = 0;
let campaignBuriedness = 0;

client.on('message', receivedMessage => {
    if (receivedMessage.channel.id === helpers.listMessages.topics.channelID) {
        topicBuriedness += 1;
        if (topicBuriedness > 19) {
            receivedMessage.channel.messages.fetch(helpers.listMessages.topics.messageID).then(oldMessage => {
                oldMessage.delete({ "reason": "bump topics pin" });
            })
            helpers.pinTopicsList(receivedMessage.guild.channels, receivedMessage.channel);
            topicBuriedness = 0;
        }
    }
    if (receivedMessage.channel.id == helpers.listMessages.campaigns.channelID) {
        campaignBuriedness += 1;
        if (campaignBuriedness > 19) {
            receivedMessage.channel.messages.fetch(helpers.listMessages.campaigns.messageID).then(oldMessage => {
                oldMessage.delete({ "reason": "bump campaigns pin" });
            })
            helpers.pinCampaignsList(receivedMessage.guild.channels, receivedMessage.channel);
            campaignBuriedness = 0;
        }
    }
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
    // if member was a campaign host, delete campaign
    // if member was a campaign player, clean player list
})

client.on('channelDelete', channel => {
    let channelID = channel.id;
    let topics = helpers.getTopicList();
    let campaigns = helpers.getCampaignList();
    if (topics && topics.includes(channelID)) {
        helpers.removeTopicEmoji(channelID);
        helpers.setTopicList(topics.filter(id => id != channelID))
        helpers.updateList(channel.guild.channels, "topics");
    } else if (campaigns) {
        if (Object.values(campaigns).map(campaign => { return campaign.voiceChannelID; }).includes(channelID)) {
            for (campaign of Object.values(campaigns)) {
                if (campaign.voiceChannelID == channelID) {
                    channel.guild.channels.resolve(campaign.channelID).delete();
                    helpers.removeCampaign(channelID);
                    break;
                }
            }
        } else if (Object.keys(campaigns).includes(channelID)) {
            channel.guild.channels.resolve(campaigns[channelID].voiceChannelID).delete();
            helpers.removeCampaign(channelID);
        } else {
            return;
        }
        helpers.updateList(channel.guild.channels, "campaigns");
    }
})

client.on('disconnect', (error, code) => {
    console.log(`Disconnect encountered (Error code ${code}):`);
    console.log(error);
    console.log(`---Restarting`);
    login();
})

client.on('error', (error) => {
    console.log(`Error encountered:`);
    console.log(error);
    console.log(`---Restarting`);
    login();
})

function login() {
    let { token } = require('./auth.json');
    client.login(token)
        .catch(console.error);

}
