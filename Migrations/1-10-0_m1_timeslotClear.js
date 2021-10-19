const fs = require("fs");

// 1. Read clubs file
let clubsPath = "../data/clubList.json";
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

// 3. forEach club, if not an Array, set club.timeslot to [undefined, undefined, ""]
Object.values(clubs).forEach(club => {
	if (!Array.isArray(club.timeslot)) {
		club.timeslot = [undefined, undefined, ""];
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
