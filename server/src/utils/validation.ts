import "dotenv/config"
import { cleanEnv } from "envalid"
import { port ,str} from "envalid/dist/validators"

const env = cleanEnv(process.env, {
    PORT: port(),
    FIREBASE_DATABASE_URL: str(),
})
export default env