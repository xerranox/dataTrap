const { readdirSync } = require("node:fs");

module.exports = {

    async loadSlash(client){
        for(const category of readdirSync("./slashcommands")){
            for(const otherCategory of readdirSync(`./slashcommands/${category}`)){
                for(const filename of readdirSync(`./slashcommands/${category}/${otherCategory}`).filter((file) => file.endsWith(".js"))){

                    const command = require(`../slashcommands/${category}/${otherCategory}/${filename}`);
                    client.slashCommands.set(command.name, command);
                }
            }
        }
        await client.aplication?.commands.set(client.slashCommands.map((x) => x));
    },
};