import { load } from "cheerio"
import axios from "axios"


async function index() {
    const data = await axios.get("https://apple.com/tw-edu/shop").then(res => { return res.data })
    // const data = "<html><body><div>aaa</div><div>bbb</div><div>ccc</div></body></html>"
    const $ = load(data)

    const t = $("body *").text() // .map(function () { return (this.type === 'text') ? $(this).text() + ' ' : '' }).get().join('')
    console.log(t.includes("我們正在更新"))
    
    // console.log(t)
}
index()