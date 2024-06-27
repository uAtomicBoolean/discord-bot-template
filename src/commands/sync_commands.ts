import { Bot } from '@lib/bot';
import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';


export const command = new SlashCommandBuilder()
	.setName('sync_commands')
	.setDescription('Upload or refresh the commands to all the guilds.')
	.setDMPermission(false)
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addStringOption(option =>
		option.setName("guild_id")
			.setDescription("A guild's ID to refresh the commands only on the former.")
	);


/**
 * Command's handler.
 * @param inter The interaction generated by the command.
 * @param client The bot's client.
 */
export async function execute(inter: CommandInteraction, client: Bot) {
	let isInteractionUnknown = false;
	await inter.deferReply({ ephemeral: true }).catch(() => {
		isInteractionUnknown = true;
	});

	if (isInteractionUnknown) return;

	client.logger.warn('Executing the command \'sync_commands\'.', 1);
	
	const guild_id = inter.options.get("guild_id")?.value as string;
	if (guild_id)
		await client.uploadCommands(guild_id);
	else
		await client.uploadCommands();

	return inter.editReply({ content: 'Commands updated.' }).catch();
}
