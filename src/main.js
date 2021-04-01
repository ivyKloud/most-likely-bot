const { Client } = require('discord.js')

const { bot } = require('./bot')
const control = require('./control')

const secret = require('../secret.json')

const client = new Client()

client.login(secret.DISCORD_TOKEN)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag} !`)
    client.user
        .setPresence({
            activity: { name: 'le chant du pingouin', type: 'LISTENING' },
            status: 'online',
        })
        .then()
        .catch(console.error)
    bot.setClient(client)
    bot.setGuild(client.guilds.cache.get(secret.GUILD_ID))
    control.setBot(bot)
})

client.on('message', (message) => {
    if (message.guild.id == secret.GUILD_ID && !message.author.bot) {
        if (message.content.startsWith('$set')) {
            control.onReceiveSetMsg(message)
        } else if (message.content.startsWith('$random')) {
            control.onReceiveRandomMsg(message)
        } else if (message.content.startsWith('$clear')) {
            control.onReceiveClearMsg()
        } else if (message.content.startsWith('$help')) {
            control.onReceiveHelpMsg(message)
        }
        console.log('----------------')
    }
})
