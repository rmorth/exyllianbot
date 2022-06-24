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
        .addStringOption((option) =>
            option
                .setName("topic")
                .setDescription("Channel's topic to display.")
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
                topic: interaction.options.getString("topic"),
                type: "GUILD_TEXT",
                parent: category,
                permissionOverwrites: interaction.options.getBoolean("private")
                    ? [
                          {
                              id: interaction.guild.roles.everyone.id,
                              deny: ["VIEW_CHANNEL"],
                          },
                      ]
                    : null,
            }
        );

        await interaction.reply({
			content: "Successfully created your channel!",
			ephemeral: true
		});
    },
};
