const { EmbedBuilder } = require('discord.js');

const infrazioni = {};
module.exports.infrazioni = infrazioni;

const LOG_CHANNEL_ID = '1169637439208443985';

const parolacce = [
  'cazzo', 'vaffanculo', 'fanculo', 'stronzo', 'stronza', 'coglione',
  'cogliona', 'idiota', 'imbecille', 'deficiente', 'bastardo', 'bastarda',
  'puttana', 'troia', 'negro', 'negra', 'frocio', 'ricchione', 'ritardato',
  'mongoloide', 'down', 'disabile', 'porco dio', 'porcodio', 'dio cane',
  'dio porco', 'madonna puttana', 'cazzo di dio',
  'vaffanculo dio', 'dio bastardo', 'merda', 'figlio di puttana',
  'figlio di troia', 'vai a fanculo', 'rompicoglioni'
];

const linkVietati = /(https?:\/\/(?!youtube\.com|tiktok\.com|discord\.gg)[^\s]+)/gi;

module.exports = {
  name: 'messageCreate',
  infrazioni,
  async execute(message) {
    if (message.author.bot) return;

    const userId = message.author.id;
    if (!infrazioni[userId]) infrazioni[userId] = 0;

    const contenuto = message.content.toLowerCase();
    const haParolaccia = parolacce.some(p => contenuto.includes(p));
    const haLinkVietato = linkVietati.test(contenuto);

    if (!haParolaccia && !haLinkVietato) return;

    await message.delete().catch(() => {});
    infrazioni[userId]++;

    const logChannel = message.guild.channels.cache.get(LOG_CHANNEL_ID);

    if (infrazioni[userId] === 1) {
      const avviso = await message.channel.send({
        embeds: [new EmbedBuilder()
          .setDescription(`⚠️ ${message.author} attenzione! Infrazione **1/3**`)
          .setColor(0xFFFF00)]
      });
      setTimeout(() => avviso.delete().catch(() => {}), 5000);

      if (logChannel) logChannel.send({
        embeds: [new EmbedBuilder()
          .setTitle('📋 Log Automod - Avviso')
          .addFields(
            { name: '👤 Utente', value: `${message.author} (${message.author.id})`, inline: true },
            { name: '📌 Canale', value: `${message.channel}`, inline: true },
            { name: '⚠️ Infrazione', value: '1/3', inline: true },
            { name: '💬 Messaggio', value: message.content || 'non disponibile' }
          )
          .setColor(0xFFFF00)
          .setTimestamp()]
      });

    } else if (infrazioni[userId] === 2) {
      const member = message.guild.members.cache.get(userId);
      await member.timeout(10 * 60 * 1000, 'Automod - seconda infrazione');

      const avviso = await message.channel.send({
        embeds: [new EmbedBuilder()
          .setDescription(`🔇 ${message.author} mutato per 10 minuti! Infrazione **2/3**`)
          .setColor(0xFF8C00)]
      });
      setTimeout(() => avviso.delete().catch(() => {}), 5000);

      if (logChannel) logChannel.send({
        embeds: [new EmbedBuilder()
          .setTitle('📋 Log Automod - Mute')
          .addFields(
            { name: '👤 Utente', value: `${message.author} (${message.author.id})`, inline: true },
            { name: '📌 Canale', value: `${message.channel}`, inline: true },
            { name: '⚠️ Infrazione', value: '2/3', inline: true },
            { name: '⏱️ Durata mute', value: '10 minuti', inline: true },
            { name: '💬 Messaggio', value: message.content || 'non disponibile' }
          )
          .setColor(0xFF8C00)
          .setTimestamp()]
      });

    } else if (infrazioni[userId] >= 3) {
      const member = message.guild.members.cache.get(userId);
      await member.ban({ reason: 'Automod - terza infrazione' });
      infrazioni[userId] = 0;

      message.channel.send({
        embeds: [new EmbedBuilder()
          .setDescription(`🔨 Un utente è stato bannato per aver raggiunto **3 infrazioni**!`)
          .setColor(0xFF0000)]
      });

      if (logChannel) logChannel.send({
        embeds: [new EmbedBuilder()
          .setTitle('📋 Log Automod - Ban')
          .addFields(
            { name: '👤 Utente', value: `${message.author} (${message.author.id})`, inline: true },
            { name: '📌 Canale', value: `${message.channel}`, inline: true },
            { name: '⚠️ Infrazione', value: '3/3', inline: true },
            { name: '🔨 Azione', value: 'Ban permanente', inline: true },
            { name: '💬 Messaggio', value: message.content || 'non disponibile' }
          )
          .setColor(0xFF0000)
          .setTimestamp()]
      });
    }
  }
};
