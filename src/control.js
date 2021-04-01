const model = require('./model')
const db = require('quick.db')

const secret = require('../secret.json')
const colors = require('./helpers/colors')

const defaultIcon = 'https://i.imgur.com/AsYSVWe.png'
const defaultUser = 'Most Likely Bot'

const control = {
    bot: null,
    setBot: (bot) => {
        this.bot = bot
        model.setTable(new db.table('MostLikely'))
    },
    
    onReceiveHelpMsg: async (message) => {
        const channelId = message.channel.id
        console.log(channelId)
        this.bot.messageChannel({
            embed: true,
            channelId: channelId,
            color: colors.yellow,
            authorName: defaultUser,
            authorIcon: defaultIcon,
            fields: [
                {
                    name: '$set [name] [emoji]',
                    value: `link an emoji to a name`,
                },
                {
                    name: '$random [phrase]',
                    value: `sends a VS [phrase] with 2 random names`,
                },
                {
                    name: '$random [number] [phrase]',
                    value: `sends a VS [phrase] with [number] random names`,
                },
                {
                    name: '$clear',
                    value: `clear all names`,
                },
            ],
        })
    },

    onReceiveSetMsg: async (message) => {
        const channelId = message.channel.id

        const msgArray = message.content.split(' ')

        const name = msgArray[1]
        const emoji = msgArray[2]

        const user = {
            name: name,
            emoji: emoji,
        }

        const id = model.getIdByName(name)

        if (id) {
            model.setUserById(id, user)
        } else {
            const newId = await model.getNextIndex()
            model.setUserById(newId, user)
            model.setIdByName(newId, name)
        }

        this.bot.messageChannel({
            embed: true,
            authorName: defaultUser,
            authorIcon: defaultIcon,
            color: colors.green,
            channelId: channelId,
            title: id ? 'Player edited' : 'New player added',
            fields: [
                {
                    name: 'name',
                    value: `${name}`,
                    inline: true,
                },
                {
                    name: 'emoji',
                    value: `${emoji}`,
                    inline: true,
                },
            ],
            attachments: null,
        })
    },

    onReceiveRandomMsg: async (message) => {
        const gameChannelId = secret.GAME_CHANNEL

        const msgArray = message.content.split(' ')

        const defaultSettings = isNaN(msgArray[1])
        const question = defaultSettings
            ? msgArray.slice(1).join(' ')
            : msgArray.slice(2).join(' ')
        const nbPlayers = defaultSettings ? 2 : msgArray[1]

        console.log('question', question)
        console.log('nbPlayers', nbPlayers)

        const current = model.getCurrentIndex()

        let players = []
        for (let i = 0; i < nbPlayers; i++) {
            let playerIndex
            do {
                playerIndex = 1 + Math.floor(Math.random() * (current))
            } while (players.includes(playerIndex))
            players[i] = playerIndex
        }

        console.log('players', players)

        const fields = []
        const emojis = []
        players.forEach((index) => {
            const currentPlayer = model.getUserById(index)
            fields.push({
                name: currentPlayer.name,
                value: currentPlayer.emoji,
                inline: true,
            })
            emojis.push(currentPlayer.emoji)
        })

        this.bot.messageChannelWithReactions({
            embed: true,
            authorName: defaultUser,
            authorIcon: defaultIcon,
            color: colors.green,
            channelId: gameChannelId,
            description: question,
            fields: fields,
            attachments: null,
            reactions: emojis,
        })

        message.react('☑️')
    },
    
    onReceiveClearMsg: async () => {
        model.clearDb()
    },
}
module.exports = control
