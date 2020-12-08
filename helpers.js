const fs = require('fs');
exports.serverID = "353575133157392385";
exports.roleIDs = require('./roleIDs.json');

exports.moderatorIDs = require('./data/moderatorIDs.json');
// messageID: channelID
exports.embedsList = require('./data/embedsList.json');
// channelID: Topic
exports.topicList = {};
// channelID: Campaign
exports.campaignList = {};

exports.saveObject = function (object, fileName) {
    var filePath = `./`;
    filePath += 'data/' + fileName;
    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
    }
    let textToSave = '';
    if (typeof object == 'object' || typeof object == 'number') {
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
