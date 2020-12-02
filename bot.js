const fs = require('fs');
const { Client } = require('discord.js');
const { commandDictionary } = require('./Commands/CommandsList.js');
var helpers = require('./helpers.js');
var roleIDs = require('./roleIDs.json');

const client = new Client();

login();

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}\n`);
    fs.readFile('./data/embedsList.json', 'utf8', (error, data) => {
        if (error) {
            console.error(error);
        } else {
            helpers.embedsList = JSON.parse(data);
        }
    })
    client.user.setActivity("@HorizonsBot help", { type: "LISTENING" }).catch(console.error);
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
            if (messageArray.length == 0 || (firstWord != client.user.id && firstWord != roleIDs.permissions)) {
                return;
            }
            command = messageArray.shift();
        } else {
            // Message from private message
            if (firstWord.replace(/\D/g, "") == client.user.id) {
                command = messageArray.shift();
            } else if (commandDictionary[firstWord]) {
                command = firstWord;
            } else {
                return;
            }
        }

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
