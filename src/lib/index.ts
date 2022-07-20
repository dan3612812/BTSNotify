import { isBTSUrl, isExists, isTwUrl } from "./core"
export * from "./core"

/**
 * 用於判斷client回報的網址
 * @param url 
 * @returns 
 */
export async function isBTS(url: string): Promise<string | true> {
    if (!isTwUrl(url)) return "NotTWUrl"
    if (!isBTSUrl(url)) return "NotBTSUrl"
    if (!await isExists(url)) return "PageNotExists"
    return true
}


export function makeMessage(url: string, type: "pre" | "start"): string {
    let message = ""
    if (type === "pre") {
        message = `Apple官網正在更新網頁，BTS要開始了!!! 快點以下網址前往\n ${url}`
    } else {
        message = `Apple Back to School 終於開始拉!!!! 快點以下網址前往\n ${url}`

    }
    return message
}