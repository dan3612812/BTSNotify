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


export function makeMessage(url: string): string {
    const message = `Apple Back to School 終於開始拉!!!! 快點以下網址前往\n ${url}`
    return message
}