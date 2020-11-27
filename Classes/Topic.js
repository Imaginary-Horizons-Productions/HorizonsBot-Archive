module.exports = class Topic {
    constructor () {
        this.channelID = 0;
        this.title = "new-topic";
        this.userIDs = [];
        this.description = "Use the `setdescription` command to use this space to describe the topic.";
    }
}