import { load } from "cheerio"
import axios from "axios"
import { without, isString } from "lodash"


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