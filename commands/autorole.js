const { SlashCommandBuilder } = require('discord.js');
const ROLE_ID = '1168215840592769024';
let autoroleId = null;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('Imposta il ruolo automatico per i nuovi membri')
    .addRoleOption(option =>
      option.setName('ruolo').setDescription('Ruolo da assegnare automaticamente').setRequired(true)
    )
    .setDefaultMemberPermissions(0),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(ROLE_ID))
      return interaction.reply({ content: '❌ Non hai il permesso!', ephemeral: true });

    const ruolo = interaction.options.getRole('ruolo');
    autoroleId = ruolo.id;
    global.autoroleId = autoroleId;
    interaction.reply({ content: `✅ Autorole impostato su **${ruolo.name}**!`, ephemeral: true });
  }
};
