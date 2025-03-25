const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedchannel')
        .setDescription('Menciona un canal de feedback.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('El canal que quieres mencionar.')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        if (channel) {
            await interaction.reply(`Puede dar feedback a mi proyecto aquí: <#${channel.id}>`);
        } else {
            await interaction.reply('No se encontró el canal.');
        }
    },
};