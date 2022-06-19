const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { createVote } = require("../votes.js");
const moment = require('moment');

const numberEmojis = new Map()
	.set(1, "1️⃣")
	.set(2, "2️⃣")
	.set(3, "3️⃣")
	.set(4, "4️⃣")
	.set(5, "5️⃣")
	.set(6, "6️⃣")
	.set(7, "7️⃣")
	.set(8, "8️⃣")
	.set(9, "9️⃣")
	.set(10, "🔟");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Create a vote.")
        .addStringOption((option) =>
            option.setName("question")
				.setDescription("What the vote is about.")
				.setRequired(true))
        .addStringOption((option) =>
            option.setName("time")
                .setDescription("How much time you want the vote to be active for.")
                .setRequired(true))
		.addStringOption((option) =>
			option.setName("text")
				.setDescription("Good to give more context behind the vote."))
		.addStringOption((option) =>
			option.setName("option1")
				.setDescription("Option 1."))
		.addStringOption((option) =>
			option.setName("option2")
				.setDescription("Option 2."))
		.addStringOption((option) =>
			option.setName("option3")
				.setDescription("Option 3."))
		.addStringOption((option) =>
			option.setName("option4")
				.setDescription("Option 4."))
		.addStringOption((option) =>
			option.setName("option5")
				.setDescription("Option 5."))
		.addStringOption((option) =>
			option.setName("option6")
				.setDescription("Option 6."))
		.addStringOption((option) =>
			option.setName("option7")
				.setDescription("Option 7."))
		.addStringOption((option) =>
			option.setName("option8")
				.setDescription("Option 8."))
		.addStringOption((option) =>
			option.setName("option9")
				.setDescription("Option 9."))
		.addStringOption((option) =>
			option.setName("option10")
				.setDescription("Option 10.")
		),
    async execute(interaction) {
		const timeRegex = new RegExp('^[0-9]+[w,d,h,m]$');
		let choices = "";
		let question = interaction.options.getString("question", true);
		let time = interaction.options.getString("time");
		let text = interaction.options.getString("text", false) ?? "";
		let options = interaction.options.data.filter((opt) => {
			return opt.name.startsWith("option");
		});

		/** 1. Validate input */
		 if (!timeRegex.test(time)) {
			await interaction.reply("Invalid time format, look into this command's usage.");
			return;
		}

		if (options.length < 2) {
			await interaction.reply("The vote must have at least two options.");
			return;
		}

		/** 2. Create embed message to display vote */
		for (let i = 0; i < options.length; i++) {
			choices += `\n${i+1}: ${options[i].value}`;
		}

		const voteEmbed = new MessageEmbed()
			.setColor('#fe8b68')
			.setTitle(question)
			.setAuthor({
				name: `${interaction.user.username} has started a vote!`,
				iconURL: interaction.user.avatarURL()})
			.setDescription(text)
			.addField("Choices", choices)
			.setTimestamp()
			.setFooter({ text: "", iconURL: interaction.client.user.avatarURL()});

		const message = await interaction.reply({
			text: text,
			embeds: [voteEmbed],
			fetchReply: true});

		/** 3. React with available reaction options */
		for (let i = 0; i < options.length; i++) {
			await message.react(numberEmojis.get(i+1));
		}

		/** Convert time to a timeout in milliseconds */
		let quantity = time.substring(0, time.length - 1);
		let unit = time.slice(-1);
		let timeout = moment.duration(quantity, unit).asMilliseconds();

		createVote(message, timeout);
	},
};
