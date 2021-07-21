const { Client } = require('discord.js')

const { bot } = require('./bot')
const control = require('./control')
const misc = require('./misc')

const secret = require('../secret.json')
// const secret = require('../secret_ivy.json')

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
    const isMentioned = message.mentions.users.some(
        (user) => user.id === client.user.id
    )
    if (!message.author.bot) {
        if (message.guild.id == secret.GUILD_ID) {
            if (message.content.startsWith('$set')) {
                control.onReceiveSetMsg(message)
            } else if (message.content.startsWith('$random')) {
                control.onReceiveRandomMsg(message)
            } else if (message.content.startsWith('$clear')) {
                control.onReceiveClearMsg()
            } else if (message.content.startsWith('$help')) {
                control.onReceiveHelpMsg(message)
            } else if (message.content.startsWith('$list')) {
                control.onReceiveListMsg(message)
            } else if (message.content.startsWith('$remove')) {
                control.onReceiveRemoveMsg(message)
            }
            console.log('----------------')
        }

        if (isMentioned) {
            misc.onReceiveMention(message)
        }
        misc.onReceiveMsg(message)
    }
})
