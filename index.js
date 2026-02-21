const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot online come ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  if (message.content === '!ciao') {
    message.reply('Ciao! 👋');
  }

  if (message.content === '!ping') {
    message.reply('Pong! 🏓');
  }
});

client.login(process.env.TOKEN);
