const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('social')
    .setDescription('Mostra i social del server'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🌐 I nostri Social')
      .setDescription('Seguici sui nostri canali social per non perderti nessun contenuto!')
      .addFields(
        {
          name: '🎥 YouTube',
          value: '[Clicca qui per visitare il canale](https://youtube.com/@iulotay)',
          inline: true
        },
        {
          name: '🎵 TikTok',
          value: '[Clicca qui per visitare il profilo](https://www.tiktok.com/@yatolui)',
          inline: true
        }
      )
      .setColor(0xFFFF00)
      .setFooter({ text: 'Seguici per restare aggiornato! 🔔' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('▶️ YouTube')
        .setURL('https://youtube.com/@iulotay')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('🎵 TikTok')
        .setURL('https://www.tiktok.com/@yatolui')
        .setStyle(ButtonStyle.Link)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
  }
};
