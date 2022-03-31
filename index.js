const fs = require("fs");
const { Client, Intents, Collection } = require("discord.js");
const { token, visitorRoleId } = require("./config.json");
const { checkReminders } = require('./reminders.js');

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS,
    ],
});

client.commands = new Collection();
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

client.once("ready", async () => {
    console.log("Ready!");

	/** Run every minute */
	setInterval (async () => {
		console.log("Checking reminders to send out.");
		await checkReminders(client);
	}, 1000 * 60);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
});

client.on("guildMemberAdd", async (member) => {
    try {
        if (member.user.bot) return;

        let role = await member.guild.roles.fetch(visitorRoleId);
        if (!role) {
            console.error(`Couldn't find role with id ${visitorRoleId}.`);
            return;
        }

        await member.roles.add(role);
    } catch (error) {
        console.error(error);
    }
});

client.login(token);
