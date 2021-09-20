const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("settopic")
        .setDescription(
            "Set the channel's topic/description where you sent the message."
        )
        .addStringOption((option) =>
            option
                .setName("topic")
                .setDescription("Actual topic of the channel.")
                .setRequired(true)
        ),
    async execute(interaction) {
        if (interaction.channel.parent.name !== interaction.user.username) {
            await interaction.reply("Failed, this isn't your channel.");
            return;
        }

        await interaction.channel.edit({
            topic: interaction.options.getString("topic"),
        });

        await interaction.reply("Successfully set channel as public!");
    },
};
