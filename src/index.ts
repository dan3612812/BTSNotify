import { init as configInit } from "./env"
import { init as telegramInit } from "./notify/telegram"
import { init as crawlerInit } from "./crawler"
async function main() {
    configInit()
    telegramInit()
    crawlerInit()
}

main()