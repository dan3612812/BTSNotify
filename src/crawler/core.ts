import { load } from "cheerio"
import axios from "axios"
import { without, isString } from "lodash"


export async function preBTS(): Promise<string | false> {
    // 在BTS方案開始之前 會有一個網站更新的資訊
    // 根據2021年的資料 `https://apple.com/tw-edu/shop`該網址的 http status 會改為503
    // 以及網頁的text會出現 `我們正在更新 Apple Store，請稍後再來。`
    const url = `https://apple.com/tw-edu/shop`
    return axios.get(url).then(res => {
        // if (res.status ===503){       }
        const $ = load(res.data)
        const t = $("body *").text()
        if (t.includes("我們正在更新")) {
            return url
        } else {
            return false
        }
    })
}


export async function redirectToBTS(): Promise<string> {
    const url = "https://apple.com/tw/shop/goto/educationrouting"
    return axios.get(url).then(res => {
        const newUrl = isString(res.request.res.responseUrl) ? res.request.res.responseUrl as string : ""
        return newUrl
    })
}

// siteMapData()

export function siteMapData() {
    // use sitemap
    // get data
    return axios.get("https://www.apple.com/tw/sitemap")
        .then(({ data }: { data: string }) => {
            const temp = data.replace(/\n/g, "")
            const $ = load(temp)
            const selector = `#main > section.category.category-appleinfo > ul > li:nth-child(8) > section > ul`
            let eduAppElement = $(selector)
            // ['Apple 與教育', '國民及學前教育選購', '大專校院師生選購']
            let elementTexts = without(eduAppElement.text().replace(/[\t]+/gm, ",").split(","), "")
            let links: string[] = []
            //href 在 elementText 的children.attribe.href
            eduAppElement.find("a").each((index, element) => {
                const link = $(element).attr("href")
                if (link) links.push(`https://apple.com/` + link)
            })
            return {
                texts: elementTexts,
                links
            }
        })
}


/**
 * 在 https://www.apple.com/us-hed/shop/back-to-school 是否其他link
 * 其中包含 hreflang 是指 tw的
 * @returns url
 */
export async function BTSHasTwHreflang(): Promise<false | string> {
    interface LinkRelTagAttribs {
        hreflang?: string // null ,en-ca
        href?: string // https://www.apple.com/us-hed/shop/back-to-school ,https://www.apple.com/ca_edu_93120/shop/back-to-school
        rel?: "canonical" | "alternate" | string // canonical ,alternate
    }
    const TWHreflangRegex = new RegExp(/zh-TW/gi)
    const canonicalUrl = "https://www.apple.com/us-hed/shop/back-to-school"
    return axios.get(canonicalUrl)
        .then(({ data }: { data: string }) => {
            const temp = data.replace(/\n/g, "")
            const $ = load(temp)
            const selector = `head`
            const headLinks = $(selector).find("link")
            for (let tag of headLinks) {
                const { rel, href, hreflang } = tag.attribs as LinkRelTagAttribs
                // 是重新導向的link
                if (rel === "alternate") {
                    if (href !== undefined && TWHreflangRegex.test(hreflang ? hreflang : "")) {
                        //上架拉
                        return href
                    }
                }
            }
            return false
        })
}