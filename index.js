
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once('ready', () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
});

app.use(express.json());

app.post('/webhook', async (req, res) => {
    const discordName = req.body.discordName;
    if (!discordName) return res.status(400).send("discordName manquant");

    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const members = await guild.members.fetch();
    const member = members.find(m => m.user.tag === discordName);

    if (!member) return res.status(404).send("Utilisateur non trouvé");

    const role = guild.roles.cache.find(role => role.name === "citoyens");
    if (!role) return res.status(404).send("Rôle 'citoyens' non trouvé");

    await member.roles.add(role);
    res.send("Rôle ajouté");
});

client.login(process.env.BOT_TOKEN);

app.listen(port, () => {
    console.log(`Serveur d'écoute lancé sur le port ${port}`);
});
