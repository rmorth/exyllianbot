function createVote(message, timeout) {
	let collector = message.createReactionCollector({time: timeout});

	/** Prevent users from voting for multiple options */
	collector.on('collect', async (reaction, user) => {
		console.log(collector);
		console.log(collector.message);
		console.log(collector.message.reactions);
	});

	setTimeout(() => {
		closeVote(message.id);
	}, timeout);
}

function closeVote(message_id) {
	console.log(`Closing vote ${message_id}.`);

	/** Calculate winner */
}

module.exports = {
	createVote
}
