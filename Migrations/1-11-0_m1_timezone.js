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

// 3. forEach club, insert 0 at club.timeslot[2]
Object.values(clubs).forEach(club => {
	club.timeslot.splice(2, 0, 0);
})

// 4. Save to clubs file
fs.writeFile(clubsPath, JSON.stringify(clubs), "utf8", (error) => {
	if (error) {
		console.error(error);
	} else {
		console.log("Migration complete.");
	}
})
