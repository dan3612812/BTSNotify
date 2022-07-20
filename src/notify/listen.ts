import TelegramBot from "node-telegram-bot-api"
import { trim } from "lodash"
import { isBTS } from "../lib"
import { BTSing, lastCheckDate, judgmentSendMessage } from "../service"

export async function listen(bot: TelegramBot) {
    const { TELEGRAM_CHANNEL_URL, TELEGRAM_GROUP_URL } = process.env

    bot.onText(/\/help/g, (msg, match) => {
        const chatId = msg.chat.id
        const message = `有建議? 有問題? 有疑問? 加入討論組解決你的問題吧!!\n${TELEGRAM_GROUP_URL}`
        bot.sendMessage(chatId, message)
    })

    bot.onText(/\/status/g, (msg, match) => {
        const chatId = msg.chat.id
        const message = `最後檢查時間:${lastCheckDate}\n` +
            `BTS${BTSing ? "開始了拉還在睡!" : "還未開始喔!殘念~\n快加入頻道接收BTS第一手的通知!" + TELEGRAM_CHANNEL_URL} \n`
        bot.sendMessage(chatId, message)
    })

    bot.onText(/\/report(.)*/g, async (msg) => {
        // 回報功能 讓client回報BTS方案的網址 且有基本的檢查
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
            judgmentSendMessage(`[感謝網友回報]` + url, "start")
        } else {
            bot.sendMessage(chatId, result)
        }

    })

    bot.onText(/\/start/g, (msg, match) => {
        const chatId = msg.chat.id
        bot.sendMessage(chatId, "歡迎使用BTSNotify，有任何問題請輸入 /help\n" +
            "此BOT不會主動推播BTS訊息\n" +
            `要接收BTS推播請加入頻道\n${TELEGRAM_CHANNEL_URL}\n` +
            `有建議? 有問題? 有疑問? 加入討論組解決你的問題吧!! ${TELEGRAM_GROUP_URL}`
        )
    })
}