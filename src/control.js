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
                    name: '>set [name] [emoji]',
                    value: `link an emoji to a name`,
                },
                {
                    name: '>random [phrase]',
                    value: `sends a VS [phrase] with 2 random names`,
                },
                {
                    name: '>random [number] [phrase]',
                    value: `sends a VS [phrase] with [number] random names`,
                },
                {
                    name: '>clear',
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
            authorName: `Azuria Support Bot`,
            authorIcon: defaultIcon,
            color: colors.green,
            channelId: channelId,
            title: id ? 'Player edited' : 'New player added',
            fields: [
                {
                    name: 'name',
                    value: `${name}`,
                },
                {
                    name: 'emoji',
                    value: `${emoji}`,
                },
            ],
            attachments: null,
        })
    },
}
module.exports = control
