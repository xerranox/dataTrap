const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Muestra información sobre el servidor.'),
    async execute(interaction) {
        try {
            const { guild } = interaction;

            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('**Información del Servidor**')
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .addFields(
                    { name: '🖥️ **Nombre**', value: guild.name, inline: true },
                    { name: '👥 **Miembros**', value: `${guild.memberCount}`, inline: true }
                )
                .setFooter({ text: `ID: ${guild.id}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error ejecutando el comando serverinfo:', error);
            await interaction.reply({ content: '❌ Ocurrió un error al obtener la información del servidor.', ephemeral: true });
        }
    },
};