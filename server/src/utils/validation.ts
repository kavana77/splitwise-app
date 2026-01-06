import "dotenv/config"
import { cleanEnv } from "envalid"
import { port ,str} from "envalid/dist/validators"
import { FIREBASE_CONFIG_VAR } from "firebase-admin/lib/app/lifecycle"

const env = cleanEnv(process.env, {
    PORT: port(),
    FIREBASE_DATABASE_URL: str(),
    EMAIL_USER: str(),
    EMAIL_PASS: str(),
    FIREBASE_PROJECT_ID: str(),
    FIREBASE_CLIENT_EMAIL: str(),
    FIREBASE_PRIVATE_KEY: str(),
})
export default env