const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Muestra información sobre el servidor.'),
    async execute(interaction) {
        const { guild } = interaction;
        const serverInfo = `**Nombre del servidor:** ${guild.name}\n**Miembros:** ${guild.memberCount}\n**ID del servidor:** ${guild.id}`;
        await interaction.reply(serverInfo);
    },
};