const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mentionrole')
        .setDescription('Menciona un rol específico.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('El rol que quieres mencionar.')
                .setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        if (role) {
            await interaction.reply(`<@&${role.id}>`);
        } else {
            await interaction.reply('No se encontró el rol.');
        }
    },
};

/* if (!interaction.member.roles.cache.some(role => role.name === 'Administrador')) {
    return interaction.reply('No tienes permisos para ejecutar este comando.');
} */