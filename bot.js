const fs = require('fs');
const { Client } = require('discord.js');
const { commandDictionary } = require('./Commands/CommandsList.js');

const client = new Client();

// channelID: Topic/Campaign
module.exports = channelList = {};

login();

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}\n`);
    //TODO read channelList from file
    client.user.setActivity("@HorizonsBot help", { type: "LISTENING" }).catch(console.error);
})

client.on('message', receivedMessage => {
    if (receivedMessage.author.bot) {
        return;
    }

    var messageArray = receivedMessage.content.split(" ").filter(element => {
        return element != "";
    });
    let firstWord = messageArray.shift();
    if (receivedMessage.guild) {
        // Message from guild
        firstWord = firstWord.replace(/\D/g, ""); // bot mention required
        if (messageArray.length > 0 && firstWord == client.user.id) { //TODO permissions role
            let command = messageArray.shift();
            let state = {
                "command": command,
                "messageArray": messageArray,
            }

            if (commandDictionary[command]) {
                commandDictionary[command].execute(receivedMessage, state);
            } else {
                receivedMessage.author.send(`**${state.command}** does not appear to be a HorizonsBot command. Please check for typos!`)
                    .catch(console.error);
            }
        }
    } else {
        // Message from private message

    }
})

client.on('guildMemberRemove', member => {

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
    fs.readFile('./auth.json', 'utf8', (error, data) => {
        if (error) {
            console.error(error)
        }

        let token = JSON.parse(data).token;
        client.login(token)
            .catch(console.error);
    })
}
