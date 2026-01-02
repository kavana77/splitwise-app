import axios from "axios";

export async function fetchRatesToUSD(): Promise<Record<string, number>> {
  try {
    const res = await axios.get("https://open.er-api.com/v6/latest/USD");

    if (!res.data || !res.data.rates) {
      throw new Error("Invalid response from currency API");
    }

    // Ensure USD = 1 always
    const rates: Record<string, number> = res.data.rates;
    rates["USD"] = 1;

    return rates;
  } catch (err) {
    console.error("❌ Failed to fetch live currency rates:", err);
    throw new Error("Failed to fetch live currency rates");
  }
}

// Helper if you just need one specific rate
export async function getRateToUSD(currencyCode: string): Promise<number> {
  const rates = await fetchRatesToUSD();
  return rates[currencyCode.toUpperCase()] ?? 1;
}
