const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// Connexion du bot Discord
client.once('ready', () => {
    console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
});

// Middleware pour lire les données JSON
app.use(express.json());

// Route Webhook pour attribuer le rôle "citoyens"
app.post('/webhook', async (req, res) => {
    const discordId = req.body.discordName; // ⚠️ reste 'discordName' pour correspondre à Google Script
    if (!discordId) return res.status(400).send("❌ ID Discord manquant");

    try {
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const member = await guild.members.fetch(discordId);

        if (!member) return res.status(404).send("❌ Utilisateur non trouvé");

        const role = guild.roles.cache.find(role => role.name === "citoyens");
        if (!role) return res.status(404).send("❌ Rôle 'citoyens' non trouvé");

        await member.roles.add(role);
        console.log(`✅ Rôle ajouté à ${member.user.tag}`);
        res.send("✅ Rôle ajouté avec succès");
    } catch (err) {
        console.error("❌ Erreur lors de l’ajout du rôle :", err);
        res.status(500).send("Erreur serveur");
    }
});

// Lancement du serveur Express
app.listen(port, () => {
    console.log(`🚀 Serveur d'écoute lancé sur le port ${port}`);
});

// Connexion à Discord
client.login(process.env.BOT_TOKEN);
