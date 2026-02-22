const { EmbedBuilder } = require('discord.js');
const ALERT_CHANNEL_ID = '1475179611116535952';
const USER_ID = '948947793874133053';
const MINUTI_INATTIVITA = 10;

let timerInattivita = null;

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (!message.webhookId) return;

    // Controlla negli embed
    const embed = message.embeds?.[0];
    if (!embed) return;

    const tuttoIlTesto = JSON.stringify(embed).toLowerCase();

    if (!tuttoIlTesto.includes('tekkit rewards logger') && !tuttoIlTesto.includes('special rewards')) return;

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

    // Controlla Special Rewards nel contenuto del messaggio
    const contenutoMessaggio = message.content?.toLowerCase() || '';
    const contenutoEmbed = JSON.stringify(message.embeds)?.toLowerCase() || '';
    const tutto = contenutoMessaggio + contenutoEmbed;

    if (!tutto.includes('special rewards')) return;
    if (tutto.includes('"none"') || tutto.includes('none\n') || tutto.includes('none"')) return;

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
