const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mensaje')
        .setDescription('Envía un mensaje a un canal específico.'),

    async execute(interaction) {
        try {
            // Enviar el mensaje al canal
            await interaction.reply(` Ya deberíais ser capaz de escribir aquí. Este mensaje permanecerá aquí para que recuerdes los beneficios de ostentar con el canal. Podemos eliminarlo si lo deseas.\n\n **Recuerda que cuentas con los siguientes beneficios:**\n - Crear hilos en el canal\n - Fijar mensajes\n - Crear encuestas\n - Usar <#1161383380093521940> para pedir ayuda y gente se una a tu proyecto.\n _¡Recordar pasar contenido  antes de __una semana__ **para que no tengamos que archivar el canal por estar vacío!**_ \n **--**\n _Después de esos  primeros avances pasaréis a tener 4 semanas de margen como todo el mundo. Más info en_ <#717006470272516157>`);

        } catch (error) {
            console.error(error);
            await interaction.reply('❌ Hubo un error al enviar el mensaje.');
        }
    },
};
