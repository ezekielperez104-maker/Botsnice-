const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ROLE_ID = '1168215840592769024';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('regole')
    .setDescription('Manda le regole del server')
    .addChannelOption(option =>
      option.setName('canale').setDescription('Canale dove mandare le regole').setRequired(true)
    )
    .setDefaultMemberPermissions(0),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(ROLE_ID))
      return interaction.reply({ content: '❌ Non hai il permesso!', ephemeral: true });

    const canale = interaction.options.getChannel('canale');

    const embed = new EmbedBuilder()
      .setTitle('📜 Regole del server')
      .setDescription(
        '• Rispetta tutti i membri del server\n\n' +
        '• Niente spam o messaggi ripetuti\n\n' +
        '• Niente pubblicità o link non autorizzati\n\n' +
        '• Usa i canali appropriati per ogni argomento\n\n' +
        '• Niente contenuti vietati ai minori\n\n' +
        '• Niente insulti, razzismo o discriminazioni\n\n' +
        '• Rispetta le decisioni dello staff\n\n' +
        '• Niente account secondari o ban evasion\n\n' +
        '• Comportati in modo maturo e civile\n\n' +
        '• Divertiti e rispetta la community! 🎉'
      )
      .setColor(0xFFFF00);

    await canale.send({ embeds: [embed] });
    interaction.reply({ content: `✅ Regole inviate in ${canale}!`, ephemeral: true });
  }
};
