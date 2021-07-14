import moment from "moment"
import { siteMapData, redirectToBTS, BTSHasTwHreflang } from "./core"
import { hasBTSContext, isBTSUrl } from "../lib"
import { pushMessageToChannel } from "../notify/telegram"

const TIMEOUT = 5 * 1000 // 5000 ms

export let BTSing = false
export let lastCheckDate = "0000/00/00 00:00:00.000"

export async function init() {
    const timer = setInterval(async () => {
        lastCheckDate = moment().format("YYYY/MM/DD HH:mm:ss.SSS")
        console.log(lastCheckDate)

        // 判斷方式一
        const m1 = isBTSInSitemap()
        // 判斷是否傳送訊息
        judgmentSendMessage(m1).then(res => {
            if (res === true) clearInterval(timer)
        })

        // 判斷方式二
        const m2 = isRedirectToBTS()
        // 判斷是否傳送訊息
        judgmentSendMessage(m2).then(res => {
            if (res === true) clearInterval(timer)
        })

        // 判斷方式三
        const m3 = isBTSHasTwHreflang()
        // 判斷是否傳送訊息
        judgmentSendMessage(m3).then(res => {
            if (res === true) clearInterval(timer)
        })

    }, TIMEOUT)
}

export async function isBTSInSitemap(): Promise<false | string> {
    const { links, texts } = await siteMapData()
    for (let i = 0; i < links.length; i++) {
        if (isBTSUrl(links[i])) return links[i]
    }
    return false
}

export async function isRedirectToBTS(): Promise<false | string> {
    const url = await redirectToBTS()
    if (hasBTSContext(url)) return url
    return false
}

export async function isBTSHasTwHreflang(): Promise<false | string> {
    const url = await BTSHasTwHreflang()
    if (url !== false) return url
    return false
}

/**
 * 統一發送 降低重複發送問題 且網址必須存在
 * @param url 
 * @returns true 已發送 false未發送
 */
async function judgmentSendMessage(result: Promise<string | false>): Promise<boolean> {
    const url = await result
    if (url) {
        if (BTSing === false) {
            pushMessageToChannel(makeMessage(url))
            BTSing = true
            return true
        }
    }
    return false
}

function makeMessage(url: string): string {
    const message = `Apple Back to School 終於開始拉!!!! 快點以下網址前往\n ${url}`
    return message
}

async function fakeTrue(): Promise<string | false> {
    return "[TEST] https://www.apple.com/tw/TESTTESTTEST"
}