const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setprivate")
        .setDescription(
            "Set the channel where you sent the message as private for EVERYONE."
        ),
    async execute(interaction) {
        if (interaction.channel.parent.name !== interaction.user.username) {
            await interaction.reply("Failed, this isn't your channel.");
            return;
        }

        /**
         * We reset permissions for allowed users, else they'd still be allowed to see the channel
         */
        interaction.channel.lockPermissions();

        interaction.channel.permissionOverwrites.create(
            interaction.guild.roles.everyone,
            {
                VIEW_CHANNEL: false,
            }
        );

        await interaction.reply("Successfully set channel as private!");
    },
};
