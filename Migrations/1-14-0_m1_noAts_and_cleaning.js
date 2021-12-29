const fs = require("fs");

// 1. Read clubs file
let clubsPath = "../Config/clubList.json";
let clubs = require(clubsPath);

// 2. Make backup of clubs file
let backupPath = `../Backups/${Date.now()}/`;
if (!fs.existsSync(backupPath)) {
	fs.mkdirSync(backupPath, { recursive: true });
}
fs.writeFile(backupPath + "clublist.json", JSON.stringify(clubs), "utf8", (error) => {
	if (error) {
		console.error(error);
	}
})

// 3. forEach club, clean out <200b> from system property
Object.values(clubs).forEach(club => {
	if (club.system === "<200b>") {
		club.system = "";
	}
})

// 4. Save to clubs file
fs.writeFile(clubsPath, JSON.stringify(clubs), "utf8", (error) => {
	if (error) {
		console.error(error);
	} else {
		console.log("Migration complete.");
	}
})

// 1. Read moderators and auth file
let modsPath = "../Config/moderatorIDs.json";
let modObject = require(modsPath);
let authPath = "../Config/auth.json";
let authObject = require(authPath);

// 2. Make backup files
if (!fs.existsSync(backupPath)) {
	fs.mkdirSync(backupPath, { recursive: true });
}
fs.writeFile(backupPath + "moderatorIDs.json", JSON.stringify(modObject), "utf8", (error) => {
	if (error) {
		console.error(error);
	}
})
fs.writeFile(backupPath + "auth.json", JSON.stringify(authObject), "utf8", (error) => {
	if (error) {
		console.error(error);
	}
})

// 3. Add reorganize variables and add noAts
let env = { //TODONOW update wiki
	token: authObject.token,
	guildId: authObject.guildID,
	botId: authObject.botId,
	modRoleId: modObject.roleId,
};
let modData = {
	modIds: modObject.userIds,
	noAts: []
}

// 4. Save to file
fs.writeFile("../Config/_env.json", JSON.stringify(env), "utf8", (error) => {
	if (error) {
		console.error(error);
	}
})
fs.writeFile("../Config/modData.json", JSON.stringify(modData), "utf8", (error) => {
	if (error) {
		console.error(error);
	}
})

// 5. Delete old files
fs.unlink(modsPath, (error) => {
	if (error) {
		console.error(error);
	}
})
fs.unlink(authPath, (error) => {
	if (error) {
		console.error(error);
	}
})
