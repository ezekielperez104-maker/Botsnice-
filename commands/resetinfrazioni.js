const { SlashCommandBuilder } = require('discord.js');
const ROLE_ID = '1168215840592769024';
const LOG_CHANNEL_ID = '1169637439208443985';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetinfrazioni')
    .setDescription('Resetta le infrazioni di un utente')
    .addUserOption(option =>
      option.setName('utente').setDescription('Utente di cui resettare le infrazioni').setRequired(true)
    )
    .setDefaultMemberPermissions(0),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(ROLE_ID))
      return interaction.reply({ content: '❌ Non hai il permesso!', ephemeral: true });

    const utente = interaction.options.getUser('utente');

    // Resetta le infrazioni nell'automod
    const automod = require('../events/automod');
    if (automod.infrazioni) {
      automod.infrazioni[utente.id] = 0;
    }

    interaction.reply({ content: `✅ Infrazioni di **${utente.tag}** resettate!` });

    const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) logChannel.send({
      embeds: [{
        title: '📋 Log - Reset Infrazioni',
        fields: [
          { name: '👤 Utente', value: `${utente} (${utente.id})`, inline: true },
          { name: '🛡️ Moderatore', value: `${interaction.user}`, inline: true }
        ],
        color: 0x00FF00,
        timestamp: new Date()
      }]
    });
  }
};
