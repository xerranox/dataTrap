const { Client, Collection } = require("discord.js");
const client = new Client({ intents: [53575421] });

require("dotenv").config;

const config = require("./config.json");
const { loadSlash } = require("./handlers/slashHandler");

client.on("interactionCreate", async (interaction) => {
    if(!interaction.isCommands()) return;
    const cmd = client.slashCommands.get(interaction.commandName);
    if(!cmd) return;

    const args = [];
    for (let option of interaction.options.data) {
        if(option.type === 1){
            if(option.name) args.push(option.name);
            option.options?.forEach((x) => {
                if(x.value) args.push(x.value);
            });
        } else if(option.value) args.push(option.value);
    }

    cmd.execute(client, interaction, args);
})

client.slashCommands = new Collection();

(async () => {
    await client
    .login(config.TOKEN)
    .catch((err) =>
        console.error(`⪢ | Error al iniciar el bot => ${err}`)
    );
})();

client.on("ready", async () => {
    await loadSlash(client)
    .then(() => {
        console.log("⪢ | Comandos cargados con exito")
    })
    .catch((err) =>
        console.log(`⪢ | Error al cargar los comandos => ${err}`)
    );

    console.log(`⪢ | Bot encendido con la cuenta de: ${client.user.tag}`)
});
