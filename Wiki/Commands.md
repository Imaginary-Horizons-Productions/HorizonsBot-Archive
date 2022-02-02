## HorizonsBot Commands
Here are all of HorizonsBot's commands. Check their details to see what the usage requirements are!
### /about
Provides details about HorizonsBot and its contributors
### /commands
List HorizonsBot command(s)
### /support
Show ways to support the community
### /data-policy
Shows types of user data HorizonsBot collects and how it's used
### /list
Get a list of topic or club channels
#### list-type
Get a list of topic or club channels
### /join
Join one or many opt-in channels or club
#### channel
The name (or id) of the topic or club to join
### /leave
Leave an opt-in channel or club
### /petition
Petition for a topic
#### topic-name
The topic channel to petition for
### /roll
Roll dice
#### dice
The number and type of dice using #d# format
#### display (optional)
Choose output display options
#### label (optional)
Text label for the roll
### /timestamp
Calculate the unix timestamp for a moment in time, which Discord displays with timezones applied
#### start (optional)
The timestamp to start from (default: now)
#### days-from-start (optional)
How many days from the start for the timestamp
#### hours-from-start (optional)
How many hours from the start for the timestamp
#### minutes-from-start (optional)
How many minutes from the start for the timestamp
### /at-channel
Send a ping to the current channel
#### message
The text to go with the notification
#### type (optional)
Who to notify with the message
## Custom Message Embeds
To get a message's id, enable developer mode (User Settings > Appearance > Developer Mode), then right-click the message and select "Copy ID".
### /embed-create
(moderator) Make a new MessageEmbed, configurable with other commands
### /embed-abandon
(moderator) Stop managing the given embed(s)
#### message-id
The id of the embed's message
### /embed-set-author
(moderator) Assign a custom embed's author
#### message-id
The id of the embed's message
#### text
The text to put in the author field
#### icon-url (optional)
The url to the image in the author field
#### url (optional)
The url to open when the author field is clicked
### /embed-set-title
(moderator) Assign a custom embed's title
#### message-id
The id of the embed's message
#### title
The text to set in the title field
### /embed-set-url
(moderator) Assign a custom embed's title url
#### message-id
The id of the embed's message
#### url
The url to go to when clicking the title field
### /embed-set-color
(moderator) Assign a custom embed's color
#### message-id
The id of the embed's message
#### color
The hexcode of the color
### /embed-set-description
(moderator) Assign a custom embed's description
#### message-id
The id of the embed's message
#### text
The text to put in the description field
### /embed-set-thumbnail
(moderator) Assign a custom embed's thumbnail
#### message-id
The id of the embed's message
#### url
The url to a picture for the thumbnail field
### /embed-add-field
(moderator) Add a custom embed field
#### message-id
The id of the embed's message
#### header
The header for the new field
#### text
The text of the new field
#### inline (optional)
Whether to show the field in-line with previous embed fields
### /embed-splice-fields
(moderator) Remove fields from a custom embed (replace unsupported)
#### message-id
The id of the embed's message
#### index
The field number to start removing fields from (count starts from 0)
#### count
The number of fields to remove
### /embed-set-image
(moderator) Assign an custom embed's image
#### message-id
The id of the embed's message
#### url
The url to a picture for the image field
### /embed-set-message
(moderator) Assign a custom embed's message content
#### message-id
The id of the embed's message
#### text
The text to put in the message (above the embed)
## Topic Commands
Commands for managing opt-in topic text channels.
### /topic-invite
Invite users to this topic
#### invitee
The user to invite (copy-paste from another channel)
#### channel
The topic channel to invite to
### /topic-add
(moderator) Set up a topic
#### topic-name
The new topic
### /topic-veto
(moderator) Veto a petition
#### topic
The petition to close
## Club Commands
Commands for managing club text and voice channels.
### /club-instructions
Get the up-to-date club setup instructions
### /club-invite
Send the user (default: self) an invite to the club by channel mention, or by sending from club
#### club-id (optional)
The club to provide details on
#### invitee (optional)
The user to invite to the club
### /club-add
(moderator) Set up a text and voice channels for a club
#### club-leader
The user to set as club leader
### /club-config
(club leader or moderator) Configure a club's information
#### name (optional)
The new name for the club
#### description (optional)
The club description is shown in the channel topic
#### game (optional)
The text to set as the club game
#### max-members (optional)
The maximum number of members for the club
#### color (optional)
The color of the details embed
### /club-next-meeting
Set the club's next meeting
#### days-from-now (optional)
How many days from now for the next meeting
#### hours-from-now (optional)
How many hours from now for the next meeting
#### minutes-from-now (optional)
How many minutes from now for the next meeting
### /club-set-repeat
Set how frequently club meetings repeat, this will set the next meetings automatically
#### count
The number of units between meetings
#### time-unit
The amount of time each unit represents
### /club-set-image
(club leader or moderator) Set or clear a club's image url
#### url (optional)
The url to the image to set for the club
### /club-details
(club leader or morderator) Posts and pins the club's details embed
### /club-promote-leader
(club leader or moderator) Promote another user to club leader
#### user
The user to promote to club leader
## Moderation Commands
Commands for moderators.
### /mod-promote
(moderator) Add a Moderator to HorizonsBot's list and give them the role
#### promotee
The user to promote to moderator
### /mod-demote
(moderator) Remove a Moderator from HorizonsBot's list and remove the role
#### demotee
The user to demote from moderator
### /pin-list
(moderator) Pin the list message for topics or clubs in this channel
#### list-type
Pin the list message for topics or clubs in this channel
### /kick
(moderator) Remove mentioned users from a topic or club channel
#### target
The user to remove from the topic or club
#### ban (optional)
Prevent the user from rejoining?
### /delete
(moderator) Delete a topic or club channel on a delay
#### delay
Number of hours to delay deleting the channel
### /no-ats
Toggles whether the user can use /at-channel
#### user
The user to prevent/allow the use of /at-channel
