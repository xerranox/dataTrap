const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ThreadAutoArchiveDuration } = require('discord.js');
const config = require('../config.json');

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
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Color del rol en formato HEX (ejemplo: #FF0000 para rojo)')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario al que se le asignará el rol')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('nombre-proyecto')
                .setDescription('Nombre del proyecto que se mostrará en proyectos actuales')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('genero')
                .setDescription('Género del proyecto que se mostrará en proyectos actuales')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('descripcion')
                .setDescription('Descripcion del proyecto que se mostrará en proyectos actuales')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('imagen')
                .setDescription('Imagen del proyecto que se mostrará en proyectos actuales')
                .setRequired(true)),

    async execute(interaction) {
        const { guild } = interaction;
        const nombreCanal = interaction.options.getString('nombre');
        const nombreRol = interaction.options.getString('rol');
        const colorHex = interaction.options.getString('color');
        const usuario = interaction.options.getUser('usuario');
        const nombre_proyecto = interaction.options.getString('nombre-proyecto');
        const genero = interaction.options.getString('genero');
        const descripcion = interaction.options.getString('descripcion');
        const imagen = interaction.options.getAttachment('imagen');
        const canal_proyectos = guild.channels.cache.get(config.CANAL_PROYECTOS_ACTIVOS);
        const foro = await guild.channels.fetch(config.FORO_PROYECTOS);
        const categoriaID = config.CATEGORIA_PROYECTOS;

        /* if (!interaction.member.roles.cache.some(role => role.name === config.ROL_ADMINISTRADOR_HELPER || role.name === config.ROL_ADMINISTRADOR_ADMIN || role.name === config.ROL_ADMINISTRADOR_BOSS)) {
            return interaction.reply('❌ No tienes permisos para ejecutar este comando.');
        } */

        if (!nombreCanal || !nombreRol || !usuario) {
            return interaction.reply('❌ El nombre del canal, el nombre del rol y el usuario son necesarios.');
        }

        try {
            await interaction.deferReply();
            const categoria = guild.channels.cache.get(categoriaID);

            if (!categoria) {
                return interaction.reply('❌ La categoría no se encuentra.');
            }

            let rol = guild.roles.cache.find(r => r.name === nombreRol);
            if (!rol) {
                rol = await guild.roles.create({
                    name: nombreRol,
                    reason: 'Rol creado para acceso específico al canal',
                });
            }

            if (!/^#[0-9A-F]{6}$/i.test(colorHex)) {
                return interaction.reply({ content: '❌ Formato de color inválido. Usa un código HEX (ejemplo: #FF0000).', ephemeral: true });
            }

            const colorDecimal = parseInt(colorHex.replace('#', ''), 16);

            const nuevoCanal = await guild.channels.create({
                name: nombreCanal,
                type: 0,
                parent: categoria.id,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: rol.id,
                        allow: [PermissionsBitField.Flags.SendMessages],
                    },
                ],
            });

            const nuevoHilo = await foro.threads.create({
                name: nombre_proyecto,
                color: colorDecimal,
                message: {  // ¡Obligatorio en foros!
                    content: " ",  // Mensaje inicial (puede ser un espacio o texto)
                    files: [{
                        attachment: imagen.url,
                        name: 'hilo-imagen.png',
                    }],
                },
                autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                reason: 'Publicacion de proyecto',
            });

            /* await nuevoHilo.send({
                content: " ", // O un mensaje descriptivo
                files: [{
                    attachment: imagen.url,
                    name: 'hilo-imagen.png',
                }],
            }); */

            const miembro = await guild.members.fetch(usuario.id);
            await miembro.roles.add(rol);

            await nuevoCanal.send(`${rol} Ya deberíais ser capaz de escribir aquí. Este mensaje permanecerá aquí para que recuerdes los beneficios de ostentar con el canal. Podemos eliminarlo si lo deseas.\n\n**Recuerda que cuentas con los siguientes beneficios:**\n- Crear hilos en el canal\n- Fijar mensajes\n - Crear encuestas\n- Usar <#1161383380093521940> para pedir ayuda y gente se una a tu proyecto.\n_¡Recordar pasar contenido  antes de __una semana__ **para que no tengamos que archivar el canal por estar vacío!**_ \n**--**\n_Después de esos  primeros avances pasaréis a tener 4 semanas de margen como todo el mundo. Más info en_ <#717006470272516157>`);

            await canal_proyectos.send({
                content: `${nombre_proyecto}\nGénero: ${genero}\nProyecto de: ${usuario}\n\n${descripcion}`,
                files: [{
                    attachment: imagen.url,
                    name: 'proyecto-imagen.png',
                }],
            });

            await interaction.editReply(`✅ El canal **${nombreCanal}** ha sido creado con éxito y el rol **${rol.name}** ha sido asignado a este canal.`);

        } catch (error) {
            console.error(error);
            await interaction.followUp('❌ Hubo un error al crear el canal o el rol.');
        }
    },
};
