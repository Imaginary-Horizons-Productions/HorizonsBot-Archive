## HorizonsBot Commands
These commands are general use utilities for the server.
### /at-channel
Send a ping to the current channel
#### message
The text of the notification
#### type (optional)
Who to notify
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
## Informantional Commands
Use these commands to learn more about HorizonsBot or this server.
### /rules
Get the server rules
### /commands
List HorizonsBot's commands
### /roles
Get a rundown of the server's roles
### /about
Get the HorizonsBot credits
### /data-policy
Show what user data HorizonsBot collects and how it's used
### /support
Show ways to support Imaginary Horizons
### /press-kit
Get info on Imaginary Horizons as a brand
### /version
Get HorizonsBot's version notes
#### full-notes
Get the file with the full version notes?
## Topic Commands
This server has opt-in topic channels that are automatically generated when enough members petition for them.
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
Clubs are private text and voice channels that include organization utilities like automatic reminders.
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
Commands for moderators. Required permissions are listed in (parenthesis) at the beginning of the description.
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
### /at-permission
(moderator) Disallow/Re-allow a user to use /at-channel
#### disallow (optional)
(moderator) Prevent a user from using /at-channel
#### allow (optional)
(moderator) Re-allow a user to use /at-channel
