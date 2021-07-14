import moment from "moment"
import { pushMessageToChannel } from "../notify"
import { makeMessage } from "../lib"

export let BTSing = false
export let lastCheckDate = "0000/00/00 00:00:00.000"

/**
* 統一發送 降低重複發送問題 且網址必須存在
* @param url 
* @returns true 已發送 false未發送
*/
export async function judgmentSendMessage(result: Promise<string | false> | string): Promise<boolean> {
    const url = await result
    if (url) {
        if (BTSing === false) {
            pushMessageToChannel(makeMessage(url))
            setBTSing(true)
            return true
        }
    }
    return false
}


export function updateLastCheckDate(): string {
    lastCheckDate = moment().format("YYYY/MM/DD HH:mm:ss.SSS")
    return lastCheckDate
}

export function setBTSing(boolean: boolean): boolean {
    BTSing = boolean
    return BTSing
}