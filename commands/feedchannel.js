const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedchannel')
        .setDescription('Menciona un canal de feedback.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('El canal que quieres mencionar.')
                .setRequired(true)),

    async execute(interaction) {
        const { guild, member } = interaction;
        const channel = interaction.options.getChannel('channel');

        const directorRole = guild.roles.cache.find(role => role.id === config.ROL_DIRECTOR_PROYECTO);
        if (!directorRole) {
            return interaction.reply({ content: "❌ No se encontró el rol 'Director de Proyecto'.", ephemeral: true });
        }

        if (!member.roles.cache.has(directorRole.id)) {
            return interaction.reply({ content: "🚫 No tienes permisos para usar este comando.", ephemeral: true });
        }

        if (channel && channel.isThread()) {
            await interaction.reply(`Puede dar feedback a mi proyecto aquí: <#${channel.id}>`);
        } else {
            await interaction.reply('❌ El canal seleccionado no es un canal de foro.');
        }
    },
};
