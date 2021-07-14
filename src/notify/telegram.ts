process.env["NTBA_FIX_319"] = "1";
import { trim } from "lodash"
import TelegramBot from "node-telegram-bot-api"
import { isBTS } from "../lib"
import { lastCheckDate, BTSing } from "../crawler"

const TOKEN = process.env.TELEGRAM_TOKEN as string
// const GROUP = process.env.TELEGRAM_GROUP as string
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL as string
const CHANNEL_URL = process.env.TELEGRAM_CHANNEL_URL as string
const GROUP_URL = process.env.TELEGRAM_GROUP_URL as string
const SELFBOTID = parseInt(process.env.TELEGRAM_SELFBOTID as string)


let bot: TelegramBot | undefined

export async function init() {
    bot = new TelegramBot(TOKEN, { polling: true })
    listen()
}

function getBot(): TelegramBot {
    if (bot) {
        return bot
    } else {
        init()
        return bot as unknown as TelegramBot
    }
}

async function listen() {
    const bot = getBot()
    bot.onText(/\/help/g, (msg, match) => {
        const chatId = msg.chat.id
        //TODO 修改底下的說明
        bot.sendMessage(chatId, "還沒寫好啦 再等等...\n" + `有建議? 有問題? 有疑問? 加入討論組解決你的問題吧!!\n${GROUP_URL}`)
    })
    bot.onText(/\/status/g, (msg, match) => {
        const chatId = msg.chat.id
        const message = `最後檢查時間:${lastCheckDate}\n` +
            `BTS${BTSing ? "開始了拉還在睡!" : "還未開始喔!殘念~\n快加入頻道接收BTS第一手的通知!" + CHANNEL_URL} \n`
        bot.sendMessage(chatId, message)
    })
    bot.onText(/\/report(.)*/g, async (msg) => {
        const chatId = msg.chat.id
        const event = msg.text ? msg.text : " "
        const regex = new RegExp(/\/report(.*)/g)
        const match = regex.exec(event)
        const url = trim(match !== null ? match[1] : " ")
        if (url.length < 17) {
            bot.sendMessage(chatId, "type like `/report https://apple.com/tw/back-to-school`")
            return
        }
        const result = await isBTS(url)
        if (result === true) {
            bot.sendMessage(chatId, "Copy that.Thank you ^^.")
        } else {
            bot.sendMessage(chatId, result)
        }

    })

    bot.onText(/\/start/g, (msg, match) => {
        const chatId = msg.chat.id
        bot.sendMessage(chatId, "歡迎使用BTSNotify，有任何問題請輸入 /help\n" +
            "此BOT不會主動推播\n" +
            `接收BTS推播請加入頻道\n${CHANNEL_URL}\n` +
            `有建議? 有問題? 有疑問? 加入討論組解決你的問題吧!! ${GROUP_URL}`
        )
    })

    // bot.on("message", (msg) => {
    //     const chatId = msg.chat.id
    //     if (msg.from?.id === SELFBOTID) return //bot 自己本身
    //     if (msg.from?.is_bot) return //其他bot
    //     // FIXME 
    //     bot.sendMessage(chatId, "roger that")
    // })

    // bot.on("new_chat_members", (msg, metadata) => {
    //     const chatId = msg.chat.id
    //     bot.sendMessage(chatId, "歡迎使用BTSNotify，有任何問題請輸入 /help")
    // })
}

export function pushMessageToChannel(message: string) {
    const bot = getBot()
    return bot.sendMessage(CHANNEL_ID, message)
}

// export function sendMessage(chatId: string, message: string) {
//     const bot = getBot()
//     bot.sendMessage(chatId, message)
// }