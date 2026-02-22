const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ROLE_ID = '1168215840592769024';
const LOG_CHANNEL_ID = '1169637439208443985';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Rimuove il mute da un utente')
    .addUserOption(option =>
      option.setName('utente').setDescription('Utente da smutare').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo').setDescription('Motivo dello smute').setRequired(false)
    )
    .setDefaultMemberPermissions(0),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(ROLE_ID))
      return interaction.reply({ content: '❌ Non hai il permesso!', ephemeral: true });

    const utente = interaction.options.getUser('utente');
    const motivo = interaction.options.getString('motivo') || 'Nessun motivo';
    const member = interaction.guild.members.cache.get(utente.id);

    await member.timeout(null);
    interaction.reply({ content: `✅ **${utente.tag}** non è più mutato!`, ephemeral: true });

    const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) logChannel.send({
      embeds: [new EmbedBuilder()
        .setTitle('📋 Log - Unmute')
        .addFields(
          { name: '👤 Utente', value: `${utente} (${utente.id})`, inline: true },
          { name: '🛡️ Moderatore', value: `${interaction.user}`, inline: true },
          { name: '📝 Motivo', value: motivo }
        )
        .setColor(0x00FF00)
        .setTimestamp()]
    });
  }
};
