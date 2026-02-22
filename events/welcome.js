const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const canale = member.guild.channels.cache.find(c => c.name === 'benvenuto');
    if (!canale) return;

    const embed = new EmbedBuilder()
      .setDescription(`Benvenuto/a ${member}!\n\nSiamo felici di averti con noi, prenditi un po' di tempo per leggere le regole e presentati alla community. Buona permanenza! 🎉`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setColor(0xFFFF00)
      .setFooter({ text: `Membro #${member.guild.memberCount}` });

    await canale.send({ content: `Benvenuto/a ${member}!`, embeds: [embed] });
  }
};
