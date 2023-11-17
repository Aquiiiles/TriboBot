const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Conectar o bot a um canal de voz'),

    async execute(interaction) {
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply('Você precisa estar em um canal de voz para que eu possa me conectar.');
        }

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            // Adicione lógica adicional conforme necessário, por exemplo, eventos na conexão.
            connection.on('stateChange', (state) => {
                console.log(`O estado da conexão mudou: ${state.status}`);
            });

            return interaction.reply(`Conectado com sucesso ao canal de voz: ${voiceChannel.name}`);
        } catch (e) {
            console.error(`Erro ao conectar ao canal de voz: ${e.message}`);
            return interaction.reply('Erro ao conectar ao canal de voz.');
        }
    },
};
