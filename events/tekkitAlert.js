const { EmbedBuilder } = require('discord.js');
const ALERT_CHANNEL_ID = '1475179611116535952';
const USER_ID = '948947793874133053';
const MINUTI_INATTIVITA = 10;

let timerInattivita = null;

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (!message.webhookId) return;

    const contenutoEmbed = JSON.stringify(message.embeds)?.toLowerCase() || '';
    const contenutoMessaggio = message.content?.toLowerCase() || '';
    const tutto = contenutoMessaggio + contenutoEmbed;

    if (!tutto.includes('tekkit rewards logger')) return;

    // Reset timer inattività
    if (timerInattivita) clearTimeout(timerInattivita);

    timerInattivita = setTimeout(async () => {
      const alertChannel = message.guild?.channels.cache.get(ALERT_CHANNEL_ID);
      if (!alertChannel) return;

      alertChannel.send({
        content: `<@${USER_ID}>`,
        embeds: [new EmbedBuilder()
          .setTitle('⚠️ Webhook Inattivo!')
          .setDescription(`Il webhook di **Tekkit** non manda messaggi da **${MINUTI_INATTIVITA} minuti**!\n\nControlla se il gioco è ancora attivo! 🔴`)
          .setColor(0xFF0000)
          .setTimestamp()]
      });
    }, MINUTI_INATTIVITA * 60 * 1000);

    // Controlla Special Rewards
    // Cerca la parte dopo "special rewards" e controlla se è none
    const indice = tutto.indexOf('special rewards');
    if (indice === -1) return;

    const dopoSpecial = tutto.substring(indice + 15, indice + 60).trim();
    if (dopoSpecial.includes('none')) return;

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
