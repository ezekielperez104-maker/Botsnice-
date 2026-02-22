const { SlashCommandBuilder, ChannelType } = require('discord.js');
const ROLE_ID = '1168215840592769024';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('creacanale')
    .setDescription('Crea un canale vocale o testuale')
    .addStringOption(option =>
      option.setName('emoji').setDescription('Emoji del canale').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('nome').setDescription('Nome del canale').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('tipo').setDescription('Tipo di canale').setRequired(true)
        .addChoices(
          { name: 'Vocale', value: 'vocale' },
          { name: 'Testuale', value: 'testuale' }
        )
    )
    .addChannelOption(option =>
      option.setName('categoria').setDescription('Categoria dove creare il canale').setRequired(true)
    )
    .setDefaultMemberPermissions(0),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(ROLE_ID))
      return interaction.reply({ content: '❌ Non hai il permesso!', ephemeral: true });

    const emoji = interaction.options.getString('emoji');
    const nome = interaction.options.getString('nome');
    const tipo = interaction.options.getString('tipo');
    const categoria = interaction.options.getChannel('categoria');

    const nomeFinale = `${emoji}┃${nome}`;

    const canale = await interaction.guild.channels.create({
      name: nomeFinale,
      type: tipo === 'vocale' ? ChannelType.GuildVoice : ChannelType.GuildText,
      parent: categoria.id
    });

    interaction.reply({ content: `✅ Canale **${nomeFinale}** creato! ${canale}`, ephemeral: true });
  }
};
