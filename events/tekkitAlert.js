const { EmbedBuilder } = require('discord.js');
const ALERT_CHANNEL_ID = '1475179611116535952';
const USER_ID = '948947793874133053';
const MINUTI_INATTIVITA = 10;

let timerInattivita = null;

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (!message.webhookId) return;

    const embed = message.embeds?.[0];
    if (!embed) return;

    const titolo = embed.title?.toLowerCase() || '';
    const descrizione = embed.description?.toLowerCase() || '';
    const campi = embed.fields?.map(f => f.name + ' ' + f.value).join(' ').toLowerCase() || '';
    const tutto = titolo + descrizione + campi;

    if (!tutto.includes('tekkit rewards logger') && !tutto.includes('special rewards')) return;

    // Reset timer inattività
    if (timerInattivita) clearTimeout(timerInattivita);
    timerInattivita = setTimeout(async () => {
      const alertChannel = message.guild?.channels.cache.get(ALERT_CHANNEL_ID);
      if (!alertChannel) return;
      alertChannel.send({
        content: `<@${USER_ID}>`,
        embeds: [new EmbedBuilder()
          .setTitle('⚠️ Webhook Inattivo!')
          .setDescription(`Il webhook di **Tekkit** non manda messaggi da **${MINUTI_INATTIVITA} minuti**! 🔴`)
          .setColor(0xFF0000)
          .setTimestamp()]
      });
    }, MINUTI_INATTIVITA * 60 * 1000);

    // Trova il campo Special Rewards
    const campoSpecial = embed.fields?.find(f => f.name?.toLowerCase().includes('special rewards'));
    
    // Se non trova il campo controlla nel testo del messaggio
    const testoMessaggio = message.content?.toLowerCase() || '';
    
    if (campoSpecial) {
      // Ha trovato il campo, controlla se il valore è none
      if (campoSpecial.value?.toLowerCase().trim() === 'none') return;
    } else {
      // Cerca nel testo normale
      const indice = testoMessaggio.indexOf('special rewards');
      if (indice === -1) return;
      const dopoSpecial = testoMessaggio.substring(indice + 15, indice + 60).trim();
      if (dopoSpecial.includes('none')) return;
    }

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
