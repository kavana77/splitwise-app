import { RequestHandler } from "express";
import db from "../config/firebaseConfig";

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

    res.status(200).json({ [groupId]: balances });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
