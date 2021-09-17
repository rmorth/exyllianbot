const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("allow")
        .setDescription(
            "Allow user to see the channel where you sent the message."
        )
        .addStringOption((option) =>
            option
                .setName("id")
                .setDescription(
                    "User to allow access to the channel where you sent this message."
                )
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName("readonly")
                .setDescription(
                    "Whether this channel will be readonly to this user."
                )
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
            VIEW_CHANNEL: true,
            SEND_MESSAGES: !interaction.options.getBoolean("readonly") ?? true,
        });

        await interaction.reply(
            `Successfully allowed ${member.user.username}!`
        );
    },
};
