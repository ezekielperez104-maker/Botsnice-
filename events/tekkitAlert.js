const { EmbedBuilder } = require('discord.js');
const ALERT_CHANNEL_ID = '1475179611116535952';
const USER_ID = '948947793874133053';

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (!message.webhookId) return;

    const contenuto = message.content + (message.embeds?.map(e => e.description + e.fields?.map(f => f.value).join(' ')).join(' ') || '');

    if (!contenuto.includes('Special Rewards')) return;
    if (contenuto.toLowerCase().includes('none')) return;

    const alertChannel = message.guild?.channels.cache.get(ALERT_CHANNEL_ID);
    if (!alertChannel) return;

    alertChannel.send({
      content: `<@${USER_ID}>`,
      embeds: [new EmbedBuilder()
        .setTitle('🎁 Special Reward Trovato!')
        .setDescription(`È apparso un **Special Reward** nel canale ${message.channel}!\n\nVai a controllare subito! 🎉`)
        .setColor(0xFFFF00)
        .setTimestamp()]
    });
  }
};
