import { init as configInit } from "./env"
import { init as telegramInit } from "./notify"
import { init as crawlerInit } from "./crawler"
async function main() {
    configInit()
    telegramInit()
    crawlerInit()
}

main()