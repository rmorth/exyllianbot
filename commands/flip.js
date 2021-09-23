const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("flip")
        .setDescription("Flips a coin, or lots of coins.")
        .addIntegerOption((option) =>
            option.setName("number").setDescription("Number of coins to flip.")
        ),
    async execute(interaction) {
        let number = interaction.options.getInteger("number");

        if (number != 0 && !number) number = 1;
        else if (number > 20) {
            await interaction.reply("The maximum number of coin flips is 20!");
            return;
        } else if (number <= 0) {
            await interaction.reply("The minimum number of coin flips is 1!");
            return;
        }

        let heads = 0;
        for (let i = 0; i < number; i++) {
            if (Math.random() >= 0.5) {
                heads++;
            }
        }

        result = `It's a tie!`;
        if (heads > number / 2) {
            result = `Heads! (Yes, with ${heads}).`;
        } else if (heads < number / 2) {
            result = `Tails! (No, with ${number - heads}).`;
        }

        await interaction.reply(`Result: ${result}`);
    },
};
