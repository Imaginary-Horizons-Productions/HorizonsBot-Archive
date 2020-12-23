module.exports = class Topic {
    constructor (channelIDInput, titleInput) {
        this.channelID = channelIDInput;
        this.title = titleInput;
        this.userIDs = [];
        this.description = "Use the `setdescription` command to use this space to describe the topic.";
    }
}