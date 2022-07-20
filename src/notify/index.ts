import TelegramBot from "node-telegram-bot-api"
import { listen } from "./listen"

let bot: TelegramBot | undefined

export async function init() {
    const TOKEN = process.env.TELEGRAM_TOKEN as string
    bot = new TelegramBot(TOKEN, { polling: true })
    listen(bot)
    // listen bot error event
    // bot.on("polling_error", err => { 

    // })
}

function getBot(): TelegramBot {
    if (bot) {
        return bot
    } else {
        init()
        return bot as unknown as TelegramBot
    }
}

export function pushMessageToChannel(message: string) {
    const CHANNEL_ID = process.env.TELEGRAM_CHANNEL as string
    const bot = getBot()
    return bot.sendMessage(CHANNEL_ID, message)
}
