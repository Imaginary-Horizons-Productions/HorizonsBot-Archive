## HorizonsBot Commands
The general use commands. Required permissions are listed in (parenthesis) at the beginning of the description.
### /about
Get the HorizonsBot credits
### /commands
List HorizonsBot's commands
### /support
Show ways to support Imaginary Horizons
### /data-policy
Show what user data HorizonsBot collects and how it's used
### /list
Get the topic or club list
#### list-type
The list to get
### /join
Join a topic or club
#### channel
The name/id of the topic or club to join
### /leave
Leave a topic or club
### /roll
Roll any number of dice with any number of sides
#### dice
The dice to roll in #d# format
#### display (optional)
Choose output display option
#### label (optional)
Text after the roll
### /timestamp
Calculate the unix timestamp for a moment in time, which Discord displays with timezones applied
#### start (optional)
The timestamp to start from (default: now)
#### days-from-start (optional)
86400 seconds
#### hours-from-start (optional)
3600 seconds
#### minutes-from-start (optional)
60 seconds
### /at-channel
Send a ping to the current channel
#### message
The text of the notification
#### type (optional)
Who to notify
### /version
Get HorizonsBot's version notes
#### full-notes
Get the file with the full version notes?
## Custom Message Embeds
To get a message's id, enable developer mode (User Settings > Appearance > Developer Mode), then right-click the message and select "Copy ID".
### /embed-create
(moderator) Make a new MessageEmbed, configurable with other commands
### /embed-abandon
(moderator) Stop managing the given embed
#### message-id
The id of the embed's message
### /embed-edit
(moderator) Edit an existing embed
#### add-field (optional)
(moderator) Add a field to the embed
#### author (optional)
(moderator) Assign a custom embed's author
#### color (optional)
(moderator) Assign a custom embed's color
#### description (optional)
(moderator) Assign a custom embed's description
#### image (optional)
(moderator) Set an custom embed's image
#### message (optional)
(moderator) Set a custom embed's message content
#### thumbnail (optional)
(moderator) Set a custom embed's thumbnail
#### title (optional)
(moderator) Set a custom embed's title
#### url (optional)
(moderator) Set a custom embed's title url
#### splice-fields (optional)
(moderator) Remove fields from a custom embed (replace unsupported)
## Topic Commands
Commands for managing topics.
### /petition
Petition for a topic
#### topic-name
Make sure the topic doesn't already exist
### /topic-invite
Invite a user to a topic
#### invitee
The user to invite (copy-paste from another channel)
#### channel
The topic channel
### /topic-add
(moderator) Set up a topic
#### topic-name
The new topic
### /petition-check
(moderator) Check if a petition has passed in case of desync
#### topic
The petition to check
### /petition-veto
(moderator) Veto a petition
#### topic
The petition to close
## Club Commands
Commands for managing clubs.
### /club-instructions
Get up-to-date club setup instructions
### /club-invite
Send a user (default: self) an invite to a club
#### club-id (optional)
The club text channel's id
#### invitee (optional)
The user's mention
### /club-add
(moderator) Set up a club (a text and voice channel)
#### club-leader
The user's mention
### /club-config
(club leader or moderator) Configure a club's information
#### name (optional)
What to call the club
#### description (optional)
Text shown in the channel topic
#### game (optional)
The text to set as the club game
#### max-members (optional)
The maximum number of members for the club
#### color (optional)
The color of the details embed
### /club-next-meeting
(club leader or morderator) Set the club's next meeting
#### days-from-now (optional)
86400 seconds
#### hours-from-now (optional)
3600 seconds
#### minutes-from-now (optional)
60 seconds
### /club-set-repeat
(club leader or morderator) Set how frequently to send club meeting reminders
#### count
The units of time between meetings
#### time-unit
The unit of time
#### reminder-text (optional)
The reminder's text
### /club-set-image
(club leader or moderator) Set or clear a club's image url
#### url (optional)
The image's url 
### /club-details
(club leader or morderator) Post and pin the club's details embed
### /club-promote-leader
(club leader or moderator) Promote another user to club leader
#### user
The user's mention
## Moderation Commands
Commands for moderators.
### /manage-mods
(moderator) Promote/demote a user to moderator
#### promote (optional)
(moderator) Add a user to the moderator list
#### demote (optional)
(moderator) Remove a user from the moderator list
### /pin-list
(moderator) Pin the topics or clubs list message in this channel
#### list-type
The list to pin
### /kick
(moderator) Remove a user from a topic or club
#### target
The user's mention
#### ban (optional)
Prevent the user from rejoining?
### /delete
(moderator) Delete a topic or club on a delay
#### delay
Number of hours to delay deleting the channel
### /no-ats
Toggles whether a user can use /at-channel
#### user
The user's mention
