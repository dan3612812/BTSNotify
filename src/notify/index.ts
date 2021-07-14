process.env["NTBA_FIX_319"] = "1";
import TelegramBot from "node-telegram-bot-api"
import { listen } from "./listen"

const TOKEN = process.env.TELEGRAM_TOKEN as string
// const GROUP = process.env.TELEGRAM_GROUP as string
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL as string

let bot: TelegramBot | undefined

export async function init() {
    bot = new TelegramBot(TOKEN, { polling: true })
    listen(bot)
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
    const bot = getBot()
    return bot.sendMessage(CHANNEL_ID, message)
}
