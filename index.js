const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');
const fs = require('fs');
const path = require('path');

// Crear el cliente de Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Cargar todos los comandos de la carpeta 'commands'
client.commands = new Collection();

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } catch (error) {
        console.error(`Error cargando el comando ${file}:`, error);
    }
}

// Registrar los comandos en Discord
const rest = new REST({ version: '9' }).setToken(config.TOKEN);

(async () => {
    try {
        console.log('Empezando a registrar los comandos Slash...');

        await rest.put(
            Routes.applicationGuildCommands(config.APP_ID, config.GUILD_ID),
            { body: commands },
        );

        console.log('Comandos registrados exitosamente!');
    } catch (error) {
        console.error(error);
    }
})();

// Cuando el bot está listo
client.once('ready', () => {
    console.log(`¡El bot ha iniciado sesión como ${client.user.tag}!`);
});

// Responder a los comandos Slash
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        return interaction.reply({ content: 'Este comando no existe.', ephemeral: true });
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
    }
});

// Iniciar sesión con el token
client.login(config.TOKEN);