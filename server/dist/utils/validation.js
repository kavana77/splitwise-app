"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const envalid_1 = require("envalid");
const validators_1 = require("envalid/dist/validators");
const env = (0, envalid_1.cleanEnv)(process.env, {
    PORT: (0, validators_1.port)(),
    FIREBASE_DATABASE_URL: (0, validators_1.str)(),
    EMAIL_USER: (0, validators_1.str)(),
    EMAIL_PASS: (0, validators_1.str)()
});
exports.default = env;
