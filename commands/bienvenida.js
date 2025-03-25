const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bienvenida')
        .setDescription('Dar la bienvenida al usuario.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('El usuario al que dar la bienvenida.')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        await interaction.reply(`**Bienvenido al servidor, <@${user.id}>!!!**, Si necesitas algo no dudes en contactar con algún moderador activo o con algún usuario de nuestra comunidad.`);
    },
};