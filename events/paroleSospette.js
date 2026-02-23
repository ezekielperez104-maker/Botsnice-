const { EmbedBuilder } = require('discord.js');
const LOG_CHANNEL_ID = '1169637439208443985';
const BYPASS_IDS = ['948947793874133053'];

const pattern = [
  /(discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9]+/gi,
  /(\+39|0039|\b3)[0-9]{8,9}\b/g,
  /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
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

    // Manda il messaggio in DM solo all'utente
    await message.author.send({
      embeds: [new EmbedBuilder()
        .setDescription(`⚠️ Il tuo messaggio nel canale ${message.channel} conteneva contenuto non autorizzato ed è stato eliminato!`)
        .setColor(0xFF0000)]
    }).catch(() => {});

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
