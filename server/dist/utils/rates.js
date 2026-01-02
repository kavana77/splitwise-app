"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRatesToUSD = fetchRatesToUSD;
exports.getRateToUSD = getRateToUSD;
const axios_1 = __importDefault(require("axios"));
async function fetchRatesToUSD() {
    try {
        const res = await axios_1.default.get("https://open.er-api.com/v6/latest/USD");
        if (!res.data || !res.data.rates) {
            throw new Error("Invalid response from currency API");
        }
        // Ensure USD = 1 always
        const rates = res.data.rates;
        rates["USD"] = 1;
        return rates;
    }
    catch (err) {
        console.error("❌ Failed to fetch live currency rates:", err);
        throw new Error("Failed to fetch live currency rates");
    }
}
// Helper if you just need one specific rate
async function getRateToUSD(currencyCode) {
    const rates = await fetchRatesToUSD();
    return rates[currencyCode.toUpperCase()] ?? 1;
}
