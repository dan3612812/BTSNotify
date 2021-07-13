
import { load } from "cheerio"
import axios from "axios"

/**
 * 檢測是否是BTS的URL
 * @param url 
 * @returns 
 */
export function isBTSUrl(url: string) {
    // TODO 看要用哪個
    const regex = new RegExp(/back.{0,3}to.{0,3}school/gi)
    // const regex = new RegExp(/[.]*back-to-school[.]*/g)
    return regex.test(url)
}
/**
 * 忽略大小寫 只要str內含有 back to school 字樣
 * 詳細參考function內的regex
 * @param str 
 * @returns 
 */
export function hasBTSContext(str: string) {
    const regex = new RegExp(/back.{0,3}to.{0,3}school/gi)
    return regex.test(str)
}

export function isTwUrl(url: string) {
    // TODO 將跟URL 判斷有關的加入這段
    const regex = new RegExp(/apple\.com\/tw.+/gi)
    return regex.test(url)
}

/**
 * is only on Taiwan
 * @param html 
 * @deprecated
 */
export function isExistByBody(html: string) {
    const $ = load(html.replace(/\n/g, ""))
    const selector = `#main > h1`
    if ($(selector).text() === "你所尋找的頁面不存在") {
        return false
    }
    return true
}

/**
 * read http code
 * @param url 
 */
export async function isExists(url: string): Promise<Boolean> {
    return axios.get(url)
        .then(({ data }: { data: string }) => {
            // TODO 可能要看看 html 內有沒有相關 back to school 相關字樣
            return true
        })
        .catch(err => {
            // 404
            return false
        })
}