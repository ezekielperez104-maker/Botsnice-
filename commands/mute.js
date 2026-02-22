const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ROLE_ID = '1168215840592769024';
const LOG_CHANNEL_ID = '1169637439208443985';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Muta un utente in timeout')
    .addUserOption(option =>
      option.setName('utente').setDescription('Utente da mutare').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('minuti').setDescription('Durata in minuti').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo').setDescription('Motivo del mute').setRequired(false)
    )
    .setDefaultMemberPermissions(0),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(ROLE_ID))
      return interaction.reply({ content: '❌ Non hai il permesso!', ephemeral: true });

    const utente = interaction.options.getUser('utente');
    const minuti = interaction.options.getInteger('minuti');
    const motivo = interaction.options.getString('motivo') || 'Nessun motivo';
    const member = interaction.guild.members.cache.get(utente.id);

    await member.timeout(minuti * 60 * 1000, motivo);
    interaction.reply({ content: `✅ **${utente.tag}** mutato per ${minuti} minuti. Motivo: ${motivo}`, ephemeral: true });

    const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) logChannel.send({
      embeds: [new EmbedBuilder()
        .setTitle('📋 Log - Mute')
        .addFields(
          { name: '👤 Utente', value: `${utente} (${utente.id})`, inline: true },
          { name: '🛡️ Moderatore', value: `${interaction.user}`, inline: true },
          { name: '⏱️ Durata', value: `${minuti} minuti`, inline: true },
          { name: '📝 Motivo', value: motivo }
        )
        .setColor(0xFF8C00)
        .setTimestamp()]
    });
  }
};
