import { load } from "cheerio"
import axios from "axios"
import { isString } from "lodash"

async function index() {
    const url = "https://apple.com/tw/shop/goto/educationrouting"
    return axios.get(url).then(res => {
        console.log(res.request.res)
        const newUrl = isString(res.request.res.responseUrl) ? res.request.res.responseUrl as string : ""
        return newUrl
    })
}
index()