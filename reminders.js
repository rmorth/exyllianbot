const database = require('./database.js');
const moment = require("moment");
const { MessageEmbed } = require("discord.js");

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

async function getReminders(user) {
	const truncateLength = 40;
	let conn = database.open();


	const sql = `SELECT * FROM reminders WHERE user_id = ? ORDER BY timestamp`;
	conn.all(sql, [user.id], async (err, rows) => {
		if (err) return console.error(err.message);

		if (!rows || rows.length == 0) {
			await user.send("You have no active reminders.");
			return;
		}

		let message = "Currently active reminders.\n";
		rows.forEach(r => {
			let text = r.message;

			const date = moment
				.unix(Math.floor(r.timestamp / 1000))
				.format("YYYY-MM-DD HH:mm");

			if (text.length > truncateLength) {
				text = text.substring(0, truncateLength) + "...";
			}

			message += `\n\`${date}\` - **${text}**`
		});

		message += `\n\n*Total: ${rows.length}*`;

		const reminderEmbed = new MessageEmbed()
		.setColor('#fe8b68')
		.setTitle("Your Reminders")
		.setDescription(message)
		.setTimestamp()
		.setAuthor({
			name: user.username,
			iconURL: user.avatarURL()
		});

		await user.send({
			embeds: [reminderEmbed],
			text: ""
		});
	});

	database.close(conn);
}

function createReminder(userId, message, timestamp) {
	let conn = database.open();

	const sql = `INSERT INTO reminders (user_id, message, timestamp) VALUES (?,?,?)`;
	database.run(conn, sql, [userId, message, timestamp]);

	database.close(conn);
}

function deleteReminder(conn, id) {
	const sql = `DELETE FROM reminders WHERE id=?`;
	database.run(conn, sql, [id]);
}

async function checkReminders(client) {
	let conn = database.open();

	/** Read reminders from database */
	const sql = `SELECT * FROM reminders ORDER BY timestamp`;
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
	createReminder,
	getReminders
}
