import moment from "moment"
import { siteMapData, redirectToBTS } from "./core"
import { hasBTSContext, isBTSUrl } from "../lib"
import { pushMessageToGroup } from "../notify/telegram"

const TIMEOUT = 5 * 1000 // 5000 ms

export let BTSing = false
export let lastCheckDate = "0000/00/00 00:00:00.000"

export async function init() {
    const timer = setInterval(async () => {
        lastCheckDate = moment().format("YYYY/MM/DD HH:mm:ss.SSS")
        console.log(lastCheckDate)
        // 判斷方式一
        const result = await isBTSInSitemap()
        if (result !== false) {
            //終於開始拉
            clearInterval(timer)
            BTSing = true
            //透過telegram 送訊息給group
            pushMessageToGroup(makeMessage(result))
        }
        // 判斷方式二
        let result2 = await isRedirectToBTS()
        if (result2 !== false) {
            //終於開始拉
            clearInterval(timer)
            BTSing = true
            //透過telegram 送訊息給group
            pushMessageToGroup(makeMessage(result2))
        }
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

function makeMessage(url: string): string {
    const message = `Apple Back to School 終於開始拉!!!! 快點以下網址前往\n ${url}`
    return message
}