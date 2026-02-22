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
          name: '<:youtube:1475146188758974584> YouTube',
          value: '[Clicca qui per visitare il canale](https://youtube.com/@iulotay)',
          inline: true
        },
        {
          name: '<:tiktok:1475146012313260213> TikTok',
          value: '[Clicca qui per visitare il profilo](https://www.tiktok.com/@yatolui)',
          inline: true
        }
      )
      .setColor(0xFFFF00)
      .setFooter({ text: 'Seguici per restare aggiornato! 🔔' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('YouTube')
        .setEmoji({ id: '1475146188758974584', name: 'youtube' })
        .setURL('https://youtube.com/@iulotay')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('TikTok')
        .setEmoji({ id: '1475146012313260213', name: 'tiktok' })
        .setURL('https://www.tiktok.com/@yatolui')
        .setStyle(ButtonStyle.Link)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
