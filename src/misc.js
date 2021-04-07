const colors = require('./helpers/colors')

const defaultIcon = 'https://i.imgur.com/AsYSVWe.png'
const defaultUser = 'Most Likely Bot'

const misc = {
    onReceiveMsg: async (message) => {
        const msg = message.content.toLowerCase()
        console.log(msg);
        
        const helloArray = ['bonj', 'hello', 'bonso', 'coucou', 'hola']
        const isHello = helloArray.some((value) => {
            return msg.includes(value)
        })
        if (isHello) message.react('👋')

        const isWsh = msg.includes('wsh')
        if (isWsh) message.channel.send('wesh wesh canne à pêche')

        const isFreeHugs = msg.includes('#freehugs')
        if (isFreeHugs) message.channel.send('tu veux un câlin ? 🤗')

        const isLea = msg.includes('#lea')
        if (isLea) message.channel.send('LÉA JE TE JUGE 👀')

        const isSammix = msg.includes('#sammix')
        if (isSammix) message.channel.send('https://cdn.discordapp.com/attachments/826173044056784927/829371156468989962/156964278_110601444317810_300934338898684325_n.png')
        
        const isRP = msg.includes('#rp')
        if (isRP) message.channel.send('Bouge ton gros cul et va rp !')

    },

    onReceiveMention: async (message) => {
        const msg = message.content.toLowerCase()
        message.react('👀')

        const isGivePaw = msg.includes('patte')
        if (isGivePaw) message.channel.send('*donne la patte et remue la queue*')
        
        const randHowAreYou = ['je bois mon thé et toi ?', 'je bois mon café et toi ?', 'ça va très bien et toi ?', 'je pète la forme et toi ?']
        const isHowAreYou = msg.includes('ça va')
        if (isHowAreYou) message.channel.send(randHowAreYou[Math.floor(Math.random() * randHowAreYou.length)])
    },
}
module.exports = misc
