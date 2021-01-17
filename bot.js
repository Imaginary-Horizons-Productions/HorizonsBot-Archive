const { Client } = require('discord.js');
const { commandDictionary } = require('./Commands/CommandsList.js');
var helpers = require('./helpers.js');

const client = new Client();

login();

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}\n`);
    client.user.setActivity(`"@HorizonsBot help"`)
        .catch(console.error);
})

client.on('message', receivedMessage => {
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
        if (commandDictionary[state.command]) {
            commandDictionary[state.command].execute(receivedMessage, state);
        } else {
            receivedMessage.author.send(`**${state.command}** does not appear to be a HorizonsBot command. Please check for typos!`)
                .catch(console.error);
        }
    }
})

client.on('guildMemberRemove', member => {

})

client.on('channelDelete', channel => {
    let channelID = channel.id;
    helpers.topicList = helpers.topicList.filter(id => id != channelID);
    helpers.saveObject(helpers.topicList, 'topicList.json')
    if (Object.keys(helpers.campaignList).includes(channelID)) {
        delete helpers.campaignList[channelID];
        helpers.saveObject(helpers.campaignList, 'campaignList.json');
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
