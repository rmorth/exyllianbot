const sqlite = require('sqlite3');

async function sendReminder(client, userId, message) {
	console.log(`Sending reminder to ${userId}.`);

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

function deleteReminder(db, id) {
	db.run(`DELETE FROM REMINDERS WHERE id=?`, id, (err) => {
		if (err) return console.error(err.message);

		console.log(`Reminder with id ${id} deleted.`);
	})
}

module.exports = {
	checkReminders: async function (client) {
		console.log("Checking reminders to send out.");

		/** 1. Start database connection */
		let db = new sqlite.Database('./data/ExyllianDB.db', sqlite.OPEN_READWRITE, (err) => {
			if (err) {
				return console.error(err.message);
			}

			console.log('Connected to Exyllian\'s SQLite database.');
		});

		/** 2. Read reminders from database */
		const sql = `SELECT * FROM REMINDERS ORDER BY TIMESTAMP`;
		db.all(sql, [], async (err, rows) => {
			if (err) throw err;

			console.log(`There are currently ${rows.length} reminders to send out.`);

			for (const row of rows) {
				const reminderTs = parseInt(row.TIMESTAMP);
				let ms = parseInt(Date.now());

				// It's ordered by timestamp
				if (reminderTs > ms) break;

				/** 3. Compare reminder timestamp with current one */
				if (reminderTs <= ms) {
					/** 4. Send reminder */
					let sent = await sendReminder(client, row.USER_ID, row.MESSAGE);
					if (!sent) {
						// TODO: Need to add a try mechanism to prevent DB from clogging
						continue;
					}

					/** 5. Delete reminder entry from database */
					console.log("Deleting reminder entry from database.");
					deleteReminder(db, row.ID);
				}
			}

			/** 6. Close database connection */
			db.close((err) => {
				if (err) {
					return console.error(err.message);
				}

				console.log('Closed connection to Exyllian\'s SQLite database.');
			});
		});
	}
}
