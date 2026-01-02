"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.getExpenseByGroupId = exports.addExpenses = void 0;
const firebaseConfig_1 = __importDefault(require("../config/firebaseConfig"));
const addExpenses = async (req, res) => {
    const { description, amount, paidUsersId, splitType, date, currencySymbol, currencyCode, groupId, splitDetails, } = req.body;
    try {
        if (!description ||
            !amount ||
            !paidUsersId ||
            !splitType ||
            !date ||
            !groupId) {
            return res.status(400).json({ message: "Invalid expense Inputs" });
        }
        if (amount <= 0) {
            return res
                .status(400)
                .json({ message: "Amount must be positive number" });
        }
        const groupSnap = await firebaseConfig_1.default
            .ref(`group/${groupId}/groupMembers`)
            .once("value");
        if (!groupSnap.exists()) {
            return res.status(404).json({ message: "Group not found" });
        }
        const existingExpensesSnap = await firebaseConfig_1.default.ref("expense")
            .orderByChild("groupId")
            .equalTo(groupId)
            .once("value");
        let existingCurrencyCodes = new Set();
        if (existingExpensesSnap.exists()) {
            const existingExpenses = existingExpensesSnap.val();
            for (const exp of Object.values(existingExpenses)) {
                if (exp.currencyCode) {
                    existingCurrencyCodes.add(exp.currencyCode);
                }
            }
        }
        existingCurrencyCodes.add(currencyCode);
        const hasMultipleCurrencies = existingCurrencyCodes.size > 1;
        const members = groupSnap.val();
        const memberIds = Object.keys(members);
        const paidUsers = typeof paidUsersId === "string"
            ? [paidUsersId]
            : Object.keys(paidUsersId || {});
        for (const userId of paidUsers) {
            if (!memberIds.includes(userId)) {
                return res
                    .status(400)
                    .json({
                    message: `Paid user ${userId} is not a member of this group`,
                });
            }
        }
        const totalPaid = Object.values(paidUsersId).reduce((sum, amnt) => sum + amnt, 0);
        if (totalPaid !== amount) {
            return res
                .status(401)
                .json({
                message: `The total of everyone's paid shares (${totalPaid}) is different than the total cost (${amount})`,
            });
        }
        console.log(totalPaid);
        if (splitDetails) {
            const invalidSplitUsers = Object.keys(splitDetails).filter((uid) => !memberIds.includes(uid));
            if (invalidSplitUsers.length > 0) {
                return res
                    .status(400)
                    .json({
                    message: `Split details contain users not in the group: ${invalidSplitUsers.join(", ")}`,
                });
            }
        }
        let splits = {};
        let grandTotal = 0;
        if (splitType === "equally") {
            const perHead = amount / memberIds.length;
            memberIds.forEach((uid) => {
                splits[uid] = Number(perHead.toFixed(2));
            });
        }
        else if (splitType === "exact") {
            if (!splitDetails) {
                return res
                    .status(400)
                    .json({ message: "Exact split requires splitDetails" });
            }
            const total = Object.values(splitDetails).reduce((a, b) => a + b, 0);
            if (Math.abs(total - amount) > 0.01) {
                return res
                    .status(400)
                    .json({ message: "Exact split must add up to total amount" });
            }
            splits = splitDetails;
        }
        else if (splitType === "percentage") {
            if (!splitDetails) {
                return res
                    .status(400)
                    .json({ message: "Percentage split requires splitDetails" });
            }
            const totalPercentage = Object.values(splitDetails).reduce((a, b) => a + b, 0);
            if (Math.abs(totalPercentage - 100) > 0.001) {
                return res
                    .status(400)
                    .json({ message: "Percentage must add up to 100" });
            }
            memberIds.forEach((uid) => {
                const userPercentage = splitDetails[uid];
                splits[uid] = Number(((amount * userPercentage) / 100).toFixed(2));
            });
        }
        else if (splitType === "shares") {
            if (!splitDetails) {
                return res
                    .status(400)
                    .json({ message: "Shares split requires splitDetails" });
            }
            const totalShares = Object.values(splitDetails).reduce((a, b) => a + b, 0);
            memberIds.forEach((uid) => {
                const userShares = splitDetails[uid] || 0;
                splits[uid] = Number(((amount * userShares) / totalShares).toFixed(2));
            });
        }
        else if (splitType === "adjustment") {
            if (!splitDetails) {
                return res
                    .status(400)
                    .json({ message: "Adjustment split requires splitDetails" });
            }
            const total = Object.values(splitDetails).reduce((a, b) => a + b, 0);
            if (Math.abs(total - amount) > 0.01) {
                return res
                    .status(400)
                    .json({ message: "Adjustment must add up to total amount" });
            }
            splits = splitDetails;
        }
        else if (splitType === "reimbursement") {
            if (!splitDetails) {
                return res
                    .status(400)
                    .json({ message: "Reimbursement requires splitDetails" });
            }
            const total = Object.values(splitDetails).reduce((a, b) => a + b, 0);
            if (Math.abs(total - amount) > 0.01) {
                return res
                    .status(400)
                    .json({ message: "Reimbursement must balance out to 0" });
            }
            splits = splitDetails;
        }
        else if (splitType === "itemized") {
            const { items = [], gst = 0, tip = 0 } = req.body;
            const splitDetails = {};
            items.forEach((item) => {
                const includedUsers = item.users || memberIds;
                const perUser = item.amount / includedUsers.length;
                includedUsers.forEach((uid) => {
                    const current = splitDetails[uid] || 0;
                    splitDetails[uid] = Number((current + perUser).toFixed(2));
                });
            });
            // Subtotal 
            const subtotal = Object.values(splitDetails).reduce((a, b) => a + b, 0);
            //  Calculate GST & Tip
            const gstAmount = (subtotal * gst) / 100;
            const tipAmount = (subtotal * tip) / 100;
            //  Add equal share of GST & Tip to each user
            const gstShare = gstAmount / memberIds.length;
            const tipShare = tipAmount / memberIds.length;
            memberIds.forEach((uid) => {
                const current = splitDetails[uid] || 0;
                splitDetails[uid] = Number((current + gstShare + tipShare).toFixed(2));
            });
            //  Grand total (Subtotal + GST + Tip)
            grandTotal = subtotal + gstAmount + tipAmount;
            splits = splitDetails;
        }
        else {
            return res.status(400).json({ message: "Invalid split type" });
        }
        const newExpenseRef = await firebaseConfig_1.default.ref("expense").push();
        const expenseId = newExpenseRef.key;
        const expenseData = {
            expenseId,
            description,
            amount: grandTotal || amount,
            paidUsersId,
            splitType,
            date,
            currencySymbol: currencySymbol || "₹",
            currencyCode,
            groupId,
            splits,
            createdAt: Date.now(),
        };
        await newExpenseRef.set(expenseData);
        await firebaseConfig_1.default.ref(`group/${groupId}/expense/${expenseId}`).set(true);
        await firebaseConfig_1.default.ref(`group/${groupId}`).update({
            hasMultipleCurrencies
        });
        res.status(201).json({
            message: hasMultipleCurrencies
                ? "Expense added successfully, but group now has multiple currencies"
                : "Expense created successfully",
            expense: expenseData,
            hasMultipleCurrencies,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server error", error });
    }
};
exports.addExpenses = addExpenses;
const getExpenseByGroupId = async (req, res) => {
    const { groupId } = req.params;
    try {
        const expenseSnap = await firebaseConfig_1.default
            .ref("expense")
            .orderByChild("groupId")
            .equalTo(groupId)
            .once("value");
        if (!expenseSnap.exists()) {
            return res
                .status(404)
                .json({ message: "No expenses found for this group" });
        }
        const groupSnap = await firebaseConfig_1.default
            .ref(`group/${groupId}/groupMembers`)
            .once("value");
        if (!groupSnap.exists()) {
            return res.status(404).json({ message: "Group not found" });
        }
        const members = groupSnap.val();
        const expenses = expenseSnap.val();
        const expenseList = Object.values(expenses).map((exp) => {
            const { expenseId, description, amount, splits, currencySymbol, paidUserId, paidUsersId, } = exp;
            let paidUserName = "";
            let totalPaid = 0;
            if (paidUsersId && typeof paidUsersId === "object") {
                const payerInfo = Object.entries(paidUsersId).map(([uid, paidAmt]) => {
                    const member = members[uid];
                    const payerName = member ? member.name : "Unknown";
                    totalPaid += paidAmt;
                    return `${payerName} (${paidAmt})`;
                });
                paidUserName = payerInfo.join(", ");
            }
            else if (paidUserId && members[paidUserId]) {
                paidUserName = members[paidUserId].name;
                totalPaid = amount;
            }
            else {
                paidUserName = "Unknown payer";
                totalPaid = amount || 0;
            }
            let totalOwedByOthers = 0;
            if (splits && typeof splits === "object") {
                for (const [uid, owedAmount] of Object.entries(splits)) {
                    if (uid !== paidUserId)
                        totalOwedByOthers += owedAmount;
                }
            }
            return {
                expenseId,
                description,
                paidUserName,
                currencySymbol,
                paidAmount: totalPaid,
                shouldGetBack: totalOwedByOthers,
            };
        });
        return res.status(200).json({ message: "Expense Data", expenseList });
    }
    catch (error) {
        console.error("getExpenseByGroupId Error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.getExpenseByGroupId = getExpenseByGroupId;
const deleteExpense = async (req, res) => {
    const { groupId, expenseId } = req.params;
    if (!groupId || !expenseId) {
        return res.status(400).json({ message: "No group or expense found" });
    }
    try {
        await firebaseConfig_1.default.ref(`expense/${expenseId}`).remove();
        await firebaseConfig_1.default.ref(`group/${groupId}/expense/${expenseId}`).remove();
        res.status(200).json({ message: "Expense deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteExpense = deleteExpense;
//detect if a group has multiple currencies in expenses
