const sqlite = require('sqlite3');
const DATABASE_PATH = './data/ExyllianDB.db';

function open() {
	return new sqlite.Database(DATABASE_PATH, sqlite.OPEN_READWRITE, (err) => {
		if (err) return console.error(err.message);

		console.log('Connected to Exyllian\'s database.');
	});
}

function run(conn, sql, parameters) {
	if (!conn) return false;

	return conn.run(sql, parameters, (err) => {
		if (err) {
			console.error(err.message);
			return false;
		}

		return true;
	});
}

function close(conn) {
	if (!conn) return false;

	return conn.close((err) => {
		if (err) {
			console.error(err.message);
			return false;
		}

		console.log('Closed connection to Exyllian\'s database.');
		return true;
	});
}

module.exports = {
	open,
	close,
	run
}
