const { Interaction } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create")
        .setDescription("Create a channel within your category.")
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("Channel's name which you want to create.")
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName("private")
                .setDescription("Whether the channel will be private or not.")
        ),
    async execute(interaction) {
        channels = await interaction.guild.channels.fetch();
        let category = null;
        for (const c of channels) {
            const channel = c[1];
            if (
                channel.type === "GUILD_CATEGORY" &&
                channel.name === interaction.user.username
            ) {
                category = channel;
            }
        }

        if (!category) {
            category = await interaction.guild.channels.create(
                interaction.user.username,
                {
                    type: "GUILD_CATEGORY",
                }
            );
        }

        await interaction.guild.channels.create(
            interaction.options.getString("name"),
            {
                type: "GUILD_TEXT",
                parent: category,
            }
        );

        await interaction.reply("Successfully created your channel!");
    },
};
