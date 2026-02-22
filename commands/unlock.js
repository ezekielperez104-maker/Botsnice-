const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ROLE_ID = '1168215840592769024';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Sblocca un canale')
    .addChannelOption(option =>
      option.setName('canale').setDescription('Canale da sbloccare').setRequired(false)
    )
    .setDefaultMemberPermissions(0),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(ROLE_ID))
      return interaction.reply({ content: '❌ Non hai il permesso!', ephemeral: true });

    const canale = interaction.options.getChannel('canale') || interaction.channel;
    await canale.permissionOverwrites.edit(interaction.guild.id, {
      SendMessages: null
    });
    interaction.reply({ content: `🔓 Canale ${canale} sbloccato!` });
  }
};
