const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crearproyecto')
        .setDescription('Crea un canal con un rol específico, y asigna ese rol al canal.')
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('Nombre del nuevo canal')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('rol')
                .setDescription('Nombre del rol que se creará y se asignará al canal')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario al que se le asignará el rol')
                .setRequired(true)),

    async execute(interaction) {
        const { guild } = interaction;
        const nombreCanal = interaction.options.getString('nombre'); // Obtiene el nombre del canal
        const nombreRol = interaction.options.getString('rol'); // Obtiene el nombre del rol
        const usuario = interaction.options.getUser('usuario'); // Obtiene el usuario al que se asignará el rol

        if (!nombreCanal || !nombreRol || !usuario) {
            return interaction.reply('❌ El nombre del canal, el nombre del rol y el usuario son necesarios.');
        }

        try {
            // Crear un rol con el nombre proporcionado si no existe
            let rol = guild.roles.cache.find(r => r.name === nombreRol);
            if (!rol) {
                rol = await guild.roles.create({
                    name: nombreRol,
                    reason: 'Rol creado para acceso específico al canal',
                });
            }

            // Crear un canal de texto con permisos específicos para el rol
            const nuevoCanal = await guild.channels.create({
                name: nombreCanal,
                type: 0, // Canal de texto
                permissionOverwrites: [
                    {
                        id: guild.id, // Permisos por defecto para todos
                        deny: [PermissionsBitField.Flags.SendMessages], // No ver el canal por defecto
                    },
                    {
                        id: rol.id, // Asignamos permisos al rol creado
                        allow: [PermissionsBitField.Flags.SendMessages], // Permitir ver y escribir
                    },
                ],
            });

            // Asignar el rol creado al usuario seleccionado
            const miembro = await guild.members.fetch(usuario.id);
            await miembro.roles.add(rol);

            // Enviar un mensaje al canal recién creado
            await nuevoCanal.send(`${rol} Ya deberíais ser capaz de escribir aquí. Este mensaje permanecerá aquí para que recuerdes los beneficios de ostentar con el canal. Podemos eliminarlo si lo deseas.\n **Recuerda que cuentas con los siguientes beneficios:**\n - Crear hilos en el canal\n - Fijar mensajes\n - Crear encuestas\n - Usar <#1161383380093521940> para pedir ayuda y gente se una a tu proyecto.\n_¡Recordar pasar contenido  antes de __una semana__ **para que no tengamos que archivar el canal por estar vacío!**_ \n **--**\n _Después de esos  primeros avances pasaréis a tener 4 semanas de margen como todo el mundo. Más info en_ <#717006470272516157>`);

            await interaction.reply(`✅ El canal **${nombreCanal}** ha sido creado con éxito y el rol **${rol.name}** ha sido asignado a este canal.`);

        } catch (error) {
            console.error(error);
            await interaction.reply('❌ Hubo un error al crear el canal o el rol.');
        }
    },
};
