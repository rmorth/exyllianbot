const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("disallow")
        .setDescription(
            "Disallow user to see the channel where you sent the message."
        )
        .addStringOption((option) =>
            option
                .setName("id")
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

        member = await interaction.guild.members.fetch(
            interaction.options.getString("id")
        );

        interaction.channel.permissionOverwrites.create(member, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
        });

        await interaction.reply(
            `Successfully disallowed ${member.user.username}!`
        );
    },
};
