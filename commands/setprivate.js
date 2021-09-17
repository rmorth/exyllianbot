const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setprivate")
        .setDescription(
            "Set the channel where you sent the message as private."
        ),
    async execute(interaction) {
        if (interaction.channel.parent.name !== interaction.user.username) {
            await interaction.reply("Failed, this isn't your channel.");
            return;
        }

        interaction.channel.permissionOverwrites.create(
            interaction.guild.roles.everyone,
            {
                VIEW_CHANNEL: false,
            }
        );

        await interaction.reply("Successfully set channel as private!");
    },
};
