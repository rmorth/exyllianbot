const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setpublic")
        .setDescription("Set the channel where you sent the message as public.")
        .addBooleanOption((option) =>
            option
                .setName("readonly")
                .setDescription("Whether this channel will be readonly.")
        ),
    async execute(interaction) {
        if (interaction.channel.parent.name !== interaction.user.username) {
            await interaction.reply("Failed, this isn't your channel.");
            return;
        }

        interaction.channel.permissionOverwrites.create(
            interaction.guild.roles.everyone,
            {
                VIEW_CHANNEL: true,
                SEND_MESSAGES:
                    !interaction.options.getBoolean("readonly") ?? true,
            }
        );

        await interaction.reply("Successfully set channel as public!");
    },
};
