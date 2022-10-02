require('dotenv').config()

const { Telegraf } = require('telegraf')
const axios = require('axios')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply('Online!'))

bot.on('text', (ctx) => {
    var api_url = `http://api.brainshop.ai/get?bid=${process.env.BRAINSHOP_BID}&key=${process.env.BRAINSHOP_KEY}&uid=${ctx.message.chat.id}&msg=${ctx.message.text}`
    axios(api_url)
        .then(response => ctx.reply(response.data.cnt))
})

bot.launch()

