const { SlashCommandBuilder, ChannelType } = require('discord.js');
const ROLE_ID = '1168215840592769024';

const CATEGORIE = {
  'Informazioni': '1168210017309163662',
  'Community': '1168971934344675340',
  'Codm': '1169294498392703118',
  'Assistenza': '1170654541222522900'
};

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
    .addStringOption(option =>
      option.setName('categoria').setDescription('Categoria dove creare il canale').setRequired(true)
        .addChoices(
          { name: 'Informazioni', value: '1168210017309163662' },
          { name: 'Community', value: '1168971934344675340' },
          { name: 'Codm', value: '1169294498392703118' },
          { name: 'Assistenza', value: '1170654541222522900' }
        )
    )
    .setDefaultMemberPermissions(0),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(ROLE_ID))
      return interaction.reply({ content: '❌ Non hai il permesso!', ephemeral: true });

    const emoji = interaction.options.getString('emoji');
    const nome = interaction.options.getString('nome');
    const tipo = interaction.options.getString('tipo');
    const categoriaId = interaction.options.getString('categoria');

    const nomeFinale = `${emoji}┃${nome}`;

    const canale = await interaction.guild.channels.create({
      name: nomeFinale,
      type: tipo === 'vocale' ? ChannelType.GuildVoice : ChannelType.GuildText,
      parent: categoriaId
    });

    interaction.reply({ content: `✅ Canale **${nomeFinale}** creato! ${canale}`, ephemeral: true });
  }
};
