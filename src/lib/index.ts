import { isBTSUrl, isExists, isTwUrl } from "./core"
export * from "./core"

// TODO 將回報的相關功能寫一寫
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