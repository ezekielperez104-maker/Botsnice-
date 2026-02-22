const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const LOG_CHANNEL_ID = '1169637439208443985';

module.exports = {
  name: 'messageDelete',
  async execute(message) {
    if (message.author?.bot) return;

    const logChannel = message.guild?.channels.cache.get(LOG_CHANNEL_ID);
    if (!logChannel) return;

    logChannel.send({
      embeds: [new EmbedBuilder()
        .setTitle('🗑️ Messaggio Eliminato')
        .addFields(
          { name: '👤 Utente', value: `${message.author} (${message.author?.id})`, inline: true },
          { name: '📌 Canale', value: `${message.channel}`, inline: true },
          { name: '💬 Messaggio', value: message.content || 'non disponibile' }
        )
        .setColor(0xFF0000)
        .setTimestamp()]
    });
  }
};
