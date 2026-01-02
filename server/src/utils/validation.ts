import "dotenv/config"
import { cleanEnv } from "envalid"
import { port ,str} from "envalid/dist/validators"

const env = cleanEnv(process.env, {
    PORT: port(),
    FIREBASE_DATABASE_URL: str(),
    EMAIL_USER: str(),
    EMAIL_PASS: str(),
    FIREBASE_SERVICE_ACCOUNT: str()
})
export default env