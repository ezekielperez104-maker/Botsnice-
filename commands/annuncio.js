const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ROLE_ID = '1168215840592769024';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('annuncio')
    .setDescription('Manda un annuncio')
    .addChannelOption(option =>
      option.setName('canale').setDescription('Canale dove mandare l annuncio').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('titolo').setDescription('Titolo dell annuncio').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('testo').setDescription('Testo dell annuncio').setRequired(true)
    )
    .setDefaultMemberPermissions(0),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(ROLE_ID))
      return interaction.reply({ content: '❌ Non hai il permesso!', ephemeral: true });

    const canale = interaction.options.getChannel('canale');
    const titolo = interaction.options.getString('titolo');
    const testo = interaction.options.getString('testo');

    const embed = new EmbedBuilder()
      .setTitle(`📢 ${titolo}`)
      .setDescription(testo)
      .setColor(0xFFFF00)
      .setTimestamp();

    await canale.send({ embeds: [embed] });
    interaction.reply({ content: `✅ Annuncio inviato in ${canale}!`, ephemeral: true });
  }
};
