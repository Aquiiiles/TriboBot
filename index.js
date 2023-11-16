const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');


//dotenv
const dotenv = require('dotenv')
dotenv.config()
const { TOKEN, CLIENT_ID, GUILD_ID} = process.env

//importacao dos comandos
const fs = require("node:fs")
const path = require("node:path")
const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))
console.log(commandFiles)
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.commands = new Collection()

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const commands = require(filePath)
    if ("data" in commands && "execute" in commands) { 
        client.commands.set(commands.data.name, commands)
    } else {
        console.log(`Esse comando em ${filePath} está com "data" ou "execute" ausente`)
    }
}

// login do bot
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`)
})
client.login(TOKEN)

// Listenner de interacoes com o bot
client.on(Events.InteractionCreate, async interaction =>{
    if(!interaction.isChatInputCommand()) return
    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) {
        console.error("comando nao encontrando")
        return
    } 
    try {
        await command.execute(interaction)
    } catch(error) {
        console.error(error)
        await interaction.reply("Houve um erro ao executar esse comando")
    }
})