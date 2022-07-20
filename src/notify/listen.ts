import TelegramBot from "node-telegram-bot-api"
import { trim } from "lodash"
import { isBTS } from "../lib"
import { BTSing, lastCheckDate, judgmentSendMessage } from "../service"

const CHANNEL_URL = process.env.TELEGRAM_CHANNEL_URL as string
const GROUP_URL = process.env.TELEGRAM_GROUP_URL as string
// const SELFBOTID = parseInt(process.env.TELEGRAM_SELFBOTID as string)


export async function listen(bot: TelegramBot) {
    bot.onText(/\/help/g, (msg, match) => {
        const chatId = msg.chat.id
        bot.sendMessage(chatId, `有建議? 有問題? 有疑問? 加入討論組解決你的問題吧!!\n${GROUP_URL}`)
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
            bot.sendMessage(chatId, "type like `/report https://www.apple.com/tw/back-to-school`")
            return
        }
        const result = await isBTS(url)
        if (result === true) {
            bot.sendMessage(chatId, "Copy that.Thank you ^^.")
            judgmentSendMessage(`[感謝網友回報]` + url)
        } else {
            bot.sendMessage(chatId, result)
        }

    })

    bot.onText(/\/start/g, (msg, match) => {
        const chatId = msg.chat.id
        bot.sendMessage(chatId, "歡迎使用BTSNotify，有任何問題請輸入 /help\n" +
            "此BOT不會主動推播BTS訊息\n" +
            `要接收BTS推播請加入頻道\n${CHANNEL_URL}\n` +
            `有建議? 有問題? 有疑問? 加入討論組解決你的問題吧!! ${GROUP_URL}`
        )
    })

}