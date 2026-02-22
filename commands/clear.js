const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ROLE_ID = '1168215840592769024';
const LOG_CHANNEL_ID = '1169637439208443985';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Cancella un numero di messaggi')
    .addIntegerOption(option =>
      option.setName('numero').setDescription('Quanti messaggi cancellare').setRequired(true)
        .setMinValue(1).setMaxValue(100)
    )
    .setDefaultMemberPermissions(0),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(ROLE_ID))
      return interaction.reply({ content: '❌ Non hai il permesso!', ephemeral: true });

    const numero = interaction.options.getInteger('numero');
    await interaction.reply({ content: `🗑️ Cancello ${numero} messaggi...`, ephemeral: true });
    await interaction.channel.bulkDelete(numero, true);

    const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) logChannel.send({
      embeds: [new EmbedBuilder()
        .setTitle('📋 Log - Clear')
        .addFields(
          { name: '🛡️ Moderatore', value: `${interaction.user}`, inline: true },
          { name: '📌 Canale', value: `${interaction.channel}`, inline: true },
          { name: '🗑️ Messaggi cancellati', value: `${numero}`, inline: true }
        )
        .setColor(0xFF0000)
        .setTimestamp()]
    });
  }
};
