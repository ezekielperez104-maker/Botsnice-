const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const ROLE_ID = '1168215840592769024';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Cancella un numero di messaggi')
    .addIntegerOption(option =>
      option.setName('numero')
        .setDescription('Quanti messaggi vuoi cancellare')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),

  async execute(interaction) {
    const hasRole = interaction.member.roles.cache.has(ROLE_ID);
    if (!hasRole) {
      return interaction.reply({
        content: '❌ Non hai il permesso per usare questo comando!',
        ephemeral: true
      });
    }

    const numero = interaction.options.getInteger('numero');
    await interaction.reply({
      content: `🗑️ Cancello ${numero} messaggi...`,
      ephemeral: true
    });

    await interaction.channel.bulkDelete(numero, true);
  }
};
