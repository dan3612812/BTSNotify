export interface selfENV {
    TELEGRAM_TOKEN: string
    TELEGRAM_CHANNEL: string
    TELEGRAM_CHANNEL_URL: string
    TELEGRAM_GROUP_URL: string
}

export const schema = {
    type: "object",
    required: ["TELEGRAM_TOKEN", "TELEGRAM_CHANNEL", "TELEGRAM_CHANNEL_URL", "TELEGRAM_GROUP_URL"],
    properties: {
        TELEGRAM_TOKEN: { type: "string", minLength: 1 },
        TELEGRAM_CHANNEL: { type: "string", minLength: 1 },
        TELEGRAM_CHANNEL_URL: { type: "string", minLength: 1 },
        TELEGRAM_GROUP_URL: { type: "string", minLength: 1 },
    }

}