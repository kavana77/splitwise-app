"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const validation_1 = __importDefault(require("../utils/validation"));
const firebase_admin_json_1 = __importDefault(require("./firebase-admin.json"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(firebase_admin_json_1.default),
    databaseURL: validation_1.default.FIREBASE_DATABASE_URL
});
const db = firebase_admin_1.default.database();
exports.default = db;
