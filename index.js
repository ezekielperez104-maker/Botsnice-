const { Client, GatewayIntentBits, REST, Routes, Collection, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const ROLE_ID = '1168215840592769024';

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.execute(...args));
}

client.once('ready', async () => {
  console.log(`Bot online come ${client.user.tag}`);

  const commands = client.commands.map(c => c.data.toJSON());
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  await rest.put(
    Routes.applicationCommands(client.user.id),
    { body: commands }
  );
  console.log('Comandi registrati!');
});

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    await command.execute(interaction);
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'apri_ticket') {
      const guild = interaction.guild;
      const utente = interaction.user;

      const esistente = guild.channels.cache.find(c => c.name === `ticket-${utente.username}`);
      if (esistente) {
        return interaction.reply({ content: `❌ Hai già un ticket aperto: ${esistente}`, ephemeral: true });
      }

      const categoria = guild.channels.cache.find(c => c.name === 'Assistenza' && c.type === 4);

      const canale = await guild.channels.create({
        name: `ticket-${utente.username}`,
        parent: categoria ? categoria.id : null,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: utente.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
          },
          {
            id: ROLE_ID,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
          }
        ]
      });

      const embed = new EmbedBuilder()
        .setTitle('🎫 Ticket aperto')
        .setDescription(`Ciao ${utente}! Lo staff ti risponderà il prima possibile.\n\nPer chiudere il ticket usa il pulsante qui sotto.`)
        .setColor(0xFFFF00);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('chiudi_ticket')
          .setLabel('🔒 Chiudi ticket')
          .setStyle(ButtonStyle.Danger)
      );

      await canale.send({ embeds: [embed], components: [row] });
      interaction.reply({ content: `✅ Ticket creato: ${canale}`, ephemeral: true });
    }

    if (interaction.customId === 'chiudi_ticket') {
      await interaction.reply({ content: '🔒 Ticket chiuso, canale eliminato tra 5 secondi...', ephemeral: true });
      setTimeout(() => interaction.channel.delete(), 5000);
    }
  }
});

const http = require('http');
http.createServer((req, res) => {
  res.write('Bot online!');
  res.end();
}).listen(3000, () => console.log('Server attivo sulla porta 3000'));

client.login(process.env.TOKEN);
