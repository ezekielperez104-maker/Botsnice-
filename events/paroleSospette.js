const { EmbedBuilder } = require('discord.js');
const LOG_CHANNEL_ID = '1169637439208443985';
const BYPASS_IDS = ['948947793874133053'];

const pattern = [
  // Link inviti Discord
  /(discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9]+/gi,
  // Numeri di telefono
  /(\+39|0039)?\s?3[0-9]{2}\s?[0-9]{6,7}/g,
  // IP
  /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  // Link sospetti
  /(https?:\/\/(?!youtube\.com|tiktok\.com|discord\.com)[^\s]+)/gi
];

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;
    if (BYPASS_IDS.includes(message.author.id)) return;

    const contenuto = message.content;

    const trovato = pattern.some(p => p.test(contenuto));
    if (!trovato) return;

    await message.delete().catch(() => {});

    const avviso = await message.channel.send({
      embeds: [new EmbedBuilder()
        .setDescription(`⚠️ ${message.author} il tuo messaggio conteneva contenuto non autorizzato ed è stato eliminato!`)
        .setColor(0xFF0000)]
    });
    setTimeout(() => avviso.delete().catch(() => {}), 5000);

    const logChannel = message.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) logChannel.send({
      embeds: [new EmbedBuilder()
        .setTitle('🚨 Contenuto Sospetto Rilevato')
        .addFields(
          { name: '👤 Utente', value: `${message.author} (${message.author.id})`, inline: true },
          { name: '📌 Canale', value: `${message.channel}`, inline: true },
          { name: '💬 Messaggio', value: contenuto || 'non disponibile' }
        )
        .setColor(0xFF0000)
        .setTimestamp()]
    });
  }
};
