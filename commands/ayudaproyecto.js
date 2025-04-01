const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ayudaproyecto')
        .setDescription('Pide ayuda para tu proyecto.'),

    async execute(interaction) {
        try {
            const { guild, member } = interaction;

            // Buscar el rol "Director de Proyecto"
            const directorRole = guild.roles.cache.find(role => role.id === "1023707293981872210");
            if (!directorRole) {
                return interaction.reply({ content: "❌ No se encontró el rol 'Director de Proyecto'.", ephemeral: true });
            }

            // Verificar si el usuario tiene el rol "Director de Proyecto"
            if (!member.roles.cache.has(directorRole.id)) {
                return interaction.reply({ content: "🚫 No tienes permisos para usar este comando.", ephemeral: true });
            }

            // Buscar el rol "@unirse a proyecto"
            const unirseRole = guild.roles.cache.find(role => role.id === "1350816111054160024");
            if (!unirseRole) {
                return interaction.reply({ content: "❌ No se encontró el rol 'unirse a proyecto'.", ephemeral: true });
            }

            // Enviar el mensaje mencionando al rol
            await interaction.reply({ content: `📢 ¡Atención ${unirseRole}, <@${member.id}> necesita ayuda con su proyecto!`, allowedMentions: { roles: [unirseRole.id] } });

        } catch (error) {
            console.error('Error ejecutando el comando pingproyecto:', error);
            await interaction.reply({ content: '❌ Ocurrió un error al ejecutar el comando.', ephemeral: true });
        }
    },
};
