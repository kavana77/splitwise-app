import { RequestHandler } from "express";
import db from "../config/firebaseConfig";
import { getRateToUSD } from "../utils/rates";
interface Expense {
  id?: string;
  groupId: string;
  amount: number;
  currencyCode: "INR" | "AED" | "USD";
  currencyLabel?: string;
  [key: string]: any;
}
interface PaidInput {
  [uid: string]: number;
}
// Exchange rates to USD
const ratesToUSD: Record<string, number> = {
  INR: 0.0114,
  EUR: 0.85,
  AED: 0.27,
  JPY: 0.81,
  USD: 1,
};
export const getGroupBalance: RequestHandler = async (req, res) => {
  const { groupId } = req.params;
  try {
    const groupSnap = await db
      .ref(`group/${groupId}/groupMembers`)
      .once("value");
    if (!groupSnap.exists()) {
      return res.status(404).json({ message: "Group not found" });
    }

    const members: Record<string, { name: string; email?: string }> =
      groupSnap.val();
      const currencySymbol: string = groupSnap.val().currencySymbol || "₹";
    const balances: Record<string, Record<string, number>> = {};

    Object.keys(members).forEach((uid) => {
      balances[uid] = { [members[uid].name]: 0 };
    });

    const expenseSnap = await db.ref(`group/${groupId}/expense`).once("value");
    if (expenseSnap.exists()) {
      const expenseIds = Object.keys(expenseSnap.val());
      for (let i = 0; i < expenseIds.length; i++) {
        const expenseId = expenseIds[i];
        const expenseSnap = await db.ref(`expense/${expenseId}`).once("value");
        const expense = expenseSnap.val();
        if (!expense) continue;

        const { paidUsersId, amount, splits } = expense;

        Object.keys(splits).forEach((uid) => {
          balances[uid][members[uid].name] -= splits[uid];
        });

        if (typeof paidUsersId === "object") {
          for (const uid in paidUsersId) {
            balances[uid][members[uid].name] += paidUsersId[uid];
          }
        } else if (typeof paidUsersId === "string") {
          balances[paidUsersId][members[paidUsersId].name] += amount;
        }
      }
    }

    const settlementSnap = await db
      .ref(`group/${groupId}/settlement`)
      .once("value");
    if (settlementSnap.exists()) {
      const settlementIds = Object.keys(settlementSnap.val());
      for (let i = 0; i < settlementIds.length; i++) {
        const settleId = settlementIds[i];
        const settleSnap = await db
          .ref(`settlements/${settleId}`)
          .once("value");
        const settle = settleSnap.val();
        if (!settle) continue;

        const { paidByUserId, receivedByUserId, amount } = settle;

        balances[paidByUserId][members[paidByUserId].name] += amount;
        balances[receivedByUserId][members[receivedByUserId].name] -= amount;
      }
    }

      res.status(200).json({
      groupId,
      currencySymbol,
      balances,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};




export const convertGroupExpenses: RequestHandler = async (req, res): Promise<void> => {
  const { groupId } = req.params;

  if (!groupId) {
    res.status(400).json({ message: "Group ID is required" });
    return;
  }

  try {
    // Fetch expenses for the given group
    const expenseSnap = await db
      .ref("expense")
      .orderByChild("groupId")
      .equalTo(groupId)
      .once("value");

    if (!expenseSnap.exists()) {
      res.status(404).json({ message: "No expenses found for this group" });
      return;
    }

    const expenses: Record<string, Expense> = expenseSnap.val();
    const updatedExpenses: any[] = [];

    for (const [id, expenseRaw] of Object.entries(expenses)) {
      // ensure typing for expense
      const expense = expenseRaw as Expense;
      const fromCode = expense.currencyCode;
      const rate =await getRateToUSD(fromCode);

      if (!rate) {
        // If one expense uses an unsupported currency, abort (or skip based on your policy)
        res
          .status(400)
          .json({ message: `Unsupported currency code: ${String(fromCode)}` });
        return;
      }

      // convert total amount
      const convertedAmount = Number((expense.amount / rate).toFixed(2));

      // convert splits if present
      const convertedSplits: Record<string, number> = {};
      if (expense.splits && typeof expense.splits === "object") {
        const splits = expense.splits as Record<string, number>;
        for (const [uid, val] of Object.entries(splits)) {
          const numVal = Number(val) || 0;
          convertedSplits[uid] = Number((numVal / rate).toFixed(2));
        }
      }

      // convert paidUsersId (can be object mapping user->amount OR a single string payer)
      let convertedPaidUsersId: PaidInput | string | undefined = undefined;
      if (expense.paidUsersId) {
        if (typeof expense.paidUsersId === "object") {
          const paidObj = expense.paidUsersId as Record<string, number>;
          const convertedPaidObj: Record<string, number> = {};
          for (const [uid, val] of Object.entries(paidObj)) {
            const numVal = Number(val) || 0;
            convertedPaidObj[uid] = Number((numVal / rate).toFixed(2));
          }
          convertedPaidUsersId = convertedPaidObj;
        } else if (typeof expense.paidUsersId === "string") {
          // if it's a single payer stored as string (userId) we already convert total amount, so keep string
          convertedPaidUsersId = expense.paidUsersId;
        } else {
          // other shapes - fallback: leave as-is
          convertedPaidUsersId = expense.paidUsersId;
        }
      }

      const updatedExpense: Partial<Expense> = {
        ...expense,
        amount: convertedAmount,
        currencyCode: "USD",
        currencySymbol: "$",
        splits: Object.keys(convertedSplits).length ? convertedSplits : expense.splits,
        // override paidUsersId only if we created converted object
        paidUsersId:
          typeof convertedPaidUsersId === "object" ? convertedPaidUsersId : expense.paidUsersId,
      };

      // write updates back to expense node
      await db.ref(`expense/${id}`).update(updatedExpense);

      // ensure the group-expense link exists (you already did this in original code)
      await db.ref(`group/${groupId}/expense/${id}`).set(true);

      updatedExpenses.push({
        id,
        oldAmount: expense.amount,
        newAmount: convertedAmount,
        oldCurrency: expense.currencyCode,
        newCurrency: "USD",
      });
    }

    // --- Convert settlements for this group (if settlements store currency)
    // I'm assuming settlements have a 'groupId' and 'currencyCode' and 'amount' fields.
    const settlementSnap = await db
      .ref("settlements")
      .orderByChild("groupId")
      .equalTo(groupId)
      .once("value");

    if (settlementSnap.exists()) {
      const settlements = settlementSnap.val() as Record<string, any>;
      for (const [sid, settleRaw] of Object.entries(settlements)) {
        const settle = settleRaw as any;
        const sCode = settle.currencyCode;
        const sRate = ratesToUSD[sCode] ?? 1;
        const newAmount = Number((Number(settle.amount) * sRate).toFixed(2));
        await db.ref(`settlements/${sid}`).update({
          amount: newAmount,
          currencyCode: "USD",
          currencySymbol: "$",
        });
      }
    }

    // mark group as single-currency (USD now)
    await db.ref(`group/${groupId}`).update({
      hasMultipleCurrencies: false,
      currencyCode: "USD",
      currencySymbol: "$",
    });

    res.status(200).json({
      message: "All group expenses converted to USD successfully",
      convertedExpenses: updatedExpenses,
    });
  } catch (error: any) {
    console.error("Error converting expenses:", error);
    res.status(500).json({ message: "Server error", error: error.message || error });
  }
};




