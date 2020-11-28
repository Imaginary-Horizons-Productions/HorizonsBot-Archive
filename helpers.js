const fs = require('fs');

// messageID: channelID
exports.embedsList = {};
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
