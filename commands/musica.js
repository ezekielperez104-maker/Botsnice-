const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const ROLE_ID = '1168215840592769024';

let distube = null;

function getDistube(client) {
  if (!distube) {
    distube = new DisTube(client, {
      plugins: [new YtDlpPlugin()]
    });

    distube.on('playSong', (queue, song) => {
      queue.textChannel?.send({
        embeds: [new EmbedBuilder()
          .setTitle('🎵 Ora in riproduzione')
          .setDescription(`**${song.name}**\nDurata: ${song.formattedDuration}`)
          .setThumbnail(song.thumbnail)
          .setColor(0xFFFF00)]
      });
    });

    distube.on('addSong', (queue, song) => {
      queue.textChannel?.send({
        embeds: [new EmbedBuilder()
          .setTitle('➕ Aggiunto alla coda')
          .setDescription(`**${song.name}**\nDurata: ${song.formattedDuration}`)
          .setColor(0xFFFF00)]
      });
    });

    distube.on('error', (channel, error) => {
      channel?.send(`❌ Errore: ${error.message}`);
    });
  }
  return distube;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('musica')
    .setDescription('Sistema musicale')
    .addSubcommand(sub =>
      sub.setName('play').setDescription('Suona una canzone')
        .addStringOption(o => o.setName('canzone').setDescription('Nome o link della canzone').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('skip').setDescription('Salta la canzone corrente')
    )
    .addSubcommand(sub =>
      sub.setName('stop').setDescription('Ferma la musica e svuota la coda')
    )
    .addSubcommand(sub =>
      sub.setName('pause').setDescription('Mette in pausa la musica')
    )
    .addSubcommand(sub =>
      sub.setName('resume').setDescription('Riprende la musica')
    )
    .addSubcommand(sub =>
      sub.setName('queue').setDescription('Mostra la coda')
    )
    .addSubcommand(sub =>
      sub.setName('volume').setDescription('Cambia il volume')
        .addIntegerOption(o => o.setName('valore').setDescription('Volume da 1 a 100').setRequired(true).setMinValue(1).setMaxValue(100))
    ),

  async execute(interaction) {
    const dt = getDistube(interaction.client);
    const sub = interaction.options.getSubcommand();
    const voiceChannel = interaction.member?.voice?.channel;

    if (sub === 'play') {
      if (!voiceChannel)
        return interaction.reply({ content: '❌ Devi essere in un canale vocale!', ephemeral: true });

      const canzone = interaction.options.getString('canzone');
      await interaction.deferReply({ ephemeral: true });

      try {
        await dt.play(voiceChannel, canzone, {
          member: interaction.member,
          textChannel: interaction.channel
        });
        interaction.editReply({ content: `✅ Ricerca in corso: **${canzone}**` });
      } catch (e) {
        interaction.editReply({ content: `❌ Errore: ${e.message}` });
      }
      return;
    }

    const queue = dt.getQueue(interaction.guild);

    if (sub === 'skip') {
      if (!queue) return interaction.reply({ content: '❌ Nessuna canzone in riproduzione!', ephemeral: true });
      await queue.skip();
      interaction.reply({ content: '⏭️ Canzone saltata!', ephemeral: true });
    }

    if (sub === 'stop') {
      if (!queue) return interaction.reply({ content: '❌ Nessuna canzone in riproduzione!', ephemeral: true });
      await queue.stop();
      interaction.reply({ content: '⏹️ Musica fermata!', ephemeral: true });
    }

    if (sub === 'pause') {
      if (!queue) return interaction.reply({ content: '❌ Nessuna canzone in riproduzione!', ephemeral: true });
      queue.pause();
      interaction.reply({ content: '⏸️ Musica in pausa!', ephemeral: true });
    }

    if (sub === 'resume') {
      if (!queue) return interaction.reply({ content: '❌ Nessuna canzone in riproduzione!', ephemeral: true });
      queue.resume();
      interaction.reply({ content: '▶️ Musica ripresa!', ephemeral: true });
    }

    if (sub === 'volume') {
      if (!queue) return interaction.reply({ content: '❌ Nessuna canzone in riproduzione!', ephemeral: true });
      const volume = interaction.options.getInteger('valore');
      queue.setVolume(volume);
      interaction.reply({ content: `🔊 Volume impostato a **${volume}%**!`, ephemeral: true });
    }

    if (sub === 'queue') {
      if (!queue) return interaction.reply({ content: '❌ Nessuna canzone in riproduzione!', ephemeral: true });
      const songs = queue.songs.map((s, i) => `${i + 1}. **${s.name}** - ${s.formattedDuration}`).join('\n');
      interaction.reply({
        embeds: [new EmbedBuilder()
          .setTitle('🎵 Coda musicale')
          .setDescription(songs || 'Coda vuota')
          .setColor(0xFFFF00)],
        ephemeral: true
      });
    }
  }
};
