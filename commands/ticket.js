const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const ROLE_ID = '1168215840592769024';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Manda il pannello ticket in un canale')
    .addChannelOption(option =>
      option.setName('canale').setDescription('Canale dove mandare il pannello').setRequired(true)
    )
    .setDefaultMemberPermissions(0),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(ROLE_ID))
      return interaction.reply({ content: '❌ Non hai il permesso!', ephemeral: true });

    const canale = interaction.options.getChannel('canale');

    const embed = new EmbedBuilder()
      .setTitle('🟢 SISTEMA ATTIVO')
      .setDescription('Utilizza il pulsante qui sotto per ricevere assistenza da un membro dello staff. Assicurati di aver letto il messaggio qui sopra per ulteriori informazioni.\n\n> ℹ️ Una volta premuto il pulsante sottostante, verrà creato il tuo ticket nell\'elenco di canali a sinistra')
      .setColor(0x2ecc71);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('apri_ticket')
        .setLabel('🎫 Apri un ticket')
        .setStyle(ButtonStyle.Secondary)
    );

    await canale.send({ embeds: [embed], components: [row] });
    interaction.reply({ content: `✅ Pannello ticket inviato in ${canale}!`, ephemeral: true });
  }
};
