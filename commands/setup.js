const { Interaction } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup your category with a showcase channel."),
    async execute(interaction) {
        channels = await interaction.guild.channels.fetch();
        for (const c of channels) {
            const channel = c[1];
            if (
                channel.type === "GUILD_CATEGORY" &&
                channel.name === interaction.user.username
            ) {
                await interaction.reply("Your category already exists.");
                return;
            }
        }

        category = await interaction.guild.channels.create(
            interaction.user.username,
            {
                type: "GUILD_CATEGORY",
            }
        );

        await interaction.guild.channels.create("showcase", {
            type: "GUILD_TEXT",
            parent: category,
        });

        await interaction.reply("Successfully setup your category!");
    },
};
