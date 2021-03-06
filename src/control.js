const model = require('./model')
const db = require('quick.db')

const secret = require('../secret.json')
// const secret = require('../secret_ivy.json')
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
                    name: '$list',
                    value: `list all names and emojis`,
                },
                {
                    name: '$list id',
                    value: `list all ids, names and emojis`,
                },
                {
                    name: '$remove [id]',
                    value: `remove a name by its id`,
                }
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
                playerIndex = 1 + Math.floor(Math.random() * current)
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

        message.react('??????')
    },

    onReceiveListMsg: async (message) => {
        const channelId = message.channel.id
        const users = model.getAllUsers()

        const msgArray = message.content.split(' ')
        const showId = msgArray[1] !== undefined && msgArray[1] === 'id'

        this.bot.messageChannel({
            embed: true,
            channelId: channelId,
            color: colors.purple,
            authorName: defaultUser,
            authorIcon: defaultIcon,
            fields: users.map((user) => ({
                name: showId ? `${user.id} - ${user.name}` : user.name,
                value: user.emoji,
                inline: true,
            })),
        })
    },

    onReceiveRemoveMsg: async (message) => {
        const userId = message.content.split(' ')[1]
        if (!isNaN(userId)) {
            const user = model.getUserById(userId)
            model.removeIdByName(user.name)
            model.removeUserById(userId)
            message.react('??????')
        }
    },

    onReceiveClearMsg: async () => {
        model.clearDb()
    },
}
module.exports = control
