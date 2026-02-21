const { Client, GatewayIntentBits, REST, Routes, Collection } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// Carica i comandi
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
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
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  await command.execute(interaction);
});

client.login(process.env.TOKEN);
