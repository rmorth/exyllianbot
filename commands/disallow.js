const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("disallow")
        .setDescription(
            "Disallow user to see the channel where you sent the message."
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription(
                    "User to disallow access to the channel where you sent this message."
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        if (interaction.channel.parent.name !== interaction.user.username) {
            await interaction.reply("Failed, this isn't your channel.");
            return;
        }

        member = interaction.options.getUser("user");
        interaction.channel.permissionOverwrites.create(member, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
        });

        await interaction.reply(`Successfully disallowed ${member.username}!`);
    },
};
