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
}
module.exports = control
