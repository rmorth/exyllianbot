const { SlashCommandBuilder } = require("@discordjs/builders");
const { getReminders } = require("../reminders.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reminders")
        .setDescription(
            "Check your current reminders, they'll be privately messaged to you."
        ),
    async execute(interaction) {
		await getReminders(interaction.user);

		await interaction.reply({
			content: "Sent you a private message with your reminders!",
			ephemeral: true
		});
    },
};
