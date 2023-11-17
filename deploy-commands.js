// deploy-commands.js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

// Remova a linha abaixo se você não estiver usando o módulo 'playlist'
// const playlist = require('./playlist');

// Ajuste esta parte conforme necessário para definir seus comandos manualmente
const commands = [
  {
    name: 'command1',
    description: 'Description for command1',
    // ... outros campos
  },
  {
    name: 'command2',
    description: 'Description for command2',
    // ... outros campos
  },
  // ... adicione mais comandos conforme necessário
];

const rest = new REST({ version: '9' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
