// play.js
const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Tocar uma música do YouTube')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL do vídeo do YouTube')
                .setRequired(true)
        ),

    async execute(interaction) {
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply('Você precisa estar em um canal de voz para que eu possa tocar música.');
        }

        const url = interaction.options.getString('url');

        // Verificar se a URL do YouTube é válida
        if (!ytdl.validateURL(url)) {
            return interaction.reply('URL do YouTube inválida.');
        }

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            console.log('Conectado ao canal de voz com sucesso.');

            const player = createAudioPlayer();

            const stream = ytdl(url, { filter: 'audioonly' });
            const resource = createAudioResource(stream, {
                inputType: StreamType.Arbitrary,
                inlineVolume: 0.5, // Ajuste o volume conforme necessário (entre 0 e 1)
            });

            player.play(resource);

            connection.subscribe(player);

            interaction.reply(`Tocando música. [${url}]`).catch(error => {
                // Verifique se a interação ainda é válida
                if (error.code === 10062) {
                    console.log('A interação não é mais válida ou foi excluída.');
                } else {
                    console.error(`Erro ao responder à interação: ${error.message}`);
                }
            });
            player.once('stateChange', (oldState, newState) => {
                console.log(`O estado da reprodução mudou: ${newState.status}`);
            
                if (newState.status === AudioPlayerStatus.Playing) {
                    // Aguarde até que a reprodução esteja realmente ocorrendo antes de permitir que o bot saia
            
                    player.on(AudioPlayerStatus.Idle, () => {
                        // Remova esta verificação e a chamada para connection.destroy()
                        // Verificar se o bot ainda está no canal de voz antes de destruir a conexão
                        // if (connection.state.status !== 'destroyed') {
                        //     connection.destroy();
                        //     console.log('Conexão destruída após a conclusão da reprodução.');
                        // }
                    });
                }
            });

            player.on('error', (error) => {
                console.error(`Erro na reprodução de música: ${error.message}`);
            });
        } catch (e) {
            console.error(`Erro ao conectar ao canal de voz: ${e.message}`);
            return interaction.reply('Erro ao conectar ao canal de voz.');
        }
    },
};
