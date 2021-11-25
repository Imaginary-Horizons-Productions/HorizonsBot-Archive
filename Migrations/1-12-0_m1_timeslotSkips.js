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

// 3. forEach club, convert to object format
Object.values(clubs).forEach(club => {
	let oldTimeslot = club.timeslot;
	if (Array.isArray(oldTimeslot)) {
		let timeslotObject = {
			day: oldTimeslot[0],
			hour: oldTimeslot[1],
			timezone: oldTimeslot[2],
			message: oldTimeslot[3],
			break: 0
		}
		club.timeslot = timeslotObject;
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
