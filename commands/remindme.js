const { SlashCommandBuilder } = require("@discordjs/builders");
const { createReminder } = require("../reminders.js");
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remindme")
        .setDescription(
            "Set a reminder, you'll be notified via DM."
        )
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription("In how much time you want the reminder to be sent.")
                .setRequired(true)
		)
		.addStringOption((option) =>
				option
					.setName("message")
					.setDescription("Message that will be sent when the reminder is up.")
					.setRequired(true)
        ),
    async execute(interaction) {
		const timeRegex = new RegExp('^[0-9]+[w,d,h,m]$');
		let time = interaction.options.getString("time");

		/**
		 * 1. Validate time message format
		 *
		 * Has to be something like "2w", "1d", "30h", "10m", ...
		 * Lowest possible is "1m" and it'll be innacurate.
		 */
		 if (!timeRegex.test(time)) {
			await interaction.reply({
				content: "Invalid time format, look into this command's usage.",
				ephemeral: true
			});

			return;
		}

		/** 2. Calculate timestamp from time argument */
		let quantity = time.substring(0, time.length - 1);
		let unit = time.slice(-1);
		let timestamp = moment().add(quantity, unit).valueOf();

		/** 3. Insert reminder in DB */
		let userId = interaction.user.id;
		let message = interaction.options.getString("message");
		createReminder(userId, message, timestamp);

        await interaction.reply({
			content: "Successfully created a new reminder!",
			ephemeral: true
		});
    },
};
