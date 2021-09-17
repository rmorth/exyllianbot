const { Interaction } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription(
            "Delete a channel within your category by specifying its id."
        )
        .addStringOption((option) =>
            option
                .setName("id")
                .setDescription("Channel's id which you want to delete.")
                .setRequired(true)
        ),
    async execute(interaction) {
        channel = await interaction.guild.channels.fetch(
            interaction.options.getString("id")
        );

        if (
            !channel.parent ||
            channel.parent.type !== "GUILD_CATEGORY" ||
            channel.parent.name !== interaction.user.username
        ) {
            await interaction.reply("Failed deleting the specified channel.");
            return;
        }

        await channel.delete();
        await interaction.reply("Successfully deleted your channel!");
    },
};
