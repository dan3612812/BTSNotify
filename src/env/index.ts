import dotenv from "dotenv"
import Ajv from "ajv"
import { schema } from "./interface.t"

export function init() {
    // load env file
    const result = dotenv.config()
    if (result.error) throw result.error
    // check parameters exists
    const ajv = new Ajv({ allErrors: true })
    const validate = ajv.compile(schema)
    const valid = validate(process.env)
    if(!valid) throw validate.errors
}