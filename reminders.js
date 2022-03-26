const database = require('./database.js');

async function sendReminder(client, userId, message) {
	const user = await client.users.fetch(userId).catch(() => null);
	if (!user) {
		console.log(`Couldn't find user with id ${userId}.`);
		return false;
	}

	await user.send(message).catch(() => {
		console.log("User has DMs closed or has no mutual servers with the bot.");
		return false;
	});


	return true;
}

function createReminder(userId, message, timestamp) {
	let conn = database.open();

	const sql = `INSERT INTO REMINDERS (USER_ID, MESSAGE, TIMESTAMP) VALUES (?,?,?);`;
	database.run(conn, sql, [userId, message, timestamp]);

	database.close(conn);
}

function deleteReminder(conn, id) {
	const sql = `DELETE FROM REMINDERS WHERE id=?`;
	database.run(conn, sql, [id]);
}

async function checkReminders(client) {
	let conn = database.open();

	/** Read reminders from database */
	const sql = `SELECT * FROM REMINDERS ORDER BY TIMESTAMP`;
	conn.all(sql, [], async (err, rows) => {
		if (err) return console.error(err.message);

		let sentCount = 0;
		for (const row of rows) {
			const reminderTs = parseInt(row.TIMESTAMP);
			let ms = parseInt(Date.now());

			// It's ordered by timestamp
			if (reminderTs > ms) break;

			/** Compare reminder timestamp with current one */
			if (reminderTs <= ms) {
				/** Send reminder */
				let sent = await sendReminder(client, row.USER_ID, row.MESSAGE);
				if (!sent) {
					// TODO: Need to add a try mechanism to prevent DB from clogging
					continue;
				}

				/** Delete reminder entry from database */
				deleteReminder(conn, row.ID);
				sentCount++;
			}
		}

		console.log(`Sent ${sentCount}/${rows.length} reminder(s).`);
		database.close(conn);
	});
}

module.exports = {
	checkReminders,
	createReminder
}
