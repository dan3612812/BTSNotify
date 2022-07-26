import { siteMapData, redirectToBTS, BTSHasTwHreflang, preBTS } from "./core"
import { hasBTSContext, isBTSUrl } from "../lib"
import { judgmentSendMessage, updateLastCheckDate } from "../service"

const TIMEOUT = 5 * 1000 // 5000 ms

// TODO 將 preBTS 加入timer內
function taskSchedule(){

}

export async function init() {
    
    const timer = setInterval(async () => {
        // 刷新 最後更新時間
        console.log(updateLastCheckDate())

        // 判斷方式一
        const m1 = isBTSInSitemap()
        // 判斷是否傳送訊息
        judgmentSendMessage(m1, "start").then(res => {
            if (res === true) clearInterval(timer)
        }).catch(err => {
            console.log("[Error] method 1 ", err)
        })

        // 判斷方式二
        const m2 = isRedirectToBTS()
        // 判斷是否傳送訊息
        judgmentSendMessage(m2, "start").then(res => {
            if (res === true) clearInterval(timer)
        }).catch(err => {
            console.log("[Error] method 2 ", err)
        })

        // 判斷方式三
        const m3 = isBTSHasTwHreflang()
        // 判斷是否傳送訊息
        judgmentSendMessage(m3, "start").then(res => {
            if (res === true) clearInterval(timer)
        }).catch(err => {
            console.log("[Error] method 3 ", err)
        })

    }, TIMEOUT)
}

export async function isPreBTS(): Promise<false | string> {
    const url = await preBTS()
    if (url === false) {
        return false
    } else {
        return url
    }
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
 * 用於測試
 * @returns 
 */
async function fakeTrue(): Promise<string | false> {
    return "[TEST] https://www.apple.com/tw/TESTTESTTEST"
}