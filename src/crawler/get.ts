import { load } from "cheerio"
import axios from "axios"
import { without, isString } from "lodash"

// 台灣BTS方案網址
// https://www.apple.com/tw-edu/shop/back-to-school

/**
 * 取得正在升級的網頁內容
 * @returns 網頁的html資料
 */
export async function webUpdating(): Promise<string> {
    // 在BTS方案開始之前 會有一個網站更新的資訊
    // 根據2021年的資料 `https://apple.com/tw-edu/shop`該網址的 http status 會改為503
    // 以及網頁的text會出現 `我們正在更新 Apple Store，請稍後再來。`
    const url = `https://apple.com/tw-edu/shop`
    return axios.get<string>(url).then(({ data }) => { return data })
}

/**
 * 撈取apple官網的網頁地圖
 * @return 網頁的html資料
 */
export async function siteMap(): Promise<string> {
    const url = "https://www.apple.com/tw/sitemap"
    return axios.get<string>(url).then(({ data }) => { return data })
}

/**
 * 在其他國家的BTS網頁上會標記其他國家的BTS網址(在該國家BTS方案開始時)
 * 通常美國官網的BTS方案最找開放
 * @return 網頁的html資料
 */
export async function otherBTSHasTWHreflang(): Promise<string> {
    const url = `https://www.apple.com/us-edu/shop/back-to-school`
    return axios.get(url).then(({ data }) => { return data })

}