const { SlashCommandBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ayudaproyecto')
        .setDescription('Pide ayuda para tu proyecto.'),

    async execute(interaction) {
        try {
            const { guild, member } = interaction;

            const directorRole = guild.roles.cache.find(role => role.id === config.ROL_DIRECTOR_PROYECTO);
            if (!directorRole) {
                return interaction.reply({ content: "❌ No se encontró el rol 'Director de Proyecto'.", ephemeral: true });
            }

            if (!member.roles.cache.has(directorRole.id)) {
                return interaction.reply({ content: "🚫 No tienes permisos para usar este comando.", ephemeral: true });
            }

            const unirseRole = guild.roles.cache.find(role => role.id === config.ROL_UNIRSE_PROYECTO);
            if (!unirseRole) {
                return interaction.reply({ content: "❌ No se encontró el rol 'unirse a proyecto'.", ephemeral: true });
            }

            await interaction.reply({ content: `📢 ¡Atención ${unirseRole}, <@${member.id}> necesita ayuda con su proyecto!`, allowedMentions: { roles: [unirseRole.id] } });

        } catch (error) {
            console.error('Error ejecutando el comando pingproyecto:', error);
            await interaction.reply({ content: '❌ Ocurrió un error al ejecutar el comando.', ephemeral: true });
        }
    },
};
