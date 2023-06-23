import fs from "node:fs";
import path from "node:path";
import { jsonc } from "jsonc";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import { token } from "../config/token.json";

export default {
	/**
	 * @param {Discord.Client} client
	 */
	async deployCommands() {
		const commands = [];
		const commandsPath = path.join(__dirname, "commands");
		const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

		const { clientId, guildId } = jsonc.parse(fs.readFileSync(path.join(__dirname, "config/config.jsonc"), "utf8"));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const command = require(filePath);
			commands.push(command.data.toJSON());
		}

		const rest = new REST({ version: "10" }).setToken(token);

		rest
			.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
			.then(() => console.log("✅  Successfully registered application commands."))
			.catch(console.error);
	},
};
